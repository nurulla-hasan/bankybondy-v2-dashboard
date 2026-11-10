"use client";

import { useId } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { AreaChartSkeleton } from "./chart-skeleton";
import { SectionError } from "./section-error";

export function AreaChartCard<T extends { month: string }>({
  title,
  subtitle,
  points,
  dataKey,
  color = "var(--chart-1)",
  isPending,
  isError,
  onRetry,
  className,
}: {
  title: string;
  subtitle: string;
  points: T[];
  dataKey: string;
  color?: string;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  className?: string;
}) {
  const gradientId = `fill-${useId().replace(/:/g, "")}`;

  const config = {
    [dataKey]: { label: title, color },
  } satisfies ChartConfig;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="font-heading">{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        {isError ? (
          <SectionError onRetry={onRetry} />
        ) : isPending ? (
          <AreaChartSkeleton label={title} />
        ) : (
          <ChartContainer
            config={config}
            className="h-64 w-full"
            role="img"
            aria-label={title}
          >
            <AreaChart
              data={points}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${dataKey})`}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${dataKey})`}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                stroke="var(--muted-foreground)"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width={32}
                stroke="var(--muted-foreground)"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey={dataKey}
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke={`var(--color-${dataKey})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
