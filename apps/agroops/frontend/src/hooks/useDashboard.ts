import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/services/api'

export const useBuyerStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'buyer', 'stats'],
    queryFn: () => dashboardApi.getBuyerStats().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  })
}

export const useSupplierStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'supplier', 'stats'],
    queryFn: () => dashboardApi.getSupplierStats().then((res) => res.data),
    staleTime: 5 * 60 * 1000,
  })
}

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => dashboardApi.getRecentActivity().then((res) => res.data),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
  })
}

export const useSeasonalForecast = (params?: { crop_type?: string; region?: string }) => {
  return useQuery({
    queryKey: ['dashboard', 'seasonal-forecast', params],
    queryFn: () => dashboardApi.getSeasonalForecast(params).then((res) => res.data),
    staleTime: 24 * 60 * 60 * 1000,
  })
}
