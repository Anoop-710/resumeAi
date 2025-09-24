// utils/resumeUtils.ts

// --------------------
// File Upload Handler
// --------------------
export const handleFileUpload = (
    type: string,
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<any>
) => {
    const file = event.target.files?.[0] || null;
    setFiles((prev: any) => ({ ...prev, [type]: file }));
};

// --------------------
// Post FormData
// --------------------
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

// --------------------
// Submit Handler
// --------------------
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

        const data = await postFormData("/api/polishResume", formData);
        setResultText(data.result || "No result generated");
    } catch (err: any) {
        setError(err.message || "Error occurred");
    } finally {
        setLoading(false);
    }
};

// --------------------
// Optimized DOCX Download
// --------------------
export const downloadAsDOCX = async (resultText: string) => {
    const { Document, Packer, Paragraph, TextRun } = await import("docx");

    const raw = resultText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
    const sections = raw.split(/\n{2,}/);

    const children: any[] = [];

    const FONT_SIZE_HEADING = 28; // ~14pt
    const FONT_SIZE_PARAGRAPH = 24; // ~12pt
    const FONT_NAME = "Calibri";

    // ---------- Helpers ----------
    const mkHeading = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text: text.replace(/\*\*/g, ""), bold: true, size: FONT_SIZE_HEADING, font: FONT_NAME })],
            spacing: { before: 120, after: 40 },
        });

    const mkParagraph = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text: text.replace(/\*\*/g, ""), size: FONT_SIZE_PARAGRAPH, font: FONT_NAME })],
            spacing: { after: 20 },
        });

    const mkItalic = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text, italics: true, size: FONT_SIZE_PARAGRAPH, font: FONT_NAME })],
            spacing: { after: 20 },
        });

    const mkBullet = (text: string) =>
        new Paragraph({
            children: [new TextRun({ text: text.replace(/\*\*/g, ""), size: FONT_SIZE_PARAGRAPH, font: FONT_NAME })],
            bullet: { level: 0 },
            spacing: { after: 15 },
        });

    function compressBlock(lines: string[]) {
        if (lines.length <= 1) return lines;
        const merged = lines.slice(0, 3).join(" | ");
        return [merged, ...lines.slice(3)];
    }

    // ---------- Main Parsing ----------
    sections.forEach((sec, secIndex) => {
        let lines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
        if (!lines.length) return;

        // Remove markdown ###
        lines = lines.map((l) => l.replace(/^###\s*/, ""));

        // Name + Contact (first section)
        if (secIndex === 0 && lines.length >= 2) {
            children.push(new Paragraph({
                children: [new TextRun({ text: lines[0].replace(/\*\*/g, ""), bold: true, size: FONT_SIZE_HEADING, font: FONT_NAME })],
                spacing: { after: 10 },
            }));
            children.push(new Paragraph({
                children: [new TextRun({ text: lines.slice(1).join(" | "), size: FONT_SIZE_PARAGRAPH, font: FONT_NAME })],
                spacing: { after: 30 },
            }));
            return;
        }

        // Headings detection
        if (lines.length === 1) {
            const single = lines[0];
            const isAllCaps = /^[A-Z0-9 \-,&]+$/.test(single);
            const endsWithColon = /:$/.test(single);
            if (isAllCaps || endsWithColon) {
                children.push(mkHeading(single.replace(/[:\*]/g, "").trim()));
                return;
            }
        }

        // Bullet list detection
        const isBulletList = lines.every((ln) => /^[-•\*\u2022] /.test(ln) || /^\d+[\.\)] /.test(ln));
        if (isBulletList) {
            lines.forEach((ln) => {
                const cleaned = ln.replace(/^[-•\*\u2022]\s+/, "").replace(/^\d+[\.\)]\s+/, "");
                children.push(mkBullet(cleaned));
            });
            return;
        }

        // Experience / Education / Projects
        const sectionKeywords = ["EXPERIENCE", "FREELANCE", "EDUCATION", "PROJECTS", "TECHNICAL PROJECTS", "SUMMARY"];
        const isSection = sectionKeywords.some((h) => sec.toUpperCase().includes(h));

        if (isSection) {
            lines = compressBlock(lines);

            // Professional Summary / Description
            if (sec.toUpperCase().includes("SUMMARY")) {
                children.push(mkHeading("PROFESSIONAL SUMMARY"));
                children.push(mkParagraph(lines.join(" ")));
                return;
            }

            // Experience / Education
            if (sec.toUpperCase().includes("EXPERIENCE") || sec.toUpperCase().includes("FREELANCE") || sec.toUpperCase().includes("EDUCATION")) {
                const title = lines[0];
                const companyOrUniversity = lines[1] || "";
                const date = lines[2] || "";

                children.push(mkHeading(title));
                if (companyOrUniversity || date) {
                    children.push(mkItalic([companyOrUniversity, date].filter(Boolean).join(" | ")));
                }

                lines.slice(3).forEach((ln) => children.push(mkBullet(ln)));
                return;
            }

            // Projects
            if (sec.toUpperCase().includes("PROJECTS")) {
                children.push(mkHeading(lines[0]));
                lines.slice(1).forEach((ln) => {
                    if (/^[-•\*\u2022]/.test(ln)) {
                        const cleaned = ln.replace(/^[-•\*\u2022]\s+/, "");
                        children.push(mkBullet(cleaned));
                    } else {
                        children.push(mkParagraph(ln));
                    }
                });
                return;
            }
        }

        // Default paragraph
        lines.forEach((ln) => children.push(mkParagraph(ln)));
    });

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: { margin: { top: 480, right: 480, bottom: 480, left: 480 } }, // 0.33 inch margins to reduce blank space
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

