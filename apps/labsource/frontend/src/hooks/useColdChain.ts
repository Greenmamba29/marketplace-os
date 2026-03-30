import { useQuery, useMutation, useQueryClient } from 'react-query'
import { coldChainApi } from '../services/api'
import toast from 'react-hot-toast'

const COLDCHAIN_QUERY_KEY = 'coldchain'

export function useActiveShipments() {
  return useQuery(
    [COLDCHAIN_QUERY_KEY, 'active'],
    () => coldChainApi.getActiveShipments().then(res => res.data),
    {
      refetchInterval: 60000, // Refetch every minute
      staleTime: 30000,
    }
  )
}

export function useShipment(shipmentId: string) {
  return useQuery(
    [COLDCHAIN_QUERY_KEY, 'shipment', shipmentId],
    () => coldChainApi.getShipment(shipmentId).then(res => res.data),
    {
      enabled: !!shipmentId,
      refetchInterval: 30000,
    }
  )
}

export function useTemperatureLog(shipmentId: string) {
  return useQuery(
    [COLDCHAIN_QUERY_KEY, 'temperature', shipmentId],
    () => coldChainApi.getTemperatureLog(shipmentId).then(res => res.data),
    {
      enabled: !!shipmentId,
      refetchInterval: 30000,
    }
  )
}

export function useColdChainAlerts() {
  return useQuery(
    [COLDCHAIN_QUERY_KEY, 'alerts'],
    () => coldChainApi.getAlerts().then(res => res.data),
    {
      refetchInterval: 30000,
    }
  )
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient()
  
  return useMutation(
    (alertId: string) => coldChainApi.acknowledgeAlert(alertId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([COLDCHAIN_QUERY_KEY, 'alerts'])
        toast.success('Alert acknowledged')
      },
      onError: () => {
        toast.error('Failed to acknowledge alert')
      },
    }
  )
}

export function useExcursionReport(shipmentId: string) {
  return useQuery(
    [COLDCHAIN_QUERY_KEY, 'excursion', shipmentId],
    () => coldChainApi.getExcursionReport(shipmentId).then(res => res.data),
    {
      enabled: !!shipmentId,
    }
  )
}
