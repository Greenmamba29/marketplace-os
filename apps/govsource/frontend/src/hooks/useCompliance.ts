import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { FARCompliance, DFARSCompliance, ComplianceRecord, ApiResponse } from '@/types'
import { api } from '@/services/api'

const COMPLIANCE_KEY = 'compliance'

export function useFarCompliance(vendorId: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'far', vendorId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<FARCompliance[]>>(`/compliance/far?vendorId=${vendorId}`)
      return response.data.data || []
    },
    enabled: !!vendorId,
  })
}

export function useDfarsCompliance(vendorId: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'dfars', vendorId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<DFARSCompliance[]>>(`/compliance/dfars?vendorId=${vendorId}`)
      return response.data.data || []
    },
    enabled: !!vendorId,
  })
}

export function useComplianceRecords(vendorId: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'records', vendorId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<ComplianceRecord[]>>(`/compliance/records?vendorId=${vendorId}`)
      return response.data.data || []
    },
    enabled: !!vendorId,
  })
}

export function useUpdateFarCompliance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FARCompliance> }) => {
      const response = await api.patch<ApiResponse<FARCompliance>>(`/compliance/far/${id}`, data)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [COMPLIANCE_KEY, 'far'] })
    },
  })
}

export function useCertifyCompliance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ 
      vendorId, 
      type, 
      clauseNumber,
      documentUrl 
    }: { 
      vendorId: string
      type: 'FAR' | 'DFARS'
      clauseNumber: string
      documentUrl?: string 
    }) => {
      const response = await api.post<ApiResponse<void>>(`/compliance/certify`, {
        vendorId,
        type,
        clauseNumber,
        documentUrl,
      })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COMPLIANCE_KEY] })
    },
  })
}

export function useComplianceStats() {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{
        totalVendors: number
        compliantVendors: number
        nonCompliantVendors: number
        pendingReviews: number
        farClausesTracked: number
        dfarsClausesTracked: number
      }>>('/compliance/stats')
      return response.data.data
    },
  })
}

export function useDebarredCheck(duns?: string, cageCode?: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'debarred', duns, cageCode],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (duns) params.append('duns', duns)
      if (cageCode) params.append('cageCode', cageCode)
      const response = await api.get<ApiResponse<{
        isDebarred: boolean
        isSuspended: boolean
        matches: Array<{
          name: string
          type: string
          effectiveDate: string
          terminationDate?: string
        }>
      }>>(`/compliance/debarred-check?${params}`)
      return response.data.data
    },
    enabled: !!(duns || cageCode),
  })
}
