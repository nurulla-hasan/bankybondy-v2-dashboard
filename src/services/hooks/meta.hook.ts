import { useQuery } from "@tanstack/react-query";

import {
  getAudioDistribution,
  getBondChartData,
  getDashboardMeta,
  getDonorChartData,
  getEarningChartData,
  getSubscriptionStats,
  getUserChartData,
} from "../api/meta.api";

export function useDashboardMeta() {
  return useQuery({
    queryKey: ["meta", "dashboard"],
    queryFn: getDashboardMeta,
  });
}

export function useUserChart(year: number) {
  return useQuery({
    queryKey: ["meta", "user-chart", year],
    queryFn: () => getUserChartData(year),
  });
}

export function useSubscriptionStats() {
  return useQuery({
    queryKey: ["meta", "subscription-stats"],
    queryFn: getSubscriptionStats,
  });
}

export function useBondChart(year: number) {
  return useQuery({
    queryKey: ["meta", "bond-chart", year],
    queryFn: () => getBondChartData(year),
  });
}

export function useDonorChart(year: number) {
  return useQuery({
    queryKey: ["meta", "donor-chart", year],
    queryFn: () => getDonorChartData(year),
  });
}

export function useEarningChart(year: number) {
  return useQuery({
    queryKey: ["meta", "earning-chart", year],
    queryFn: () => getEarningChartData(year),
  });
}

export function useAudioDistribution() {
  return useQuery({
    queryKey: ["meta", "audio-distribution"],
    queryFn: getAudioDistribution,
  });
}
