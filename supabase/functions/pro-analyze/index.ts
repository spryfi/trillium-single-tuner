import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const PRO_PREPROMPT = `You are GPT‑5 PRO, acting as an enterprise data-quality specialist and Trillium engineer.
Environment: Precisely Trillium System v7.15–v7.16 (IBM mainframe compatible).

HARD CONSTRAINTS you MUST enforce:
• CDP patterns use 1–2 lines. Example:
  '<TOKENS>' PATTERN NAME|STREET|MISC DEF
  REC='ATTR(INDEX) ATTR(INDEX) ...'
• BDP patterns use 3 lines and the fixed second line:
  '<TOKENS>'
  PATTERN MISC DEF
  RECODE='CATEGORY CATEGORY ...'
• Do NOT include the following inside the single-quoted REC/RECODE value: = ' " ,
• Maximum line length for Table Maintenance entries is 120 characters (including newline).
• Maximum length of any single token is 100 characters; tokens cannot wrap to a second line.
• Valid CDP line types: NAME, STREET, MISC. BDP must use MISC.
• Attribute and mask names must match Precisely nomenclature (e.g., GVN-NM1, GVN-NM2, SRNM; and intrinsic masks like ALPHA, NUMERIC, HYPHEN).
• No tabs. Emit spaces only. Always end files with a newline.

YOUR MISSION:
1) Validate or produce a syntactically correct pattern that compiles under Trillium v7.15–7.16.
2) Keep inbound token line(s) concise and within the 120-char limit; avoid overly long tokens (100-char max per token).
3) For "Normalization" questions: determine the likely registered legal entity name and advise punctuation policy (keep/remove hyphen/ampersand/apostrophe), citing authoritative sources (SEC/state registries/brand & trademark pages).
4) Return structured JSON ONLY (see schema below) plus short operator notes. Never exceed the above constraints.

JSON SCHEMA TO RETURN:
{
  "engine": "CDP" | "BDP",
  "lineType": "NAME" | "STREET" | "MISC",
  "inboundTokens": [ "ALPHA", "HYPHEN", "GVN-NM1", ... ],
  "rec": "GVN-NM1(1) SRNM(1)" | null,
  "recode": "YEAR MAKE MODEL" | null,
  "warnings": [ "string", ... ],
  "actions": [ { "type":"replaceTokens"|"updateRec"|"updateRecode"|"normalizeName", "payload": {...} } ],
  "normalization": {
    "query": "THE NORTH-FACE, LLC",
    "normalizedName": "THE NORTH FACE LLC",
    "keepHyphen": false,
    "sources": [ {"title":"SEC filing", "url":"..."}, {"title":"Trademark", "url":"..."} ],
    "rationale": "short operator-facing explanation"
  }
}`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { mode, engine, lineType, rawInput, inboundTokens, rec, recode, question } = body;

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const sys = `${PRO_PREPROMPT}\nMODE: ${mode}`;
    const user = JSON.stringify({ 
      engine, 
      lineType, 
      rawInput, 
      inboundTokens, 
      rec, 
      recode, 
      question: question || `Please ${mode === 'validate' ? 'validate this pattern' : mode === 'repair' ? 'suggest repairs' : 'research normalization for this name'}` 
    });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        stream: true,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: user }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('OpenAI API error:', response.status, text);
      return new Response(JSON.stringify({ error: text }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const encoder = new TextEncoder();
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    const stream = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder.encode(`event: status\ndata: ${JSON.stringify({msg:'Starting analysis'})}\n\n`));
        
        let buffer = '';
        let contentBuffer = '';

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') continue;

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    contentBuffer += content;
                    controller.enqueue(encoder.encode(`event: delta\ndata: ${JSON.stringify({chunk: content})}\n\n`));
                  }
                } catch (e) {
                  console.error('Error parsing chunk:', e);
                }
              }
            }
          }

          // Send final content
          if (contentBuffer) {
            controller.enqueue(encoder.encode(`event: content\ndata: ${JSON.stringify({content: contentBuffer})}\n\n`));
          }

          controller.enqueue(encoder.encode(`event: done\ndata: {}\n\n`));
        } catch (error) {
          console.error('Stream error:', error);
          const errMsg = error instanceof Error ? error.message : 'Unknown stream error';
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({error: errMsg})}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error('pro-analyze error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
