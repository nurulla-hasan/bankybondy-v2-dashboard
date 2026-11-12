"use client";

import "leaflet/dist/leaflet.css";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { CircleMarker, MapContainer, TileLayer, Tooltip } from "react-leaflet";

import type { GeoCoordinateCluster } from "@/types";

const MIN_RADIUS = 6;
const MAX_RADIUS = 40;

/** Leaflet is browser-only, so this module is loaded with `ssr: false`. */
export default function UserHeatMap({
  points,
}: {
  points: GeoCoordinateCluster[];
}) {
  const t = useTranslations("HeatMap");

  const validPoints = useMemo(
    () =>
      points.filter(
        (point) =>
          Number.isFinite(point.lat) &&
          Number.isFinite(point.lng) &&
          point.count > 0,
      ),
    [points],
  );

  const maxCount = useMemo(
    () => validPoints.reduce((max, point) => Math.max(max, point.count), 0) || 1,
    [validPoints],
  );

  // sqrt keeps the circle AREA proportional to the user count.
  const radiusFor = (count: number) =>
    MIN_RADIUS + Math.sqrt(count / maxCount) * (MAX_RADIUS - MIN_RADIUS);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg border">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        worldCopyJump
        scrollWheelZoom
        className="size-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validPoints.map((point) => (
          <CircleMarker
            key={`${point.lat}-${point.lng}`}
            center={[point.lat, point.lng]}
            radius={radiusFor(point.count)}
            className="leaflet-heat-marker"
            pathOptions={{ weight: 1, fillOpacity: 0.45 }}
          >
            <Tooltip direction="top">
              {t("usersCount", { count: point.count })}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
