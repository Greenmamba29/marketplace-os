import { useQuery } from '@tanstack/react-query'
import { dashboardApi, adminApi } from '../services/api'
import type { 
  BuyerDashboardStats, 
  SupplierDashboardStats, 
  AdminDashboardStats,
  Order,
  RFQSubmission,
  Quote,
  User
} from '../types'

// Buyer Dashboard Hooks
export const useBuyerStats = () => {
  return useQuery<BuyerDashboardStats>({
    queryKey: ['dashboard', 'buyer', 'stats'],
    queryFn: () => dashboardApi.getBuyerStats(),
  })
}

export const useBuyerOrders = () => {
  return useQuery<Order[]>({
    queryKey: ['dashboard', 'buyer', 'orders'],
    queryFn: () => dashboardApi.getBuyerOrders(),
  })
}

export const useBuyerRFQs = () => {
  return useQuery<RFQSubmission[]>({
    queryKey: ['dashboard', 'buyer', 'rfqs'],
    queryFn: () => dashboardApi.getBuyerRFQs(),
  })
}

// Supplier Dashboard Hooks
export const useSupplierStats = () => {
  return useQuery<SupplierDashboardStats>({
    queryKey: ['dashboard', 'supplier', 'stats'],
    queryFn: () => dashboardApi.getSupplierStats(),
  })
}

export const useSupplierQuotes = () => {
  return useQuery<Quote[]>({
    queryKey: ['dashboard', 'supplier', 'quotes'],
    queryFn: () => dashboardApi.getSupplierQuotes(),
  })
}

// Admin Dashboard Hooks
export const useAdminStats = () => {
  return useQuery<AdminDashboardStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminApi.getStats(),
  })
}

export const usePendingVerifications = () => {
  return useQuery<{
    ingredients: unknown[]
    suppliers: unknown[]
    certifications: unknown[]
  }>({
    queryKey: ['admin', 'verifications', 'pending'],
    queryFn: () => adminApi.getPendingVerifications(),
  })
}

export const useComplianceAlerts = () => {
  return useQuery<unknown[]>({
    queryKey: ['admin', 'compliance', 'alerts'],
    queryFn: () => adminApi.getComplianceAlerts(),
  })
}

export const useAdminUsers = (page = 1, perPage = 20) => {
  return useQuery<{
    users: User[]
    total: number
    page: number
    per_page: number
  }>({
    queryKey: ['admin', 'users', { page, per_page: perPage }],
    queryFn: () => adminApi.getUsers({ page, per_page: perPage }),
  })
}
