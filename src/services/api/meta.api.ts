import { apiClient } from "@/lib/api-client";
import type { ApiResponse, UserGeoAggregation } from "@/types";

export interface DashboardMeta {
  totalUser: number;
  totalBlockAccount: number;
  totalDonationAmount: number;
  totalDonors: number;
}

export interface UserChartPoint {
  month: string;
  totalUser: number;
}

export interface UserChartData {
  chartData: UserChartPoint[];
  yearsDropdown: number[];
}

export interface SubscriptionStats {
  free: number;
  standard: number;
  premium: number;
  total: number;
}

export interface BondChartPoint {
  month: string;
  total: number;
  ongoing: number;
  completed: number;
  canceled: number;
}

export interface BondChartData {
  total: number;
  ongoing: number;
  completed: number;
  canceled: number;
  chartData: BondChartPoint[];
  yearsDropdown: number[];
}

/** GET /meta/get-meta-data — KPI totals for the admin overview. */
export function getDashboardMeta() {
  return apiClient<ApiResponse<DashboardMeta>>("/meta/get-meta-data");
}

/** GET /meta/user-chart-data — signups per month for one year. */
export function getUserChartData(year: number) {
  return apiClient<ApiResponse<UserChartData>>("/meta/user-chart-data", {
    query: { year },
  });
}

/** GET /meta/subscription-stats — user count per subscription plan. */
export function getSubscriptionStats() {
  return apiClient<ApiResponse<SubscriptionStats>>("/meta/subscription-stats");
}

/** GET /meta/bond-chart-data — bond totals and monthly activity for one year. */
export function getBondChartData(year: number) {
  return apiClient<ApiResponse<BondChartData>>("/meta/bond-chart-data", {
    query: { year },
  });
}

export interface DonorChartPoint {
  month: string;
  totalDonate: number;
}

export interface DonorChartData {
  chartData: DonorChartPoint[];
  yearsDropdown: number[];
}

export interface EarningChartPoint {
  month: string;
  totalEarning: number;
}

export interface EarningChartData {
  chartData: EarningChartPoint[];
  yearsDropdown: number[];
}

export interface AudioDistribution {
  shortAudioCount: number;
  longAudioCount: number;
  totalCount: number;
}

/** GET /meta/donor-chart-data — donations per month for one year. */
export function getDonorChartData(year: number) {
  return apiClient<ApiResponse<DonorChartData>>("/meta/donor-chart-data", {
    query: { year },
  });
}

/** GET /meta/earning-chart-data — earnings per month for one year. */
export function getEarningChartData(year: number) {
  return apiClient<ApiResponse<EarningChartData>>("/meta/earning-chart-data", {
    query: { year },
  });
}

/** GET /meta/audio-pie-chart — short vs long audio totals. */
export function getAudioDistribution() {
  return apiClient<ApiResponse<AudioDistribution>>("/meta/audio-pie-chart");
}

/** GET /meta/user-geo-aggregation — users grouped by coordinate and by city. */
export function getUserGeoAggregation() {
  return apiClient<ApiResponse<UserGeoAggregation>>(
    "/meta/user-geo-aggregation",
  );
}
