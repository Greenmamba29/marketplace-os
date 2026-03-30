import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { complianceApi, alertsApi } from '@/services/baserow';
import { aiComplianceApi } from '@/services/intelligence';
import type { ComplianceRecord, ComplianceReport, RegulatoryAlert } from '@/types';

// Query keys
const COMPLIANCE_KEY = 'compliance';
const COMPLIANCE_REPORTS_KEY = 'compliance-reports';
const REGULATORY_ALERTS_KEY = 'regulatory-alerts';
const AI_REPORT_KEY = 'ai-compliance-report';

// Get compliance record by CAS number
export function useComplianceByCAS(casNumber: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, casNumber],
    queryFn: () => complianceApi.getByCAS(casNumber),
    enabled: !!casNumber,
    staleTime: 10 * 60 * 1000,
  });
}

// Get compliance reports for a chemical
export function useComplianceReports(casNumber: string) {
  return useQuery({
    queryKey: [COMPLIANCE_REPORTS_KEY, casNumber],
    queryFn: () => complianceApi.getReports(casNumber),
    enabled: !!casNumber,
    staleTime: 5 * 60 * 1000,
  });
}

// Get all regulatory alerts
export function useRegulatoryAlerts(severity?: string) {
  return useQuery({
    queryKey: [REGULATORY_ALERTS_KEY, severity],
    queryFn: () => alertsApi.getAll(severity),
    staleTime: 5 * 60 * 1000,
  });
}

// Get regulatory alerts for specific CAS
export function useAlertsByCAS(casNumber: string) {
  return useQuery({
    queryKey: [REGULATORY_ALERTS_KEY, 'cas', casNumber],
    queryFn: () => alertsApi.getByCAS(casNumber),
    enabled: !!casNumber,
    staleTime: 10 * 60 * 1000,
  });
}

// Generate AI compliance report
export function useGenerateAIReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ casNumber, reportType }: { casNumber: string; reportType?: 'full_assessment' | 'reach_summary' | 'tsca_check' | 'safety_review' }) =>
      aiComplianceApi.generateReport(casNumber, reportType),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [COMPLIANCE_REPORTS_KEY, variables.casNumber] });
    },
  });
}

// Analyze compliance risk
export function useAnalyzeComplianceRisk(casNumber: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'risk', casNumber],
    queryFn: () => aiComplianceApi.analyzeRisk(casNumber),
    enabled: !!casNumber,
    staleTime: 30 * 60 * 1000,
  });
}

// Compare compliance across regions
export function useCompareRegions(casNumber: string) {
  return useQuery({
    queryKey: [COMPLIANCE_KEY, 'regions', casNumber],
    queryFn: () => aiComplianceApi.compareRegions(casNumber),
    enabled: !!casNumber,
    staleTime: 60 * 60 * 1000,
  });
}
