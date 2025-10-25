import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { simulatePatternParse, CLWDPATPattern } from '@/utils/parserSimulator';
import { TRILLIUM_TOKEN_TYPES, TOKEN_MAP, getTokenType } from '@/utils/constants';

interface ParsedName {
  prefix?: string;
  firstName?: string;
  middle?: string;
  lastName?: string;
  generation?: string;
  businessName?: string;
}

interface TokenInfo {
  text: string;
  type: string;
  isConnective: boolean;
  isBusinessType: boolean;
  isConjunction: boolean;
}

class TrilliumTokenizer {
  tokenize(text: string): TokenInfo[] {
    return text.toUpperCase().split(' ').filter(Boolean).map(word => {
      const type = getTokenType(word);
      return {
        text: word,
        type,
        isConnective: type === TRILLIUM_TOKEN_TYPES.CONNECTIVE_PRIMARY || 
                     type === TRILLIUM_TOKEN_TYPES.CONNECTIVE_COMPOUND,
        isBusinessType: type === TRILLIUM_TOKEN_TYPES.BUSINESS_SUFFIX,
        isConjunction: type === TRILLIUM_TOKEN_TYPES.CONJUNCTION
      };
    });
  }
}

export default function SingleTuner() {
  const { toast } = useToast();
  const [entityType, setEntityType] = useState<'person' | 'business'>('person');
  const [originalParse, setOriginalParse] = useState('');
  const [correctParse, setCorrectParse] = useState<ParsedName>({});
  const [clwdpatCode, setClwdpatCode] = useState('');
  const [parserCode, setParserCode] = useState('');
  const [parseResult, setParseResult] = useState<any>(null);
  const [showTokenInfo, setShowTokenInfo] = useState(false);

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

  const extractParticles = (text: string): string[] => {
    const particles = ['DE', 'DEL', 'LA', 'LAS', 'LOS', 'VAN', 'VON', 'DER', 'DEN'];
    const words = text.split(' ');
    return words.filter(word => particles.includes(word.toUpperCase()));
  };

  const extractBusinessTypes = (text: string): string[] => {
    const types = ['LLC', 'INC', 'CORP', 'CORPORATION', 'LTD', 'LIMITED', 'CO', 'COMPANY'];
    const words = text.split(' ');
    return words.filter(word => types.includes(word.toUpperCase().replace(/[.,]/g, '')));
  };

  const generatePatterns = () => {
    const tokenizer = new TrilliumTokenizer();
    const patterns: string[] = [];
    const upperOriginal = originalParse.toUpperCase().trim();
    const tokens = tokenizer.tokenize(upperOriginal);
    
    patterns.push('*****************************************');
    patterns.push(`* Generated: ${new Date().toISOString().split('T')[0]}`);
    patterns.push(`* Original: ${upperOriginal}`);
    patterns.push('*****************************************');
    patterns.push('');
    
    if (entityType === 'person') {
      const firstName = correctParse.firstName?.toUpperCase() || '';
      const lastName = correctParse.lastName?.toUpperCase() || '';
      const lastNameTokens = tokenizer.tokenize(lastName);
      
      if (lastNameTokens.some(t => t.isConnective)) {
        patterns.push('* Define connector words with token types');
        const connectors = lastNameTokens.filter(t => t.isConnective);
        connectors.forEach(token => {
          patterns.push(`'${token.text}'     WORDTYPE CONNECT`);
          patterns.push(`* Token type: ${token.type}`);
        });
        patterns.push('');
        
        patterns.push(`'${lastName}'                  INS NAME DEF ATT=SRNM`);
        patterns.push('');
        
        const patternTokens = lastNameTokens.map(token => 
          token.isConnective ? 'CONNECT' : 'ALPHA'
        ).join(' ');
        
        patterns.push(`'${patternTokens}' PATTERN NAME DEF`);
        patterns.push(`REC='SRNM(1-)'`);
        patterns.push('');
        
        const fullPattern = tokens.map((token, idx) => {
          if (idx === 0) return 'ALPHA';
          return token.isConnective ? 'CONNECT' : 'ALPHA';
        }).join(' ');
        
        patterns.push(`'${fullPattern}' PATTERN NAME DEF`);
        patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
      } else {
        const tokenCount = tokens.length;
        
        if (tokenCount === 2) {
          patterns.push(`'ALPHA ALPHA' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1) SRNM(2)'`);
        } else if (tokenCount === 3) {
          patterns.push(`'ALPHA ALPHA ALPHA' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
        } else {
          patterns.push(`'${'ALPHA '.repeat(tokenCount).trim()}' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
        }
        
        patterns.push('');
        patterns.push(`'${upperOriginal}' PATTERN NAME DEF`);
        patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
      }
    } else {
      patterns.push(`'${upperOriginal}' PATTERN MISC DEF`);
      patterns.push(`REC='BRAND(1-)'`);
      patterns.push('');
      
      const businessTokens = tokens.filter(t => t.isBusinessType);
      if (businessTokens.length > 0) {
        businessTokens.forEach(token => {
          patterns.push(`'${token.text}'    WORDTYPE BUSTYPE`);
          patterns.push(`* Token type: ${token.type}`);
        });
        patterns.push('');
        
        const bizPattern = tokens.map(token => 
          token.isBusinessType ? 'BUSTYPE' : 'ALPHA'
        ).join(' ');
        
        patterns.push(`'${bizPattern}' PATTERN MISC DEF`);
        
        const brandEndPos = tokens.findIndex(t => t.isBusinessType);
        if (brandEndPos > 0) {
          patterns.push(`REC='BRAND(1-${brandEndPos}) CO-TYPE(${brandEndPos + 1}-)'`);
        }
      }
    }
    
    setClwdpatCode(patterns.join('\n'));
    
    // Generate pfprsdrv.par configuration with token types
    const config: string[] = [];
    config.push('****************************************************');
    config.push('* Parser Configuration Updates for v7.15');
    config.push(`* Generated: ${new Date().toISOString().split('T')[0]}`);
    config.push('* With proper token type codes');
    config.push('****************************************************');
    config.push('');
    
    let needsConfig = false;
    
    if (entityType === 'person' && correctParse.lastName) {
      const lastNameTokens = tokenizer.tokenize(correctParse.lastName);
      const hasConnectives = lastNameTokens.some(t => t.isConnective);
      
      if (hasConnectives) {
        needsConfig = true;
        config.push('* JOIN_LINES directives with token codes');
        config.push('* Format: "word1","token_code1","word2","token_code2"');
        config.push('');
        
        lastNameTokens.forEach((token, idx) => {
          if (token.isConnective && idx < lastNameTokens.length - 1) {
            const nextToken = lastNameTokens[idx + 1];
            
            if (nextToken.isConnective) {
              config.push(`JOIN_LINES  "${token.text}","${token.type}","${nextToken.text}","${nextToken.type}"`);
            } else {
              config.push(`JOIN_LINES  "${token.text}","${token.type}","*","${TRILLIUM_TOKEN_TYPES.ALPHA}"`);
            }
          }
        });
        
        config.push('');
        config.push('* Wildcard patterns for flexibility');
        const uniqueConnectives = [...new Set(
          lastNameTokens.filter(t => t.isConnective).map(t => t.text)
        )];
        
        uniqueConnectives.forEach(conn => {
          config.push(`JOIN_LINES  "*","","${conn}",""`);
        });
        
        config.push('');
        config.push('* Patterns for tokens preceding connectives');
        uniqueConnectives.forEach(conn => {
          const tokenType = getTokenType(conn);
          config.push(`JOIN_LINES  "*","${TRILLIUM_TOKEN_TYPES.ALPHA}","${conn}","${tokenType}"`);
        });
      }
    }
    
    if (correctParse.generation) {
      needsConfig = true;
      config.push('');
      config.push('* Generation suffix handling');
      config.push(`JOIN_LINES  "*","${TRILLIUM_TOKEN_TYPES.ALPHA}","${correctParse.generation.toUpperCase()}",""`);
      config.push(`JOIN_LINES  "*","${TRILLIUM_TOKEN_TYPES.PUNCTUATION}","${correctParse.generation.toUpperCase()}",""`);
    }
    
    if (entityType === 'business') {
      const businessTokens = tokens.filter(t => t.isBusinessType);
      if (businessTokens.length > 0) {
        needsConfig = true;
        config.push('');
        config.push('* Business suffix handling');
        businessTokens.forEach(token => {
          config.push(`JOIN_LINES  "*","${TRILLIUM_TOKEN_TYPES.ALPHA}","${token.text}","${token.type}"`);
        });
      }
    }
    
    if (tokens.length > 10) {
      needsConfig = true;
      config.push('');
      config.push('* Increase maximum name components');
      config.push(`MAX_NUMB_NAMES          ${Math.min(tokens.length + 5, 20)}`);
    }
    
    config.push('');
    setParserCode(needsConfig ? config.join('\n') : '');
    
    simulateResult(patterns);
    
    toast({
      title: "Patterns generated",
      description: "Using correct v7.15 syntax with PATTERN NAME DEF and WORDTYPE"
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
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Trillium v7.15 Single Tuner</h1>
          <p className="text-muted-foreground">
            Fix parsing issues one record at a time using correct v7.15 PATTERN NAME DEF syntax
          </p>
        </div>

        {/* Token Type Reference Panel */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Token Type Reference</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTokenInfo(!showTokenInfo)}
              >
                {showTokenInfo ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
            <CardDescription>
              Trillium v7.15 token type codes for precise parsing control
            </CardDescription>
          </CardHeader>
          
          {showTokenInfo && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Name Particles</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div>DE, LA, LOS, LAS: <code className="bg-muted px-1.5 py-0.5 rounded">174</code></div>
                    <div>DEL, DI, DA, DO: <code className="bg-muted px-1.5 py-0.5 rounded">175</code></div>
                    <div>VAN, VON, DER: <code className="bg-muted px-1.5 py-0.5 rounded">174</code></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Business Types</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div>LLC, INC, CORP: <code className="bg-muted px-1.5 py-0.5 rounded">059</code></div>
                    <div>LTD, CO, COMPANY: <code className="bg-muted px-1.5 py-0.5 rounded">059</code></div>
                    <div>AND, &, OF: <code className="bg-muted px-1.5 py-0.5 rounded">058</code></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-primary">Core Types</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <div>Regular word: <code className="bg-muted px-1.5 py-0.5 rounded">049</code></div>
                    <div>Numbers: <code className="bg-muted px-1.5 py-0.5 rounded">050</code></div>
                    <div>Punctuation: <code className="bg-muted px-1.5 py-0.5 rounded">051</code></div>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

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
                <div className="mt-2 p-2 bg-primary/5 rounded text-xs">
                  <p className="font-semibold mb-1">v7.15 Syntax Used:</p>
                  <ul className="space-y-1">
                    <li>• PATTERN NAME DEF - Person name patterns with position-based recoding</li>
                    <li>• PATTERN MISC DEF - Business name patterns</li>
                    <li>• WORDTYPE CONNECT - Particle definitions (DE, LA, LOS)</li>
                    <li>• REC='GVN-NM1(1) SRNM(2-)' - Token position assignments</li>
                    <li>• Token type codes shown in comments for JOIN_LINES reference</li>
                  </ul>
                </div>
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
                <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/20 rounded">
                  <p className="font-semibold mb-1">JOIN_LINES Format:</p>
                  <code className="text-xs">"word1","token_code1","word2","token_code2"</code>
                  <p className="mt-1">
                    Token codes ensure proper parsing precedence in v7.15
                  </p>
                </div>
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
