import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import fetch from "node-fetch";

// --------------------
// Text cleaning helper
// --------------------
function cleanText(input: string): string {
  return input
    .replace(/[^\x20-\x7E\n]/g, "") // remove non-printable chars
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();
}

// --------------------
// JSON extraction helper
// --------------------
function safeJSONParse(str: string) {
  try {
    // Remove markdown code fences or descriptive text before JSON
    const clean = str
      .replace(/```(?:json)?/gi, "")
      .replace(/Here'?s[\s\S]*?\{/i, "{") // remove leading descriptive text
      .trim();

    // Find JSON-like object
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error(
        "❌ No JSON found. AI response snippet:",
        str.slice(0, 200)
      );
      throw new Error("No JSON found in AI response");
    }

    // Try parsing
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    console.error("❌ JSON parsing failed:", err);
    throw err;
  }
}

// --------------------
// File text extractor
// --------------------
async function extractText(file: File | null): Promise<string> {
  if (!file) return "";

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const lower = file.name.toLowerCase();

    if (lower.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return cleanText(data.text);
    }

    if (lower.endsWith(".docx")) {
      const { value } = await mammoth.extractRawText({ buffer });
      return cleanText(value);
    }

    return cleanText(buffer.toString("utf-8"));
  } catch (err) {
    console.error("File parse error:", err);
    return "";
  }
}

// --------------------
// OpenRouter API call
// --------------------
// --------------------
// OpenRouter API call
// --------------------
interface OpenRouterChoice {
  message?: { content?: string };
}

interface OpenRouterResponse {
  choices?: OpenRouterChoice[];
  error?: { message?: string };
}

async function callOpenRouter(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("Missing OPENROUTER_API_KEY");

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "AI Resume Builder",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3.1:free",
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }],
          },
        ],
        temperature: 0.7,
        max_tokens: 10000,
      }),
    }
  );

  const data = (await response.json()) as OpenRouterResponse;

  if (!response.ok) {
    console.error("OpenRouter error response:", data);
    throw new Error(data?.error?.message || "Failed to call OpenRouter API");
  }

  return data?.choices?.[0]?.message?.content ?? "";
}

// --------------------
// POST Handler
// --------------------
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jdFile = formData.get("jd") as File | null;
    const techStack = (formData.get("techStack") as string) ?? "";

    const resumeText = resumeFile ? await extractText(resumeFile) : "";
    const jdText = jdFile ? await extractText(jdFile) : "";

    // --------------------
    // AI output template
    // --------------------
    const template = {
      name: "",
      contact: {
        email: "",
        phone: "",
        linkedin: "",
        address: "",
        portfolio: "",
      },
      summary: "",
      skills: {
        languages: [],
        frameworks: [],
        databases: [],
        tools: [],
        concepts: [],
      },
      experience: [{ title: "", company: "", dates: "", description: [] }],
      education: [{ degree: "", university: "", graduationDate: "" }],
      projects: [{ name: "", description: "" }],
      achievements: [],
      hobbies: [],
      languages: [],
    };

    // --------------------
    // Prompt construction
    // --------------------
    let prompt = "";

    if (resumeText && jdText) {
      prompt = `You are an expert resume writer. Optimize this resume based on the Job Description.
      Follow Jake's resume template and make it ATS-friendly.
      Return ONLY raw JSON matching this template (no markdown or extra text).
      Template: ${JSON.stringify(template)}
      Resume Text: ${resumeText}
      Job Description: ${jdText}`;
    } else if (resumeText) {
      prompt = `You are an expert resume writer. Optimize this resume to be ATS-friendly: improve phrasing, highlight accomplishments, combine repetitive points, and use professional wording.
      Return ONLY raw JSON matching this template (no markdown or extra text).
      Template: ${JSON.stringify(template)}
      Resume Text: ${resumeText}`;
    } else if (techStack) {
      prompt = `You are an expert resume writer. The user has no resume. Build a new resume based on this tech stack using Jake's resume template.
      Return ONLY raw JSON matching this template (no markdown or extra text).
      Template: ${JSON.stringify(template)}
      Tech Stack: ${techStack}`;
    } else {
      return NextResponse.json(
        { error: "Please provide input." },
        { status: 400 }
      );
    }

    // --------------------
    // Call AI
    // --------------------
    const aiResponse = await callOpenRouter(prompt);

    // --------------------
    // Parse JSON safely
    // --------------------
    let polishedJSON;
    try {
      console.log(
        "🔍 AI Raw Response (first 500 chars):",
        aiResponse.slice(0, 500)
      );

      polishedJSON = safeJSONParse(aiResponse);
    } catch (err) {
      console.error("Error parsing AI JSON:", err, "AI response:", aiResponse);
      return NextResponse.json(
        { error: "Failed to parse AI response. Ensure AI returns valid JSON." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: polishedJSON });
  } catch (err: any) {
    console.error("Server error in /api/polishResume:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
