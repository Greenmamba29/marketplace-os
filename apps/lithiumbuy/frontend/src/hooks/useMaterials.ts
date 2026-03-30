import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsApi } from '@/services/api';
import type { Material, Mine, MaterialFilters } from '@/types';

const MATERIALS_KEY = 'materials';
const MINES_KEY = 'mines';

export function useMaterials(filters?: MaterialFilters, page = 1, perPage = 20) {
  return useQuery({
    queryKey: [MATERIALS_KEY, filters, page, perPage],
    queryFn: () =>
      materialsApi.getAll({
        ...filters,
        page,
        per_page: perPage,
      }),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: [MATERIALS_KEY, id],
    queryFn: () => materialsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useMines(filters?: { country?: string; ira_eligible?: boolean }, page = 1, perPage = 50) {
  return useQuery({
    queryKey: [MINES_KEY, filters, page, perPage],
    queryFn: () =>
      materialsApi.getMines({
        ...filters,
        page,
        per_page: perPage,
      }),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useMine(id: string) {
  return useQuery({
    queryKey: [MINES_KEY, id],
    queryFn: () => materialsApi.getMineById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  });
}
