import { useQuery } from 'react-query'
import { ordersApi, adminApi } from '../services/api'
import { DashboardStats, ColdChainAlert, LotExpiryAlert } from '../types'

const DASHBOARD_QUERY_KEY = 'dashboard'

export function useDashboardStats() {
  return useQuery(
    [DASHBOARD_QUERY_KEY, 'stats'],
    () => ordersApi.list().then(res => {
      // Transform order data into dashboard stats
      const orders = res.data || []
      return {
        totalOrders: orders.length,
        pendingRFQs: 0,
        activeLots: 0,
        coldChainAlerts: 0,
        expiringLots: 0,
        monthlySpend: orders.reduce((sum: number, o: any) => sum + (o.payment?.amount || 0), 0),
      } as DashboardStats
    }),
    {
      staleTime: 5 * 60 * 1000,
    }
  )
}

export function useRecentOrders(limit: number = 5) {
  return useQuery(
    [DASHBOARD_QUERY_KEY, 'orders', 'recent', limit],
    () => ordersApi.list().then(res => {
      const orders = res.data || []
      return orders.slice(0, limit)
    }),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}

export function useOrdersByStatus(status: string) {
  return useQuery(
    [DASHBOARD_QUERY_KEY, 'orders', 'status', status],
    () => ordersApi.getByStatus(status).then(res => res.data),
    {
      enabled: !!status,
      staleTime: 2 * 60 * 1000,
    }
  )
}

// Admin hooks
export function useAdminStats() {
  return useQuery(
    [DASHBOARD_QUERY_KEY, 'admin', 'stats'],
    () => adminApi.getStats().then(res => res.data),
    {
      staleTime: 5 * 60 * 1000,
    }
  )
}

export function useSystemHealth() {
  return useQuery(
    [DASHBOARD_QUERY_KEY, 'admin', 'health'],
    () => adminApi.getSystemHealth().then(res => res.data),
    {
      refetchInterval: 30000,
    }
  )
}

export function useAuditLog(params?: Record<string, unknown>) {
  return useQuery(
    [DASHBOARD_QUERY_KEY, 'admin', 'audit', params],
    () => adminApi.getAuditLog(params).then(res => res.data),
    {
      staleTime: 2 * 60 * 1000,
    }
  )
}
