import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";
import MarkdownRenderer from "@/app/(presentation-generator)/documents-preview/components/MarkdownRenderer";

const PLACEHOLDER_COMPANY_URL =
    "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg";

const PLACEHOLDER_HERO_IMAGE =
    "https://picsum.photos/seed/picsum/300/200"; // stock hero

/**
 * Schema for HeroImageWithText slide
 */
export const Schema = z.object({
    slideNumber: z.number().min(1).default(1).meta({
        description: "Slide sequence number",
    }),

    sectionTitle: z
        .string()
        .min(2)
        .max(50)
        .default("Overview")
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

    heroImage: ImageSchema.default({
        __image_url__: PLACEHOLDER_HERO_IMAGE,
        __image_prompt__: "Hero visual for the slide",
    }).meta({
        description: "Main hero image shown on left side",
    }),

    bodyText: z
        .string()
        .max(500)
        .default(
            "This is where your key supporting message goes. Keep it clear, concise, and aligned with the visual."
        )
        .meta({
            description: "Main supporting markdown text displayed alongside the hero image",
        }),
});

type HeroImageWithTextType = z.infer<typeof Schema>;

/**
 * Slide layout with hero image (left) + text content (right)
 */
export const layoutDescription =
    "Hero Image With Text Content Layout: This slide layout presents a large hero image on the left and a flexible markdown-supported text area on the right. The text area supports full markdown, including tables, code blocks, lists, checkboxes, links, and images. Includes a standardized header with slide number, section title, content rating, and company logo. Ideal for combining impactful visuals with rich, formatted supporting content.";

function HeroImageWithTextContent({
    data,
}: {
    data: HeroImageWithTextType;
}) {
    const {
        slideNumber,
        sectionTitle,
        contentRating,
        companyLogo,
        heroImage,
        bodyText,
    } = data;

    return (
        <div className="aspect-video max-w-[1280px] w-full bg-white flex flex-col">
            {/* Slide Header */}
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

            {/* Hero Image + Text */}
            <main className="flex-1 grid grid-cols-2 gap-6 px-10 py-6">
                {/* Left: Hero Image */}
                <div className="flex items-center justify-center">
                    {heroImage?.__image_url__ && (
                        <img
                            src={heroImage.__image_url__}
                            alt="Hero"
                            className="w-full h-auto max-h-[80%] object-contain"
                        />
                    )}
                </div>

                {/* Right: Text Content */}
                <div className="flex items-center justify-center">
                    <MarkdownRenderer content={bodyText}/>
                </div>
            </main>
        </div>
    );
}

export default HeroImageWithTextContent;
