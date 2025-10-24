/**
 * Trillium v7.15 Parser Simulator
 * Simulates how Trillium parses names with and without patterns
 */

import { ParsedRecord, Issue } from '@/types/trillium';
import { SPANISH_PARTICLES, GENERATION_SUFFIXES, BUSINESS_INDICATORS } from './constants';

export interface ParsedParty {
  type: 'PERSON' | 'BUSINESS';
  firstName?: string;
  lastName?: string;
  businessName?: string;
  generation?: string;
  fullName: string;
  partyNumber?: number;
}

export interface ParseResult {
  partyCount: number;
  parties: ParsedParty[];
  matchedPattern: string;
  parseSteps: string[];
  tokens: string[];
}

export interface CLWDPATPattern {
  pattern: string;
  command: 'INS NAME' | 'MOD NAME' | 'INSERT GEOG';
  type: 'DEF' | 'END' | 'BEG' | 'MID';
  attributes: string;
  original: string;
}

/**
 * Parse a CLWDPAT entry into a structured pattern
 */
export function parseCLWDPATEntry(entry: string): CLWDPATPattern | null {
  const match = entry.match(/^'([^']+)'\s+(INS NAME|MOD NAME|INSERT GEOG)\s+(DEF|END|BEG|MID)\s+(.+)$/);
  if (!match) return null;

  return {
    pattern: match[1],
    command: match[2] as CLWDPATPattern['command'],
    type: match[3] as CLWDPATPattern['type'],
    attributes: match[4],
    original: entry
  };
}

/**
 * Simulate default Trillium parsing (without patterns)
 */
export function simulateDefaultParse(record: string): ParseResult {
  const tokens = record.toUpperCase().trim().split(/\s+/);
  
  // Default behavior: creates a party for each token
  const parties = tokens.map((token, index) => ({
    type: 'PERSON' as const,
    fullName: token,
    partyNumber: index + 1
  }));

  return {
    partyCount: tokens.length,
    parties,
    matchedPattern: 'NONE - DEFAULT PARSING',
    parseSteps: [
      'No patterns matched',
      `Split into ${tokens.length} token(s)`,
      'Each token created as separate party'
    ],
    tokens
  };
}

/**
 * Simulate parsing with patterns applied
 */
export function simulatePatternParse(record: string, patterns: CLWDPATPattern[]): ParseResult {
  const upperRecord = record.toUpperCase().trim();
  const tokens = upperRecord.split(/\s+/);

  // Sort patterns by length (longest first) - mimics Trillium precedence
  const sortedPatterns = [...patterns].sort((a, b) => b.pattern.length - a.pattern.length);

  // Try to match patterns
  for (const pattern of sortedPatterns) {
    if (matchesPattern(upperRecord, pattern)) {
      return applyPattern(upperRecord, pattern, tokens);
    }
  }

  // No pattern matched - return default parse
  return simulateDefaultParse(record);
}

/**
 * Check if a record matches a pattern
 */
function matchesPattern(record: string, pattern: CLWDPATPattern): boolean {
  const upperPattern = pattern.pattern.toUpperCase();
  
  switch (pattern.type) {
    case 'DEF':
      return record === upperPattern;
    case 'END':
      return record.endsWith(upperPattern);
    case 'BEG':
      return record.startsWith(upperPattern);
    case 'MID':
      return record.includes(upperPattern);
    default:
      return false;
  }
}

/**
 * Apply a matched pattern to create parse result
 */
function applyPattern(record: string, pattern: CLWDPATPattern, tokens: string[]): ParseResult {
  const steps: string[] = [];
  steps.push(`Pattern matched: '${pattern.pattern}' (${pattern.type})`);

  const attributes = pattern.attributes;
  const parties: ParsedParty[] = [];

  // Check if it's a business pattern
  if (attributes.includes('ATT=BUSINESS')) {
    parties.push({
      type: 'BUSINESS',
      businessName: record,
      fullName: record
    });
    steps.push('Applied BUSINESS entity type');
  } 
  // Check if it's a person pattern
  else if (attributes.includes('ATT=PERSON')) {
    const firstMatch = attributes.match(/FIRST='([^']+)'/);
    const lastMatch = attributes.match(/LAST='([^']+)'/);
    const genMatch = attributes.match(/GEN='([^']+)'/);

    const firstName = firstMatch ? firstMatch[1] : '';
    const lastName = lastMatch ? lastMatch[1] : '';
    const generation = genMatch ? genMatch[1] : extractGeneration(tokens);

    parties.push({
      type: 'PERSON',
      firstName,
      lastName,
      generation,
      fullName: record
    });

    steps.push(`Applied PERSON parsing: FIRST='${firstName}', LAST='${lastName}'`);
    if (generation) steps.push(`Generation suffix: ${generation}`);
  }
  // Last name pattern
  else if (attributes.includes('ATT=LAST')) {
    parties.push({
      type: 'PERSON',
      lastName: pattern.pattern,
      fullName: record
    });
    steps.push(`Marked as LAST name component`);
  }
  // Connector pattern (doesn't create party)
  else if (attributes.includes('ATT=CONNECTOR')) {
    steps.push(`Recognized as name CONNECTOR (kept together)`);
    return {
      partyCount: 0,
      parties: [],
      matchedPattern: pattern.original,
      parseSteps: steps,
      tokens
    };
  }

  return {
    partyCount: parties.length,
    parties,
    matchedPattern: pattern.original,
    parseSteps: steps,
    tokens
  };
}

