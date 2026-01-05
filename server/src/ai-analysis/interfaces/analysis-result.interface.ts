export interface RiskItem {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  category?: 'legal' | 'financial' | 'operational' | 'compliance' | 'other';
  suggestion?: string;
}

export interface KeyTerm {
  title: string;
  content: string;
  importance: 'critical' | 'important' | 'normal';
}

export interface ContractInfo {
  type?: string;
  parties?: string[];
  effectiveDate?: string;
  expirationDate?: string;
  totalValue?: string;
}

export interface AnalysisResult {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  risks: RiskItem[];
  keyTerms: KeyTerm[];
  recommendations: string[];
  contractInfo?: ContractInfo;
  analyzedAt: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult | null;
  message?: string;
}
