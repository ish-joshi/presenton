import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

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

    emphasiseText: z
        .string()
        .max(150)
        .default("Driving Growth Through Innovation and Execution Excellence")
        .meta({
            description:
                "Large central emphasised text (max 3 lines, 150 chars max)",
        }),
});

type SchemaType = z.infer<typeof Schema>;

/**
 * Slide layout with a standardized header bar
 */

export const layoutDescription =
    "Emphasis Text Layout: This slide layout features a large, bold, centrally positioned text block, ideal for highlighting key facts, impactful statements, or memorable quotes. The layout includes a standardized header with slide number, section title, content rating, and company logo. Best used for drawing attention to a single, important message or callout.";

function EmphasisTextLayout({ data }: { data: SchemaType }) {
    const { slideNumber, sectionTitle, contentRating, companyLogo, emphasiseText } = data;

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
                <p className="text-5xl font-extrabold text-center leading-tight max-w-4xl">
                    {emphasiseText}
                </p>
            </main>
        </div>
    );
}

export default EmphasisTextLayout;
