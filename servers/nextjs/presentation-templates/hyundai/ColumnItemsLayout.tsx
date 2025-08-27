import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutDescription =
    "Column Items Layout: This slide layout displays up to 3 visually distinct cards in a horizontal row, each with a short title and description. Includes a header with slide number, section title, content rating, and company logo. Ideal for summarizing key features, benefits, or comparisons in a concise, visually organized format.";

const PLACEHOLDER_COMPANY_URL =
    "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg";

/**
 * Schema for MultiItemsView layout
 */
export const Schema = z.object({
    slideNumber: z.number().min(1).default(1).meta({
        description: "Slide sequence number",
    }),

    sectionTitle: z.string().min(2).max(50).default("Overview").meta({
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

    title: z.string().min(3).max(50).default("Main Title").meta({
        description: "Main title of the slide",
    }),

    items: z
        .array(
            z.object({
                heading: z.string().min(2).max(50).meta({
                    description: "Item heading",
                }),
                description: z.string().min(10).max(130).meta({
                    description: "Item description",
                }),
            })
        )
        .min(2)
        .max(3)
        .default([
            {
                heading: "First Point",
                description:
                    "Description for the first key point that explains important details",
            },
            {
                heading: "Second Point",
                description:
                    "Description for the second key point with relevant information",
            },
            {
                heading: "Third Point",
                description:
                    "Description for the third key point highlighting crucial aspects",
            },
        ])
        .meta({
            description: "List of content items (2–3 items)",
        }),
});

export type MultiItemsViewData = z.infer<typeof Schema>;

interface MultiItemsViewProps {
    data: Partial<MultiItemsViewData>;
}

/**
 * Slide layout: MultiItemsView
 */
const MultiItemsView: React.FC<MultiItemsViewProps> = ({ data: slideData }) => {
    const { slideNumber, sectionTitle, contentRating, companyLogo, title, items } =
        slideData;

    const isGridLayout = items?.length && items?.length >= 4;

    const renderGridContent = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 relative gap-6 md:gap-12 mt-4 lg:mt-12">
            {items?.map((item, index) => (
                <div
                    key={index}
                    className="w-full relative p-3 lg:p-6 rounded-md"
                    style={{
                        boxShadow: "0 2px 10px 0 rgba(43, 43, 43, 0.2)",
                    }}
                >
                    <div className="space-y-2">
                        {item.heading && (
                            <h3 className="text-gray-900 text-base sm:text-lg lg:text-[24px] leading-[26px] lg:leading-[32px] font-bold">
                                {item.heading}
                            </h3>
                        )}
                        {item.description && (
                            <p className="text-gray-700 text-sm sm:text-base lg:text-[20px] leading-[20px] lg:leading-[30px] font-normal">
                                {item.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderHorizontalContent = () => (
        <div className="flex flex-col lg:flex-row mt-4 lg:mt-12 w-full relative gap-12">
            {items?.map((item, index) => (
                <div
                    key={index}
                    className="w-full relative p-3 lg:p-6 rounded-md"
                    style={{
                        boxShadow: "0 2px 10px 0 rgba(43, 43, 43, 0.2)",
                    }}
                >
                    <div className="space-y-2 lg:space-y-4">
                        {item.heading && (
                            <h3 className="text-gray-900 text-base sm:text-lg lg:text-[24px] leading-[26px] lg:leading-[32px] font-bold">
                                {item.heading}
                            </h3>
                        )}
                        {item.description && (
                            <p className="text-gray-700 text-sm sm:text-base lg:text-[20px] leading-[20px] lg:leading-[30px] font-normal">
                                {item.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="aspect-video max-w-[1280px] w-full bg-white flex flex-col shadow-lg rounded-sm">
            {/* Top Bar */}
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-start px-6 sm:px-12 lg:px-20 py-8">
                {title && (
                    <div className="text-center lg:pb-8 w-full">
                        <h1 className="text-gray-900 text-xl sm:text-2xl lg:text-[40px] leading-[36px] lg:leading-[48px] font-bold">
                            {title}
                        </h1>
                    </div>
                )}

                {isGridLayout ? renderGridContent() : renderHorizontalContent()}
            </main>
        </div>
    );
};

export default MultiItemsView;
