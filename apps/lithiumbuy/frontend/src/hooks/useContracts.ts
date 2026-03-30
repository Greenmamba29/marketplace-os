import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsApi } from '@/services/api';
import type { Contract, ContractType } from '@/types';

const CONTRACTS_KEY = 'contracts';

export function useContracts(
  filters?: { status?: string; contract_type?: ContractType },
  page = 1,
  perPage = 20
) {
  return useQuery({
    queryKey: [CONTRACTS_KEY, filters, page, perPage],
    queryFn: () =>
      contractsApi.getAll({
        ...filters,
        page,
        per_page: perPage,
      }),
    staleTime: 2 * 60 * 1000,
  });
}

export function useContract(id: string) {
  return useQuery({
    queryKey: [CONTRACTS_KEY, id],
    queryFn: () => contractsApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Contract>) => contractsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
    },
  });
}

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) =>
      contractsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
    },
  });
}

export function useTerminateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contractsApi.terminate(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CONTRACTS_KEY] });
    },
  });
}
