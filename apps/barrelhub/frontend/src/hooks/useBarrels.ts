import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { barrelsApi, registryApi, sensoryApi, marketCompsApi, rfqApi, ttbApi } from '../services/api'
import type { Barrel, BarrelRegistry, SensoryProfile, MarketComp, RFQ, FilterState } from '../types'

// Barrels Hooks
export const useBarrels = (filters?: FilterState, page = 1, perPage = 20) => {
  return useQuery({
    queryKey: ['barrels', filters, page, perPage],
    queryFn: async () => {
      const response = await barrelsApi.getAll({ 
        ...filters, 
        page, 
        per_page: perPage 
      })
      return response.data as { items: Barrel[]; total: number; total_pages: number }
    },
  })
}

export const useBarrel = (id: string) => {
  return useQuery({
    queryKey: ['barrel', id],
    queryFn: async () => {
      const response = await barrelsApi.getById(id)
      return response.data as Barrel
    },
    enabled: !!id,
  })
}

export const useBarrelSearch = (query: string, filters?: FilterState) => {
  return useQuery({
    queryKey: ['barrelSearch', query, filters],
    queryFn: async () => {
      const response = await barrelsApi.search(query, filters)
      return response.data as Barrel[]
    },
    enabled: query.length >= 2,
  })
}

export const useBarrelFilters = () => {
  return useQuery({
    queryKey: ['barrelFilters'],
    queryFn: async () => {
      const response = await barrelsApi.getFilters()
      return response.data as {
        spirit_types: string[]
        distilleries: string[]
        storage_types: string[]
        locations: string[]
        age_range: { min: number; max: number }
        proof_range: { min: number; max: number }
        price_range: { min: number; max: number }
      }
    },
  })
}

// Registry Hooks
export const useRegistry = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['registry', params],
    queryFn: async () => {
      const response = await registryApi.getAll(params)
      return response.data as { items: BarrelRegistry[]; total: number }
    },
  })
}

export const useBarrelHistory = (barrelId: string) => {
  return useQuery({
    queryKey: ['barrelHistory', barrelId],
    queryFn: async () => {
      const response = await registryApi.getHistory(barrelId)
      return response.data as {
        samples: Array<{
          date: string
          proof: number
          volume: number
          sample_type: string
          notes?: string
        }>
        movements: Array<{
          date: string
          from_location: string
          to_location: string
          reason: string
          authorized_by: string
        }>
      }
    },
    enabled: !!barrelId,
  })
}

export const useAddSample = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ barrelId, data }: { barrelId: string; data: Record<string, unknown> }) => {
      const response = await registryApi.addSample(barrelId, data)
      return response.data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['barrelHistory', variables.barrelId] })
      queryClient.invalidateQueries({ queryKey: ['registry'] })
    },
  })
}

// Sensory Hooks
export const useSensoryProfiles = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['sensoryProfiles', params],
    queryFn: async () => {
      const response = await sensoryApi.getAll(params)
      return response.data as { items: SensoryProfile[]; total: number }
    },
  })
}

export const useBarrelSensory = (barrelId: string) => {
  return useQuery({
    queryKey: ['barrelSensory', barrelId],
    queryFn: async () => {
      const response = await sensoryApi.getByBarrelId(barrelId)
      return response.data as SensoryProfile[]
    },
    enabled: !!barrelId,
  })
}

export const useSensoryDistribution = (spiritType?: string) => {
  return useQuery({
    queryKey: ['sensoryDistribution', spiritType],
    queryFn: async () => {
      const response = await sensoryApi.getScoreDistribution(spiritType)
      return response.data as {
        overall: { ranges: Array<{ min: number; max: number; count: number }>; average: number }
        by_category: Record<string, { average: number; distribution: number[] }>
      }
    },
  })
}

// Market Comps Hooks
export const useMarketComps = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['marketComps', params],
    queryFn: async () => {
      const response = await marketCompsApi.getAll(params)
      return response.data as { items: MarketComp[]; total: number }
    },
  })
}

export const usePriceTrends = (spiritType: string, months = 12) => {
  return useQuery({
    queryKey: ['priceTrends', spiritType, months],
    queryFn: async () => {
      const response = await marketCompsApi.getPriceTrends(spiritType, months)
      return response.data as Array<{
        month: string
        avg_price: number
        volume: number
        transaction_count: number
      }>
    },
    enabled: !!spiritType,
  })
}

export const usePriceStats = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['priceStats', params],
    queryFn: async () => {
      const response = await marketCompsApi.getPriceStats(params)
      return response.data as {
        overall: {
          avg_price: number
          median_price: number
          min_price: number
          max_price: number
          transaction_count: number
          total_volume: number
        }
        by_age: Array<{ age: number; avg_price: number; count: number }>
        by_proof: Array<{ proof_range: string; avg_price: number; count: number }>
      }
    },
  })
}

export const useComparables = (barrelId: string) => {
  return useQuery({
    queryKey: ['comparables', barrelId],
    queryFn: async () => {
      const response = await marketCompsApi.getComparables(barrelId)
      return response.data as MarketComp[]
    },
    enabled: !!barrelId,
  })
}

// RFQ Hooks
export const useRFQs = (params?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ['rfqs', params],
    queryFn: async () => {
      const response = await rfqApi.getAll(params)
      return response.data as { items: RFQ[]; total: number }
    },
  })
}

export const useRFQ = (id: string) => {
  return useQuery({
    queryKey: ['rfq', id],
    queryFn: async () => {
      const response = await rfqApi.getById(id)
      return response.data as RFQ
    },
    enabled: !!id,
  })
}

export const useCreateRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await rfqApi.create(data)
      return response.data as RFQ
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
    },
  })
}

export const useSubmitRFQ = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await rfqApi.submit(id)
      return response.data
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['rfq', id] })
      queryClient.invalidateQueries({ queryKey: ['rfqs'] })
    },
  })
}

// TTB Hooks
export const useTTBVerification = (permitNumber: string) => {
  return useQuery({
    queryKey: ['ttbVerification', permitNumber],
    queryFn: async () => {
      const response = await ttbApi.verifyPermit(permitNumber)
      return response.data as {
        valid: boolean
        permit_number: string
        company_name: string
        status: string
        expiration_date?: string
      }
    },
    enabled: permitNumber.length >= 5,
  })
}
