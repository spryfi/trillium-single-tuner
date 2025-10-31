import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TokenChip } from './TokenChip';
import { RecEditor } from './RecEditor';
import { TunePreview } from './TunePreview';
import { AnyPattern, CDPPattern, BDPPattern, tokenizeSample, suggestIntrinsicToken, LINE_TYPES } from '@/engine/patterns';
import { Sparkles, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface BuildTuneFormProps {
  onAddToQueue: (pattern: AnyPattern) => void;
  defaultCountryCode: string;
}

export const BuildTuneForm = ({ onAddToQueue, defaultCountryCode }: BuildTuneFormProps) => {
  const [engine, setEngine] = useState<'CDP' | 'BDP'>('CDP');
  const [lineType, setLineType] = useState<'NAME' | 'STREET' | 'MISC'>('NAME');
  const [countryCode, setCountryCode] = useState(defaultCountryCode);
  const [rawInput, setRawInput] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [recode, setRecode] = useState<{ attr: string; index: number }[]>([]);
  const [recodeLiteral, setRecodeLiteral] = useState('');
  const [comment, setComment] = useState('');

  const handleTokenAssist = () => {
    if (!rawInput.trim()) {
      toast.error('Enter a sample input first');
      return;
    }
    const words = tokenizeSample(rawInput);
    const suggested = words.map(suggestIntrinsicToken);
    setTokens(suggested);
    setRecode(suggested.map((_, i) => ({ attr: 'GVN-NM1', index: i + 1 })));
    toast.success('Tokens suggested from input');
  };

  const handleAddToken = () => {
    setTokens([...tokens, 'ALPHA']);
  };

  const handleUpdateToken = (idx: number, newToken: string) => {
    const updated = [...tokens];
    updated[idx] = newToken;
    setTokens(updated);
  };

  const handleRemoveToken = (idx: number) => {
    setTokens(tokens.filter((_, i) => i !== idx));
  };

  const currentPattern = (): AnyPattern | null => {
    if (tokens.length === 0) return null;
    
    if (engine === 'CDP') {
      return {
        engine: 'CDP',
        countryCode,
        lineType,
        inboundTokens: tokens,
        recode,
        comment: comment || undefined
      } as CDPPattern;
    } else {
      return {
        engine: 'BDP',
        countryCode,
        lineType: 'MISC',
        inboundTokens: tokens,
        recodeLiteral,
        comment: comment || undefined
      } as BDPPattern;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pattern = currentPattern();
    if (!pattern) {
      toast.error('Configure pattern first');
      return;
    }
    
    try {
      onAddToQueue(pattern);
      // Reset form
      setRawInput('');
      setTokens([]);
      setRecode([]);
      setRecodeLiteral('');
      setComment('');
      toast.success('Added to queue');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add tune');
    }
  };

  const handleReset = () => {
    setRawInput('');
    setTokens([]);
    setRecode([]);
    setRecodeLiteral('');
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Build Tune</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Engine</label>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value as 'CDP' | 'BDP')}
                className="w-full px-3 py-2 border rounded bg-background"
              >
                <option value="CDP">CDP</option>
                <option value="BDP">BDP</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Line Type</label>
              <select
                value={lineType}
                onChange={(e) => setLineType(e.target.value as typeof lineType)}
                disabled={engine === 'BDP'}
                className="w-full px-3 py-2 border rounded bg-background disabled:opacity-50"
              >
                {LINE_TYPES.map(lt => (
                  <option key={lt} value={lt}>{lt}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Country Code</label>
              <input
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full px-3 py-2 border rounded bg-background"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Raw Input (Optional)</label>
            <Textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g., JOHN SMITH or 123 MAIN STREET"
              className="font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTokenAssist}
              className="mt-2"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Token Assist
            </Button>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Inbound Tokens</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tokens.map((token, idx) => (
                <TokenChip
                  key={idx}
                  token={token}
                  onTokenChange={(newToken) => handleUpdateToken(idx, newToken)}
                  onRemove={() => handleRemoveToken(idx)}
                />
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddToken}
            >
              Add Token
            </Button>
          </div>

          {engine === 'CDP' ? (
            <RecEditor
              recode={recode}
              tokenCount={tokens.length}
              onChange={setRecode}
            />
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">REC Literal</label>
              <input
                type="text"
                value={recodeLiteral}
                onChange={(e) => setRecodeLiteral(e.target.value)}
                placeholder="e.g., NORTH FACE"
                className="w-full px-3 py-2 border rounded bg-background font-mono"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Comment (Optional)</label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Description of this pattern"
              className="w-full px-3 py-2 border rounded bg-background"
            />
          </div>
        </CardContent>
      </Card>

      <TunePreview pattern={currentPattern()} />

      <div className="flex gap-2">
        <Button type="submit" size="lg">
          Add to Queue
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </form>
  );
};
