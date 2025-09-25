// ResumePDFJSON.tsx
import React from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";
import sampleData from "../utils/sampleResume.json";

// --- Register fonts ---
Font.register({
    family: "Helvetica",
    fonts: [
        { src: "https://github.com/google/fonts/raw/main/apache/helvetica/Helvetica-Regular.ttf" },
        { src: "https://github.com/google/fonts/raw/main/apache/helvetica/Helvetica-Bold.ttf", fontWeight: "bold" },
    ],
});

// --- Styles ---
const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: "Helvetica", fontSize: 11, lineHeight: 1.4 },
    name: { fontSize: 17, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 4 },
    contact: { fontSize: 9.5, textAlign: "center", marginBottom: 6 },
    header: { fontSize: 12.5, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 4 },
    paragraph: { marginBottom: 4, fontSize: 10.5, lineHeight: 1.4 },
    bulletItem: { flexDirection: "row", marginBottom: 4, paddingLeft: 12 },
    bulletPoint: { width: 10, marginRight: 4 },
    bulletText: { flex: 1 },
});

export const ResumePDFJSON = () => {
    const data = sampleData;

    return (
        <Document title="Sample Resume">
            <Page size="A4" style={styles.page}>
                <Text style={styles.name}>{data.name}</Text>
                <Text style={styles.contact}>
                    {data.contact.email} | {data.contact.phone} | {data.contact.linkedin} | {data.contact.address} | {data.contact.portfolio}
                </Text>

                {/* Summary */}
                <Text style={styles.header}>Summary</Text>
                <Text style={styles.paragraph}>{data.summary}</Text>

                {/* Technical Skills */}
                <Text style={styles.header}>Technical Skills</Text>
                {Object.entries(data.technicalSkills).map(([key, skills], i) => (
                    <Text key={i} style={styles.paragraph}>
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>{key}:</Text> {Array.isArray(skills) ? skills.join(", ") : skills}
                    </Text>
                ))}

                {/* Experience */}
                <Text style={styles.header}>Professional Experience</Text>
                {data.experience.map((exp, i) => (
                    <View key={i} style={{ marginBottom: 6 }}>
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>
                            {exp.role} | {exp.company} | {exp.duration}
                        </Text>
                        {exp.responsibilities.map((r, idx) => (
                            <View key={idx} style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>{r}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Education */}
                <Text style={styles.header}>Education</Text>
                {data.education.map((edu, i) => (
                    <Text key={i} style={styles.paragraph}>
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>{edu.degree}</Text> | {edu.institution} | Graduated: {edu.graduation}
                    </Text>
                ))}

                {/* Projects */}
                <Text style={styles.header}>Projects</Text>
                {data.projects.map((proj, i) => (
                    <View key={i} style={{ marginBottom: 6 }}>
                        <Text style={{ fontFamily: "Helvetica-Bold" }}>
                            {proj.name} | {proj.techStack.join(", ")}
                        </Text>
                        {proj.responsibilities.map((r, idx) => (
                            <View key={idx} style={styles.bulletItem}>
                                <Text style={styles.bulletPoint}>•</Text>
                                <Text style={styles.bulletText}>{r}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </Page>
        </Document>
    );
};
