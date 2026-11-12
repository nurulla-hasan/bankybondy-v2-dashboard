"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error";
import { useUserGeoAggregation } from "@/services";

const UserHeatMap = dynamic(() => import("./user-heat-map"), {
  ssr: false,
  loading: () => <Skeleton className="aspect-video w-full" />,
});

export function HeatMapView() {
  const t = useTranslations("HeatMap");
  const geo = useUserGeoAggregation();

  const clusters = geo.data?.data.byCoordinate ?? [];
  const cities = geo.data?.data.byCity ?? [];
  const maxCityCount = cities[0]?.count ?? 1;

  const hasData = clusters.length > 0 || cities.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeading
        as="h3"
        alignment="left"
        constrain={false}
        title={t("title")}
        description={t("subtitle")}
      />

      {geo.isError ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              {getErrorMessage(geo.error, t("loadError"))}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                void geo.refetch();
              }}
            >
              {t("retry")}
            </Button>
          </CardContent>
        </Card>
      ) : geo.isPending ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="aspect-video w-full lg:col-span-2" />
          <Skeleton className="min-h-64 w-full" />
        </div>
      ) : !hasData ? (
        <EmptyState
          icon={<MapPin aria-hidden />}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("mapTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {clusters.length > 0 ? (
                <UserHeatMap points={clusters} />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted/40 text-sm text-muted-foreground">
                  {t("noLocationData")}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {t("clustersCount", { count: clusters.length })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("citiesTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {cities.length > 0 ? (
                <div className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
                  {cities.slice(0, 10).map((city) => (
                    <div key={city.city} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate font-medium">{city.city}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {city.count}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(city.count / maxCityCount) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("noCityData")}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
