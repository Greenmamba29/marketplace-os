import { useQuery } from '@tanstack/react-query';
import { intelligenceApi } from '@/services/api';
import type { SupplyAlert, GeopoliticalRisk } from '@/types';

const INTELLIGENCE_KEY = 'intelligence';

export function useSupplyAlerts() {
  return useQuery({
    queryKey: [INTELLIGENCE_KEY, 'alerts'],
    queryFn: () => intelligenceApi.getSupplyAlerts(),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function useMarketSummary() {
  return useQuery({
    queryKey: [INTELLIGENCE_KEY, 'summary'],
    queryFn: () => intelligenceApi.getMarketSummary(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useGeopoliticalRisks(country?: string) {
  return useQuery({
    queryKey: [INTELLIGENCE_KEY, 'risks', country],
    queryFn: () => intelligenceApi.getGeopoliticalRisks(country),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
}
