import * as z from "zod";
import React from "react";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    AreaChart,
    Area,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Cell,
} from "recharts";
import { ImageSchema } from "@/presentation-templates/defaultSchemes";
import MarkdownRenderer from "@/app/(presentation-generator)/documents-preview/components/MarkdownRenderer";

const PLACEHOLDER_COMPANY_URL = "https://brandyhq.com/wp-content/uploads/2024/12/Hyundai-Logo.jpg"

export const layoutDescription =
    "Chart With Caption Layout: This slide layout features a prominent chart visualization (supports bar, line, area, pie, and scatter charts) with a dedicated caption area for markdown-formatted explanations. Includes a standardized header with slide number, section title, content rating, and company logo. Ideal for presenting data insights, trends, and comparisons with clear supporting text.";

const chartDataSchema = z.object({
    name: z.string(),
    value: z.number(),
    category: z.string().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
});

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
    chartCaption: z
        .string()
        .min(8)
        .max(200)
        .default(`## Findings

This chart **highlights** trends in performance across years.

Notice the steady increase in values, indicating positive growth.`),
    chartType: z
        .enum(["bar", "line", "pie", "area", "scatter"])
        .default("line"),
    data: z
        .array(chartDataSchema)
        .min(2)
        .max(12)
        .default([
            { name: "2021", value: 5 },
            { name: "2022", value: 12 },
            { name: "2023", value: 18 },
            { name: "2024", value: 23 },
            { name: "2025", value: 26 },
        ]),
    dataKey: z.string().default("value"),
    categoryKey: z.string().default("name"),
    color: z.string().default("#3b82f6"),
    showLegend: z.boolean().default(false),
    showTooltip: z.boolean().default(true),
});

export type Type11SlideData = z.infer<typeof Schema>;

const CHART_COLORS = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
    "#ec4899",
    "#6366f1",
];

const renderChart = (
    chartType: string,
    chartData: any[],
    dataKey: string,
    categoryKey: string,
    color: string,
    showLegend: boolean,
    showTooltip: boolean
) => {
    const commonProps = {
        data: chartData,
        margin: { top: 10, right: 20, left: 0, bottom: 30 },
    };

    switch (chartType) {
        case "bar":
            return (
                <BarChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={categoryKey} />
                    <YAxis />
                    {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                    {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                    <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
            );

        case "line":
            return (
                <LineChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={categoryKey} />
                    <YAxis />
                    {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                    {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                    <Line
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        strokeWidth={3}
                        dot={{ fill: color, strokeWidth: 2, r: 4 }}
                    />
                </LineChart>
            );

        case "area":
            return (
                <AreaChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={categoryKey} />
                    <YAxis />
                    {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                    {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                    <Area
                        type="monotone"
                        dataKey={dataKey}
                        stroke={color}
                        fill={color}
                        fillOpacity={0.6}
                    />
                </AreaChart>
            );

        case "pie":
            return (
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                    {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="45%"
                        outerRadius={80}
                        fill={color}
                        dataKey={dataKey}
                        label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                        }
                    >
                        {chartData.map((entry: any, index: number) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>
            );

        case "scatter":
            return (
                <ScatterChart {...commonProps}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" type="number" />
                    <YAxis dataKey="y" type="number" />
                    {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
                    {showLegend && <ChartLegend content={<ChartLegendContent />} />}
                    <Scatter dataKey="value" fill={color} />
                </ScatterChart>
            );

        default:
            return <div>Unsupported chart type</div>;
    }
};

const Type11SlideLayout: React.FC<{ data: Type11SlideData }> = ({ data }) => {
    const {
        slideNumber,
        sectionTitle,
        contentRating,
        companyLogo,
        chartCaption,
        chartType,
        data: chartData,
        dataKey,
        categoryKey,
        color,
        showLegend,
        showTooltip,
    } = data;

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
                {/*<p className="text-lg text-gray-800">{chartCaption}</p>*/}
                <MarkdownRenderer content={chartCaption}/>
            </section>

            {/* Chart */}
            <main className="flex-1 flex items-center justify-center px-6 py-6">
                <div className="w-full" style={{maxHeight: 400, height: '100%'}}>
                    <ChartContainer
                        config={{
                            [dataKey]: {
                                label: categoryKey,
                                color,
                            },
                        }}
                        className="w-full h-full"
                    >
                        {renderChart(
                            chartType,
                            chartData,
                            dataKey,
                            categoryKey,
                            color,
                            showLegend,
                            showTooltip
                        )}
                    </ChartContainer>
                </div>
            </main>
        </div>
    );
};

export default Type11SlideLayout;
