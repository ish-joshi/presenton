import React from "react";
import * as z from "zod";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";

export const layoutId = "key-points-with-summary-slide";
export const layoutName = "Key Points With Summary Layout";
export const layoutDescription =
    "Key Points With Summary Layout: This slide layout features a header, a main title and short description on the left, and up to 3 numbered cards arranged vertically in a single column on the right. Each card includes a heading and a concise description. Includes a standardized header with slide number, section title, content rating, and company logo. Ideal for summarizing key takeaways, steps, or highlights in a clear, sequential format.";

const PLACEHOLDER_COMPANY_URL =
    "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg";

const keyPointsSchema = z.object({
    slideNumber: z.number().min(1).default(1),
    sectionTitle: z.string().min(2).max(50).default("Key Points"),
    contentRating: z
        .enum(["internal", "restricted", "unclassified"])
        .default("restricted"),
    companyLogo: ImageSchema.default({
        __image_url__:
            "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg",
        __image_prompt__: "Company logo",
    }),
    title: z
        .string()
        .min(3)
        .max(50)
        .default("Key Points")
        .meta({
            description: "Main title of the slide",
        }),
    description: z
        .string()
        .min(10)
        .max(130)
        .default(
            "Here is the main description that provides context and introduction to the numbered points on the right side."
        )
        .meta({
            description: "Main description text",
        }),
    items: z
        .array(
            z.object({
                heading: z
                    .string()
                    .min(2)
                    .max(50)
                    .meta({ description: "Item heading" }),
                description: z
                    .string()
                    .min(10)
                    .max(130)
                    .meta({ description: "Item description" }),
            })
        )
        .min(2)
        .max(3)
        .default([
            {
                heading: "First Key Point",
                description:
                    "Detailed explanation of the first important point that supports the main topic",
            },
            {
                heading: "Second Key Point",
                description:
                    "Detailed explanation of the second important point with relevant information",
            },
            {
                heading: "Third Key Point",
                description:
                    "Detailed explanation of the third important point that concludes the discussion",
            },
        ])
        .meta({
            description: "List of numbered items (2-3 items)",
        }),
});

export const Schema = keyPointsSchema;
export type KeyPointsWithSummaryData = z.infer<typeof keyPointsSchema>;

interface KeyPointsWithSummaryProps {
    data: Partial<KeyPointsWithSummaryData>;
}

function KeyPointsWithSummaryLayout({ data }: KeyPointsWithSummaryProps) {
    const { slideNumber, sectionTitle, contentRating, companyLogo, title, description, items } =
        data;

    return (
        <div className="aspect-video max-w-[1280px] w-full bg-white flex flex-col shadow-lg rounded-sm mx-auto">
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

            {/* Body */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 md:gap-16 items-center w-full px-6 py-6">
                {/* Left section - Title + Description */}
                <div className="lg:w-1/2 lg:space-y-8">
                    {title && (
                        <h1 className="text-gray-900 text-xl sm:text-2xl lg:text-[40px] leading-[36px] lg:leading-[48px] font-bold">
                            {title}
                        </h1>
                    )}
                    {description && (
                        <p className="text-gray-700 text-sm sm:text-base lg:text-[20px] leading-[20px] lg:leading-[30px] font-normal">
                            {description}
                        </p>
                    )}
                </div>

                {/* Right section - Numbered items */}
                <div className="lg:w-1/2 relative">
                    <div className="space-y-3 lg:space-y-6">
                        {items?.map((item, index) => (
                            <div
                                key={index}
                                style={{ boxShadow: "0 2px 10px 0 rgba(43, 43, 43, 0.2)" }}
                                className="rounded-lg p-3 lg:p-6 relative bg-white"
                            >
                                <div className="flex gap-6">
                                    <div className="text-[26px] lg:text-[32px] leading-[40px] px-1 font-bold mb-4 text-blue-600">
                                        {`0${index + 1}`}
                                    </div>
                                    <div className="space-y-1">
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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KeyPointsWithSummaryLayout;
