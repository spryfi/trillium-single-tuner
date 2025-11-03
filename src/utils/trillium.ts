// utils/trillium.ts
export type EngineMode = 'CDP' | 'TM';
export type EntityType = 'person' | 'business' | 'address';

const PARTICLES = [
  'DE','DEL','DE LA','DE LOS','DE LAS','DE EL',
  'DA','DO','DAS','DOS','DI','DU',"D'",
  'VAN','VAN DER','VAN DE','VAN DEN','VON','LA','LOS','LAS','EL'
];
const CONNECTORS = ['Y']; // add 'E' if needed
const GENERATIONS = ['JR','SR','II','III','IV','V'];

const isParticle = (w: string) => PARTICLES.includes(w.toUpperCase());
const isConnector = (w: string) => CONNECTORS.includes(w.toUpperCase());
const isGen = (w: string) => GENERATIONS.includes(w.toUpperCase());

// Join multi-word particles, normalize hyphens to spaces, squeeze spaces, uppercase
export function normalizeAndChunkBadName(s: string): string[] {
  const u = s.replace(/[-]+/g,' ').replace(/\s+/g,' ').trim().toUpperCase();
  if (!u) return [];
  // Greedy grouping of multi-word particles: scan ahead
  const tokens = u.split(' ');
  const out: string[] = [];
  for (let i=0;i<tokens.length;i++){
    const one = tokens[i];
    const two = i+1<tokens.length ? `${one} ${tokens[i+1]}` : '';
    const three = i+2<tokens.length ? `${two} ${tokens[i+2]}` : '';
    if (three && isParticle(three)) { out.push(three); i+=2; continue; }
    if (two && isParticle(two))    { out.push(two);  i+=1; continue; }
    out.push(one);
  }
  return out;
}

// Build inbound token string for NAME
export function inboundNameTokens(original: string): string[] {
  const words = normalizeAndChunkBadName(original);
  return words.map(w => isParticle(w) ? 'CONCATENEE'
                   : isConnector(w) ? 'CONNECTOR'
                   : isGen(w)       ? 'GENERATION'
                   : 'ALPHA');
}

export interface PersonParts {
  prefix?: string; first: string; middle?: string; last: string; gen?: string;
}

// CDP pattern block (2 lines): 'ALPHA …' PATTERN NAME DEF + REC with (1)
export function makeCdpNamePattern(original: string, p: PersonParts) {
  const inbound = inboundNameTokens(original).join(' ');
  // Build REC using GVN-NM1, GVN-NM2, SRNM, GENR, TITLE with (1)
  const rec: string[] = [];
  if (p.prefix?.trim()) rec.push("TITLE(1)");
  rec.push("GVN-NM1(1)");
  if (p.middle?.trim()) rec.push("GVN-NM2(1)");
  // Last may have multiple words; map each to SRNM(1)
  const lastParts = normalizeAndChunkBadName(p.last).filter(Boolean);
  for (let _ of lastParts) rec.push("SRNM(1)");
  if (p.gen?.trim()) rec.push("GENR(1)");
  return {
    inbound: `'${inbound}' PATTERN NAME DEF`,
    rec:     `REC='${rec.join(' ')}'`
  };
}

// TM pattern block (3 lines): INSERT PATTERN NAME DEF, RECODE, EXPORT
export function makeTmNamePattern(original: string, p: PersonParts) {
  const inbound = inboundNameTokens(original).join(' ');
  const rec: string[] = [];
  const exp: string[] = [];
  if (p.prefix?.trim()) { rec.push('TITLE');       exp.push('TITLE(1)'); }
  rec.push('FIRST');       exp.push('FIRST(1)');
  if (p.middle?.trim()) { rec.push('MIDDLE');      exp.push('MIDDLE(1)'); }
  const lastParts = normalizeAndChunkBadName(p.last).filter(Boolean);
  for (let _ of lastParts) { rec.push('LAST');     exp.push('LAST(1)'); }
  if (p.gen?.trim())     { rec.push('GENERATION'); exp.push('GENERATION(1)'); }
  // Hard validations mirroring v7.16 TM errors
  if (rec.length !== exp.length) throw new Error('REC/EXPORT token count mismatch (TM Error 52).');
  return {
    insert: `'${inbound}'\n  INSERT PATTERN NAME DEF`,
    rec:    `  RECODE='${rec.join(' ')}'`,
    exp:    `  EXPORT='${exp.join(' ')}'`
  };
}

export function previewPrepos(p: PersonParts){
  const lastParts = normalizeAndChunkBadName(p.last).filter(Boolean);
  const [s1,s2,s3] = [lastParts[0]||'', lastParts[1]||'', lastParts[2]||''];
  return { surname1: s1, surname2: s2, surname3: s3 };
}
