import { NextResponse } from "next/server";

export async function GET() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "AI Resume Builder",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistralai/mistral-small-3.2-24b-instruct:free",
                messages: [
                    {
                        role: "user",
                        content: [{ type: "text", text: "Hello, can you hear me?" }],
                    },
                ],
                max_tokens: 50,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("OpenRouter error:", data);
            return NextResponse.json({ error: data }, { status: 500 });
        }

        return NextResponse.json({ text: data.choices?.[0]?.message?.content || "" });
    } catch (err: any) {
        console.error("Server error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
