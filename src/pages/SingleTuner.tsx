import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { simulatePatternParse, CLWDPATPattern } from '@/utils/parserSimulator';

interface ParsedName {
  prefix?: string;
  firstName?: string;
  middle?: string;
  lastName?: string;
  generation?: string;
  businessName?: string;
}

export default function SingleTuner() {
  const { toast } = useToast();
  const [entityType, setEntityType] = useState<'person' | 'business'>('person');
  const [originalParse, setOriginalParse] = useState('');
  const [correctParse, setCorrectParse] = useState<ParsedName>({});
  const [clwdpatCode, setClwdpatCode] = useState('');
  const [parserCode, setParserCode] = useState('');
  const [parseResult, setParseResult] = useState<any>(null);

  const parsedTokens = originalParse.trim().split(/\s+/).filter(Boolean);

  const updateCorrectParse = (field: keyof ParsedName, value: string) => {
    setCorrectParse(prev => ({ ...prev, [field]: value }));
  };

  const isValidInput = () => {
    if (!originalParse.trim()) return false;
    if (entityType === 'person') {
      return !!(correctParse.firstName && correctParse.lastName);
    }
    return !!correctParse.businessName;
  };

  const generatePatterns = () => {
    const patterns: string[] = [];
    const upperOriginal = originalParse.toUpperCase().trim();
    
    patterns.push('*****************************************');
    patterns.push(`* Generated: ${new Date().toISOString().split('T')[0]}`);
    patterns.push(`* Original: ${upperOriginal}`);
    patterns.push('*****************************************');
    
    if (entityType === 'person') {
      const first = correctParse.firstName?.toUpperCase() || '';
      const last = correctParse.lastName?.toUpperCase() || '';
      
      patterns.push(`'${upperOriginal}'    INS NAME DEF ATT=PERSON,FIRST='${first}',LAST='${last}'`);
      
      const particles = ['DE', 'DEL', 'DE LA', 'DE LAS', 'DE LOS', 'VAN', 'VON', 'MAC', 'MC'];
      if (particles.some(p => last.includes(p))) {
        patterns.push(`'${last}'    INS NAME END ATT=LAST`);
      }
      
      if (correctParse.generation) {
        const gen = correctParse.generation.toUpperCase();
        patterns.push(`'${last} ${gen}'    MOD NAME END ATT=PERSON,LAST='${last}',GEN='${gen}'`);
      }
    } else {
      patterns.push(`'${upperOriginal}'    INS NAME DEF ATT=BUSINESS`);
      
      const indicators = ['LLC', 'INC', 'CORP', 'LTD', 'CO'];
      indicators.forEach(ind => {
        if (upperOriginal.includes(ind)) {
          patterns.push(`'${ind}'    INS NAME END ATT=BUSINESS`);
        }
      });
    }
    
    setClwdpatCode(patterns.join('\n'));
    
    const maxParts = parsedTokens.length;
    if (maxParts > 10) {
      const config = [
        '****************************************************',
        '* Parser Configuration Updates Required',
        '****************************************************',
        '',
        `MAX_NUMB_NAMES          ${Math.max(maxParts, 15)}`
      ];
      setParserCode(config.join('\n'));
    } else {
      setParserCode('');
    }
    
    simulateResult(patterns);
    
    toast({
      title: "Patterns generated",
      description: "CLWDPAT and parser configuration created"
    });
  };

  const simulateResult = (patterns: string[]) => {
    const clwdpatPatterns: CLWDPATPattern[] = patterns
      .filter(line => line.startsWith("'"))
      .map(line => {
        const match = line.match(/^'([^']+)'\s+(INS NAME|MOD NAME)\s+(DEF|END|BEG|MID)\s+(.+)$/);
        if (match) {
          return {
            pattern: match[1],
            command: match[2] as CLWDPATPattern['command'],
            type: match[3] as CLWDPATPattern['type'],
            attributes: match[4],
            original: line
          };
        }
        return null;
      })
      .filter(Boolean) as CLWDPATPattern[];

    const result = simulatePatternParse(originalParse, clwdpatPatterns);
    setParseResult(result);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`
    });
  };

  const downloadPattern = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trillium v7.15 Single Tuner</h1>
          <p className="text-muted-foreground">
            Fix parsing issues one record at a time with visual feedback
          </p>
        </div>

        {/* Entity Type Selection */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Entity Type</h2>
          <div className="flex gap-6">
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="entityType" 
                value="person"
                checked={entityType === 'person'}
                onChange={() => setEntityType('person')}
                className="mr-2"
              />
              <span>Person</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input 
                type="radio" 
                name="entityType" 
                value="business"
                checked={entityType === 'business'}
                onChange={() => setEntityType('business')}
                className="mr-2"
              />
              <span>Business</span>
            </label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Only one can be selected, parse based on which is selected
          </p>
        </Card>

        {/* Original Parse Input */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Original Parse - Bad</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Copy paste the bad output from Trillium
          </p>
          
          <Textarea
            className="font-mono text-sm min-h-24"
            placeholder="Example: MARIA DE LOS SANTOS (currently parsing as 4 parties)"
            value={originalParse}
            onChange={(e) => setOriginalParse(e.target.value)}
          />
          
          {parsedTokens.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">Detected tokens:</p>
              <div className="flex flex-wrap gap-2">
                {parsedTokens.map((token, idx) => (
                  <Badge key={idx} variant="destructive">
                    {token}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-destructive mt-2">
                Currently creates {parsedTokens.length} parties
              </p>
            </div>
          )}
        </Card>

        {/* Manual Parse Entry */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Correct Parse Entry</h2>
          <p className="text-sm text-muted-foreground mb-3">
            Type in manually how the name should look
          </p>
          
          {entityType === 'person' ? (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div>
                <Label>Prefix</Label>
                <Input
                  placeholder="Dr"
                  value={correctParse.prefix || ''}
                  onChange={(e) => updateCorrectParse('prefix', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Given Name *</Label>
                <Input
                  placeholder="Maria"
                  value={correctParse.firstName || ''}
                  onChange={(e) => updateCorrectParse('firstName', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Middle</Label>
                <Input
                  placeholder="Isabel"
                  value={correctParse.middle || ''}
                  onChange={(e) => updateCorrectParse('middle', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Surname *</Label>
                <Input
                  placeholder="De Los Santos"
                  value={correctParse.lastName || ''}
                  onChange={(e) => updateCorrectParse('lastName', e.target.value)}
                />
              </div>
              
              <div>
                <Label>Gen</Label>
                <Input
                  placeholder="Jr"
                  value={correctParse.generation || ''}
                  onChange={(e) => updateCorrectParse('generation', e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <Label>Business Name *</Label>
              <Input
                placeholder="ABC Plumbing LLC"
                value={correctParse.businessName || ''}
                onChange={(e) => updateCorrectParse('businessName', e.target.value)}
              />
            </div>
          )}
          
          <Button
            onClick={generatePatterns}
            disabled={!isValidInput()}
            className="mt-4"
          >
            Parse
          </Button>
        </Card>

        {/* Generated Patterns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* CLWDPAT */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">CLWDPAT - Tuning Code</h3>
            
            <div className="bg-muted rounded-md p-4 font-mono text-sm min-h-[200px]">
              {clwdpatCode ? (
                <>
                  <pre className="whitespace-pre-wrap break-words text-xs">{clwdpatCode}</pre>
                  
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(clwdpatCode, 'CLWDPAT')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadPattern('CLWDPAT', clwdpatCode)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Pattern will appear here after parsing
                </p>
              )}
            </div>
            
            {clwdpatCode && (
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                <p>• Add to CLWDPAT file after line 106053 (Spanish entries section)</p>
                <p>• Pattern precedence: Longer patterns match first</p>
              </div>
            )}
          </Card>
          
          {/* pfprsdrv.par */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">pfprsdrv.par - Tuning Code</h3>
            
            <div className="bg-muted rounded-md p-4 font-mono text-sm min-h-[200px]">
              {parserCode ? (
                <>
                  <pre className="whitespace-pre-wrap break-words text-xs">{parserCode}</pre>
                  
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => copyToClipboard(parserCode, 'Parser Config')}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadPattern('parser_config', parserCode)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground">
                  Configuration will appear here if needed
                </p>
              )}
            </div>
            
            {parserCode && (
              <div className="mt-3 text-xs text-muted-foreground space-y-1">
                <p>• Update existing parameters in pfprsdrv.par</p>
                <p>• Only shown if configuration changes needed</p>
              </div>
            )}
          </Card>
        </div>

        {/* Corrected Trillium Display */}
        {parseResult && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-3">Corrected Trillium Display</h3>
            <p className="text-sm text-muted-foreground mb-3">
              This shows how Trillium v7.15 will parse the name after applying the patterns
            </p>
            
            <div className={`rounded-md p-4 ${
              parseResult.matchedPattern !== 'NONE - DEFAULT PARSING' ? 'bg-green-50 dark:bg-green-950/20' : 'bg-muted'
            }`}>
              <div className="space-y-3">
                <div className="font-mono text-sm">
                  <div className="mb-3 pb-3 border-b">
                    <span className="text-muted-foreground">Input: </span>
                    <span className="font-semibold">{originalParse}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-2">Parse Result</h4>
                      {parseResult.parties[0] && (
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">Party Type:</span>
                            <span className="ml-2 font-medium">{parseResult.parties[0].type}</span>
                          </div>
                          {parseResult.parties[0].firstName && (
                            <div>
                              <span className="text-muted-foreground">First Name:</span>
                              <span className="ml-2 font-medium text-primary">
                                {parseResult.parties[0].firstName}
                              </span>
                            </div>
                          )}
                          {parseResult.parties[0].lastName && (
                            <div>
                              <span className="text-muted-foreground">Last Name:</span>
                              <span className="ml-2 font-medium text-primary">
                                {parseResult.parties[0].lastName}
                              </span>
                            </div>
                          )}
                          {parseResult.parties[0].businessName && (
                            <div>
                              <span className="text-muted-foreground">Business Name:</span>
                              <span className="ml-2 font-medium text-primary">
                                {parseResult.parties[0].businessName}
                              </span>
                            </div>
                          )}
                          {parseResult.parties[0].generation && (
                            <div>
                              <span className="text-muted-foreground">Generation:</span>
                              <span className="ml-2 font-medium text-primary">
                                {parseResult.parties[0].generation}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-xs text-muted-foreground uppercase mb-2">Statistics</h4>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="text-muted-foreground">Party Count:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {parseResult.partyCount}
                            <span className="text-xs text-muted-foreground ml-1">
                              (was {parsedTokens.length})
                            </span>
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Pattern Match:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {parseResult.matchedPattern !== 'NONE - DEFAULT PARSING' ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-xs text-muted-foreground uppercase mb-2">Parse Logic Applied</h4>
                  <ol className="text-xs text-muted-foreground space-y-1">
                    {parseResult.parseSteps.map((step: string, idx: number) => (
                      <li key={idx}>{idx + 1}. {step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
