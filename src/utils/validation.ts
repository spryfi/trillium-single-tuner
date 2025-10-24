/**
 * Validation utilities for Trillium v7.15 patterns
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate CLWDPAT pattern syntax
 */
export function validateCLWDPATPattern(pattern: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for required quote at start
  if (!pattern.startsWith("'")) {
    errors.push("Pattern must start with single quote");
  }

  // Check for pattern closing quote and spacing
  const quoteEndMatch = pattern.match(/^'[^']+'(\s+)/);
  if (!quoteEndMatch) {
    errors.push("Pattern must have closing quote followed by spaces");
  } else if (quoteEndMatch[1].length < 4) {
    errors.push("Must have at least 4 spaces between pattern and command");
  }

  // Check for valid commands
  const validCommands = ['INS NAME', 'MOD NAME', 'DEL NAME', 'INSERT GEOG'];
  const hasValidCommand = validCommands.some(cmd => pattern.includes(cmd));
  if (!hasValidCommand) {
    errors.push(`Must include valid command: ${validCommands.join(', ')}`);
  }

  // Check for valid positions (for NAME patterns)
  if (pattern.includes('NAME')) {
    const validPositions = ['DEF', 'END', 'MID', 'BEG'];
    const hasValidPosition = validPositions.some(pos => pattern.includes(` ${pos} `));
    if (!hasValidPosition) {
      errors.push(`NAME patterns must include position: ${validPositions.join(', ')}`);
    }
  }

  // Check for attributes
  if (!pattern.includes('ATT=')) {
    warnings.push("Pattern should include ATT= attribute");
  }

  // Validate attribute values
  const validAttributes = ['PERSON', 'BUSINESS', 'LAST', 'FIRST', 'MIDDLE', 'SUFFIX', 'CONNECTOR', 'ADDRESS'];
  if (pattern.includes('ATT=')) {
    const attMatch = pattern.match(/ATT=([A-Z]+)/);
    if (attMatch && !validAttributes.includes(attMatch[1])) {
      errors.push(`Invalid attribute: ${attMatch[1]}. Valid: ${validAttributes.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validate pfprsdrv.par parameter
 */
export function validateParserParameter(name: string, value: string | number): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (name) {
    case 'MAX_NUMB_NAMES':
      const maxNames = typeof value === 'number' ? value : parseInt(value);
      if (maxNames < 1 || maxNames > 99) {
        errors.push('MAX_NUMB_NAMES must be between 1 and 99');
      }
      if (maxNames > 20) {
        warnings.push('MAX_NUMB_NAMES > 20 may impact performance');
      }
      break;

    case 'MAXIN':
      const maxin = typeof value === 'number' ? value : parseInt(value);
      if (maxin < 1) {
        errors.push('MAXIN must be positive');
      }
      if (maxin > 999999) {
        warnings.push('MAXIN > 999999 is unusually high');
      }
      break;

    case 'THRESHOLD':
      const threshold = typeof value === 'number' ? value : parseInt(value);
      if (threshold < -10 || threshold > 10) {
        warnings.push('THRESHOLD typically ranges from -5 to 5');
      }
      break;

    case 'GEN_BUSINESS_NAMES':
      if (value !== 'Y' && value !== 'N') {
        errors.push('GEN_BUSINESS_NAMES must be Y or N');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Calculate recommended MAX_NUMB_NAMES based on data
 */
export function calculateMaxNumbNames(tokens: string[][]): number {
  // Find longest tokenized name
  const maxTokens = Math.max(...tokens.map(t => t.length));
  
  // Add buffer for parsing flexibility
  const recommended = Math.min(Math.ceil(maxTokens * 1.5), 99);
  
  return Math.max(recommended, 10); // Minimum of 10
}

/**
 * Calculate recommended MAXIN based on address data
 */
export function calculateMaxin(inputs: string[]): number | null {
  // Find longest digit sequence
  let maxDigits = 0;
  
  inputs.forEach(input => {
    const digitMatches = input.match(/\d+/g);
    if (digitMatches) {
      digitMatches.forEach(match => {
        maxDigits = Math.max(maxDigits, match.length);
      });
    }
  });

  // Only recommend MAXIN if we found 5+ digit numbers
  if (maxDigits >= 5) {
    return Math.pow(10, maxDigits) - 1;
  }
  
  return null;
}

/**
 * Validate entire CLWDPAT file section
 */
export function validateCLWDPATSection(patterns: string[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const seenPatterns = new Set<string>();

  patterns.forEach((pattern, idx) => {
    // Skip comment lines
    if (pattern.trim().startsWith('*')) return;
    if (pattern.trim() === '') return;

    // Validate individual pattern
    const result = validateCLWDPATPattern(pattern);
    errors.push(...result.errors.map(e => `Line ${idx + 1}: ${e}`));
    warnings.push(...result.warnings.map(w => `Line ${idx + 1}: ${w}`));

    // Check for duplicates
    const patternText = pattern.match(/^'([^']+)'/)?.[1];
    if (patternText) {
      if (seenPatterns.has(patternText)) {
        warnings.push(`Duplicate pattern: '${patternText}'`);
      }
      seenPatterns.add(patternText);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
