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
        fontSize: 17,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 4,
    },
    contact: {
        fontSize: 9.5,
        textAlign: "center",
        marginBottom: 6,
    },
    hr: {
        borderBottomWidth: 1,
        borderBottomColor: "#000",
        marginVertical: 6,
    },
    header: {
        fontSize: 12.5,
        marginTop: 10,
        marginBottom: 4,
        fontWeight: "bold",
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
// Helper: parse bold inline
// --------------------
const renderTextWithBold = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
    return parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
            <Text key={i} style={{ fontWeight: "bold" }}>
                {part.slice(2, -2)}
            </Text>
        ) : (
            <Text key={i}>{part}</Text>
        )
    );
};

// --------------------
// Helper: compress multi-line blocks for Experience/Education/Projects
// --------------------
const compressBlock = (lines: string[]) => {
    if (lines.length <= 1) return lines;
    // Join first 2–3 lines with " | "
    const merged = lines.slice(0, 3).join(" | ");
    const remaining = lines.slice(3);
    return [merged, ...remaining];
};

// --------------------
// Main PDF Component
// --------------------
export const ResumePDF = ({ resultText }: { resultText: string }) => {
    const content = useMemo(() => {
        const raw = resultText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
        const sections = raw.split(/\n{2,}/);
        const elements: JSX.Element[] = [];

        sections.forEach((sec, secIndex) => {
            let lines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
            if (lines.length === 0) return;

            // Remove any markdown ###
            lines = lines.map((l) => l.replace(/^###\s*/, ""));

            // First section: Name + Contact
            if (secIndex === 0 && lines.length >= 2) {
                elements.push(
                    <Text key="name" style={styles.name}>{lines[0].replace(/\*\*/g, "")}</Text>
                );
                elements.push(
                    <Text key="contact" style={styles.contact}>{lines.slice(1).join(" | ")}</Text>
                );
                elements.push(<View key="hr" style={styles.hr} />);
                return;
            }

            // Heading detection
            if (lines.length === 1) {
                const single = lines[0];
                const isAllCaps = /^[A-Z0-9 \-,&]+$/.test(single);
                const endsWithColon = /:$/.test(single);
                if (isAllCaps || endsWithColon) {
                    elements.push(
                        <Text key={`h-${secIndex}`} style={styles.header}>{single.replace(/[:\*]/g, "").trim()}</Text>
                    );
                    return;
                }
            }

            // Bullet list detection
            const isBulletList = lines.every((ln) => /^[-•\*\u2022] /.test(ln));
            if (isBulletList) {
                lines.forEach((ln, lnIndex) => {
                    const cleaned = ln.replace(/^[-•\*\u2022]\s+/, "");
                    elements.push(
                        <View key={`b-${secIndex}-${lnIndex}`} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{renderTextWithBold(cleaned)}</Text>
                        </View>
                    );
                });
                return;
            }

            // Compress Experience, Education, Freelance, Projects sections
            const headingWords = ["EXPERIENCE", "FREELANCE", "EDUCATION", "PROJECTS"];
            if (secIndex > 0 && headingWords.some((h) => sec.toUpperCase().includes(h))) {
                lines = compressBlock(lines);
            }

            // Render lines as paragraphs
            lines.forEach((ln, lnIndex) => {
                elements.push(
                    <Text key={`p-${secIndex}-${lnIndex}`} style={styles.paragraph}>
                        {renderTextWithBold(ln)}
                    </Text>
                );
            });
        });

        return elements;
    }, [resultText]);

    return (
        <Document title="Optimized Resume">
            <Page size="A4" style={styles.page}>
                {content}
            </Page>
        </Document>
    );
};
