import { useQuery, useMutation } from '@tanstack/react-query';
import { casLookupApi } from '@/services/intelligence';

// Query keys
const CAS_LOOKUP_KEY = 'cas-lookup';
const CAS_SEARCH_KEY = 'cas-search';
const CAS_VALIDATE_KEY = 'cas-validate';
const CAS_RELATED_KEY = 'cas-related';

// Validate CAS number
export function useValidateCAS(casNumber: string) {
  return useQuery({
    queryKey: [CAS_VALIDATE_KEY, casNumber],
    queryFn: () => casLookupApi.validate(casNumber),
    enabled: casNumber.length >= 5,
    staleTime: Infinity,
  });
}

// Lookup CAS number
export function useCASLookup(casNumber: string) {
  return useQuery({
    queryKey: [CAS_LOOKUP_KEY, casNumber],
    queryFn: () => casLookupApi.lookup(casNumber),
    enabled: casNumber.length >= 5,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// Search by name to find CAS
export function useCASSearchByName(name: string, limit = 10) {
  return useQuery({
    queryKey: [CAS_SEARCH_KEY, name, limit],
    queryFn: () => casLookupApi.searchByName(name, limit),
    enabled: name.length >= 2,
    staleTime: 60 * 60 * 1000,
  });
}

// Get related CAS numbers
export function useCASRelated(casNumber: string, limit = 10) {
  return useQuery({
    queryKey: [CAS_RELATED_KEY, casNumber, limit],
    queryFn: () => casLookupApi.getRelated(casNumber, limit),
    enabled: casNumber.length >= 5,
    staleTime: 24 * 60 * 60 * 1000,
  });
}

// Bulk lookup
export function useCASBulkLookup() {
  return useMutation({
    mutationFn: (casNumbers: string[]) => casLookupApi.bulkLookup(casNumbers),
  });
}
