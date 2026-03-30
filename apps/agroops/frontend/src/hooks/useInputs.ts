import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { inputsApi } from '@/services/api'
import type { InputFilters } from '@/types'

export const useInputs = (filters?: InputFilters, page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['inputs', filters, page, perPage],
    queryFn: () =>
      inputsApi
        .getAll({
          page,
          per_page: perPage,
          category: filters?.category?.join(','),
          search: filters?.search,
          state: filters?.state,
          crop: filters?.crop_compatibility?.join(','),
          formulation: filters?.formulation_type?.join(','),
          min_price: filters?.price_min,
          max_price: filters?.price_max,
          in_stock: filters?.in_stock_only,
        })
        .then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  })
}

export const useInput = (id: string) => {
  return useQuery({
    queryKey: ['input', id],
    queryFn: () => inputsApi.getById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useFeaturedInputs = () => {
  return useQuery({
    queryKey: ['inputs', 'featured'],
    queryFn: () => inputsApi.getFeatured().then((res) => res.data),
    staleTime: 30 * 60 * 1000,
  })
}

export const useInputsByCategory = (category: string, page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['inputs', 'category', category, page, perPage],
    queryFn: () =>
      inputsApi.getByCategory(category, { page, per_page: perPage }).then((res) => res.data),
    enabled: !!category,
    staleTime: 10 * 60 * 1000,
  })
}

export const useRelatedInputs = (id: string, cropType?: string) => {
  return useQuery({
    queryKey: ['inputs', 'related', id, cropType],
    queryFn: () => inputsApi.getRelated(id, cropType).then((res) => res.data),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
  })
}

export const useStateRegistrationCheck = (id: string, state: string) => {
  return useQuery({
    queryKey: ['input', id, 'registration', state],
    queryFn: () => inputsApi.checkStateRegistration(id, state).then((res) => res.data),
    enabled: !!id && !!state,
    staleTime: 60 * 60 * 1000, // 1 hour - registration data doesn't change often
  })
}
