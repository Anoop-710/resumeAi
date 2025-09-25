"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var docx_1 = require("docx");
var fs_1 = require("fs");
// Sample AI JSON input
var sampleData = {
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
var createBullets = function (items) {
    return items.map(function (item) {
        return new docx_1.Paragraph({
            text: item,
            bullet: { level: 0 },
            spacing: { after: 200 }
        });
    });
};
// --------------------
// Create DOCX document
// --------------------
var doc = new docx_1.Document({
    sections: [
        {
            properties: {},
            children: __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([
                // Name
                new docx_1.Paragraph({
                    text: sampleData.name,
                    heading: docx_1.HeadingLevel.TITLE,
                    spacing: { after: 200 }
                }),
                // Contact
                new docx_1.Paragraph({
                    text: "".concat(sampleData.contact.email, " | ").concat(sampleData.contact.phone, " | ").concat(sampleData.contact.linkedin, " | ").concat(sampleData.contact.address, " | ").concat(sampleData.contact.portfolio),
                    spacing: { after: 400 }
                }),
                // Summary
                new docx_1.Paragraph({ text: "PROFESSIONAL SUMMARY", heading: docx_1.HeadingLevel.HEADING_1 }),
                new docx_1.Paragraph({ text: sampleData.summary, spacing: { after: 400 } }),
                // Technical Skills
                new docx_1.Paragraph({ text: "TECHNICAL SKILLS", heading: docx_1.HeadingLevel.HEADING_1 })
            ], Object.entries(sampleData.skills).map(function (_a, idx) {
                var category = _a[0], items = _a[1];
                if (Array.isArray(items) && items.length > 0) {
                    return new docx_1.Paragraph({
                        text: "".concat(category.charAt(0).toUpperCase() + category.slice(1), ": ").concat(items.join(", ")),
                        spacing: { after: 200 }
                    });
                }
            }).filter(Boolean), true), [
                // Experience
                new docx_1.Paragraph({ text: "PROFESSIONAL EXPERIENCE", heading: docx_1.HeadingLevel.HEADING_1 })
            ], false), sampleData.experience.map(function (exp, idx) { return __spreadArray(__spreadArray([
                new docx_1.Paragraph({
                    spacing: { after: 100 },
                    children: [
                        new docx_1.TextRun({
                            text: "".concat(exp.title, " | ").concat(exp.company, " | ").concat(exp.dates),
                            bold: true
                        })
                    ]
                })
            ], createBullets(exp.description), true), [
                new docx_1.Paragraph({ text: "", spacing: { after: 200 } }) // spacing between experiences
            ], false); }).flat(), true), [
                // Education
                new docx_1.Paragraph({ text: "EDUCATION", heading: docx_1.HeadingLevel.HEADING_1 })
            ], false), sampleData.education.map(function (ed) {
                return new docx_1.Paragraph({
                    text: "".concat(ed.degree, " | ").concat(ed.university, " | Graduated: ").concat(ed.graduationDate),
                    spacing: { after: 200 }
                });
            }), true), [
                // Projects
                new docx_1.Paragraph({ text: "PROJECTS", heading: docx_1.HeadingLevel.HEADING_1 })
            ], false), sampleData.projects.map(function (pr) {
                return new docx_1.Paragraph({ text: "".concat(pr.name, ": ").concat(pr.description), spacing: { after: 200 } });
            }), true), [
                // Achievements (optional)
                ((_a = sampleData.achievements) === null || _a === void 0 ? void 0 : _a.length)
                    ? new docx_1.Paragraph({ text: "ACHIEVEMENTS", heading: docx_1.HeadingLevel.HEADING_1 })
                    : null
            ], false), (((_b = sampleData.achievements) === null || _b === void 0 ? void 0 : _b.length) ? createBullets(sampleData.achievements) : []), true), [
                // Hobbies (optional)
                ((_c = sampleData.hobbies) === null || _c === void 0 ? void 0 : _c.length)
                    ? new docx_1.Paragraph({ text: "HOBBIES", heading: docx_1.HeadingLevel.HEADING_1 })
                    : null
            ], false), (((_d = sampleData.hobbies) === null || _d === void 0 ? void 0 : _d.length) ? createBullets(sampleData.hobbies) : []), true), [
                // Languages (optional)
                ((_e = sampleData.languages) === null || _e === void 0 ? void 0 : _e.length)
                    ? new docx_1.Paragraph({ text: "LANGUAGES", heading: docx_1.HeadingLevel.HEADING_1 })
                    : null
            ], false), (((_f = sampleData.languages) === null || _f === void 0 ? void 0 : _f.length) ? createBullets(sampleData.languages) : []), true).filter(Boolean)
        }
    ]
});
// --------------------
// Save DOCX
// --------------------
docx_1.Packer.toBuffer(doc).then(function (buffer) {
    fs_1.default.writeFileSync("optimized_resume.docx", buffer);
    console.log("DOCX file created successfully!");
});
