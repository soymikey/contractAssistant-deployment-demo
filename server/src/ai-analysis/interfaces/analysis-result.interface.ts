export interface RiskItem {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface KeyTerm {
  title: string;
  content: string;
  importance: 'critical' | 'important' | 'normal';
}

export interface AnalysisResult {
  summary: string;
  riskLevel: 'high' | 'medium' | 'low';
  risks: RiskItem[];
  keyTerms: KeyTerm[];
  recommendations: string[];
  analyzedAt: string;
}

export interface AnalysisResponse {
  success: boolean;
  data: AnalysisResult | null;
  message?: string;
}
