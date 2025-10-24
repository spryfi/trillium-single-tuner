import { ParsedRecord, Issue, IssueType } from '@/types/trillium';

// Spanish name particles
const SPANISH_PARTICLES = ['DE', 'DEL', 'DE LA', 'DE LAS', 'DE LOS'];

// Other cultural name particles
const CULTURAL_PARTICLES = ['VAN DER', 'VAN', 'VON', 'MAC', 'MC', "O'", 'IBN', 'BIN', 'AL'];

// Generation suffixes
const GENERATION_SUFFIXES = ['JR', 'SR', 'II', 'III', 'IV', 'V', 'JUNIOR', 'SENIOR'];

// Business indicators
const BUSINESS_INDICATORS = ['LLC', 'INC', 'CORP', 'LTD', 'D/B/A', 'DBA', 'COMPANY', 'CO'];

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
 * Detect Spanish name patterns
 * Spanish names often include particles like "DE LOS" that should stay with the surname
 */
function detectSpanishName(tokens: string[]): Issue | null {
  for (let i = 0; i < tokens.length; i++) {
    // Check for multi-token particles first (DE LA, DE LOS, etc.)
    if (i + 2 < tokens.length) {
      const threeToken = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
      if (SPANISH_PARTICLES.includes(threeToken)) {
        return {
          type: 'spanish_name',
          pattern: tokens.slice(i).join(' '),
          tokens: tokens.slice(i),
          position: i,
          severity: 'high'
        };
      }
    }
    
    // Check for two-token particles (DE LA, etc.)
    if (i + 1 < tokens.length) {
      const twoToken = `${tokens[i]} ${tokens[i + 1]}`;
      if (SPANISH_PARTICLES.includes(twoToken)) {
        return {
          type: 'spanish_name',
          pattern: tokens.slice(i).join(' '),
          tokens: tokens.slice(i),
          position: i,
          severity: 'high'
        };
      }
    }
    
    // Check for single-token particles
    if (SPANISH_PARTICLES.includes(tokens[i])) {
      return {
        type: 'spanish_name',
        pattern: tokens.slice(i).join(' '),
        tokens: tokens.slice(i),
        position: i,
        severity: 'high'
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
      if (CULTURAL_PARTICLES.includes(twoToken)) {
        return {
          type: 'cultural_name',
          pattern: tokens.slice(i).join(' '),
          tokens: tokens.slice(i),
          position: i,
          severity: 'medium'
        };
      }
    }
    
    // Check for single-token particles
    if (CULTURAL_PARTICLES.includes(tokens[i])) {
      return {
        type: 'cultural_name',
        pattern: tokens.slice(i).join(' '),
        tokens: tokens.slice(i),
        position: i,
        severity: 'medium'
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
    if (GENERATION_SUFFIXES.includes(tokens[i])) {
      return {
        type: 'generation_suffix',
        pattern: tokens[i],
        tokens: [tokens[i]],
        position: i,
        severity: 'low'
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
    if (BUSINESS_INDICATORS.includes(tokens[i])) {
      return {
        type: 'business_indicator',
        pattern: tokens[i],
        tokens: [tokens[i]],
        position: i,
        severity: 'high'
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
        severity: 'medium'
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
