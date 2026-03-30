import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { RFP, RFPFilter, ApiResponse } from '@/types'
import { api } from '@/services/api'

const RFPS_KEY = 'rfps'

export function useRFPs(filter?: RFPFilter) {
  return useQuery({
    queryKey: [RFPS_KEY, filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter?.search) params.append('search', filter.search)
      if (filter?.agency) params.append('agency', filter.agency)
      if (filter?.naicsCodes?.length) params.append('naicsCodes', filter.naicsCodes.join(','))
      if (filter?.setAside) params.append('setAside', filter.setAside)
      if (filter?.status) params.append('status', filter.status)
      if (filter?.minValue) params.append('minValue', String(filter.minValue))
      if (filter?.maxValue) params.append('maxValue', String(filter.maxValue))
      if (filter?.securityClearance) params.append('securityClearance', filter.securityClearance)

      const response = await api.get<ApiResponse<RFP[]>>(`/rfps?${params}`)
      return response.data.data || []
    },
  })
}

export function useRFP(id: string) {
  return useQuery({
    queryKey: [RFPS_KEY, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<RFP>>(`/rfps/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateRFP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<RFP>) => {
      const response = await api.post<ApiResponse<RFP>>('/rfps', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFPS_KEY] })
    },
  })
}

export function useUpdateRFP() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<RFP> }) => {
      const response = await api.patch<ApiResponse<RFP>>(`/rfps/${id}`, data)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [RFPS_KEY, variables.id] })
      queryClient.invalidateQueries({ queryKey: [RFPS_KEY] })
    },
  })
}

export function useMatchRFPToVendors(rfpId: string) {
  return useQuery({
    queryKey: [RFPS_KEY, rfpId, 'matches'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Array<{ vendorId: string; score: number; reasons: string[] }>>>(`/rfps/${rfpId}/matches`)
      return response.data.data || []
    },
    enabled: !!rfpId,
  })
}

export function useImportFromSamGov() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: { noticeId: string }) => {
      const response = await api.post<ApiResponse<RFP>>('/rfps/import-samgov', params)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RFPS_KEY] })
    },
  })
}

export function useRFPStats() {
  return useQuery({
    queryKey: [RFPS_KEY, 'stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{
        total: number
        open: number
        closed: number
        awarded: number
        byAgency: Record<string, number>
        bySetAside: Record<string, number>
      }>>('/rfps/stats')
      return response.data.data
    },
  })
}
