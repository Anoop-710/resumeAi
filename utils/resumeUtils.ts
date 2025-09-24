// utils/resumeUtils.ts

// File Upload
export const handleFileUpload = (
    type: string,
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<any>
) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev: any) => ({ ...prev, [type]: file }));
};

// Simple form data posting function
export const postFormData = async (url: string, formData: FormData) => {
    const res = await fetch(url, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Something went wrong.");
    }

    return await res.json();
};

// Submit Handler
export const handleSubmit = async (
    section: string,
    {
        files,
        resumeText,
        resume2Text,
        jobDescriptionText,
        techStack,
        setResultText,
        setError,
        setLoading,
    }: any
) => {
    try {
        setLoading(true);
        setError("");
        setResultText("");

        const formData = new FormData();

        if (section === "resume" && files.resume) {
            formData.append("resume", files.resume);
        } else if (section === "resume" && resumeText) {
            formData.append("resumeText", resumeText);
        }

        if (section === "job" && files.resume2) {
            formData.append("resume2", files.resume2);
        } else if (section === "job" && resume2Text) {
            formData.append("resume2Text", resume2Text);
        }

        if (section === "job" && files.jobDescription) {
            formData.append("jobDescription", files.jobDescription);
        } else if (section === "job" && jobDescriptionText) {
            formData.append("jobDescriptionText", jobDescriptionText);
        }

        if (section === "tech" && techStack) {
            formData.append("techStack", techStack);
        }

        const res = await fetch("/api/polishResume", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) throw new Error("Something went wrong.");

        const data = await res.json();
        setResultText(data.result || "No result generated");
    } catch (err: any) {
        setError(err.message || "Error occurred");
    } finally {
        setLoading(false);
    }
};

// DOCX Download with docx
export const downloadAsDOCX = async (resultText: string) => {
    const { Document, Packer, Paragraph, TextRun } = await import("docx");

    // The rest of your DOCX function remains unchanged...
    const raw = resultText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
    const sections = raw.split(/\n{2,}/);

    const children: any[] = [];

    const mkHeading = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text, bold: true, size: 26 })], // ~13pt
            spacing: { after: 100 },
            keepNext: true, // prevent orphaned headings
            keepLines: true,
        });

    const mkParagraph = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text, size: 22, font: "Calibri" })], // ~11pt
            spacing: { after: 60 },
            keepLines: true,
        });

    const mkBullet = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text, size: 22, font: "Calibri" })],
            bullet: { level: 0 },
            spacing: { after: 40 },
            keepLines: true,
        });

    for (const sec of sections) {
        const lines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) continue;

        if (lines.length === 1) {
            const single = lines[0];
            const isAllCaps = /^[A-Z0-9 \-,&]+$/.test(single) && single.length <= 40;
            const endsWithColon = /:$/.test(single);
            if (isAllCaps || endsWithColon) {
                children.push(mkHeading(single.replace(/:$/, "")));
                continue;
            }
        }

        const bulletable = lines.every(
            (ln) => /^[-•\*\u2022] /.test(ln) || /^\d+[\.\)] /.test(ln)
        );
        if (bulletable) {
            for (const ln of lines) {
                const cleaned = ln
                    .replace(/^[-•\*\u2022]\s+/, "")
                    .replace(/^\d+[\.\)]\s+/, "");
                children.push(mkBullet(cleaned));
            }
            continue;
        }

        for (const ln of lines) {
            if (/^[A-Za-z0-9 \-\/&]{1,60}:$/.test(ln)) {
                children.push(mkHeading(ln.replace(/:$/, "")));
            } else {
                children.push(mkParagraph(ln));
            }
        }
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch margins
                    },
                },
                children,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.docx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};