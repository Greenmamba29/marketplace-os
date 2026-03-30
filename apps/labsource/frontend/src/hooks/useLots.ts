import { useQuery, useMutation, useQueryClient } from 'react-query'
import { lotsApi } from '../services/api'
import { LotFilters } from '../types'
import toast from 'react-hot-toast'

const LOTS_QUERY_KEY = 'lots'

export function useLots(filters?: LotFilters) {
  return useQuery(
    [LOTS_QUERY_KEY, filters],
    () => lotsApi.list(filters).then(res => res.data),
    {
      staleTime: 2 * 60 * 1000,
      keepPreviousData: true,
    }
  )
}

export function useLot(id: string) {
  return useQuery(
    [LOTS_QUERY_KEY, id],
    () => lotsApi.get(id).then(res => res.data),
    {
      enabled: !!id,
    }
  )
}

export function useLotCoA(lotId: string) {
  return useQuery(
    [LOTS_QUERY_KEY, lotId, 'coa'],
    () => lotsApi.getCoA(lotId).then(res => res.data),
    {
      enabled: !!lotId,
    }
  )
}

export function useLotsByReagent(reagentId: string) {
  return useQuery(
    [LOTS_QUERY_KEY, 'reagent', reagentId],
    () => lotsApi.getByReagent(reagentId).then(res => res.data),
    {
      enabled: !!reagentId,
    }
  )
}

export function useExpiringLots(days: number = 30) {
  return useQuery(
    [LOTS_QUERY_KEY, 'expiring', days],
    () => lotsApi.getExpiring(days).then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
    }
  )
}

export function useDownloadCoA() {
  return useMutation(
    async (lotId: string) => {
      const response = await lotsApi.downloadCoA(lotId)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `CoA_${lotId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
    {
      onSuccess: () => {
        toast.success('CoA downloaded successfully')
      },
      onError: () => {
        toast.error('Failed to download CoA')
      },
    }
  )
}

export function useQuarantineLot() {
  const queryClient = useQueryClient()
  
  return useMutation(
    ({ lotId, reason }: { lotId: string; reason: string }) =>
      lotsApi.quarantine(lotId, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LOTS_QUERY_KEY])
        toast.success('Lot quarantined successfully')
      },
      onError: () => {
        toast.error('Failed to quarantine lot')
      },
    }
  )
}
