import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chemicalsApi, offeringsApi } from '@/services/baserow';
import type { Chemical, SearchFilters, ProductOffering } from '@/types';

// Query keys
const CHEMICALS_KEY = 'chemicals';
const CHEMICAL_KEY = 'chemical';
const OFFERINGS_KEY = 'offerings';

// Get all chemicals with filters
export function useChemicals(filters?: SearchFilters, page = 1, size = 20) {
  return useQuery({
    queryKey: [CHEMICALS_KEY, filters, page, size],
    queryFn: () => chemicalsApi.getAll(filters, page, size),
    staleTime: 5 * 60 * 1000,
  });
}

// Get single chemical by ID
export function useChemical(id: string) {
  return useQuery({
    queryKey: [CHEMICAL_KEY, id],
    queryFn: () => chemicalsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Get chemical by CAS number
export function useChemicalByCAS(casNumber: string) {
  return useQuery({
    queryKey: [CHEMICAL_KEY, 'cas', casNumber],
    queryFn: () => chemicalsApi.getByCAS(casNumber),
    enabled: !!casNumber,
    staleTime: 5 * 60 * 1000,
  });
}

// Search chemicals
export function useChemicalSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: [CHEMICALS_KEY, 'search', query, limit],
    queryFn: () => chemicalsApi.search(query, limit),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
}

// Get product offerings for a chemical
export function useChemicalOfferings(chemicalId: string) {
  return useQuery({
    queryKey: [OFFERINGS_KEY, chemicalId],
    queryFn: () => offeringsApi.getByChemical(chemicalId),
    enabled: !!chemicalId,
    staleTime: 2 * 60 * 1000,
  });
}

// Get all offerings with filters
export function useOfferings(filters?: SearchFilters, page = 1, size = 20) {
  return useQuery({
    queryKey: [OFFERINGS_KEY, filters, page, size],
    queryFn: () => offeringsApi.getAll(filters, page, size),
    staleTime: 2 * 60 * 1000,
  });
}

// Prefetch chemical for faster navigation
export function usePrefetchChemical() {
  const queryClient = useQueryClient();
  
  return (id: string) => {
    queryClient.prefetchQuery({
      queryKey: [CHEMICAL_KEY, id],
      queryFn: () => chemicalsApi.getById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}
