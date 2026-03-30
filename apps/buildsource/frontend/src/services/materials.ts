import { api } from './api';
import { 
  Material, 
  MaterialFilters, 
  PaginatedResponse, 
  PaginationParams,
  RegionalAvailability,
  SpecSheet 
} from '@types/index';

export const materialsService = {
  // Get all materials with filters
  getMaterials: async (
    filters?: MaterialFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Material>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.material_type) params.append('material_type', filters.material_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.zip_code) params.append('zip_code', filters.zip_code);
      if (filters.radius_miles) params.append('radius_miles', filters.radius_miles.toString());
      if (filters.min_recycled_content) params.append('min_recycled_content', filters.min_recycled_content.toString());
      if (filters.leed_eligible) params.append('leed_eligible', 'true');
      if (filters.in_stock) params.append('in_stock', 'true');
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      if (filters.supplier_id) params.append('supplier_id', filters.supplier_id);
      if (filters.astm_standard) params.append('astm_standard', filters.astm_standard);
    }
    
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.page_size.toString());
    }
    
    const response = await api.get<PaginatedResponse<Material>>(`/materials?${params.toString()}`);
    return response.data!;
  },

  // Get single material
  getMaterial: async (id: string): Promise<Material> => {
    const response = await api.get<Material>(`/materials/${id}`);
    return response.data!;
  },

  // Get material types
  getMaterialTypes: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/materials/types');
    return response.data!;
  },

  // Get ASTM standards
  getASTMStandards: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/materials/astm-standards');
    return response.data!;
  },

  // Get regional availability for a material
  getRegionalAvailability: async (
    materialId: string,
    zipCode: string,
    radiusMiles: number = 50
  ): Promise<RegionalAvailability[]> => {
    const response = await api.get<RegionalAvailability[]>(
      `/materials/${materialId}/availability?zip_code=${zipCode}&radius=${radiusMiles}`
    );
    return response.data!;
  },

  // Get spec sheets for a material
  getSpecSheets: async (materialId: string): Promise<SpecSheet[]> => {
    const response = await api.get<SpecSheet[]>(`/materials/${materialId}/spec-sheets`);
    return response.data!;
  },

  // Compare materials
  compareMaterials: async (materialIds: string[]): Promise<Material[]> => {
    const response = await api.post<Material[]>('/materials/compare', { material_ids: materialIds });
    return response.data!;
  },

  // Get related materials
  getRelatedMaterials: async (materialId: string, limit: number = 5): Promise<Material[]> => {
    const response = await api.get<Material[]>(`/materials/${materialId}/related?limit=${limit}`);
    return response.data!;
  },

  // Get LEED-eligible materials
  getLEEDMaterials: async (
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Material>> => {
    const params = new URLSearchParams();
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('page_size', pagination.page_size.toString());
    }
    const response = await api.get<PaginatedResponse<Material>>(`/materials/leed?${params.toString()}`);
    return response.data!;
  },

  // Search materials by specification
  searchBySpec: async (
    astmStandard: string,
    grade?: string
  ): Promise<Material[]> => {
    const params = new URLSearchParams();
    params.append('astm', astmStandard);
    if (grade) params.append('grade', grade);
    const response = await api.get<Material[]>(`/materials/search-by-spec?${params.toString()}`);
    return response.data!;
  },
};