/**
 * Extract generation suffix from tokens
 */
function extractGeneration(tokens: string[]): string | undefined {
  return tokens.find(token => GENERATION_SUFFIXES.includes(token));
}

/**
 * Generate patterns from a parsed record's issues
 */
export function generatePatternsFromRecord(record: ParsedRecord): CLWDPATPattern[] {
  const patterns: CLWDPATPattern[] = [];

  record.issues.forEach(issue => {
    const pattern = generatePatternFromIssue(record.original, issue);
    if (pattern) patterns.push(pattern);
  });

  return patterns;
}

/**
 * Generate a CLWDPAT pattern from a detected issue
 */
function generatePatternFromIssue(original: string, issue: Issue): CLWDPATPattern | null {
  const tokens = original.toUpperCase().split(/\s+/);

  switch (issue.type) {
    case 'spanish_name': {
      const particleIndex = tokens.findIndex(t => SPANISH_PARTICLES.includes(t));
      if (particleIndex > 0) {
        const firstName = tokens[particleIndex - 1];
        const lastName = tokens.slice(particleIndex).join(' ');
        
        return {
          pattern: `${firstName} ${lastName}`,
          command: 'INS NAME',
          type: 'DEF',
          attributes: `ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`,
          original: `'${firstName} ${lastName}'    INS NAME DEF ATT=PERSON,FIRST='${firstName}',LAST='${lastName}'`
        };
      }
      break;
    }

    case 'business_indicator': {
      return {
        pattern: original.toUpperCase(),
        command: 'INS NAME',
        type: 'DEF',
        attributes: 'ATT=BUSINESS',
        original: `'${original.toUpperCase()}'    INS NAME DEF ATT=BUSINESS`
      };
    }

    case 'generation_suffix': {
      const gen = tokens.find(t => GENERATION_SUFFIXES.includes(t));
      if (gen) {
        const nameWithoutGen = tokens.filter(t => t !== gen).join(' ');
        return {
          pattern: original.toUpperCase(),
          command: 'MOD NAME',
          type: 'DEF',
          attributes: `ATT=PERSON,LAST='${nameWithoutGen}',GEN='${gen}'`,
          original: `'${original.toUpperCase()}'    MOD NAME DEF ATT=PERSON,LAST='${nameWithoutGen}',GEN='${gen}'`
        };
      }
      break;
    }
  }

  return null;
}

/**
 * Calculate effectiveness metrics for patterns
 */
export interface EffectivenessMetrics {
  totalRecords: number;
  fixedRecords: number;
  partyReduction: number;
  patternsGenerated: number;
  issueTypeBreakdown: Record<string, { total: number; fixed: number }>;
}

export function calculateEffectiveness(
  records: ParsedRecord[],
  patterns: CLWDPATPattern[]
): EffectivenessMetrics {
  let totalParties = 0;
  let fixedParties = 0;
  let fixedCount = 0;

  const issueBreakdown: Record<string, { total: number; fixed: number }> = {
    spanish_name: { total: 0, fixed: 0 },
    cultural_name: { total: 0, fixed: 0 },
    generation_suffix: { total: 0, fixed: 0 },
    business_indicator: { total: 0, fixed: 0 },
    address_number: { total: 0, fixed: 0 }
  };

  records.forEach(record => {
    const beforeParse = simulateDefaultParse(record.original);
    const afterParse = simulatePatternParse(record.original, patterns);

    totalParties += beforeParse.partyCount;
    fixedParties += afterParse.partyCount;

    if (afterParse.partyCount < beforeParse.partyCount) {
      fixedCount++;
    }

    // Track issue types
    record.issues.forEach(issue => {
      if (issueBreakdown[issue.type]) {
        issueBreakdown[issue.type].total++;
        if (afterParse.matchedPattern !== 'NONE - DEFAULT PARSING') {
          issueBreakdown[issue.type].fixed++;
        }
      }
    });
  });

  const partyReduction = totalParties > 0 
    ? Math.round(((totalParties - fixedParties) / totalParties) * 100)
    : 0;

  return {
    totalRecords: records.length,
    fixedRecords: fixedCount,
    partyReduction,
    patternsGenerated: patterns.length,
    issueTypeBreakdown: issueBreakdown
  };
}
