/**
 * Pattern constants for Trillium v7.15 name parsing analysis
 * These patterns are used to detect common parsing issues
 */

// Spanish name particles that should stay together with surnames
export const SPANISH_PARTICLES = [
  'DE', 'DEL', 'DE LA', 'DE LAS', 'DE LOS', 'Y', 'E'
];

// Common Spanish surnames for better pattern matching
export const SPANISH_SURNAMES = [
  'SANTOS', 'CRUZ', 'GARCIA', 'MARTINEZ', 'RODRIGUEZ', 'LOPEZ',
  'GONZALEZ', 'HERNANDEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ', 'TORRES',
  'FLORES', 'RIVERA', 'GOMEZ', 'DIAZ', 'REYES', 'MORALES', 'ORTIZ',
  'SILVA', 'CASTRO', 'VARGAS', 'FERNANDEZ', 'GUZMAN', 'MENDOZA',
  'RUIZ', 'ALVAREZ', 'JIMENEZ', 'MORENO', 'MUNOZ', 'ROJAS',
  'RAMOS', 'ROMERO', 'SOTO', 'CONTRERAS', 'LUNA', 'MEDINA'
];

// Other cultural name particles organized by origin
export const OTHER_PARTICLES = {
  dutch: ['VAN', 'VAN DER', 'VAN DEN', 'VAN DE', 'TER', 'TE'],
  german: ['VON', 'VOM', 'ZU', 'ZUR', 'AUF'],
  arabic: ['AL', 'EL', 'IBN', 'BIN', 'BINT', 'ABU', 'ABD'],
  irish: ['MAC', 'MC', "O'", 'UA'],
  french: ['DE', 'DU', 'DES', 'LE', 'LA', 'L'],
  italian: ['DA', 'DAL', 'DALLA', 'DELLA', 'DEI', 'DI', 'DEGLI'],
  scottish: ['MAC', 'MC'],
  portuguese: ['DA', 'DO', 'DOS', 'DAS', 'DE']
};

// Flatten all cultural particles for easy lookup
export const ALL_CULTURAL_PARTICLES = Object.values(OTHER_PARTICLES).flat();

// Generation suffixes that need special handling
export const GENERATION_SUFFIXES = [
  'JR', 'SR', 'JUNIOR', 'SENIOR',
  'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  '2ND', '3RD', '4TH', '5TH'
];

// Business indicators that should not appear in personal names
export const BUSINESS_INDICATORS = [
  'LLC', 'L.L.C.', 'INC', 'INC.', 'INCORPORATED',
  'CORP', 'CORP.', 'CORPORATION', 'CO', 'CO.',
  'COMPANY', 'LTD', 'LTD.', 'LIMITED',
  'D/B/A', 'DBA', 'DOING BUSINESS AS',
  'LP', 'LLP', 'PC', 'PA', 'PLC',
  'TRUST', 'FOUNDATION', 'ASSOCIATION',
  'GROUP', 'ENTERPRISES', 'HOLDINGS'
];

// Common business entity types
export const BUSINESS_TYPES = [
  'RESTAURANT', 'STORE', 'SHOP', 'MARKET', 'MART',
  'CENTER', 'AGENCY', 'SERVICE', 'SERVICES',
  'SOLUTIONS', 'CONSULTING', 'MANAGEMENT'
];

// Academic and professional titles
export const TITLES = [
  'DR', 'DR.', 'DOCTOR', 'MD', 'M.D.',
  'PHD', 'PH.D.', 'ESQ', 'ESQ.',
  'PROF', 'PROFESSOR', 'REV', 'REVEREND',
  'CAPT', 'CAPTAIN', 'LT', 'LIEUTENANT',
  'SGT', 'SERGEANT', 'COLONEL', 'MAJOR'
];

// Common first names for better pattern matching
export const COMMON_FIRST_NAMES = [
  'MARIA', 'JOSE', 'JUAN', 'CARLOS', 'LUIS', 'ANA',
  'JOHN', 'MARY', 'ROBERT', 'MICHAEL', 'DAVID', 'JAMES',
  'WILLIAM', 'RICHARD', 'THOMAS', 'PATRICIA', 'JENNIFER', 'LINDA'
];

/**
 * Get all particles as a single array for matching
 */
export function getAllParticles(): string[] {
  return [...SPANISH_PARTICLES, ...ALL_CULTURAL_PARTICLES];
}

/**
 * Check if a token is a known particle
 */
export function isParticle(token: string): boolean {
  return getAllParticles().includes(token.toUpperCase());
}

/**
 * Check if a token is a generation suffix
 */
export function isGenerationSuffix(token: string): boolean {
  return GENERATION_SUFFIXES.includes(token.toUpperCase().replace(/\./g, ''));
}

/**
 * Check if a token is a business indicator
 */
export function isBusinessIndicator(token: string): boolean {
  const normalized = token.toUpperCase();
  return BUSINESS_INDICATORS.includes(normalized) || BUSINESS_TYPES.includes(normalized);
}
