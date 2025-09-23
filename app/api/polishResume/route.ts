import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import fetch from "node-fetch";


// Helper to extract text from uploaded file
async function extractText(file: File | null): Promise<string> {
    if (!file) return "";

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const lower = file.name.toLowerCase();

        if (lower.endsWith(".pdf")) {
            // Dynamic import for pdf-parse
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



// OpenRouter call
async function callOpenRouter(prompt: string) {
    const apiKey = process.env.OPENROUTER_API_KEY;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:3000", // or your deployed site URL
            "X-Title": "AI Resume Builder",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "mistralai/mistral-small-3.2-24b-instruct:free",
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


        // scenario detection
        let prompt = "";
        if (resumeText && jdText) {
            prompt = `You are an expert resume writer. Please optimize this resume based on Job Description. Follow Jake's resume template. Make the resume ATS friendly. Just provide the resume, no extra words like "Here's your resume".Don't add any emojis or icons: \nJob Description:\n${jdText}\n\nResume:\n${resumeText}`;
        } else if (resumeText) {
            prompt = `You are an expert resume writer. Please optimize this resume.Follow Jake's resume template.Just provide the resume. Make the resume ATS friendly. No extra words like "Here's your resume".Don't add any emojis or icons: \nResume:\n${resumeText}`;
        } else if (techStack) {
            prompt = `You are an expert resume writer. The user don't have a resume. Please help the user to build a resume based on this tech stack. Follow Jake's resume template. Make the resume ATS friendly. Just provide the resume, no extra words like "Here's your resume".Don't add any emojis or icons: \nBuild a resume based on this tech stack: ${techStack}`;
        } else {
            return NextResponse.json({ text: "Please provide input." });
        }

        const polishedText = await callOpenRouter(prompt);
        return NextResponse.json({ text: polishedText });

    } catch (err: any) {
        console.error("Server error in /api/polishResume:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

