import React from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { fileURLToPath } from "url";
import path from "path";
// --------------------
// Sample JSON data
// --------------------
const sampleData = {
  name: "JOHN A. SMITH",
  email: "john.smith@example.com",
  phone: "(555) 555-1234",
  linkedin: "linkedin.com/in/johnasmith",
  address: {
    street: "789 Pine Ave",
    city: "Cityville",
    state: "NY",
    zipcode: "67890",
  },
  portfolio: "github.com/johnsmithdev",
  summary:
    "Junior Software Developer with 2 years of experience in web development, specializing in Python and JavaScript. Eager to contribute to a dynamic team and grow professionally.",
  skills: {
    languages: ["Python", "JavaScript", "HTML", "CSS"],
    frameworks: ["Django", "React (basic)"],
    databases: ["PostgreSQL", "SQLite"],
    tools: ["Git", "Docker (basic understanding)"],
    concepts: ["RESTful APIs", "Agile Methodologies"],
  },
  experience: [
    {
      title: "Software Developer Intern",
      company: "Tech Solutions Inc.",
      dates: "May 2023 – August 2023",
      description: [
        "Assisted senior developers in building backend APIs using Django.",
        "Fixed bugs in existing web applications.",
      ],
    },
    {
      title: "Freelance Web Developer",
      company: "Self-Employed",
      dates: "Jan 2022 – Dec 2022",
      description: [
        "Developed small static websites for local businesses.",
        "Managed client communication and project requirements.",
      ],
    },
  ],
  education: {
    degree: "B.S. in Computer Science",
    university: "State University",
    graduationDate: "May 2023",
  },
  projects: [
    {
      name: "E-commerce Website",
      description:
        "Developed a full-stack e-commerce site using Django (backend) and HTML/CSS/JS (frontend). Implemented user authentication and product catalog.",
    },
    {
      name: "Task Manager App",
      description: "A simple Python CLI application for managing daily tasks.",
    },
  ],
};

// --------------------
// Register fonts
// --------------------
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://github.com/google/fonts/raw/main/apache/helvetica/Helvetica-Regular.ttf",
    },
    {
      src: "https://github.com/google/fonts/raw/main/apache/helvetica/Helvetica-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.4 },
  name: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 4,
  },
  contact: { fontSize: 9.5, textAlign: "center", marginBottom: 6 },
  header: {
    fontSize: 12.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 4,
  },
  paragraph: { marginBottom: 4, fontSize: 10.5, lineHeight: 1.4 },
  bulletItem: { flexDirection: "row", marginBottom: 4, paddingLeft: 12 },
  bulletPoint: { width: 10, marginRight: 4 },
  bulletText: { flex: 1 },
});

// --------------------
// PDF Document using React.createElement
// --------------------
const ResumePDF = React.createElement(
  Document,
  null,
  React.createElement(
    Page,
    { size: "A4", style: styles.page },
    React.createElement(Text, { style: styles.name }, sampleData.name),
    React.createElement(
      Text,
      { style: styles.contact },
      `${sampleData.contact.email} | ${sampleData.contact.phone} | ${sampleData.contact.linkedin} | ${sampleData.contact.address} | ${sampleData.contact.portfolio}`
    ),

    React.createElement(Text, { style: styles.header }, "Summary"),
    React.createElement(Text, { style: styles.paragraph }, sampleData.summary),

    React.createElement(Text, { style: styles.header }, "Technical Skills"),
    Object.entries(sampleData.technicalSkills).map(([key, skills], i) =>
      React.createElement(
        Text,
        { key: i, style: styles.paragraph },
        React.createElement(
          Text,
          { style: { fontFamily: "Helvetica-Bold" } },
          key + ": "
        ),
        Array.isArray(skills) ? skills.join(", ") : skills
      )
    ),

    React.createElement(
      Text,
      { style: styles.header },
      "Professional Experience"
    ),
    sampleData.experience.map((exp, i) =>
      React.createElement(
        View,
        { key: i, style: { marginBottom: 6 } },
        React.createElement(
          Text,
          { style: { fontFamily: "Helvetica-Bold" } },
          `${exp.role} | ${exp.company} | ${exp.duration}`
        ),
        exp.responsibilities.map((r, idx) =>
          React.createElement(
            View,
            { key: idx, style: styles.bulletItem },
            React.createElement(Text, { style: styles.bulletPoint }, "•"),
            React.createElement(Text, { style: styles.bulletText }, r)
          )
        )
      )
    ),

    React.createElement(Text, { style: styles.header }, "Education"),
    sampleData.education.map((edu, i) =>
      React.createElement(
        Text,
        { key: i, style: styles.paragraph },
        React.createElement(
          Text,
          { style: { fontFamily: "Helvetica-Bold" } },
          edu.degree
        ),
        ` | ${edu.institution} | Graduated: ${edu.graduation}`
      )
    ),

    React.createElement(Text, { style: styles.header }, "Projects"),
    sampleData.projects.map((proj, i) =>
      React.createElement(
        View,
        { key: i, style: { marginBottom: 6 } },
        React.createElement(
          Text,
          { style: { fontFamily: "Helvetica-Bold" } },
          `${proj.name} | ${proj.techStack.join(", ")}`
        ),
        proj.responsibilities.map((r, idx) =>
          React.createElement(
            View,
            { key: idx, style: styles.bulletItem },
            React.createElement(Text, { style: styles.bulletPoint }, "•"),
            React.createElement(Text, { style: styles.bulletText }, r)
          )
        )
      )
    )
  )
);

// --------------------
// Generate PDF locally
// --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputPath = path.join(__dirname, "SampleResume.pdf");

ReactPDF.render(ResumePDF, outputPath).then(() => {
  console.log("PDF generated successfully:", outputPath);
});
