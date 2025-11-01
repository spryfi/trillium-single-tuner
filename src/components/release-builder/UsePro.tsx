import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import { ProModeSelector, ProMode } from './ProModeSelector';
import { ProThinkingPanel } from './ProThinkingPanel';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UseProProps {
  engine: 'CDP' | 'BDP';
  lineType: 'NAME' | 'STREET' | 'MISC';
  rawInput: string;
  tokens: string[];
  rec?: string;
  recode?: string;
  onApply: (tokens: string[], recOrRecode: string, normalization?: any) => void;
}

interface ProResponse {
  engine: 'CDP' | 'BDP';
  lineType: 'NAME' | 'STREET' | 'MISC';
  inboundTokens: string[];
  rec: string | null;
  recode: string | null;
  warnings: string[];
  actions?: Array<{ type: string; payload: any }>;
  normalization?: {
    query: string;
    normalizedName: string;
    keepHyphen: boolean;
    sources: Array<{ title: string; url: string }>;
    rationale: string;
  };
}

export const UsePro = ({ engine, lineType, rawInput, tokens, rec, recode, onApply }: UseProProps) => {
  const [mode, setMode] = useState<ProMode>('validate');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ProResponse | null>(null);
  const [thinkingMessages, setThinkingMessages] = useState<string[]>([]);
  const [customQuestion, setCustomQuestion] = useState('');

  const handleUsePro = async () => {
    if (!isSupabaseConfigured()) {
      toast.error('Backend not configured. Please enable Lovable Cloud to use GPT-5 PRO features.');
      return;
    }

    if (!rawInput.trim()) {
      toast.error('Enter raw input first');
      return;
    }

    setLoading(true);
    setThinkingMessages(['Starting GPT-5 PRO analysis...']);
    setResponse(null);

    try {
      const res = await supabase.functions.invoke('pro-analyze', {
        body: {
          mode,
          engine,
          lineType,
          rawInput: rawInput.trim(),
          inboundTokens: tokens.map(t => t.toUpperCase()),
          rec,
          recode,
          question: customQuestion
        }
      });

      if (res.error) throw res.error;

      // Parse the streaming response
      const reader = res.data;
      if (typeof reader === 'string') {
        // Non-streaming response
        const parsed = JSON.parse(reader);
        setResponse(parsed);
        toast.success('Pro analysis complete');
      } else {
        toast.success('Pro analysis complete');
      }
    } catch (error) {
      console.error('Pro error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get Pro analysis');
    } finally {
      setLoading(false);
    }
  };

  const saveNormalization = async (norm: ProResponse['normalization']) => {
    if (!norm) return;

    try {
      const { error } = await supabase.from('normalized_names').insert({
        query: norm.query,
        normalized: norm.normalizedName,
        keep_hyphen: norm.keepHyphen,
        sources: norm.sources,
        rationale: norm.rationale
      });

      if (error) throw error;
      toast.success('Normalization saved');
    } catch (error) {
      console.error('Save normalization error:', error);
      toast.error('Failed to save normalization');
    }
  };

  const handleApply = async () => {
    if (!response) return;
    const recOrRecode = engine === 'CDP' ? response.rec : response.recode;
    if (recOrRecode) {
      // Save normalization if present
      if (response.normalization) {
        await saveNormalization(response.normalization);
      }
      
      onApply(response.inboundTokens, recOrRecode, response.normalization);
      toast.success('Applied Pro suggestion');
      setResponse(null);
    }
  };

  return (
    <div className="space-y-4">
      {!isSupabaseConfigured() && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">
            GPT-5 PRO requires Lovable Cloud to be enabled. Please enable it in your project settings to use these features.
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <Label className="text-xs mb-2 block">Pro Mode</Label>
        <ProModeSelector mode={mode} onChange={setMode} />
      </div>

      {mode === 'research' && (
        <div>
          <Label htmlFor="customQuestion" className="text-xs">
            Custom Question (optional)
          </Label>
          <Textarea
            id="customQuestion"
            value={customQuestion}
            onChange={(e) => setCustomQuestion(e.target.value)}
            placeholder="e.g., Should we keep the hyphen in THE NORTH-FACE?"
            className="mt-1 text-sm"
            rows={2}
          />
        </div>
      )}

      <Button
        type="button"
        onClick={handleUsePro}
        disabled={loading}
        variant="outline"
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing with GPT-5 PRO...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Use GPT-5 PRO
          </>
        )}
      </Button>

      <ProThinkingPanel messages={thinkingMessages} isActive={loading} />

      {response && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-sm">Pro Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {response.warnings && response.warnings.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-2">
                <p className="text-xs font-medium mb-1">Warnings:</p>
                <ul className="text-xs space-y-1">
                  {response.warnings.map((w, idx) => (
                    <li key={idx} className="text-yellow-800 dark:text-yellow-200">⚠ {w}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="text-xs font-medium mb-1">Tokens:</p>
              <p className="text-sm font-mono bg-muted p-2 rounded">
                {response.inboundTokens.join(' ')}
              </p>
            </div>

            {engine === 'CDP' && response.rec && (
              <div>
                <p className="text-xs font-medium mb-1">REC:</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">{response.rec}</p>
              </div>
            )}

            {engine === 'BDP' && response.recode && (
              <div>
                <p className="text-xs font-medium mb-1">RECODE:</p>
                <p className="text-sm font-mono bg-muted p-2 rounded">{response.recode}</p>
              </div>
            )}

            {response.normalization && (
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-medium">Normalization Research:</p>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Query:</span> {response.normalization.query}</p>
                  <p><span className="font-medium">Normalized:</span> {response.normalization.normalizedName}</p>
                  <p><span className="font-medium">Keep Hyphen:</span> {response.normalization.keepHyphen ? 'Yes' : 'No'}</p>
                  <p className="text-xs text-muted-foreground">{response.normalization.rationale}</p>
                </div>
                {response.normalization.sources && response.normalization.sources.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1">Sources:</p>
                    <ul className="text-xs space-y-1">
                      {response.normalization.sources.map((src, idx) => (
                        <li key={idx}>
                          <a 
                            href={src.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {src.title} <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <Button onClick={handleApply} size="sm" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Apply to Pattern
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
