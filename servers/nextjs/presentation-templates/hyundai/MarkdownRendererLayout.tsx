import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";
import MarkdownRenderer from "@/app/(presentation-generator)/documents-preview/components/MarkdownRenderer";

/**
 * Schema for slides with a standardized slide header
 */

const PLACEHOLDER_COMPANY_URL = "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg"

export const Schema = z.object({
    slideNumber: z.number().min(1).default(1).meta({
        description: "Slide sequence number",
    }),

    sectionTitle: z
        .string()
        .min(2)
        .max(50)
        .default("Background")
        .meta({
            description: "Section or slide title displayed in the header",
        }),

    contentRating: z
        .enum(["internal", "restricted", "unclassified"])
        .default("restricted")
        .meta({
            description: "Content classification rating",
        }),

    companyLogo: ImageSchema.default({
        __image_url__: PLACEHOLDER_COMPANY_URL,
        __image_prompt__: "Company logo",
    }).meta({
        description: "Brand or company logo",
    }),

    markdownContent: z
        .string()
        .max(500)
        .default(`- **Git** enables version control by tracking changes in source code across multiple locations.
- Developed by *Linus Torvalds* in **2005**.
- Trusted by more than *80%* of global software teams.
- Facilitates feature branching, change history, and team collaboration.
- Integrated with services such as **GitHub**, **GitLab**, and **Bitbucket**.`)
        .meta({
            description:
                "Markdown content to display in the slide center, use for code snippets, tables etc...",
        }),
});

type SchemaType = z.infer<typeof Schema>;

/**
 * Slide layout with a standardized header bar
 */

export const layoutDescription =
    "Markdown Renderer Layout: This slide layout dedicates the entire slide to rich markdown content, supporting all markdown features including code blocks, tables, ordered and unordered lists, checkboxes, links, and images. Includes a standardized header with slide number, section title, content rating, and company logo. Ideal for technical documentation, detailed explanations, or any content requiring advanced formatting and structure.";

export default function MarkdownRendererLayout({ data }: { data: SchemaType }) {
    const { slideNumber, sectionTitle, contentRating, companyLogo, markdownContent } = data;

    return (
        <div className="aspect-video max-w-[1280px] w-full bg-white flex flex-col">
            {/* Slide Header */}
            <header className="flex items-center justify-between border-b-2 border-gray-300 px-6 py-3">
                {/* Left side: slide number + section title */}
                <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{slideNumber}.</span>
                    <span className="font-bold text-lg">{sectionTitle}</span>
                </div>

                {/* Right side: classification + logo */}
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

            {/* Emphasised Text in Center */}
            <main className="flex-1 flex items-center justify-center px-12 py-8">
                <MarkdownRenderer content={markdownContent}/>
            </main>
        </div>
    );
}
