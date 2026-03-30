import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ingredientApi, regulatoryApi } from '../services/api'
import type { Ingredient, IngredientFilters, PaginatedResponse } from '../types'

// Query Keys
export const ingredientKeys = {
  all: ['ingredients'] as const,
  lists: () => [...ingredientKeys.all, 'list'] as const,
  list: (filters: IngredientFilters) => [...ingredientKeys.lists(), filters] as const,
  details: () => [...ingredientKeys.all, 'detail'] as const,
  detail: (id: string) => [...ingredientKeys.details(), id] as const,
  regulatory: (id: string) => [...ingredientKeys.detail(id), 'regulatory'] as const,
  certifications: (id: string) => [...ingredientKeys.detail(id), 'certifications'] as const,
  allergens: (id: string) => [...ingredientKeys.detail(id), 'allergens'] as const,
}

// Hooks
export const useIngredients = (filters?: IngredientFilters, page = 1, perPage = 20) => {
  return useQuery<PaginatedResponse<Ingredient>>({
    queryKey: ingredientKeys.list(filters || {}),
    queryFn: () => ingredientApi.getAll({ page, per_page: perPage, filters }),
  })
}

export const useIngredient = (id: string) => {
  return useQuery<Ingredient>({
    queryKey: ingredientKeys.detail(id),
    queryFn: () => ingredientApi.getById(id),
    enabled: !!id,
  })
}

export const useIngredientCategories = () => {
  return useQuery<string[]>({
    queryKey: [...ingredientKeys.all, 'categories'],
    queryFn: () => ingredientApi.getCategories(),
  })
}

export const useSearchIngredients = (query: string, filters?: IngredientFilters) => {
  return useQuery<PaginatedResponse<Ingredient>>({
    queryKey: [...ingredientKeys.all, 'search', query, filters],
    queryFn: () => ingredientApi.search(query, filters),
    enabled: query.length > 2,
  })
}

export const useRegulatoryStatus = (ingredientId: string) => {
  return useQuery({
    queryKey: ingredientKeys.regulatory(ingredientId),
    queryFn: () => regulatoryApi.getGRASStatus(ingredientId),
    enabled: !!ingredientId,
  })
}

export const useCertifications = (ingredientId: string) => {
  return useQuery({
    queryKey: ingredientKeys.certifications(ingredientId),
    queryFn: () => regulatoryApi.getCertifications(ingredientId),
    enabled: !!ingredientId,
  })
}

export const useAllergenProfile = (ingredientId: string) => {
  return useQuery({
    queryKey: ingredientKeys.allergens(ingredientId),
    queryFn: () => regulatoryApi.getAllergenProfile(ingredientId),
    enabled: !!ingredientId,
  })
}

export const useComplianceDocuments = (ingredientId: string) => {
  return useQuery({
    queryKey: [...ingredientKeys.detail(ingredientId), 'documents'],
    queryFn: () => regulatoryApi.getComplianceDocuments(ingredientId),
    enabled: !!ingredientId,
  })
}

export const useVerifyGRAS = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (ingredientId: string) => regulatoryApi.verifyGRAS(ingredientId),
    onSuccess: (_, ingredientId) => {
      queryClient.invalidateQueries({ queryKey: ingredientKeys.regulatory(ingredientId) })
    },
  })
}
