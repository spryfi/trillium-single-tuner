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
    const { rawInput, inboundTokens, rec } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const system = [
      "You are GPT-5 PRO, a Precisely Trillium v7.15–v7.16 CDP expert.",
      "Follow Trillium syntax strictly:",
      "• CDP patterns: 1–2 lines. Example: 'ALPHA ALPHA' PATTERN NAME DEF  REC='GVN-NM1(1) SRNM(1)'",
      "• Parentheses after attributes are the NAME NUMBER (physical person index), not token positions.",
      "• Outbound REC entries map POSITIONALLY to inbound tokens; repeat SRNM for multi-token surnames.",
      "• Use standard attributes (GVN-NM1=first name, GVN-NM2=middle name, SRNM=surname). No = ' \" , inside REC quotes."
    ].join(' ');

    const currentPattern = `'${inboundTokens.join(' ')}' PATTERN NAME DEF\n${rec}`;
    
    const user = `
Please validate and correct this NAME pattern for one person:
Input tokens (left-to-right): ${inboundTokens.join(' | ')}
Raw input: ${rawInput}
Current pattern:
${currentPattern}

Return ONLY valid JSON with this structure:
{
  "correctPatternTwoLine": "corrected pattern with both lines",
  "explanation": "brief explanation of changes",
  "inboundTokens": ["ALPHA", "ALPHA", ...],
  "rec": "GVN-NM1(1) GVN-NM2(1) SRNM(1) SRNM(1) ..."
}
    `.trim();

    console.log('Calling OpenAI to fix NAME pattern:', { rawInput, inboundTokens, rec });

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
    console.error('Error in pro-fix-name-pattern:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
