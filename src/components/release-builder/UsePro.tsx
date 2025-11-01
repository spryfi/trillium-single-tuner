import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface UseProProps {
  engine: 'CDP' | 'BDP';
  lineType: 'NAME' | 'STREET' | 'MISC';
  rawInput: string;
  tokens: string[];
  onApply: (tokens: string[], recOrRecode: string) => void;
}

interface ProResponse {
  inboundTokens: string[];
  rec: string | null;
  recode: string | null;
  explanations: string[];
}

export const UsePro = ({ engine, lineType, rawInput, tokens, onApply }: UseProProps) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ProResponse | null>(null);

  const handleUsePro = async () => {
    if (!rawInput.trim()) {
      toast.error('Enter raw input first');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/pro/suggest-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          engine,
          lineType,
          rawInput: rawInput.trim(),
          tokens: tokens.map(t => t.toUpperCase())
        })
      });

      if (!res.ok) {
        throw new Error('Failed to get Pro suggestion');
      }

      const data: ProResponse = await res.json();
      setResponse(data);
      toast.success('Pro suggestion ready');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to get Pro suggestion');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!response) return;
    const recOrRecode = engine === 'CDP' ? response.rec : response.recode;
    if (recOrRecode) {
      onApply(response.inboundTokens, recOrRecode);
      toast.success('Applied Pro suggestion');
      setResponse(null);
    }
  };

  return (
    <div className="space-y-4">
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
            Getting Pro Suggestion...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Use Pro Assistant
          </>
        )}
      </Button>

      {response && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="text-sm">Pro Suggestion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
            {response.explanations && response.explanations.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1">Rationale:</p>
                <ul className="text-sm space-y-1">
                  {response.explanations.map((exp, idx) => (
                    <li key={idx} className="text-muted-foreground">• {exp}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleApply} size="sm" className="w-full">
              <ArrowRight className="h-4 w-4 mr-2" />
              Send to Builder
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
