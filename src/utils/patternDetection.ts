import { ParsedRecord, Issue, IssueType } from '@/types/trillium';
import { 
  SPANISH_PARTICLES, 
  SPANISH_SURNAMES,
  ALL_CULTURAL_PARTICLES, 
  GENERATION_SUFFIXES, 
  BUSINESS_INDICATORS,
  BUSINESS_TYPES,
  COMMON_FIRST_NAMES
} from './constants';

/**
 * Tokenize input string into normalized tokens
 */
export function tokenize(input: string): string[] {
  return input
    .toUpperCase()
    .trim()
    .split(/\s+/)
    .filter(token => token.length > 0);
}

/**
 * Calculate confidence score for a pattern match
 */
function calculateConfidence(tokens: string[], position: number, type: IssueType): number {
  let confidence = 0.5; // Base confidence
  
  if (type === 'spanish_name') {
    // Higher confidence if we see a known Spanish surname
    const hasKnownSurname = tokens.some(t => SPANISH_SURNAMES.includes(t));
    if (hasKnownSurname) confidence += 0.3;
    
    // Higher confidence if first name looks common
    if (position > 0 && COMMON_FIRST_NAMES.includes(tokens[position - 1])) {
      confidence += 0.2;
    }
  } else if (type === 'business_indicator') {
    // Business indicators are usually very high confidence
    confidence = 0.95;
  } else if (type === 'generation_suffix') {
    // High confidence for standard suffixes
    confidence = 0.9;
  }
  
  return Math.min(confidence, 1.0);
}

/**
 * Detect Spanish name patterns
 * Spanish names often include particles like "DE LOS" that should stay with the surname
 */
function detectSpanishName(tokens: string[]): Issue | null {
  for (let i = 0; i < tokens.length; i++) {
    // Check for multi-token particles first (DE LA, DE LOS, etc.)
    if (i + 2 < tokens.length) {
      const threeToken = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
      if (SPANISH_PARTICLES.includes(threeToken)) {
        const lastName = tokens.slice(i).join(' ');
        const firstName = i > 0 ? tokens[i - 1] : '';
        return {
          type: 'spanish_name',
          pattern: lastName,
          tokens: tokens.slice(i),
          position: i,
          severity: 'high',
          confidence: calculateConfidence(tokens, i, 'spanish_name'),
          suggestion: firstName 
            ? `Add pattern: '${firstName} ${lastName}' INS NAME DEF ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`
            : `Add pattern: '${lastName}' INS NAME END ATT=LAST`
        };
      }
    }
    
    // Check for two-token particles (DE LA, etc.)
    if (i + 1 < tokens.length) {
      const twoToken = `${tokens[i]} ${tokens[i + 1]}`;
      if (SPANISH_PARTICLES.includes(twoToken)) {
        const lastName = tokens.slice(i).join(' ');
        const firstName = i > 0 ? tokens[i - 1] : '';
        return {
          type: 'spanish_name',
          pattern: lastName,
          tokens: tokens.slice(i),
          position: i,
          severity: 'high',
          confidence: calculateConfidence(tokens, i, 'spanish_name'),
          suggestion: firstName
            ? `Add pattern: '${firstName} ${lastName}' INS NAME DEF ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`
            : `Add pattern: '${lastName}' INS NAME END ATT=LAST`
        };
      }
    }
    
    // Check for single-token particles
    if (SPANISH_PARTICLES.includes(tokens[i])) {
      const lastName = tokens.slice(i).join(' ');
      const firstName = i > 0 ? tokens[i - 1] : '';
      return {
        type: 'spanish_name',
        pattern: lastName,
        tokens: tokens.slice(i),
        position: i,
        severity: 'high',
        confidence: calculateConfidence(tokens, i, 'spanish_name'),
        suggestion: firstName
          ? `Add pattern: '${firstName} ${lastName}' INS NAME DEF ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`
          : `Add pattern: '${lastName}' INS NAME END ATT=LAST`
      };
    }
  }
  return null;
}

/**
 * Detect other cultural name patterns
 */
