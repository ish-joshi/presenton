import React, { useEffect, useRef } from "react";
import * as z from "zod";
import MarkdownRenderer from "@/app/(presentation-generator)/documents-preview/components/MarkdownRenderer";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

const PLACEHOLDER_COMPANY_URL =
    "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg";

export const Schema = z.object({
    slideNumber: z.number().min(1).default(1),
    sectionTitle: z.string().min(2).max(50).default("Background"),
    contentRating: z
        .enum(["internal", "restricted", "unclassified"])
        .default("restricted"),
    companyLogo: ImageSchema.default({
        __image_url__: PLACEHOLDER_COMPANY_URL,
        __image_prompt__: "Company logo",
    }),
    mermaidCode: z.string().min(10).default(`graph LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Fix it]
    D --> B
    C --> E[End]`),
    theme: z.enum(["default", "dark", "forest", "neutral"]).default("neutral"),
    caption: z
        .string()
        .min(8)
        .max(200)
        .default(
            `## Diagram Explanation

This Mermaid diagram **visualizes** the process flow.`
        ),
});

export type MermaidSlideData = z.infer<typeof Schema>;

export const layoutDescription =
    `Mermaid With Caption Layout: This slide layout displays a Mermaid diagram with a markdown-supported caption. Supports all major Mermaid chart types, including: Flowchart, Class, Sequence, Entity Relationship, State, Mindmap, Architecture, Block, C4, Gantt, Git, Kanban, Packet, Pie, Quadrant, Radar, Requirement, Sankey, Timeline, Treemap, User Journey, XY, ZenUML. Includes a standardized header with slide number, section title, content rating, and company logo. Ideal for visualizing processes, systems, relationships, timelines, and technical diagrams with a clear, formatted explanation.`;

const MermaidWithCaptionLayout: React.FC<{ data: MermaidSlideData }> = ({
                                                                      data,
                                                                  }) => {
    const { slideNumber, sectionTitle, contentRating, companyLogo, mermaidCode, theme, caption } =
        data;
    const mermaidRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadMermaid = async () => {
            try {
                const mermaid = (await import("mermaid")).default;
                mermaid.initialize({
                    startOnLoad: true,
                    theme: theme || "default",
                    themeVariables: {
                        primaryColor: "#3b82f6",
                        primaryTextColor: "#1f2937",
                        primaryBorderColor: "#e5e7eb",
                        lineColor: "#6b7280",
                        secondaryColor: "#f3f4f6",
                        tertiaryColor: "#ffffff",
                    },
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true,
                        curve: "basis",
                    },
                });

                if (mermaidRef.current && mermaidCode) {
                    mermaidRef.current.innerHTML = "";
                    const diagramId = `mermaid-${Date.now()}`;
                    const { svg } = await mermaid.render(diagramId, mermaidCode);
                    mermaidRef.current.innerHTML = svg;
                }
            } catch (error) {
                console.error("Error rendering Mermaid diagram:", error);
                if (mermaidRef.current) {
                    mermaidRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-red-500">
              <div class="text-center">
                <p class="text-lg font-semibold">Error rendering diagram</p>
                <p class="text-sm mt-2">Please check your Mermaid syntax</p>
              </div>
            </div>
          `;
                }
            }
        };

        loadMermaid();
    }, [mermaidCode, theme]);

    return (
        <div className="aspect-video max-w-[1280px] w-full bg-white flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between border-b-2 border-gray-300 px-6 py-3">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{slideNumber}.</span>
                    <span className="font-bold text-lg">{sectionTitle}</span>
                </div>
                <div className="flex items-center gap-4">
          <span
              className={`px-2 py-1 border rounded text-sm font-semibold uppercase ${
                  contentRating === "restricted"
                      ? "border-red-500 text-red-600"
                      : contentRating === "internal"
                          ? "border-yellow-500 text-yellow-600"
                          : "border-gray-500 text-gray-600"
              }`}
          >
            {contentRating}
          </span>
                    {companyLogo?.__image_url__ && (
                        <img
                            src={PLACEHOLDER_COMPANY_URL}
                            alt="Company Logo"
                            className="h-8 w-auto"
                        />
                    )}
                </div>
            </header>

            {/* Caption */}
            <section className="px-6 py-4 border-b border-gray-200">
                <MarkdownRenderer content={caption} />
            </section>

            {/* Mermaid Diagram */}
            <main className="flex-1 flex items-center justify-center px-6 py-6">
                <div
                    ref={mermaidRef}
                    className="w-full h-full flex items-center justify-center min-h-[300px] max-h-[400px] overflow-hidden"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
            </main>
        </div>
    );
};

export default MermaidWithCaptionLayout;
