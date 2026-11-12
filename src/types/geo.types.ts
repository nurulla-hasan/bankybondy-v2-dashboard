/** One cluster of users rounded to ~2 decimals (~1.1 km) on the map. */
export interface GeoCoordinateCluster {
  lat: number;
  lng: number;
  count: number;
}

export interface GeoCityCluster {
  city: string;
  count: number;
}

export interface UserGeoAggregation {
  byCoordinate: GeoCoordinateCluster[];
  byCity: GeoCityCluster[];
}
