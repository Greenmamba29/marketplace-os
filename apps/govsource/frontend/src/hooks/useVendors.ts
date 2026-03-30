import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Vendor, VendorFilter, ApiResponse } from '@/types'
import { api } from '@/services/api'

const VENDORS_KEY = 'vendors'

export function useVendors(filter?: VendorFilter) {
  return useQuery({
    queryKey: [VENDORS_KEY, filter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filter?.search) params.append('search', filter.search)
      if (filter?.naicsCodes?.length) params.append('naicsCodes', filter.naicsCodes.join(','))
      if (filter?.pscCodes?.length) params.append('pscCodes', filter.pscCodes.join(','))
      if (filter?.setAsides?.length) params.append('setAsides', filter.setAsides.join(','))
      if (filter?.securityClearance) params.append('securityClearance', filter.securityClearance)
      if (filter?.samStatus) params.append('samStatus', filter.samStatus)
      if (filter?.state) params.append('state', filter.state)
      if (filter?.smallBusiness !== undefined) params.append('smallBusiness', String(filter.smallBusiness))
      if (filter?.qualifiedOnly) params.append('qualifiedOnly', String(filter.qualifiedOnly))

      const response = await api.get<ApiResponse<Vendor[]>>(`/vendors?${params}`)
      return response.data.data || []
    },
  })
}

export function useVendor(id: string) {
  return useQuery({
    queryKey: [VENDORS_KEY, id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Vendor>>(`/vendors/${id}`)
      return response.data.data
    },
    enabled: !!id,
  })
}

export function useCreateVendor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: Partial<Vendor>) => {
      const response = await api.post<ApiResponse<Vendor>>('/vendors', data)
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDORS_KEY] })
    },
  })
}

export function useUpdateVendor() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Vendor> }) => {
      const response = await api.patch<ApiResponse<Vendor>>(`/vendors/${id}`, data)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [VENDORS_KEY, variables.id] })
      queryClient.invalidateQueries({ queryKey: [VENDORS_KEY] })
    },
  })
}

export function useVerifySamRegistration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cageCode: string) => {
      const response = await api.post<ApiResponse<Vendor>>('/vendors/verify-sam', { cageCode })
      return response.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENDORS_KEY] })
    },
  })
}

export function useVendorQualifications(vendorId: string) {
  return useQuery({
    queryKey: [VENDORS_KEY, vendorId, 'qualifications'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Vendor['qualifications']>>(`/vendors/${vendorId}/qualifications`)
      return response.data.data || []
    },
    enabled: !!vendorId,
  })
}

export function useVendorCompliance(vendorId: string) {
  return useQuery({
    queryKey: [VENDORS_KEY, vendorId, 'compliance'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Vendor['complianceStatus']>>(`/vendors/${vendorId}/compliance`)
      return response.data.data
    },
    enabled: !!vendorId,
  })
}
