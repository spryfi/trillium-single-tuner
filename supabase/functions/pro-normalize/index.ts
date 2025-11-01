import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Minimal JSON validator
function isObj(x: any): boolean {
  return x && typeof x === 'object' && !Array.isArray(x);
}

function validateResponse(o: any) {
  if (!isObj(o)) throw new Error('Bad JSON');
  if (typeof o.normalizedName !== 'string') throw new Error('normalizedName missing');
  if (typeof o.keepHyphen !== 'boolean') throw new Error('keepHyphen missing');
  if (o.applyEdits) {
    if (!isObj(o.applyEdits)) throw new Error('applyEdits must be object');
    if (o.applyEdits.rawInput && typeof o.applyEdits.rawInput !== 'string') 
      throw new Error('applyEdits.rawInput must be string');
    if (o.applyEdits.inboundTokens && !Array.isArray(o.applyEdits.inboundTokens)) 
      throw new Error('applyEdits.inboundTokens must be array');
    if (o.applyEdits.rec && typeof o.applyEdits.rec !== 'string') 
      throw new Error('applyEdits.rec must be string');
  }
  if (o.sources && !Array.isArray(o.sources)) throw new Error('sources must be array');
  return o;
}

const PRO_PREPROMPT = `
You are GPT‑5 PRO, a Trillium v7.15–7.16 tuning expert.
Return ONLY compact JSON per schema: { normalizedName, keepHyphen, applyEdits?, sources?, rationale? }.
Hard constraints: CDP uses REC='…'; BDP uses 3 lines with RECODE='…'; no = ' " , inside REC/RECODE quotes;
max line length 120 chars; max single token 100 chars; no tabs.
Task: Given a business name string, decide punctuation policy (keep/remove hyphen/&/'/slash) based on registered legal
name and enterprise data-quality practice. Provide sources. If confident, include applyEdits { rawInput, inboundTokens, rec }.
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { engine, lineType, rawInput, inboundTokens, rec, meta } = payload ?? {};
    
    const userMsg = JSON.stringify({
      engine, 
      lineType, 
      rawInput, 
      inboundTokens, 
      rec,
      ask: "Normalize business/legal name; decide hyphen policy; provide applyEdits."
    });

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: PRO_PREPROMPT },
          { role: 'user', content: userMsg }
        ]
      })
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error('OpenAI error:', r.status, errText);
      return new Response(JSON.stringify({ error: errText }), { 
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const data = await r.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty model response');

    const parsed = validateResponse(JSON.parse(content));

    // Store in pro_sessions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('pro_sessions').insert({
      mode: 'research',
      request: payload,
      response: parsed
    });

    return new Response(JSON.stringify(parsed), {
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('Normalize error:', e);
    return new Response(JSON.stringify({ error: e?.message ?? 'Normalize failed' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
