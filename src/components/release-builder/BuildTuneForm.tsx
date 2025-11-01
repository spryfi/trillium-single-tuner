import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TokenChip } from './TokenChip';
import { RecEditor } from './RecEditor';
import { TunePreview } from './TunePreview';
import { NameParsingHelper } from './NameParsingHelper';
import { UsePro } from './UsePro';
import { AnyPattern, CDPPattern, BDPPattern, tokenizeSample, suggestIntrinsicToken, LINE_TYPES } from '@/engine/patterns';
import { generateBDPExample, generateCDPBusinessName, EXAMPLES } from '@/engine/examples';
import { Sparkles, RotateCcw, Lightbulb, Wand2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  const getPlaceholder = () => {
    if (engine === 'BDP') {
      return 'Paste one noisy business line (e.g., 2008 FORD FOCUS 2-DOOR HATCHBACK). We\'ll propose tokens and a RECODE mapping.';
    }
    if (lineType === 'NAME') {
      return 'Paste the name as currently parsed (e.g., SMITH JOHN JR). We\'ll suggest tokens and REC mapping.';
    }
    if (lineType === 'STREET') {
      return 'Paste the street address (e.g., 123 MAIN STREET APT 4B). We\'ll suggest tokens and REC mapping.';
    }
    return 'Enter a sample input for token analysis';
  };

  const handleTokenAssist = () => {
    if (!rawInput.trim()) {
      toast.error('Enter a sample input first');
      return;
    }
    const words = tokenizeSample(rawInput);
    const suggested = words.map(suggestIntrinsicToken);
    setTokens(suggested);
    
    if (engine === 'CDP') {
      setRecode(suggested.map((_, i) => ({ attr: 'GVN-NM1', index: i + 1 })));
    } else {
      setRecodeLiteral(suggested.join(' '));
    }
    
    toast.success('Tokens suggested from input');
  };

  const handleInsertExample = (type: 'bdp-vehicle' | 'bdp-apparel' | 'cdp-business') => {
    if (type === 'bdp-vehicle') {
      const ex = EXAMPLES.bdp.vehicle;
      setEngine('BDP');
      setLineType('MISC');
      setRawInput(ex.raw);
      setTokens(ex.tokens);
      setRecodeLiteral(ex.recode);
    } else if (type === 'bdp-apparel') {
      const ex = EXAMPLES.bdp.apparel;
      setEngine('BDP');
      setLineType('MISC');
      setRawInput(ex.raw);
      setTokens(ex.tokens);
      setRecodeLiteral(ex.recode);
    } else if (type === 'cdp-business') {
      const ex = EXAMPLES.cdp.businessName;
      setEngine('CDP');
      setLineType('NAME');
      setRawInput(ex.raw);
      setTokens(ex.tokens);
      setRecode(ex.tokens.map((tok, i) => ({ attr: tok, index: i + 1 })));
    }
    toast.success('Example loaded');
  };

  const handleGenerateTricky = () => {
    if (engine === 'BDP') {
      const ex = generateBDPExample();
      setRawInput(ex.raw);
      setTokens(ex.tokens);
      setRecodeLiteral(ex.recode);
      toast.success('Generated tricky BDP example');
    } else {
      const raw = generateCDPBusinessName();
      setRawInput(raw);
      toast.success('Generated tricky business name');
    }
  };

  const handleGeneratePattern = () => {
    if (tokens.length === 0) {
      toast.error('Add tokens first');
      return;
    }

    if (engine === 'BDP') {
      setRecodeLiteral(tokens.join(' '));
      toast.success('RECODE generated from tokens');
    } else {
      // CDP: safe defaults
      const newRecode = tokens.map((tok, i) => {
        if (lineType === 'NAME') {
          if (i === 0) return { attr: 'GVN-NM1', index: 1 };
          if (i === 1) return { attr: 'SRNM', index: 1 };
          return { attr: 'GVN-NM2', index: 1 };
        } else if (lineType === 'STREET') {
          if (i === 0) return { attr: 'HSNO', index: 1 };
          if (i === 1) return { attr: 'STR-NM', index: 1 };
          return { attr: 'STR-TYPE', index: 1 };
        }
        return { attr: 'ALPHA', index: 1 };
      });
      setRecode(newRecode);
      toast.success('REC mapping generated');
    }
  };

  const handleApplyNameHelper = (helperTokens: string[], rec: string, raw: string) => {
    setRawInput(raw);
    setTokens(helperTokens);
    const recParts = rec.split(' ').map(part => {
      const match = part.match(/^([A-Z-]+)\((\d+)\)$/);
      if (match) {
        return { attr: match[1], index: parseInt(match[2]) };
      }
      return { attr: part, index: 1 };
    });
    setRecode(recParts);
    toast.success('Name pattern applied');
  };

  const handleApplyPro = (proTokens: string[], recOrRecode: string) => {
    setTokens(proTokens);
    if (engine === 'CDP') {
      const recParts = recOrRecode.split(' ').map(part => {
        const match = part.match(/^([A-Z-]+)\((\d+)\)$/);
        if (match) {
          return { attr: match[1], index: parseInt(match[2]) };
        }
        return { attr: part, index: 1 };
      });
      setRecode(recParts);
    } else {
      setRecodeLiteral(recOrRecode);
    }
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
          {/* Engine explanations */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>CDP</strong> — Customer Data Parser: parses names, streets, and misc lines into structured attributes (GVN-NM1, SRNM, STR-NM).
              <br />
              <strong>BDP</strong> — Business Data Parser: maps free-form business text into categories you define (YEAR, MODEL, BRAND, etc.), outputting to BP_USERn fields.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Engine</label>
              <select
                value={engine}
                onChange={(e) => {
                  const newEngine = e.target.value as 'CDP' | 'BDP';
                  setEngine(newEngine);
                  if (newEngine === 'BDP') {
                    setLineType('MISC');
                  }
                }}
                className="w-full px-3 py-2 border rounded bg-background"
              >
                <option value="CDP">CDP</option>
                <option value="BDP">BDP</option>
              </select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Line Type
                {engine === 'BDP' && (
                  <span className="ml-1 text-xs text-muted-foreground">(BDP uses MISC)</span>
                )}
              </label>
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

          {/* BDP info card */}
          {engine === 'BDP' && (
            <Alert>
              <AlertDescription className="text-sm">
                <strong>BDP 3-line structure:</strong><br />
                Line 1: <code>'TOKEN1 TOKEN2 ...'</code><br />
                Line 2: <code>PATTERN MISC DEF</code><br />
                Line 3: <code>RECODE='CATEGORY1 CATEGORY2 ...'</code><br />
                <span className="text-muted-foreground">
                  Note: =, quotes, and commas are forbidden inside RECODE quotes.
                </span>
              </AlertDescription>
            </Alert>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Raw Input (Optional)</label>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button type="button" variant="outline" size="sm">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Insert Example
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleInsertExample('bdp-vehicle')}>
                      BDP: Vehicle (2008 FORD FOCUS...)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleInsertExample('bdp-apparel')}>
                      BDP: Apparel (SKU 18435 JACKET...)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleInsertExample('cdp-business')}>
                      CDP: Business Name (THE NORTH-FACE, LLC)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateTricky}
                >
                  <Wand2 className="h-4 w-4 mr-1" />
                  Generate Tricky
                </Button>
              </div>
            </div>
            <Textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder={getPlaceholder()}
              className="font-mono text-sm"
              rows={3}
            />
            <div className="flex gap-2 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleTokenAssist}
                    >
                      <Sparkles className="h-4 w-4 mr-1" />
                      Token Assist
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      Suggests intrinsic tokens (ALPHA, NUMERIC, HYPHEN, etc.) from your input. 
                      Click any chip to change it to a category or attribute.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGeneratePattern}
              >
                <Wand2 className="h-4 w-4 mr-1" />
                Generate Pattern
              </Button>
            </div>
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
            <>
              <RecEditor
                recode={recode}
                tokenCount={tokens.length}
                onChange={setRecode}
              />
              {lineType === 'NAME' && (
                <NameParsingHelper onApply={handleApplyNameHelper} />
              )}
            </>
          ) : (
            <div>
              <label className="text-sm font-medium mb-2 block">
                RECODE (required)
                <span className="ml-2 text-xs text-muted-foreground">
                  Third line of BDP pattern. No =, quotes, or commas inside.
                </span>
              </label>
              <input
                type="text"
                value={recodeLiteral}
                onChange={(e) => setRecodeLiteral(e.target.value)}
                placeholder="e.g., YEAR MAKE MODEL or SKU PRODUCT SIZE COLOR BRAND"
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TunePreview pattern={currentPattern()} />
        </div>
        <div>
          <UsePro
            engine={engine}
            lineType={lineType}
            rawInput={rawInput}
            tokens={tokens}
            onApply={handleApplyPro}
          />
        </div>
      </div>

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
