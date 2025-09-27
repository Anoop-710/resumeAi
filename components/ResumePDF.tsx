// components/ResumePDF.tsx
import React, { JSX, useMemo } from "react";
import { Page, Text, View, Document, StyleSheet, Font } from "@react-pdf/renderer";

// --------------------
// Register fonts
// --------------------
Font.register({
    family: "Helvetica",
    fonts: [
        { src: "https://github.com/google/fonts/raw/main/apache/helvetica/Helvetica-Regular.ttf" },
        { src: "https://github.com/google/fonts/raw/main/apache/helvetica/Helvetica-Bold.ttf", fontWeight: "bold" },
    ],
});

// --------------------
// Styles
// --------------------
const styles = StyleSheet.create({
    page: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 35,
        fontFamily: "Helvetica",
        fontSize: 10.8,
        lineHeight: 1.3,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
    },
    contact: {
        fontSize: 9.5,
        textAlign: "center",
        marginBottom: 8,
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginVertical: 6,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 12,
        marginBottom: 4,
        textTransform: "uppercase",
    },
    paragraph: {
        fontSize: 10.5,
        marginBottom: 3,
        lineHeight: 1.3,
    },
    bulletItem: {
        flexDirection: "row",
        marginBottom: 2,
        paddingLeft: 12,
    },
    bulletPoint: {
        width: 8,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10.5,
        lineHeight: 1.3,
    },
});

// --------------------
// Helper: render bullets
// --------------------
const renderBullets = (items: string[] = [], prefix = "") => {
    return items.map((item, i) => (
        <View key={`${prefix}-${i}`} style={styles.bulletItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>{item}</Text>
        </View>
    ));
};

// --------------------
// Main PDF Component
// --------------------
interface ResumePDFProps {
    data: any; // JSON from AI API
}

export const ResumePDF: React.FC<ResumePDFProps> = ({ data }) => {
    const content = useMemo(() => {
        const elements: JSX.Element[] = [];

        // Name + Contact
        if (data.name) elements.push(<Text key="name" style={styles.name}>{data.name}</Text>);
        if (data.contact) {
            const contactArr = [];
            if (data.contact.email) contactArr.push(data.contact.email);
            if (data.contact.phone) contactArr.push(data.contact.phone);
            if (data.contact.linkedin) contactArr.push(data.contact.linkedin);
            if (data.contact.address) contactArr.push(data.contact.address);
            if (data.contact.portfolio) contactArr.push(data.contact.portfolio);

            elements.push(<Text key="contact" style={styles.contact}>{contactArr.join(" | ")}</Text>);
            elements.push(<View key="hr" style={styles.hr} />);
        }

        // Summary
        if (data.summary) {
            elements.push(<Text key="summaryHeader" style={styles.sectionHeader}>Summary</Text>);
            elements.push(<Text key="summary" style={styles.paragraph}>{data.summary}</Text>);
        }

        // Technical Skills - single line
        if (data.skills) {
            elements.push(<Text key="skillsHeader" style={styles.sectionHeader}>Technical Skills</Text>);

            Object.entries(data.skills).forEach(([category, items], idx) => {
                if (Array.isArray(items) && items.length > 0) {
                    elements.push(
                        <Text key={`skills-${idx}`} style={styles.paragraph}>
                            {`${category.charAt(0).toUpperCase() + category.slice(1)}: ${items.join(", ")}`}
                        </Text>
                    );
                }
            });
        }


        // Experience
        if (data.experience && data.experience.length > 0) {
            elements.push(<Text key="expHeader" style={styles.sectionHeader}>Professional Experience</Text>);
            data.experience.forEach((job: any, idx: number) => {
                const titleLine = [job.title, job.company, job.dates].filter(Boolean).join(" | ");
                if (titleLine) elements.push(<Text key={`expTitle-${idx}`} style={{ fontWeight: "bold", marginTop: 4 }}>{titleLine}</Text>);
                if (job.description) elements.push(...renderBullets(job.description, `exp-${idx}`));
            });
        }

        // Education
        if (data.education && data.education.length > 0) {
            elements.push(<Text key="eduHeader" style={styles.sectionHeader}>Education</Text>);
            data.education.forEach((edu: any, idx: number) => {
                const eduLine = [edu.degree, edu.university, edu.graduationDate].filter(Boolean).join(" | ");
                if (eduLine) elements.push(<Text key={`edu-${idx}`} style={styles.paragraph}>{eduLine}</Text>);
            });
        }

        // Projects
        if (data.projects && data.projects.length > 0) {
            elements.push(<Text key="projHeader" style={styles.sectionHeader}>Projects</Text>);
            data.projects.forEach((proj: any, idx: number) => {
                if (proj.name) elements.push(<Text key={`projName-${idx}`} style={{ fontWeight: "bold", marginTop: 2 }}>{proj.name}</Text>);
                if (proj.description) elements.push(...renderBullets([proj.description], `proj-${idx}`));
            });
        }

        // Achievements
        if (data.achievements && data.achievements.length > 0) {
            elements.push(<Text key="achHeader" style={styles.sectionHeader}>Achievements</Text>);
            elements.push(...renderBullets(data.achievements, "ach"));
        }

        // Hobbies
        if (data.hobbies && data.hobbies.length > 0) {
            elements.push(<Text key="hobbyHeader" style={styles.sectionHeader}>Hobbies</Text>);
            elements.push(...renderBullets(data.hobbies, "hobby"));
        }

        // Languages
        if (data.languages && data.languages.length > 0) {
            elements.push(<Text key="langHeader" style={styles.sectionHeader}>Languages</Text>);
            elements.push(...renderBullets(data.languages, "lang"));
        }

        return elements;
    }, [data]);

    return (
        <Document title="Optimized Resume">
            <Page size="A4" style={styles.page}>
                {content}
            </Page>
        </Document>
    );
};
