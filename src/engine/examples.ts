/* engine/examples.ts
   Example generators for BDP and CDP patterns
*/

export interface BDPExample {
  raw: string;
  tokens: string[];
  recode: string;
}

/** Generate a noisy BDP product line with categories */
export function generateBDPExample(): BDPExample {
  const brands = ['THE NORTH FACE', 'PATAGONIA', 'NIKE', 'ADIDAS', "LEVI'S", "ARC'TERYX"];
  const colors = ['BLK', 'BLK', 'BLK', 'NVY', 'NVY', 'NVY', 'RED', 'WHT', 'GRN'];
  const products = ['JACKET', 'TEE', 'HOODIE', 'PANTS', 'BACKPACK', 'SNEAKERS'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const year = String(2008 + Math.floor(Math.random() * 16));
  const brand = brands[Math.floor(Math.random() * brands.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const prod = products[Math.floor(Math.random() * products.length)];
  const size = sizes[Math.floor(Math.random() * sizes.length)];
  const sku = (10000 + Math.floor(Math.random() * 89999)).toString();
  
  const pieces = [Math.random() < 0.6 ? 'SKU' : 'ITEM', sku, prod, size, color, brand];
  if (Math.random() < 0.3) pieces.splice(2, 0, year);
  
  const raw = pieces.join(' ').replace(/ \//g, '/').replace(/ -/g, '-');
  
  const tokens = raw.split(/\s+/).map(w => {
    if (/^\d{4}$/.test(w)) return 'YEAR';
    if (/^\d{5}$/.test(w)) return 'SKU';
    if (['XS', 'S', 'M', 'L', 'XL', '2XL'].includes(w)) return 'SIZE';
    if (['BLK', 'NVY', 'RED', 'WHT', 'GRN'].includes(w)) return 'COLOR';
    return /^[A-Z]+$/.test(w) ? 'PRODUCT' : 'ALPHA';
  });
  
  const recode = tokens.join(' ');
  return { raw, tokens, recode };
}

/** Generate a tricky business name for CDP testing */
export function generateCDPBusinessName(): string {
  const heads = ['THE', 'A', 'GLOBAL', 'NATIONAL', 'INTERNATIONAL', 'OLD', 'NEW'];
  const bodies = ['NORTH', 'SOUTH', 'ACME', 'DELTA', 'H&M', 'AT&T', '3M', "O'REILLY", 'SMITH & SONS', 'NORTH-FACE'];
  const tails = ['LLC', 'INC', 'CO', 'LTD', 'GROUP', 'HOLDINGS'];
  
  const h = Math.random() < 0.5 ? heads[Math.floor(Math.random() * heads.length)] + ' ' : '';
  const b = bodies[Math.floor(Math.random() * bodies.length)];
  const t = Math.random() < 0.8 ? ', ' + tails[Math.floor(Math.random() * tails.length)] : '';
  
  return `${h}${b}${t}`.replace(/\s+,/g, ',');
}

/** Predefined examples */
export const EXAMPLES = {
  bdp: {
    vehicle: {
      raw: '2008 FORD FOCUS 2-DOOR HATCHBACK',
      tokens: ['YEAR', 'MAKE', 'MODEL', 'MODEL', 'MODEL'],
      recode: 'YEAR MAKE MODEL MODEL MODEL'
    },
    apparel: {
      raw: 'SKU 18435 JACKET L NVY THE NORTH FACE',
      tokens: ['SKU', 'SKU', 'PRODUCT', 'SIZE', 'COLOR', 'BRAND', 'BRAND', 'BRAND'],
      recode: 'SKU SKU PRODUCT SIZE COLOR BRAND BRAND BRAND'
    }
  },
  cdp: {
    businessName: {
      raw: 'THE NORTH-FACE, LLC',
      tokens: ['BUS?', 'ALPHA', 'HYPHEN', 'ALPHA', 'B-DES'],
      recode: 'BUS(1) BUS(2) BUS(3) BUS(4) B-DES(1)'
    }
  }
};

/** Generate a CDP pattern from name fields */
export function nameToPattern(params: {
  first?: string;
  middle?: string;
  last?: string;
  title?: string;
  generation?: string;
}): { tokens: string[]; rec: string; raw: string } {
  const { first, middle, last, title, generation } = params;
  const tokens: string[] = [];
  const recParts: string[] = [];
  const rawParts: string[] = [];
  
  let idx = 1;
  if (title) {
    tokens.push('ALPHA');
    recParts.push(`TTLP(${idx})`);
    rawParts.push(title);
    idx++;
  }
  if (first) {
    tokens.push('ALPHA');
    recParts.push(`GVN-NM1(${idx})`);
    rawParts.push(first);
    idx++;
  }
  if (middle) {
    tokens.push('ALPHA');
    recParts.push(`GVN-NM2(${idx})`);
    rawParts.push(middle);
    idx++;
  }
  if (last) {
    tokens.push('ALPHA');
    recParts.push(`SRNM(${idx})`);
    rawParts.push(last);
    idx++;
  }
  if (generation) {
    tokens.push('ALPHA');
    recParts.push(`GENR(${idx})`);
    rawParts.push(generation);
  }
  
  return {
    tokens,
    rec: recParts.join(' '),
    raw: rawParts.join(' ')
  };
}
