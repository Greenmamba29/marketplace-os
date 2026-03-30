import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gpoApi } from '../services/api'

// GPO Hooks
export const useGPOList = () => {
  return useQuery({
    queryKey: ['gpo', 'list'],
    queryFn: () => gpoApi.getAll(),
  })
}

export const useGPO = (id: string) => {
  return useQuery({
    queryKey: ['gpo', id],
    queryFn: () => gpoApi.getById(id),
    enabled: !!id,
  })
}

export const useGPOContracts = (gpoId: string) => {
  return useQuery({
    queryKey: ['gpo', gpoId, 'contracts'],
    queryFn: () => gpoApi.getContracts(gpoId),
    enabled: !!gpoId,
  })
}

export const usePriceBenchmark = (equipmentId: string) => {
  return useQuery({
    queryKey: ['gpo', 'benchmark', equipmentId],
    queryFn: () => gpoApi.getPriceBenchmark(equipmentId),
    enabled: !!equipmentId,
  })
}

export const usePriceComparison = () => {
  return useMutation({
    mutationFn: (equipmentIds: string[]) => gpoApi.comparePrices(equipmentIds),
  })
}

export const useGPOSavingsAnalysis = (organizationId: string, period?: string) => {
  return useQuery({
    queryKey: ['gpo', 'savings', organizationId, period],
    queryFn: () => gpoApi.getSavingsAnalysis(organizationId, period),
    enabled: !!organizationId,
  })
}
