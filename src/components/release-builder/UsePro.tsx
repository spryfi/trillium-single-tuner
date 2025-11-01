import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileSearch, Wand2, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProThinkingPanel } from './ProThinkingPanel';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UseProProps {
  engine: 'CDP' | 'BDP';
  lineType: 'NAME' | 'STREET' | 'MISC';
  rawInput: string;
  tokens: string[];
  rec?: string;
  recode?: string;
  onApply: (tokens: string[], recOrRecode: string, normalization?: any) => void;
}

export const UsePro = ({ engine, lineType, rawInput, tokens, rec, recode, onApply }: UseProProps) => {
  const [loading, setLoading] = useState(false);
  const [thinkingMessages, setThinkingMessages] = useState<string[]>([]);
  const [showSources, setShowSources] = useState(false);
  const [sourcesData, setSourcesData] = useState<any>(null);

  const handleResearchNormalization = async () => {
    if (!rawInput.trim()) {
      toast.error('Enter raw input first');
      return;
    }

    setLoading(true);
    setThinkingMessages(['Researching normalization...']);
    
    try {
      const res = await supabase.functions.invoke('pro-normalize', {
        body: {
          mode: 'research',
          engine,
          lineType,
          rawInput: rawInput.trim(),
          inboundTokens: tokens.map(t => t.toUpperCase()),
          rec,
          meta: { releaseId: null, tuneId: null, countryCode: 'US' }
        }
      });

      if (res.error) throw res.error;
      const j = res.data;

      if (j.error) throw new Error(j.error);

      // Apply edits to UI
      const updatedTokens = j.applyEdits?.inboundTokens || tokens;
      const updatedRec = j.applyEdits?.rec || rec;
      const updatedRawInput = j.applyEdits?.rawInput || j.normalizedName;

      // Save to normalized_names
      await supabase.from('normalized_names').insert({
        query: rawInput,
        normalized: updatedRawInput,
        keep_hyphen: !!j.keepHyphen,
        sources: j.sources || [],
        rationale: j.rationale || null
      });

      // Update parent component
      onApply(updatedTokens, updatedRec);

      // Show sources panel
      setSourcesData({
        normalizedName: updatedRawInput,
        keepHyphen: j.keepHyphen,
        sources: j.sources,
        rationale: j.rationale
      });
      setShowSources(true);

      toast.success('Normalized and applied');
    } catch (err: any) {
      console.error('Normalization error:', err);
      toast.error(err.message || 'Normalization error');
    } finally {
      setLoading(false);
    }
  };

  const handleExplainTokens = async () => {
    if (!rawInput.trim()) {
      toast.error('Enter raw input first');
      return;
    }

    setLoading(true);
    try {
      const res = await supabase.functions.invoke('pro-validate', {
        body: {
          mode: 'validate',
          engine,
          lineType,
          rawInput: rawInput.trim(),
          inboundTokens: tokens.map(t => t.toUpperCase()),
          rec,
          recode
        }
      });

      if (res.error) throw res.error;
      const j = res.data;

      if (j.error) throw new Error(j.error);

      if (j.suggestions?.inboundTokens) {
        onApply(j.suggestions.inboundTokens, rec || recode || '');
      }

      setSourcesData({
        title: 'Token Analysis',
        issues: j.issues,
        notes: j.notes
      });
      setShowSources(true);
      
      toast.success('Token analysis complete');
    } catch (err: any) {
      console.error('Token explain error:', err);
      toast.error(err.message || 'Failed to explain tokens');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoMapRec = async () => {
    if (!rawInput.trim()) {
      toast.error('Enter raw input first');
      return;
    }

    setLoading(true);
    try {
      const res = await supabase.functions.invoke('pro-validate', {
        body: {
          mode: 'repair',
          engine,
          lineType,
          rawInput: rawInput.trim(),
          inboundTokens: tokens.map(t => t.toUpperCase()),
          rec
        }
      });

      if (res.error) throw res.error;
      const j = res.data;

      if (j.error) throw new Error(j.error);

      if (j.suggestions?.rec) {
        onApply(tokens, j.suggestions.rec);
        toast.success('REC mapping suggested');
      } else if (j.suggestions?.recode) {
        onApply(tokens, j.suggestions.recode);
        toast.success('RECODE mapping suggested');
      } else {
        toast.info('No suggestions available');
      }
    } catch (err: any) {
      console.error('Auto-map error:', err);
      toast.error(err.message || 'Failed to auto-map');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <TooltipProvider>
        <div className="space-y-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleResearchNormalization}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Researching...
                  </>
                ) : (
                  <>
                    <FileSearch className="h-4 w-4 mr-2" />
                    Research Normalization
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                AI researches the correct business name normalization, decides punctuation policy, and updates your input automatically.
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleExplainTokens}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Explain Tokens (AI)
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                AI analyzes your tokens and suggests improvements. These describe the pieces of your input (ALPHA, NUMERIC, HYPHEN, etc.).
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleAutoMapRec}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {engine === 'CDP' ? 'Auto-Map REC (AI)' : 'Generate RECODE (AI)'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                {engine === 'CDP' 
                  ? 'AI maps tokens to output fields (e.g., GVN-NM1, SRNM). This tells the parser which token fills which field.'
                  : 'AI generates the RECODE line for BDP patterns, listing output categories (e.g., YEAR MAKE MODEL).'}
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <ProThinkingPanel messages={thinkingMessages} isActive={loading} />

      <Sheet open={showSources} onOpenChange={setShowSources}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{sourcesData?.title || 'Normalization Results'}</SheetTitle>
            <SheetDescription>
              Research findings and sources
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            {sourcesData?.normalizedName && (
              <>
                <div>
                  <p className="text-sm font-medium">Normalized:</p>
                  <p className="text-sm mt-1">{sourcesData.normalizedName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Keep Hyphen:</p>
                  <p className="text-sm mt-1">{sourcesData.keepHyphen ? 'Yes' : 'No'}</p>
                </div>
                {sourcesData.rationale && (
                  <div>
                    <p className="text-sm font-medium">Rationale:</p>
                    <p className="text-sm mt-1 text-muted-foreground">{sourcesData.rationale}</p>
                  </div>
                )}
                {sourcesData.sources && sourcesData.sources.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Sources:</p>
                    <ul className="space-y-2">
                      {sourcesData.sources.map((src: any, idx: number) => (
                        <li key={idx}>
                          <a 
                            href={src.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {src.title} <ExternalLink className="h-3 w-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            {sourcesData?.issues && (
              <div>
                <p className="text-sm font-medium mb-2">Issues:</p>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {sourcesData.issues.map((issue: string, idx: number) => (
                    <li key={idx}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            {sourcesData?.notes && (
              <div>
                <p className="text-sm font-medium mb-2">Notes:</p>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  {sourcesData.notes.map((note: string, idx: number) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
