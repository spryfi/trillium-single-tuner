import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileSearch, Wand2, Sparkles, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProThinkingPanel } from './ProThinkingPanel';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { removeLetterHyphens, reindexRec } from '@/lib/normalize';

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
  const [showFixNamePanel, setShowFixNamePanel] = useState(false);
  const [fixNameResults, setFixNameResults] = useState<any>(null);

  const handleResearchNormalization = async () => {
    if (!rawInput.trim()) {
      toast.error('Enter raw input first');
      return;
    }

    const prev = { rawInput, tokens: [...tokens], rec };
    setLoading(true);
    setThinkingMessages(['Researching normalization...']);
    
    try {
      const res = await supabase.functions.invoke('pro-normalize', {
        body: {
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

      // 1) Choose source of truth for new raw text
      let nextRaw = j.applyEdits?.rawInput || j.normalizedName || rawInput;

      // 2) If the model says keepHyphen=false but didn't supply edits, do the fallback
      let nextTokens = Array.isArray(j.applyEdits?.inboundTokens) ? j.applyEdits.inboundTokens : tokens;
      let nextRec = typeof j.applyEdits?.rec === 'string' ? j.applyEdits.rec : rec;

      if (j.keepHyphen === false) {
        // local fallback changes (safe no-ops if not needed)
        nextRaw = removeLetterHyphens(nextRaw);
        // remove any HYPHEN chips that exist
        const removeIdx: number[] = [];
        nextTokens = nextTokens.filter((tok, i) => {
          const keep = tok.toUpperCase() !== 'HYPHEN';
          if (!keep) removeIdx.push(i + 1); // 1-based
          return keep;
        });
        if (removeIdx.length && nextRec) nextRec = reindexRec(nextRec, removeIdx);
      }

      // 3) Apply to UI
      onApply(nextTokens.map((t: string) => t.toUpperCase()), nextRec || '');

      // 4) Persist research
      await supabase.from('normalized_names').insert({
        query: prev.rawInput,
        normalized: nextRaw,
        keep_hyphen: !!j.keepHyphen,
        sources: j.sources || [],
        rationale: j.rationale || null
      });

      // 5) Operator feedback
      toast.success(`Normalized: ${nextRaw}`);
      setSourcesData({
        normalizedName: nextRaw,
        keepHyphen: j.keepHyphen,
        sources: j.sources || [],
        rationale: j.rationale || 'Applied normalization based on PRO research.'
      });
      setShowSources(true);
    } catch (err: any) {
      // Never blank the screen—restore and show error
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

  const handleFixNamePattern = async () => {
    if (!rec) {
      toast.error('REC mapping is required');
      return;
    }

    setLoading(true);
    setThinkingMessages(['Analyzing NAME pattern structure...']);

    try {
      const res = await supabase.functions.invoke('pro-fix-name-pattern', {
        body: { rawInput, inboundTokens: tokens, rec }
      });

      if (res.error) throw res.error;
      const j = res.data;

      if (j.error) throw new Error(j.error);

      setFixNameResults(j);
      setShowFixNamePanel(true);
      
      toast.success('NAME pattern analysis complete');
    } catch (err: any) {
      console.error('Fix NAME pattern error:', err);
      toast.error(err.message || 'Failed to analyze NAME pattern');
    } finally {
      setLoading(false);
    }
  };

  const applyFixedNamePattern = () => {
    if (!fixNameResults) return;

    const { inboundTokens: newTokens, rec: newRec } = fixNameResults;
    
    if (Array.isArray(newTokens)) {
      onApply(newTokens, newRec || rec || '');
      toast.success('Applied corrected NAME pattern');
    }
    
    setShowFixNamePanel(false);
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

          {/* Fix NAME Pattern Button - Only for CDP NAME patterns */}
          {engine === 'CDP' && lineType === 'NAME' && rec && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  onClick={handleFixNamePattern}
                  disabled={loading}
                  variant="outline"
                  className="w-full"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  Fix NAME Pattern (PRO)
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Validates NAME pattern structure and corrects multi-token surnames (e.g., "DE LA ROSA" → repeat SRNM(1))
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TooltipProvider>

      <ProThinkingPanel messages={thinkingMessages} isActive={loading} />

      {/* Fix NAME Pattern Results Panel */}
      <Sheet open={showFixNamePanel} onOpenChange={setShowFixNamePanel}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>NAME Pattern Analysis</SheetTitle>
          </SheetHeader>
          
          {fixNameResults && (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-sm mb-2">Explanation</h3>
                <p className="text-sm text-muted-foreground">{fixNameResults.explanation}</p>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Corrected Pattern</h3>
                <pre className="text-xs bg-muted p-3 rounded whitespace-pre-wrap font-mono">
                  {fixNameResults.correctPatternTwoLine}
                </pre>
              </div>

              {fixNameResults.inboundTokens && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Token Sequence</h3>
                  <div className="flex flex-wrap gap-2">
                    {fixNameResults.inboundTokens.map((tok: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-primary/10 text-xs rounded">
                        {tok}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {fixNameResults.rec && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">REC Mapping</h3>
                  <code className="text-xs bg-muted p-2 rounded block">
                    {fixNameResults.rec}
                  </code>
                </div>
              )}

              <Button onClick={applyFixedNamePattern} className="w-full">
                Apply Corrected Pattern
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

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
