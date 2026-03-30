import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsService, CreateProjectData, UpdateProjectData, AddMaterialData } from '@services/projects';
import { PaginationParams } from '@types/index';

const PROJECTS_QUERY_KEY = 'projects';

export const useProjects = (status?: string, pagination?: PaginationParams) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, status, pagination],
    queryFn: () => projectsService.getProjects(status, pagination),
    staleTime: 2 * 60 * 1000,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, id],
    queryFn: () => projectsService.getProject(id),
    enabled: !!id,
  });
};

export const useProjectMaterials = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, projectId, 'materials'],
    queryFn: () => projectsService.getProjectMaterials(projectId),
    enabled: !!projectId,
  });
};

export const useProjectStats = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, projectId, 'stats'],
    queryFn: () => projectsService.getProjectStats(projectId),
    enabled: !!projectId,
  });
};

export const useProjectTimeline = (projectId: string) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, projectId, 'timeline'],
    queryFn: () => projectsService.getProjectTimeline(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectData }) =>
      projectsService.updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: projectsService.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
};

export const useAddProjectMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: AddMaterialData }) =>
      projectsService.addMaterial(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, variables.projectId, 'materials'] });
    },
  });
};

export const useUpdateProjectMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      projectId,
      materialId,
      data,
    }: {
      projectId: string;
      materialId: string;
      data: Parameters<typeof projectsService.updateMaterial>[2];
    }) => projectsService.updateMaterial(projectId, materialId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, variables.projectId, 'materials'] });
    },
  });
};

export const useRemoveProjectMaterial = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, materialId }: { projectId: string; materialId: string }) =>
      projectsService.removeMaterial(projectId, materialId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, variables.projectId, 'materials'] });
    },
  });
};

export const useDuplicateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, newName }: { projectId: string; newName: string }) =>
      projectsService.duplicateProject(projectId, newName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
  });
};
