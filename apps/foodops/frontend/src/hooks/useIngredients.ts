import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ingredientsApi } from '../services/api'
import type { Ingredient, FilterParams, PaginationParams } from '../types'

export const useIngredients = (filters?: FilterParams & PaginationParams) => {
  return useQuery({
    queryKey: ['ingredients', filters],
    queryFn: () => ingredientsApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useIngredient = (id: string) => {
  return useQuery({
    queryKey: ['ingredient', id],
    queryFn: () => ingredientsApi.get(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Ingredient>) => ingredientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Ingredient created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create ingredient')
    },
  })
}

export const useUpdateIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ingredient> }) =>
      ingredientsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      queryClient.invalidateQueries({ queryKey: ['ingredient', variables.id] })
      toast.success('Ingredient updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update ingredient')
    },
  })
}

export const useDeleteIngredient = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ingredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
      toast.success('Ingredient deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete ingredient')
    },
  })
}

export const useIngredientCategories = () => {
  return useQuery({
    queryKey: ['ingredient-categories'],
    queryFn: () => ingredientsApi.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
