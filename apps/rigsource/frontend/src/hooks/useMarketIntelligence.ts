import { useQuery, useMutation } from '@tanstack/react-query';
import { intelligenceApi } from '@/services/baserow';
import { aiIntelligenceApi, priceIndexApi } from '@/services/intelligence';
import type { MarketIntelligence } from '@/types';

// Query keys
const INTELLIGENCE_KEY = 'intelligence';
const PRICE_HISTORY_KEY = 'price-history';
const PRICE_INDEX_KEY = 'price-index';
const MARKET_OVERVIEW_KEY = 'market-overview';
const FORECAST_KEY = 'forecast';
const SUPPLY_CHAIN_KEY = 'supply-chain';
const ALTERNATIVES_KEY = 'alternatives';

// Get market intelligence by CAS
export function useMarketIntelligence(casNumber: string, limit = 10) {
  return useQuery({
    queryKey: [INTELLIGENCE_KEY, casNumber, limit],
    queryFn: () => intelligenceApi.getByCAS(casNumber, limit),
    enabled: !!casNumber,
    staleTime: 30 * 60 * 1000,
  });
}

// Get latest market intelligence
export function useLatestIntelligence(limit = 20) {
  return useQuery({
    queryKey: [INTELLIGENCE_KEY, 'latest', limit],
    queryFn: () => intelligenceApi.getLatest(limit),
    staleTime: 30 * 60 * 1000,
  });
}

// Get price history
export function usePriceHistory(casNumber: string, months = 12) {
  return useQuery({
    queryKey: [PRICE_HISTORY_KEY, casNumber, months],
    queryFn: () => intelligenceApi.getPriceHistory(casNumber, months),
    enabled: !!casNumber,
    staleTime: 60 * 60 * 1000,
  });
}

// Get current price index
export function useCurrentPrice(casNumber: string) {
  return useQuery({
    queryKey: [PRICE_INDEX_KEY, casNumber],
    queryFn: () => priceIndexApi.getCurrentPrice(casNumber),
    enabled: !!casNumber,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

// Get market overview
export function useMarketOverview() {
  return useQuery({
    queryKey: [MARKET_OVERVIEW_KEY],
    queryFn: () => priceIndexApi.getMarketOverview(),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

// Get top movers
export function useTopMovers(direction: 'gainers' | 'losers' = 'gainers', limit = 10) {
  return useQuery({
    queryKey: [PRICE_INDEX_KEY, 'movers', direction, limit],
    queryFn: () => priceIndexApi.getTopMovers(direction, limit),
    staleTime: 15 * 60 * 1000,
  });
}

// Generate price forecast
export function usePriceForecast(casNumber: string, months = 6) {
  return useQuery({
    queryKey: [FORECAST_KEY, casNumber, months],
    queryFn: () => aiIntelligenceApi.generateForecast(casNumber, months),
    enabled: !!casNumber,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// Analyze supply chain
export function useSupplyChainAnalysis(casNumber: string) {
  return useQuery({
    queryKey: [SUPPLY_CHAIN_KEY, casNumber],
    queryFn: () => aiIntelligenceApi.analyzeSupplyChain(casNumber),
    enabled: !!casNumber,
    staleTime: 12 * 60 * 60 * 1000,
  });
}

// Get alternative chemicals
export function useAlternativeChemicals(casNumber: string, useCase?: string) {
  return useQuery({
    queryKey: [ALTERNATIVES_KEY, casNumber, useCase],
    queryFn: () => aiIntelligenceApi.getAlternatives(casNumber, useCase),
    enabled: !!casNumber,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// Subscribe to price alerts
export function useSubscribePriceAlert() {
  return useMutation({
    mutationFn: ({ casNumber, threshold, direction }: { casNumber: string; threshold: number; direction: 'above' | 'below' }) =>
      priceIndexApi.subscribeToAlerts(casNumber, threshold, direction),
  });
}
