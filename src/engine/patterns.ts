/* engine/patterns.ts
   Trillium Parser Tuning Engine — core builder/validator/emitter
   NOTE: Keep tokens uppercase. All emitted files are space-delimited and end with \n.
*/

export type LineType = 'NAME' | 'STREET' | 'MISC';
export type Engine = 'CDP' | 'BDP';

export const INTRINSIC_TOKENS = new Set<string>([
  'ALPHA','NUMERIC','ALPHA-NUMERIC','NUMERIC-ALPHA','1ALPHA','1NUMERIC',
  'ALPHA-1NUMERIC','NUMERIC-1ALPHA','NUMERIC-1SPECIAL','ALPHA-1SPECIAL',
  'NUMERIC-SPECIAL','ALPHA-SPECIAL','OTHER-SPECIAL','MIXED-NUMERIC','HYPHEN'
]);

/** Concise "common" attributes. Extend safely in Settings if you need more. */
export const NAME_ATTRS = new Set<string>([
  'GVN-NM1','GVN-NM2','SRNM','TTLP','TTLS','GENR','BUS','BUS?','ATTN','CTR','REL','RDEF','B-DES','B-RDEF'
]);

export const STREET_ATTRS = new Set<string>([
  'HSNO','NMB','STR-NM','STR-NM2','STR-TYPE','STR-TYPE1','STR-TYPE2',
  'DIR','DIR2','S-DIR','S-DIR2','APT','APT-NUM','UNIT','UNIT-NUM','FLR','FLR-NUM',
  'POBOX','POBOX-NUM','RTE','RTE-NUM','HWY','HWY-NUM','PCODE','CITY','STATE','PRV','CNTRY'
]);

export const LINE_TYPES: LineType[] = ['NAME','STREET','MISC'];

