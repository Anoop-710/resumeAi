// utils/resumeUtils.ts
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
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

export async function downloadAsDOCX(resultText: string) {
    if (!resultText) return;

    let data: any;
    try {
        data = typeof resultText === "string" ? JSON.parse(resultText) : resultText;
    } catch {
        console.error("Invalid JSON");
        return;
    }

    const doc = new Document({
        sections: [
            {
                children: [
                    // Name
                    new Paragraph({
                        children: [new TextRun({ text: data.name || "", bold: true, size: 32 })],
                        spacing: { after: 200 },
                    }),

                    // Contact
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: [
                                    data.contact?.email,
                                    data.contact?.phone,
                                    data.contact?.linkedin,
                                    data.contact?.address,
                                    data.contact?.portfolio,
                                ]
                                    .filter(Boolean)
                                    .join(" | "),
                            }),
                        ],
                        spacing: { after: 200 },
                    }),

                    // Summary
                    ...(data.summary
                        ? [
                            new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2 }),
                            new Paragraph({ children: [new TextRun({ text: data.summary })], spacing: { after: 200 } }),
                        ]
                        : []),

                    // Skills
                    ...(data.skills
                        ? [
                            new Paragraph({ text: "TECHNICAL SKILLS", heading: HeadingLevel.HEADING_2 }),
                            ...Object.entries(data.skills)
                                .filter(([_, items]) => Array.isArray(items) && items.length > 0)
                                .map(([category, items]) =>
                                    new Paragraph({
                                        children: [
                                            new TextRun({
                                                text: `${category.charAt(0).toUpperCase() + category.slice(1)}: ${(
                                                    items as any[]
                                                ).join(", ")}`, // type assertion here
                                            }),
                                        ],
                                        spacing: { after: 100 },
                                    })
                                )

                        ]
                        : []),

                    // Experience
                    ...(data.experience && Array.isArray(data.experience)
                        ? [
                            new Paragraph({ text: "PROFESSIONAL EXPERIENCE", heading: HeadingLevel.HEADING_2 }),
                            ...data.experience.flatMap((exp: any) => [
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `${exp.title} | ${exp.company} | ${exp.dates || ""}`,
                                            bold: true,
                                        }),
                                    ],
                                    spacing: { after: 100 },
                                }),
                                ...(exp.description || []).map(
                                    (desc: string) =>
                                        new Paragraph({ text: `• ${desc}`, spacing: { after: 50 } })
                                ),
                            ]),
                        ]
                        : []),

                    // Education
                    ...(data.education && Array.isArray(data.education)
                        ? [
                            new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }),
                            ...data.education.map((edu: any) =>
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: `${edu.degree} | ${edu.university} | ${edu.graduationDate || ""}`,
                                            bold: true,
                                        }),
                                    ],
                                    spacing: { after: 100 },
                                })
                            ),
                        ]
                        : []),

                    // Projects
                    ...(data.projects && Array.isArray(data.projects)
                        ? [
                            new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_2 }),
                            ...data.projects.flatMap((proj: any) => [
                                new Paragraph({ children: [new TextRun({ text: proj.name, bold: true })], spacing: { after: 50 } }),
                                new Paragraph({ text: proj.description || "", spacing: { after: 100 } }),
                            ]),
                        ]
                        : []),

                    // Optional: Achievements
                    ...(data.achievements && Array.isArray(data.achievements) && data.achievements.length > 0
                        ? [
                            new Paragraph({ text: "ACHIEVEMENTS", heading: HeadingLevel.HEADING_2 }),
                            ...data.achievements.map((ach: string) => new Paragraph({ text: `• ${ach}`, spacing: { after: 50 } })),
                        ]
                        : []),

                    // Optional: Hobbies
                    ...(data.hobbies && Array.isArray(data.hobbies) && data.hobbies.length > 0
                        ? [
                            new Paragraph({ text: "HOBBIES", heading: HeadingLevel.HEADING_2 }),
                            ...data.hobbies.map((h: string) => new Paragraph({ text: h, spacing: { after: 50 } })),
                        ]
                        : []),

                    // Optional: Languages
                    ...(data.languages && Array.isArray(data.languages) && data.languages.length > 0
                        ? [
                            new Paragraph({ text: "LANGUAGES", heading: HeadingLevel.HEADING_2 }),
                            ...data.languages.map((l: string) => new Paragraph({ text: l, spacing: { after: 50 } })),
                        ]
                        : []),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "optimized_resume.docx");
}



