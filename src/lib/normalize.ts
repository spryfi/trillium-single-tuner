// Replace hyphens between letters with single spaces; trim + tidy commas/spaces.
export function removeLetterHyphens(raw: string): string {
  return raw
    .replace(/([A-Za-z])[-–—]([A-Za-z])/g, '$1 $2')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+,/g, ',')
    .trim();
}

// -------- REC helpers --------
export function parseRec(rec: string): Array<{attr:string; idx:number}> {
  if (!rec) return [];
  const s = rec.trim().replace(/^REC\s*=\s*'/i,'').replace(/'$/,'');
  if (!s) return [];
  return s.split(/\s+/).map(piece => {
    const m = /^([A-Z0-9\-]+)\((\d+)\)$/.exec(piece);
    if (!m) throw new Error(`Invalid REC piece: ${piece}`);
    return { attr: m[1], idx: Number(m[2]) };
  });
}

export function emitRec(parts: Array<{attr:string; idx:number}>): string {
  return `REC='${parts.map(p => `${p.attr}(${p.idx})`).join(' ')}'`;
}

/** Reindex after removing 1-based token positions in removeAt (e.g., [3] for HYPHEN). */
export function reindexRec(rec: string, removeAt: number[]): string {
  const parts = parseRec(rec);
  if (!removeAt.length || !parts.length) return rec;
  const removed = new Set(removeAt);
  const shifted = parts
    .filter(p => !removed.has(p.idx))
    .map(p => {
      const shift = removeAt.filter(x => x < p.idx).length;
      return { attr: p.attr, idx: p.idx - shift };
    });
  return emitRec(shifted);
}