function detectCulturalName(tokens: string[]): Issue | null {
  for (let i = 0; i < tokens.length; i++) {
    // Check for multi-token particles
    if (i + 1 < tokens.length) {
      const twoToken = `${tokens[i]} ${tokens[i + 1]}`;
      if (ALL_CULTURAL_PARTICLES.includes(twoToken)) {
        const lastName = tokens.slice(i).join(' ');
        const firstName = i > 0 ? tokens[i - 1] : '';
        return {
          type: 'cultural_name',
          pattern: lastName,
          tokens: tokens.slice(i),
          position: i,
          severity: 'medium',
          confidence: 0.8,
          suggestion: firstName
            ? `Add pattern: '${firstName} ${lastName}' INS NAME DEF ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`
            : `Add pattern: '${lastName}' INS NAME END ATT=LAST`
        };
      }
    }
    
    // Check for single-token particles
    if (ALL_CULTURAL_PARTICLES.includes(tokens[i])) {
      const lastName = tokens.slice(i).join(' ');
      const firstName = i > 0 ? tokens[i - 1] : '';
      return {
        type: 'cultural_name',
        pattern: lastName,
        tokens: tokens.slice(i),
        position: i,
        severity: 'medium',
        confidence: 0.8,
        suggestion: firstName
          ? `Add pattern: '${firstName} ${lastName}' INS NAME DEF ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`
          : `Add pattern: '${lastName}' INS NAME END ATT=LAST`
      };
    }
  }
  return null;
}

/**
 * Detect generation suffixes
 */
function detectGenerationSuffix(tokens: string[]): Issue | null {
  for (let i = 0; i < tokens.length; i++) {
    const normalized = tokens[i].replace(/\./g, '');
    if (GENERATION_SUFFIXES.includes(normalized)) {
      return {
        type: 'generation_suffix',
        pattern: tokens[i],
        tokens: [tokens[i]],
        position: i,
        severity: 'low',
        confidence: 0.9,
        suggestion: `Add pattern: '${tokens[i]}' INS NAME MOD ATT=SUFFIX`
      };
    }
  }
  return null;
}

/**
 * Detect business indicators in personal names
 */
function detectBusinessIndicator(tokens: string[]): Issue | null {
  for (let i = 0; i < tokens.length; i++) {
    const normalized = tokens[i].toUpperCase().replace(/\./g, '');
    if (BUSINESS_INDICATORS.includes(normalized) || BUSINESS_TYPES.includes(normalized)) {
      return {
        type: 'business_indicator',
        pattern: tokens[i],
        tokens: [tokens[i]],
        position: i,
        severity: 'high',
        confidence: 0.95,
        suggestion: `Add pattern: '${tokens[i]}' INS NAME END ATT=BUSINESS`
      };
    }
  }
  return null;
}

/**
 * Detect 5+ digit numbers that cause address parsing issues
 */
function detectAddressNumber(tokens: string[]): Issue | null {
  for (let i = 0; i < tokens.length; i++) {
    if (/^\d{5,}$/.test(tokens[i])) {
      return {
        type: 'address_number',
        pattern: tokens[i],
        tokens: [tokens[i]],
        position: i,
        severity: 'medium',
        confidence: 1.0,
        suggestion: `Increase MAXIN parameter to handle ${tokens[i].length}-digit numbers`
      };
    }
  }
  return null;
}

/**
 * Analyze a single record and detect all issues
 */
export function analyzeRecord(input: string): ParsedRecord {
  const tokens = tokenize(input);
  const issues: Issue[] = [];

  // Run all detectors
  const spanishName = detectSpanishName(tokens);
  if (spanishName) issues.push(spanishName);

  const culturalName = detectCulturalName(tokens);
  if (culturalName) issues.push(culturalName);

  const generationSuffix = detectGenerationSuffix(tokens);
  if (generationSuffix) issues.push(generationSuffix);

  const businessIndicator = detectBusinessIndicator(tokens);
  if (businessIndicator) issues.push(businessIndicator);

  const addressNumber = detectAddressNumber(tokens);
  if (addressNumber) issues.push(addressNumber);

  return {
    original: input,
    tokens,
    issues
  };
}

/**
 * Analyze multiple records
 */
export function analyzeRecords(inputs: string[]): ParsedRecord[] {
  return inputs
    .filter(input => input.trim().length > 0)
    .map(input => analyzeRecord(input));
}

/**
 * Get example data for testing
 */
export function getExampleData(): string[] {
  return [
    'MARIA DE LOS SANTOS',
    'JUAN CARLOS DE LA CRUZ',
    'ROBERT VAN DER MEER',
    'PATRICK O\'CONNOR',
    'JOHN SMITH JR',
    'ABC COMPANY LLC',
    'JOSE GARCIA 12345 MAIN ST',
    'MOHAMED IBN SAUD',
    'MARY SMITH INC',
    'CARLOS DEL RIO'
  ];
}
