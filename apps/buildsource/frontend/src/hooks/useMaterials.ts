import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materialsService } from '@services/materials';
import { MaterialFilters, PaginationParams } from '@types/index';

const MATERIALS_QUERY_KEY = 'materials';

export const useMaterials = (filters?: MaterialFilters, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, filters, pagination],
    queryFn: () => materialsService.getMaterials(filters, pagination),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, id],
    queryFn: () => materialsService.getMaterial(id),
    enabled: !!id,
  });
};

export const useMaterialTypes = () => {
  return useQuery({
    queryKey: ['material-types'],
    queryFn: materialsService.getMaterialTypes,
    staleTime: 30 * 60 * 1000,
  });
};

export const useASTMStandards = () => {
  return useQuery({
    queryKey: ['astm-standards'],
    queryFn: materialsService.getASTMStandards,
    staleTime: 30 * 60 * 1000,
  });
};

export const useRegionalAvailability = (materialId: string, zipCode: string, radiusMiles?: number) => {
  return useQuery({
    queryKey: ['regional-availability', materialId, zipCode, radiusMiles],
    queryFn: () => materialsService.getRegionalAvailability(materialId, zipCode, radiusMiles),
    enabled: !!materialId && !!zipCode,
  });
};

export const useSpecSheets = (materialId: string) => {
  return useQuery({
    queryKey: ['spec-sheets', materialId],
    queryFn: () => materialsService.getSpecSheets(materialId),
    enabled: !!materialId,
  });
};

export const useLEEDMaterials = (pagination?: PaginationParams) => {
  return useQuery({
    queryKey: ['leed-materials', pagination],
    queryFn: () => materialsService.getLEEDMaterials(pagination),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCompareMaterials = () => {
  return useMutation({
    mutationFn: materialsService.compareMaterials,
  });
};

export const useRelatedMaterials = (materialId: string, limit?: number) => {
  return useQuery({
    queryKey: ['related-materials', materialId, limit],
    queryFn: () => materialsService.getRelatedMaterials(materialId, limit),
    enabled: !!materialId,
  });
};
