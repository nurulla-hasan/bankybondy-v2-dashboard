"use client";

import { Cell, Pie, PieChart } from "recharts";

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

import { DonutChartSkeleton } from "./chart-skeleton";
import { SectionError } from "./section-error";
import { useCountFormatter } from "./use-count-formatter";

export interface DonutSlice {
  key: string;
  label: string;
  value: number;
  fill: string;
  dotClassName: string;
}

export function DonutBreakdownCard({
  title,
  subtitle,
  slices,
  total,
  totalLabel,
  isPending,
  isError,
  onRetry,
  className,
}: {
  title: string;
  subtitle: string;
  slices: DonutSlice[];
  total: number;
  totalLabel: string;
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  className?: string;
}) {
  const fmt = useCountFormatter();

  const config = Object.fromEntries(
    slices.map((slice) => [
      slice.key,
      { label: slice.label, color: slice.fill },
    ]),
  ) satisfies ChartConfig;

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
          <DonutChartSkeleton label={title} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <ChartContainer
                config={config}
                className="mx-auto aspect-square h-52"
                role="img"
                aria-label={title}
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="key" hideLabel />}
                  />
                  <Pie
                    data={slices}
                    dataKey="value"
                    nameKey="key"
                    innerRadius={62}
                    outerRadius={92}
                    strokeWidth={4}
                  >
                    {slices.map((slice) => (
                      <Cell key={slice.key} fill={slice.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-2xl font-bold tracking-tight">
                  {fmt(total)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {totalLabel}
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-2">
              {slices.map((slice) => {
                const percent =
                  total > 0 ? Math.round((slice.value / total) * 100) : 0;

                return (
                  <li
                    key={slice.key}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <span
                        aria-hidden
                        className={cn("size-2.5 rounded-full", slice.dotClassName)}
                      />
                      {slice.label}
                    </span>
                    <span className="font-medium tabular-nums">
                      {fmt(slice.value)}
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        {percent}%
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
