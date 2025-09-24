// components/ResumePDF.tsx
import React, { JSX, useMemo } from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';


// Define styles for the PDF document
const styles = StyleSheet.create({
    page: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        fontFamily: 'Helvetica', // Default font
    },
    header: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    paragraph: {
        fontSize: 11,
        marginBottom: 5,
        lineHeight: 1.4,
    },
    bulletItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 10,
    },
    bulletPoint: {
        width: 10,
        fontSize: 11,
    },
    bulletText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 1.4,
    },
});

// The main PDF Document Component
export const ResumePDF = ({ resultText }: { resultText: string }) => {
    // We use useMemo to avoid re-parsing the text on every render
    const content = useMemo(() => {
        const raw = resultText.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
        const sections = raw.split(/\n{2,}/);
        const elements: JSX.Element[] = [];

        sections.forEach((sec, secIndex) => {
            const lines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
            if (lines.length === 0) return;

            // Heading detection logic (similar to your docx function)
            if (lines.length === 1) {
                const single = lines[0];
                const isAllCaps = /^[A-Z0-9 \-,&]+$/.test(single) && single.length <= 40;
                const endsWithColon = /:$/.test(single);
                if (isAllCaps || endsWithColon) {
                    elements.push(<Text key={`h-${secIndex}`} style={styles.header}>{single.replace(/:$/, "")}</Text>);
                    return;
                }
            }

            // Bullet points detection
            const isBulletList = lines.every((ln) => /^[-•\*\u2022] /.test(ln));
            if (isBulletList) {
                lines.forEach((ln, lnIndex) => {
                    const cleaned = ln.replace(/^[-•\*\u2022]\s+/, "");
                    elements.push(
                        <View key={`b-${secIndex}-${lnIndex}`} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{cleaned}</Text>
                        </View>
                    );
                });
                return;
            }

            // Fallback to normal paragraphs
            lines.forEach((ln, lnIndex) => {
                elements.push(<Text key={`p-${secIndex}-${lnIndex}`} style={styles.paragraph}>{ln}</Text>);
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