// utils/trillium.ts
export type EngineMode = 'CDP' | 'TM';
export type EntityType = 'person' | 'business' | 'address';

export const PARTICLES = [
  'DE','DEL','DE LA','DE LOS','DE LAS','DE EL',
  'DA','DO','DAS','DOS','DI','DU',"D'",
  'VAN','VAN DER','VAN DE','VAN DEN','VON','LA','LOS','LAS','EL'
];
export const CONNECTORS = ['Y']; // add 'E' if needed
export const GENERATIONS = ['JR','SR','II','III','IV','V'];

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

// Aliases for Labs compatibility
export const normalizeAndGroup = normalizeAndChunkBadName;
export const tokenizeInbound = inboundNameTokens;

/* ================= VALIDATORS (key v7.16 rules) ================= */

// Valid attribute sets
const CDP_NAME_ATTR = new Set(["TITLE","GVN-NM1","GVN-NM2","SRNM","GENR","CONNECTOR"]);
const TM_NAME_REC   = new Set(["FIRST","MIDDLE","LAST","TITLE","GENERATION","CONNECTOR"]);
const TOKEN_OK      = /^(ALPHA|CONCATENEE|CONNECTOR|GENERATION)(\s+(ALPHA|CONCATENEE|CONNECTOR|GENERATION))*$/;

export function validateCdp(text:string): string[] {
  const errs:string[] = [];
  const lines = text.split("\n").map(s=>s.trim()).filter(Boolean);
  if (lines.length<2) { errs.push("CDP: Must contain two lines (pattern + REC)."); return errs; }
  if (!/'[\s\S]+' PATTERN NAME DEF/.test(lines[0])) errs.push("CDP: First line must be quoted and end with PATTERN NAME DEF.");
  const m = lines[0].match(/^'(.+)' PATTERN NAME DEF$/);
  if (!m) errs.push("CDP: Failed to read inbound tokens.");
  else if (!TOKEN_OK.test(m[1])) errs.push("CDP: Inbound tokens must be ALPHA/CONCATENEE/CONNECTOR/GENERATION.");
  const rec = lines.find(l=>/^REC='.+?'$/.test(l));
  if (!rec) errs.push("CDP: Second line must be REC='…'.");
  else {
    const inner = rec.slice(5,-1).trim();
    if (/[="'`,]/.test(inner)) errs.push("CDP: Do not use = ' \" , inside REC value.");
    const attrs = inner.split(/\s+/);
    attrs.forEach(a=>{
      const mm = a.match(/^([A-Z-]+)\((\d+)\)$/);
      if (!mm) errs.push(`CDP: Name attributes must include (1): ${a}`);
      else {
        const [_, name, num] = mm;
        if (num!=="1") errs.push("CDP: Use name number (1) for NAME patterns.");
        if (!CDP_NAME_ATTR.has(name)) errs.push(`CDP: Unknown or disallowed attribute: ${name}`);
      }
    });
  }
  return errs;
}

export function validateTm(text:string): string[] {
  const errs:string[] = [];
  const lines = text.split("\n").map(s=>s.trim()).filter(Boolean);
  const hasInsert = lines.some(l=>/INSERT PATTERN NAME DEF$/.test(l));
  const recLine = lines.find(l=>/^RECODE='.+?'$/.test(l));
  const expLine = lines.find(l=>/^EXPORT='.+?'$/.test(l));

  if (!hasInsert) errs.push("TM: Missing INSERT PATTERN NAME DEF.");
  if (!recLine)   errs.push("TM: Missing RECODE='…'.");
  if (!expLine)   errs.push("TM: NAME patterns require EXPORT (Error 67).");

  const head = lines[0];
  const mm = head?.match(/^'(.+)'$/);
  if (!mm) errs.push("TM: First line must be a quoted inbound token string.");
  else if (!TOKEN_OK.test(mm[1])) errs.push("TM: Inbound tokens must be ALPHA/CONCATENEE/CONNECTOR/GENERATION.");

  if (recLine && expLine) {
    const rec = recLine.slice(8,-1).trim().split(/\s+/);
    const exp = expLine.slice(8,-1).trim().split(/\s+/);
    if (rec.length !== exp.length) errs.push("TM: REC and EXPORT token counts must match (Error 52).");

    // attribute checks
    rec.forEach(a=>{
      if (!TM_NAME_REC.has(a)) errs.push(`TM: Unknown NAME attribute in RECODE: ${a}`);
    });

    exp.forEach(e=>{
      const mm = e.match(/^([A-Z-]+)\((\d+)\)$/);
      if (!mm) errs.push(`TM: EXPORT items must include (1): ${e} (Error 9 if blanks)`);
      else if (mm[2] !== "1") errs.push("TM: Use name number (1) in EXPORT for this course.");
    });
  }
  return errs;
}
