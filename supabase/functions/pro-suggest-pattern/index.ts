import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { engine, rawInput, tokens, lineType } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const system = [
      "You are a Trillium Parser Tuning expert.",
      "When engine=CDP: return a REC mapping like GVN-NM1(1) SRNM(1).",
      "When engine=BDP: return a three-line pattern and a RECODE='…' line.",
      "Never include =, quotes, or commas inside the REC/RECODE quotes.",
      "Only use valid line types: CDP(NAME|STREET|MISC), BDP(MISC).",
      "Valid CDP NAME attributes: GVN-NM1, GVN-NM2, SRNM, TTLP, TTLS, GENR, BUS, BUS?, ATTN, CTR.",
      "Valid CDP STREET attributes: HSNO, STR-NM, STR-TYPE, DIR, APT, APT-NUM, CITY, STATE, PCODE.",
      "Valid intrinsic tokens: ALPHA, NUMERIC, ALPHA-NUMERIC, 1ALPHA, 1NUMERIC, HYPHEN, MIXED-NUMERIC.",
      "BDP categories are user-defined (YEAR, MAKE, MODEL, BRAND, SIZE, COLOR, SKU, PRODUCT, etc.)."
    ].join(' ');

    const user = `
Engine: ${engine}
LineType: ${lineType}
RawInput: ${rawInput}
CurrentTokens: ${tokens.join(' ')}

Analyze this input and suggest the best token sequence and mapping.
Return JSON with this exact structure:
{
  "inboundTokens": string[],          // uppercase tokens
  "rec": string | null,               // CDP only, e.g. "GVN-NM1(1) SRNM(1)"
  "recode": string | null,            // BDP only, e.g. "YEAR MAKE MODEL"
  "explanations": string[]            // 2-3 short bullet points explaining the choices
}
    `.trim();

    console.log('Calling OpenAI with:', { engine, lineType, rawInput, tokens });

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAIApiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('OpenAI error:', resp.status, text);
      throw new Error(`OpenAI API error: ${resp.status}`);
    }

    const data = await resp.json();
    const content = JSON.parse(data.choices[0].message.content);
    
    console.log('OpenAI response:', content);

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in pro-suggest-pattern:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
