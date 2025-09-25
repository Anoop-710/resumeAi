import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import fs from "fs";

// Sample AI JSON input
const sampleData = {
    name: "Sarah L. Johnson",
    contact: {
        email: "sarah.johnson@pro.com",
        phone: "+1-987-654-3210",
        linkedin: "linkedin.com/in/sarahjohnsonse",
        address: "San Francisco, CA",
        portfolio: "github.com/sarah-j-dev"
    },
    summary: "Senior Software Engineer with 7+ years of experience...",
    skills: {
        languages: ["Python", "Go", "JavaScript", "SQL"],
        frameworks: ["FastAPI", "Django", "Flask", "Node.js"],
        databases: ["PostgreSQL", "MongoDB"],
        tools: ["Git", "Docker", "AWS"],
        concepts: ["Microservices", "CI/CD", "REST APIs"]
    },
    experience: [
        {
            title: "Senior Software Engineer",
            company: "TechCorp Inc.",
            dates: "Jan 2020 – Present",
            description: [
                "Architected and deployed scalable backend systems using Python and FastAPI.",
                "Led CI/CD implementation and automated testing pipelines.",
                "Mentored junior developers and conducted code reviews."
            ]
        }
    ],
    education: [
        {
            degree: "B.S. in Computer Science",
            university: "State University",
            graduationDate: "May 2016"
        }
    ],
    projects: [
        {
            name: "Inventory Management System",
            description: "Developed full-stack inventory management system using Django and React."
        }
    ],
    achievements: ["Employee of the Year 2021", "Open Source Contributor"],
    hobbies: ["Reading", "Traveling"],
    languages: ["English", "Spanish"]
};

// --------------------
// Helper: create bullet paragraphs
// --------------------
const createBullets = (items: string[]) => {
    return items.map(item =>
        new Paragraph({
            text: item,
            bullet: { level: 0 },
            spacing: { after: 200 }
        })
    );
};

// --------------------
// Create DOCX document
// --------------------
const doc = new Document({
    sections: [
        {
            properties: {},
            children: [
                // Name
                new Paragraph({
                    text: sampleData.name,
                    heading: HeadingLevel.TITLE,
                    spacing: { after: 200 }
                }),

                // Contact
                new Paragraph({
                    text: `${sampleData.contact.email} | ${sampleData.contact.phone} | ${sampleData.contact.linkedin} | ${sampleData.contact.address} | ${sampleData.contact.portfolio}`,
                    spacing: { after: 400 }
                }),

                // Summary
                new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_1 }),
                new Paragraph({ text: sampleData.summary, spacing: { after: 400 } }),

                // Technical Skills
                new Paragraph({ text: "TECHNICAL SKILLS", heading: HeadingLevel.HEADING_1 }),
                ...Object.entries(sampleData.skills).map(([category, items], idx) => {
                    if (Array.isArray(items) && items.length > 0) {
                        return new Paragraph({
                            text: `${category.charAt(0).toUpperCase() + category.slice(1)}: ${items.join(", ")}`,
                            spacing: { after: 200 }
                        });
                    }
                }).filter(Boolean) as Paragraph[],

                // Experience
                new Paragraph({ text: "PROFESSIONAL EXPERIENCE", heading: HeadingLevel.HEADING_1 }),
                ...sampleData.experience.map((exp, idx) => [
                    new Paragraph({
                        spacing: { after: 100 },
                        children: [
                            new TextRun({
                                text: `${exp.title} | ${exp.company} | ${exp.dates}`,
                                bold: true
                            })
                        ]
                    }),

                    ...createBullets(exp.description),
                    new Paragraph({ text: "", spacing: { after: 200 } }) // spacing between experiences
                ]).flat(),

                // Education
                new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_1 }),
                ...sampleData.education.map(ed =>
                    new Paragraph({
                        text: `${ed.degree} | ${ed.university} | Graduated: ${ed.graduationDate}`,
                        spacing: { after: 200 }
                    })
                ),

                // Projects
                new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_1 }),
                ...sampleData.projects.map(pr =>
                    new Paragraph({ text: `${pr.name}: ${pr.description}`, spacing: { after: 200 } })
                ),

                // Achievements (optional)
                sampleData.achievements?.length
                    ? new Paragraph({ text: "ACHIEVEMENTS", heading: HeadingLevel.HEADING_1 })
                    : null,
                ...(sampleData.achievements?.length ? createBullets(sampleData.achievements) : []),

                // Hobbies (optional)
                sampleData.hobbies?.length
                    ? new Paragraph({ text: "HOBBIES", heading: HeadingLevel.HEADING_1 })
                    : null,
                ...(sampleData.hobbies?.length ? createBullets(sampleData.hobbies) : []),

                // Languages (optional)
                sampleData.languages?.length
                    ? new Paragraph({ text: "LANGUAGES", heading: HeadingLevel.HEADING_1 })
                    : null,
                ...(sampleData.languages?.length ? createBullets(sampleData.languages) : [])
            ].filter(Boolean) as Paragraph[]
        }
    ]
});

// --------------------
// Save DOCX
// --------------------
Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync("optimized_resume.docx", buffer);
    console.log("DOCX file created successfully!");
});
