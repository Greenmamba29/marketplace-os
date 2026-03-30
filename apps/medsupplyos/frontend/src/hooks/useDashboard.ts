import { useQuery } from '@tanstack/react-query'
import { dashboardApi, biomedicalApi, emergencyApi } from '../services/api'

// Dashboard Hooks
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: () => dashboardApi.getMetrics(),
  })
}

export const useSpendAnalysis = (period?: string) => {
  return useQuery({
    queryKey: ['dashboard', 'spend-analysis', period],
    queryFn: () => dashboardApi.getSpendAnalysis(period),
  })
}

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: () => dashboardApi.getRecentActivity(),
  })
}

export const useDashboardAlerts = () => {
  return useQuery({
    queryKey: ['dashboard', 'alerts'],
    queryFn: () => dashboardApi.getAlerts(),
  })
}

// Biomedical Hooks
export const useBiomedicalAssets = (params?: { facilityId?: string; departmentId?: string; status?: string }) => {
  return useQuery({
    queryKey: ['biomedical', 'assets', params],
    queryFn: () => biomedicalApi.getAssets(params),
  })
}

export const useBiomedicalAsset = (id: string) => {
  return useQuery({
    queryKey: ['biomedical', 'assets', id],
    queryFn: () => biomedicalApi.getAssetById(id),
    enabled: !!id,
  })
}

export const useMaintenanceSchedule = (facilityId: string) => {
  return useQuery({
    queryKey: ['biomedical', 'maintenance', facilityId],
    queryFn: () => biomedicalApi.getMaintenanceSchedule(facilityId),
    enabled: !!facilityId,
  })
}

export const useUpcomingCalibrations = (facilityId: string) => {
  return useQuery({
    queryKey: ['biomedical', 'calibrations', facilityId],
    queryFn: () => biomedicalApi.getUpcomingCalibrations(facilityId),
    enabled: !!facilityId,
  })
}

// Emergency Sourcing Hooks
export const useEmergencyRequest = (id: string) => {
  return useQuery({
    queryKey: ['emergency', 'request', id],
    queryFn: () => emergencyApi.getRequest(id),
    enabled: !!id,
  })
}
