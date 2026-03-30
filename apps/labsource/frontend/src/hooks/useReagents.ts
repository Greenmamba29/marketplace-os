import { useQuery, useMutation, useQueryClient } from 'react-query'
import { reagentsApi } from '../services/api'
import { Reagent, ReagentFilters } from '../types'
import toast from 'react-hot-toast'

const REAGENTS_QUERY_KEY = 'reagents'

export function useReagents(filters?: ReagentFilters) {
  return useQuery(
    [REAGENTS_QUERY_KEY, filters],
    () => reagentsApi.list(filters).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
      keepPreviousData: true,
    }
  )
}

export function useReagent(id: string) {
  return useQuery(
    [REAGENTS_QUERY_KEY, id],
    () => reagentsApi.get(id).then(res => res.data),
    {
      enabled: !!id,
      staleTime: 10 * 60 * 1000,
    }
  )
}

export function useSearchReagents(query: string, filters?: ReagentFilters) {
  return useQuery(
    [REAGENTS_QUERY_KEY, 'search', query, filters],
    () => reagentsApi.search(query, filters).then(res => res.data),
    {
      enabled: query.length >= 2,
      staleTime: 2 * 60 * 1000,
    }
  )
}

export function useReagentSubstitutes(id: string) {
  return useQuery(
    [REAGENTS_QUERY_KEY, id, 'substitutes'],
    () => reagentsApi.getSubstitutes(id).then(res => res.data),
    {
      enabled: !!id,
    }
  )
}

export function useReagentsByCategory(category: string) {
  return useQuery(
    [REAGENTS_QUERY_KEY, 'category', category],
    () => reagentsApi.getByCategory(category).then(res => res.data),
    {
      enabled: !!category,
      staleTime: 10 * 60 * 1000,
    }
  )
}
