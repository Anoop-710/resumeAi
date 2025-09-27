import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import fetch from "node-fetch";

// --------------------
// Helper to extract text from uploaded file
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
            return data.text;
        }

        if (lower.endsWith(".docx")) {
            const { value } = await mammoth.extractRawText({ buffer });
            return value;
        }
        return buffer.toString("utf-8");
    } catch (err) {
        console.error("File parse error:", err);
        return "";
    }
}

// --------------------
// OpenRouter API call
// --------------------
async function callOpenRouter(prompt: string) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "AI Resume Builder",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3.1:free",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                },
            ],
            temperature: 0.7,
            max_tokens: 10000,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("OpenRouter error response:", data);
        throw new Error(data?.error?.message || "Failed to call OpenRouter API");
    }

    return data?.choices?.[0]?.message?.content || "";
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

        let resumeText = "";
        let jdText = "";

        if (resumeFile) resumeText = await extractText(resumeFile);
        if (jdFile) jdText = await extractText(jdFile);

        // --------------------
        // JSON Template for AI Output
        // --------------------
        const template = {
            name: "",
            contact: {
                email: "",
                phone: "",
                linkedin: "",
                address: "",
                portfolio: ""
            },
            summary: "",
            skills: {
                languages: [],
                frameworks: [],
                databases: [],
                tools: [],
                concepts: []
            },
            experience: [
                {
                    title: "",
                    company: "",
                    dates: "",
                    description: []
                }
            ],
            education: [
                {
                    degree: "",
                    university: "",
                    graduationDate: ""
                }
            ],
            projects: [
                {
                    name: "",
                    description: ""
                }
            ],
            achievements: [],
            hobbies: [],
            languages: []
        };

        // --------------------
        // Construct prompt
        // --------------------
        let prompt = "";
        if (resumeText && jdText) {
            prompt = `You are an expert resume writer. Optimize this resume based on the Job Description. 
            Follow Jake's resume template. Make the resume ATS friendly. 
            Return **ONLY JSON** matching this template exactly (including extra fields: achievements, hobbies, languages). 
            If a section is not present in the resume, keep it empty. Do not include extra explanations or markdown.
            IMPORTANT: Do not include "json fences like backticks json or markdown. Output raw JSON only"
            Template:
            ${JSON.stringify(template)}

            Resume Text:
            ${resumeText}

            Job Description:
            ${jdText}`;
        } else if (resumeText) {
            prompt = `You are an expert resume writer. Optimize the resume to be ATS-friendly: improve phrasing, highlight accomplishments, combine repetitive points, and use professional wording. 
            Return the output strictly as JSON matching this template (including achievements, hobbies, languages). 
            If a section is not present, leave it empty. Do not include explanations, markdown, or extra text.
            IMPORTANT: Do not include "json fences like backticks json or markdown. Output raw JSON only".
            DO NOT PROVIDE BACKTICKS JSON IN RESPONSE.
            Template:
            ${JSON.stringify(template)}

            Resume Text:
            ${resumeText}`;
        } else if (techStack) {
            prompt = `You are an expert resume writer. The user has no resume. Build a new resume based on this tech stack. Follow Jake's resume template. Make it ATS friendly. 
            Return **ONLY JSON** matching this template exactly (including achievements, hobbies, languages). 
            If a section is not present in the resume, instruct user to add the content. For example: If "projects" field is empty, return "Projects" Add your projects here. Should be applied for every field
            IMPORTANT: Do not include "json fences like backticks json or markdown. Output raw JSON only"
            Template:
            ${JSON.stringify(template)}

            Tech Stack:
            ${techStack}`;
        } else {
            return NextResponse.json({ text: "Please provide input." });
        }

        // --------------------
        // Call AI
        // --------------------
        const aiResponse = await callOpenRouter(prompt);

        // --------------------
        // Parse JSON safely
        // --------------------
        let polishedJSON = {};
        try {
            polishedJSON = JSON.parse(aiResponse);
        } catch (err) {
            console.error("Error parsing AI JSON:", err, "AI response:", aiResponse);
            return NextResponse.json({ error: "Failed to parse AI response. Ensure AI returns valid JSON." }, { status: 500 });
        }

        return NextResponse.json({ data: polishedJSON });

    } catch (err: any) {
        console.error("Server error in /api/polishResume:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
