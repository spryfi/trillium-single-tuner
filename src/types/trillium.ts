export interface ParsedRecord {
  original: string;
  tokens: string[];
  issues: Issue[];
}

export interface Issue {
  type: IssueType;
  pattern: string;
  tokens: string[];
  position: number;
  severity: 'high' | 'medium' | 'low';
  confidence: number;
  suggestion: string;
}

export type IssueType = 
  | 'spanish_name'
  | 'cultural_name'
  | 'generation_suffix'
  | 'business_indicator'
  | 'address_number';

export interface CLWDPATEntry {
  pattern: string;
  instruction: string;
  attributes: string;
}

export interface AnalysisStats {
  totalRecords: number;
  spanishNames: number;
  culturalNames: number;
  generationSuffixes: number;
  businessIndicators: number;
  addressIssues: number;
}

export interface ParserConfig {
  maxNumberNames: number;
  maxin: number;
  threshold: number;
  genBusinessNames: boolean;
}
