import { useQuery, useMutation } from '@tanstack/react-query'
import { agronomyApi } from '@/services/api'
import toast from 'react-hot-toast'

interface RecommendationParams {
  crop_id: string
  growth_stage?: string
  soil_type?: string
  planting_date?: string
  acres?: number
  state: string
}

export const useRecommendations = () => {
  return useMutation({
    mutationFn: (params: RecommendationParams) =>
      agronomyApi.getRecommendations(params).then((res) => res.data),
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to get recommendations')
    },
  })
}

export const useCrops = () => {
  return useQuery({
    queryKey: ['crops'],
    queryFn: () => agronomyApi.getCrops().then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - crops don't change often
  })
}

export const useCrop = (id: string) => {
  return useQuery({
    queryKey: ['crop', id],
    queryFn: () => agronomyApi.getCropById(id).then((res) => res.data),
    enabled: !!id,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export const useGrowthStages = (cropId: string) => {
  return useQuery({
    queryKey: ['crop', cropId, 'growth-stages'],
    queryFn: () => agronomyApi.getGrowthStages(cropId).then((res) => res.data),
    enabled: !!cropId,
    staleTime: 24 * 60 * 60 * 1000,
  })
}

export const useWeatherForecast = (lat: number, lon: number, days = 7) => {
  return useQuery({
    queryKey: ['weather', lat, lon, days],
    queryFn: () =>
      agronomyApi.getWeatherForecast({ lat, lon, days }).then((res) => res.data),
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 minutes - weather updates frequently
    refetchInterval: 30 * 60 * 1000,
  })
}

export const useGDD = (params: {
  crop_id: string
  planting_date: string
  location: string
}) => {
  return useQuery({
    queryKey: ['gdd', params],
    queryFn: () => agronomyApi.getGDD(params).then((res) => res.data),
    enabled: !!params.crop_id && !!params.planting_date && !!params.location,
    staleTime: 60 * 60 * 1000,
  })
}
