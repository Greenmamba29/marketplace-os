import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leedService } from '@services/leed';

const LEED_QUERY_KEY = 'leed';

export const useLEEDTracking = (projectId: string) => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'tracking', projectId],
    queryFn: () => leedService.getLEEDTracking(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProjectLEEDMaterials = (projectId: string) => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'materials', projectId],
    queryFn: () => leedService.getProjectLEEDMaterials(projectId),
    enabled: !!projectId,
  });
};

export const useLEEDCredits = () => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'credits'],
    queryFn: leedService.getAllCredits,
    staleTime: 30 * 60 * 1000,
  });
};

export const useLEEDCreditDetails = (creditId: string) => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'credit', creditId],
    queryFn: () => leedService.getCreditDetails(creditId),
    enabled: !!creditId,
    staleTime: 30 * 60 * 1000,
  });
};

export const useMRCalculation = (projectId: string) => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'mr-calculation', projectId],
    queryFn: () => leedService.calculateMRContributions(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecycledContentSummary = (projectId: string) => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'recycled-content', projectId],
    queryFn: () => leedService.getRecycledContentSummary(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRegionalMaterialsSummary = (projectId: string) => {
  return useQuery({
    queryKey: [LEED_QUERY_KEY, 'regional-materials', projectId],
    queryFn: () => leedService.getRegionalMaterialsSummary(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGenerateLEEDDocumentation = () => {
  return useMutation({
    mutationFn: ({ projectId, creditIds }: { projectId: string; creditIds?: string[] }) =>
      leedService.generateDocumentation(projectId, creditIds),
  });
};

export const useUpdateLEEDTarget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, target }: { projectId: string; target: 'certified' | 'silver' | 'gold' | 'platinum' }) =>
      leedService.updateLEEDTarget(projectId, target),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [LEED_QUERY_KEY, 'tracking', variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });
};
