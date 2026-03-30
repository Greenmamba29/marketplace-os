import { api } from './api';
import { 
  Project, 
  ProjectMaterial, 
  PaginatedResponse, 
  PaginationParams 
} from '@types/index';

export interface CreateProjectData {
  name: string;
  description?: string;
  project_number: string;
  owner_name: string;
  gc_name?: string;
  project_type: 'commercial' | 'residential' | 'industrial' | 'infrastructure' | 'mixed_use';
  construction_type: 'new' | 'renovation' | 'expansion';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  site_coordinates?: {
    lat: number;
    lng: number;
  };
  start_date?: string;
  completion_date?: string;
  contract_value?: number;
  leed_target?: 'certified' | 'silver' | 'gold' | 'platinum';
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: 'planning' | 'procurement' | 'construction' | 'completed' | 'on_hold';
}

export interface AddMaterialData {
  material_id: string;
  quantity_required: number;
  delivery_date_required: string;
  delivery_location?: string;
  notes?: string;
}

export const projectsService = {
  // Get all projects for current user
  getProjects: async (
    status?: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.page_size.toString());
    }
    const response = await api.get<PaginatedResponse<Project>>(`/projects?${params.toString()}`);
    return response.data!;
  },

  // Get single project
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data!;
  },

  // Create new project
  createProject: async (data: CreateProjectData): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data!;
  },

  // Update project
  updateProject: async (id: string, data: UpdateProjectData): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data!;
  },

  // Delete project
  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },

  // Add material to project
  addMaterial: async (projectId: string, data: AddMaterialData): Promise<ProjectMaterial> => {
    const response = await api.post<ProjectMaterial>(`/projects/${projectId}/materials`, data);
    return response.data!;
  },

  // Update project material
  updateMaterial: async (
    projectId: string,
    materialId: string,
    data: Partial<ProjectMaterial>
  ): Promise<ProjectMaterial> => {
    const response = await api.patch<ProjectMaterial>(
      `/projects/${projectId}/materials/${materialId}`,
      data
    );
    return response.data!;
  },

  // Remove material from project
  removeMaterial: async (projectId: string, materialId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/materials/${materialId}`);
  },

  // Get project materials
  getProjectMaterials: async (projectId: string): Promise<ProjectMaterial[]> => {
    const response = await api.get<ProjectMaterial[]>(`/projects/${projectId}/materials`);
    return response.data!;
  },

  // Get project stats
  getProjectStats: async (projectId: string): Promise<{
    total_materials: number;
    materials_sourced: number;
    total_budget: number;
    spent_to_date: number;
    leed_points_contribution: number;
    recycled_content_avg: number;
  }> => {
    const response = await api.get(`/projects/${projectId}/stats`);
    return response.data!;
  },

  // Duplicate project
  duplicateProject: async (projectId: string, newName: string): Promise<Project> => {
    const response = await api.post<Project>(`/projects/${projectId}/duplicate`, {
      new_name: newName,
    });
    return response.data!;
  },

  // Get project timeline
  getProjectTimeline: async (projectId: string): Promise<{
    deliveries: Array<{
      date: string;
      material_name: string;
      quantity: number;
      supplier_name: string;
      status: string;
    }>;
  }> => {
    const response = await api.get(`/projects/${projectId}/timeline`);
    return response.data!;
  },
};
