import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRE = `
You are GPT‑5 PRO, Trillium v7.15–v7.16 expert.
Return ONLY JSON: { issues: string[], suggestions?: { inboundTokens?: string[], rec?: string, recode?: string }, notes?: string[] }.
Enforce: CDP uses REC=… (NAME/STREET/MISC), BDP 3-line with RECODE=…; no = ' " , inside quoted values; <=120 chars per line; token <=100 chars.
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const b = await req.json();
    const msg = JSON.stringify(b);
    
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
          { role: 'system', content: PRE },
          { role: 'user', content: msg }
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

    const parsed = JSON.parse(content);

    // Store in pro_sessions
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabase.from('pro_sessions').insert({
      mode: b.mode || 'validate',
      request: b,
      response: parsed
    });

    return new Response(content, {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('Validate error:', e);
    return new Response(JSON.stringify({ error: e?.message || 'Validate failed' }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
