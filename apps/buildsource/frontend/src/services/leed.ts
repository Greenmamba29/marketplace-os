import { api } from './api';
import { LEEDTracking, Material } from '@types/index';

export const leedService = {
  // Get LEED tracking for a project
  getLEEDTracking: async (projectId: string): Promise<LEEDTracking> => {
    const response = await api.get<LEEDTracking>(`/leed/project/${projectId}`);
    return response.data!;
  },

  // Get LEED-eligible materials for a project
  getProjectLEEDMaterials: async (projectId: string): Promise<{
    materials: Array<Material & {
      leed_contribution: string[];
      points_contributed: number;
    }>;
    total_contribution: number;
  }> => {
    const response = await api.get(`/leed/project/${projectId}/materials`);
    return response.data!;
  },

  // Get LEED credit details
  getCreditDetails: async (creditId: string): Promise<{
    credit_id: string;
    credit_name: string;
    category: string;
    points_available: number;
    requirements: string[];
    documentation_needed: string[];
    calculation_methodology: string;
  }> => {
    const response = await api.get(`/leed/credits/${creditId}`);
    return response.data!;
  },

  // Get all LEED credits
  getAllCredits: async (): Promise<Array<{
    credit_id: string;
    credit_name: string;
    category: string;
    points_available: number;
  }>> => {
    const response = await api.get('/leed/credits');
    return response.data!;
  },

  // Generate LEED documentation
  generateDocumentation: async (projectId: string, creditIds?: string[]): Promise<{
    download_url: string;
    expires_at: string;
  }> => {
    const response = await api.post('/leed/generate-documentation', {
      project_id: projectId,
      credit_ids: creditIds,
    });
    return response.data!;
  },

  // Calculate MR credit contributions
  calculateMRContributions: async (projectId: string): Promise<{
    mr_credit_1: { // Building Life-Cycle Impact Reduction
      points: number;
      requirements_met: boolean;
    };
    mr_credit_2: { // Building Product Disclosure and Optimization - EPDs
      points: number;
      requirements_met: boolean;
    };
    mr_credit_3: { // Building Product Disclosure and Optimization - Sourcing of Raw Materials
      points: number;
      requirements_met: boolean;
    };
    mr_credit_4: { // Building Product Disclosure and Optimization - Material Ingredients
      points: number;
      requirements_met: boolean;
    };
    mr_credit_5: { // Construction and Demolition Waste Management
      points: number;
      requirements_met: boolean;
    };
    total_mr_points: number;
  }> => {
    const response = await api.get(`/leed/project/${projectId}/mr-calculation`);
    return response.data!;
  },

  // Get recycled content summary
  getRecycledContentSummary: async (projectId: string): Promise<{
    total_materials_cost: number;
    recycled_content_value: number;
    recycled_content_percentage: number;
    post_consumer_value: number;
    pre_consumer_value: number;
    materials_breakdown: Array<{
      material_name: string;
      cost: number;
      recycled_percentage: number;
      recycled_value: number;
    }>;
  }> => {
    const response = await api.get(`/leed/project/${projectId}/recycled-content`);
    return response.data!;
  },

  // Get regional materials summary
  getRegionalMaterialsSummary: async (projectId: string): Promise<{
    total_materials_cost: number;
    regional_materials_value: number;
    regional_materials_percentage: number;
    materials_breakdown: Array<{
      material_name: string;
      cost: number;
      extraction_location: string;
      manufacturer_location: string;
      distance_miles: number;
      is_regional: boolean;
    }>;
  }> => {
    const response = await api.get(`/leed/project/${projectId}/regional-materials`);
    return response.data!;
  },

  // Update LEED target for project
  updateLEEDTarget: async (
    projectId: string,
    target: 'certified' | 'silver' | 'gold' | 'platinum'
  ): Promise<void> => {
    await api.patch(`/projects/${projectId}`, { leed_target: target });
  },
};
