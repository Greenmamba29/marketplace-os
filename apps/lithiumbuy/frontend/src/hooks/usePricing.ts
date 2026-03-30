import { useQuery } from '@tanstack/react-query';
import { pricingApi } from '@/services/api';
import type { SpotPrice, PriceIndex, PriceHistory, MaterialForm, PurityGrade } from '@/types';

const PRICING_KEY = 'pricing';

export function useSpotPrices(materialForm?: MaterialForm, grade?: PurityGrade) {
  return useQuery({
    queryKey: [PRICING_KEY, 'spot', materialForm, grade],
    queryFn: () =>
      pricingApi.getSpotPrices({
        material_form: materialForm,
        grade,
      }),
    staleTime: 30 * 1000, // 30 seconds - spot prices update frequently
    refetchInterval: 60 * 1000, // Auto-refetch every minute
  });
}

export function usePriceIndex(materialForm: MaterialForm) {
  return useQuery({
    queryKey: [PRICING_KEY, 'index', materialForm],
    queryFn: () => pricingApi.getPriceIndex(materialForm),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000, // Auto-refetch every 2 minutes
  });
}

export function useAllPriceIndices() {
  return useQuery({
    queryKey: [PRICING_KEY, 'indices'],
    queryFn: () => pricingApi.getAllIndices(),
    staleTime: 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  });
}

export function usePriceHistory(
  materialForm: MaterialForm,
  startDate: string,
  endDate: string,
  grade?: PurityGrade
) {
  return useQuery({
    queryKey: [PRICING_KEY, 'history', materialForm, grade, startDate, endDate],
    queryFn: () =>
      pricingApi.getPriceHistory({
        material_form: materialForm,
        grade,
        start_date: startDate,
        end_date: endDate,
      }),
    enabled: !!materialForm && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePriceHistoryWithRange(
  materialForm: MaterialForm,
  days: number = 30,
  grade?: PurityGrade
) {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return usePriceHistory(materialForm, startDate, endDate, grade);
}