/** Utils */
const U = {
  up: (s: string) => s.trim().toUpperCase(),
  isInt: (v: number) => Number.isInteger(v) && isFinite(v),
  // forbid = ' " , and control chars inside quoted recode strings
  illegalInQuoted: (s: string) => /[=',"\x00-\x1F]/.test(s),
  hasTabs: (s: string) => /\t/.test(s),
  ensureNoTabs: (s: string) => { if (U.hasTabs(s)) throw new Error('Tabs are not allowed'); },
};

export type Token = string;

export type CDPRecItem = { attr: string; index: number }; // e.g., {attr:'GVN-NM1', index:1}
export type CDPPattern = {
  engine: 'CDP';
  countryCode: string;
  lineType: LineType;
  inboundTokens: Token[];     // e.g., ['ALPHA','ALPHA']
  recode: CDPRecItem[];       // e.g., [{attr:'GVN-NM1',index:1},{attr:'SRNM',index:1}]
  comment?: string;
};

export type BDPPattern = {
  engine: 'BDP';
  countryCode: string;
  lineType: 'MISC';
  inboundTokens: Token[];     // commonly ['ALPHA'] etc.
  recodeLiteral: string;      // e.g., 'NORTH FACE'
  comment?: string;
};

export type AnyPattern = CDPPattern | BDPPattern;

export function sanitizeToken(t: string): string {
  return U.up(t);
}

function isKnownToken(t: string): boolean {
  const tt = U.up(t);
  return INTRINSIC_TOKENS.has(tt) || NAME_ATTRS.has(tt) || STREET_ATTRS.has(tt);
}

export function isKnownAttr(a: string): boolean {
  const aa = U.up(a);
  return NAME_ATTRS.has(aa) || STREET_ATTRS.has(aa);
}

function assertLineTypeCDP(t: LineType) {
  if (!LINE_TYPES.includes(t)) throw new Error(`Invalid CDP line type: ${t}`);
}

function validateCDP(p: CDPPattern): { warnings: string[] } {
  const warnings: string[] = [];
  
  assertLineTypeCDP(p.lineType);
  if (!Array.isArray(p.inboundTokens) || p.inboundTokens.length === 0) {
    throw new Error('Inbound tokens are required');
  }
  p.inboundTokens.forEach((tok, i) => {
    const T = sanitizeToken(tok);
    if (!isKnownToken(T)) {
      warnings.push(`Unknown token at position ${i + 1}: ${tok}`);
    }
  });
  if (!Array.isArray(p.recode) || p.recode.length === 0) {
    throw new Error('REC mapping is required for CDP');
  }
  p.recode.forEach((r, i) => {
    const A = U.up(r.attr);
    if (!isKnownAttr(A)) {
      warnings.push(`Unknown REC attribute: ${r.attr}`);
    }
    if (!U.isInt(r.index) || r.index < 1 || r.index > p.inboundTokens.length) {
      throw new Error(`REC index out of range at index ${i + 1}: ${r.index}`);
    }
  });
  
  return { warnings };
}

function validateBDP(p: BDPPattern) {
  if (p.lineType !== 'MISC') throw new Error('BDP patterns must use line type MISC');
  if (!Array.isArray(p.inboundTokens) || p.inboundTokens.length === 0) {
    throw new Error('Inbound tokens are required');
  }
  p.inboundTokens.forEach((tok, i) => {
    const T = sanitizeToken(tok);
    if (!isKnownToken(T)) throw new Error(`Unknown token at position ${i + 1}: ${tok}`);
  });
  const lit = p.recodeLiteral ?? '';
  if (!lit.length) throw new Error("RECODE line is required for BDP (third line: RECODE='...')");
  if (U.illegalInQuoted(lit)) {
    throw new Error('RECODE contains illegal characters (=, quotes, comma, or control chars)');
  }
}

/** Render one pattern block for CLWDPAT */
export function emitCDPPattern(p: CDPPattern): { output: string; warnings: string[] } {
  const validation = validateCDP(p);
  const toks = p.inboundTokens.map(sanitizeToken).join(' ');
  const header = `'${toks}' PATTERN ${p.lineType} DEF`;
  const rec = p.recode.map(r => `${U.up(r.attr)}(${r.index})`).join(' ');
  const recLine = `REC='${rec}'`;
  const comment = p.comment ? `# ${p.comment}\n` : '';
  const block = `${comment}${header}\n${recLine}\n`;
  U.ensureNoTabs(block);
  return { output: block, warnings: validation.warnings };
}

export function emitBDPPattern(p: BDPPattern): string {
  validateBDP(p);
  const toks = p.inboundTokens.map(sanitizeToken).join(' ');
  const header1 = `'${toks}'`;
  const header2 = `PATTERN MISC DEF`;
  const recLit = p.recodeLiteral.replace(/\s+/g,' ').trim();
  const recLine = `RECODE='${recLit}'`;
  const comment = p.comment ? `# ${p.comment}\n` : '';
  const block = `${comment}${header1}\n${header2}\n${recLine}\n`;
  U.ensureNoTabs(block);
  return block;
}

export function emitCLWDPAT(patterns: AnyPattern[], opts?: { header?: string; commentChar?: string }): string {
  const cc = (opts?.commentChar ?? '#').slice(0,1);
  const header = opts?.header ? `${cc} ${opts.header}\n` : '';
  const body = patterns.map(p => {
    if (p.engine === 'CDP') {
      const result = emitCDPPattern(p);
      return result.output;
    }
    return emitBDPPattern(p);
  }).join('\n');
  const out = `${header}${body}`.replace(/\r?\n/g, '\n');
  U.ensureNoTabs(out);
  return out.endsWith('\n') ? out : out + '\n';
}

/** Driver parm file (PFPRSDRV.PAR) */
export function emitPFPRSDRV(opts: {
  inp: string; outp: string; pfparser: string; stat: string;
  ddlIn: string; ddlPrepos: string; ddlOut: string;
  rIn?: string; rPrepos?: string; rOut?: string;
  printNth?: number;
}): string {
  const lines = [
    `MAXIN 10000`,
    `INP_DDNAME ${opts.inp}`,
    `OUT_DDNAME ${opts.outp}`,
    `PA_PARMNAME ${opts.pfparser}`,
    `STAT_FNAME ${opts.stat}`,
    `DDL_INP_FNAME ${opts.ddlIn}`,
    `DDL_PREPOS_FNAME ${opts.ddlPrepos}`,
    `DDL_OUT_FNAME ${opts.ddlOut}`,
    `DDL_INP_RNAME ${opts.rIn ?? 'INPUT'}`,
    `DDL_PREPOS_RNAME ${opts.rPrepos ?? 'PREPOS'}`,
    `DDL_OUT_RNAME ${opts.rOut ?? 'PARSOUT'}`,
    `PRINT_NTH_COUNT ${opts.printNth ?? 100}`
  ].join('\n') + '\n';
  U.ensureNoTabs(lines);
  return lines;
}

/** CDP parser parm file (PFPARSER.PAR) – safe defaults; allow overrides upstream */
export function emitPFPARSER(parms?: Partial<Record<string,string|number>>): string {
  const base: Record<string,string|number> = {
    STREET_PARSING_DEPTH: 9, // REQUIRED
    NO_SPECIAL_COMMA_NAME_REVERSE_SERVICE: 'N',
    NO_SPECIAL_ORDINAL_STREET_SERVICE: '',   // '', 'X', or 'Y'
    ORIGINAL_MEANINGS_OPTION: 1
  };
  const merged = {...base, ...(parms ?? {})};
  const lines = Object.entries(merged).map(([k,v]) => `${k} ${String(v).trim()}`).join('\n') + '\n';
  U.ensureNoTabs(lines);
  return lines;
}

/** Table Maintenance parm file to compile CLWDPAT + STDDEF → CLTABDEF / CLTABPAT */
export function emitPFTABMNT(opts: {
  countryCode: string;
  stddefPath: string;
  clwdpatPath: string;
  cltabdefPath: string;
  cltabpatPath: string;
}): string {
  const lines = [
    `STDDEF ${opts.stddefPath}`,
    `USERDEF ${opts.clwdpatPath}`,
    `TABLEDEF ${opts.cltabdefPath}`,
    `TABLEPAT ${opts.cltabpatPath}`
  ].join('\n') + '\n';
  U.ensureNoTabs(lines);
  return lines;
}

/** Lightweight heuristics for token suggestions from raw input. */
export function suggestIntrinsicToken(word: string): string {
  const w = word.trim();
  if (!w) return 'ALPHA';
  const isAlpha = /^[A-Za-z]+$/.test(w);
  const isNum = /^[0-9]+$/.test(w);
  const isOneAlpha = /^[A-Za-z]$/.test(w);
  const isOneNum = /^[0-9]$/.test(w);
  const hasHyphen = /-/.test(w);
  const hasSlash = /\//.test(w);
  if (isOneAlpha) return '1ALPHA';
  if (isOneNum) return '1NUMERIC';
  if (isAlpha) return 'ALPHA';
  if (isNum) return 'NUMERIC';
  if (hasHyphen || hasSlash) return 'MIXED-NUMERIC';
  return /[A-Za-z]/.test(w) && /[0-9]/.test(w) ? 'ALPHA-NUMERIC' : 'OTHER-SPECIAL';
}

export function tokenizeSample(s: string): string[] {
  return s.split(/(\s+|[-\/])/).filter(t => t && !/^\s+$/.test(t));
}
