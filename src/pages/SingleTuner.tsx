import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { simulatePatternParse, CLWDPATPattern } from '@/utils/parserSimulator';
import { TRILLIUM_TOKEN_TYPES, TOKEN_MAP, getTokenType } from '@/utils/constants';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Sparkles, 
  Wand2, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  Save, 
  Download, 
  Copy,
  Plus,
  Search,
  Clock,
  FileText
} from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { supabase } from '../lib/supabaseClient';


interface ParsedName {
  prefix?: string;
  firstName?: string;
  middle?: string;
  lastName?: string;
  generation?: string;
  businessName?: string;
  businessSuffix?: string;
  businessKeyTerms?: string;
}

interface Address {
  badAddress?: string;
  houseNumber?: string;
  street?: string;
  streetType?: string;
  unit?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface TuneHistory {
  id: string;
  date: string;
  entityType: 'person' | 'business' | 'address';
  original: string;
  status: 'draft' | 'validated' | 'needs-review' | 'auto-qc-passed';
  description: string;
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
  const [entityType, setEntityType] = useState<'person' | 'business' | 'address'>('person');
  const [originalParse, setOriginalParse] = useState('');
  const [parseErrorDescription, setParseErrorDescription] = useState('');
  
  // Separate bad parse inputs for each entity type
  const [badParse, setBadParse] = useState({
    person: '',
    business: '',
    address: ''
  });
  
  const [correctParse, setCorrectParse] = useState<ParsedName>({});
  const [address, setAddress] = useState<Address>({});
  const [clwdpatCode, setClwdpatCode] = useState('');
  const [parserCode, setParserCode] = useState('');
  const [summaryCode, setSummaryCode] = useState('');
  const [parseResult, setParseResult] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<'draft' | 'validated' | 'needs-review' | 'auto-qc-passed'>('draft');
  const [history, setHistory] = useState<TuneHistory[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState('');

  const updateCorrectParse = (field: keyof ParsedName, value: string) => {
    setCorrectParse(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  const isValidInput = () => {
    if (!originalParse.trim()) return false;
    if (entityType === 'person') {
      return !!(correctParse.firstName && correctParse.lastName);
    } else if (entityType === 'business') {
      return !!correctParse.businessName;
    } else if (entityType === 'address') {
      return !!(address.badAddress || address.street);
    }
    return false;
  };

  const handleAISuggest = () => {
    toast({
      title: "AI Suggestion",
      description: "AI pattern suggestion will be implemented with backend integration"
    });
    
    // Mock AI suggestion for demo
    if (entityType === 'person' && originalParse.includes('DE')) {
      const parts = originalParse.split(' ');
      if (parts.length >= 3) {
        setCorrectParse({
          firstName: parts[0],
          lastName: parts.slice(1).join(' ')
        });
        toast({
          title: "AI Detected",
          description: "Compound surname with particle detected"
        });
      }
    }
  };

  const handleAutoFix = () => {
    if (entityType === 'address' && address.badAddress) {
      // Mock address parsing
      const parts = address.badAddress.split(/[\s,]+/);
      const houseNum = parts[0]?.match(/^\d+/) ? parts[0] : '';
      const streetParts = parts.slice(houseNum ? 1 : 0);
      
      setAddress(prev => ({
        ...prev,
        houseNumber: houseNum,
        street: streetParts.slice(0, -3).join(' '),
        city: streetParts[streetParts.length - 3] || '',
        state: streetParts[streetParts.length - 2] || '',
        zip: streetParts[streetParts.length - 1] || ''
      }));
      
      toast({
        title: "Auto-Fixed",
        description: "Address parsed automatically"
      });
    }
  };

  const generatePatterns = () => {
    console.log("Generate Patterns clicked");
    console.log("originalParse:", originalParse);
    console.log("entityType:", entityType);

    const tokenizer = new TrilliumTokenizer();
    const patterns: string[] = [];
    const upperOriginal = originalParse.toUpperCase().trim();
    const tokens = tokenizer.tokenize(upperOriginal);
    
    patterns.push('*****************************************');
    patterns.push(`* Generated: ${new Date().toISOString().split('T')[0]}`);
    patterns.push(`* Original: ${upperOriginal}`);
    patterns.push(`* Entity: ${entityType.toUpperCase()}`);
    patterns.push('*****************************************');
    patterns.push('');
    
    if (entityType === 'person') {
      const firstName = correctParse.firstName?.toUpperCase() || '';
      const lastName = correctParse.lastName?.toUpperCase() || '';
      const lastNameTokens = tokenizer.tokenize(lastName);
      
      if (lastNameTokens.some(t => t.isConnective)) {
        patterns.push('* Define connector words');
        const connectors = lastNameTokens.filter(t => t.isConnective);
        connectors.forEach(token => {
          patterns.push(`'${token.text}'     WORDTYPE CONNECT`);
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
        
        if (firstName) {
          const firstNameTokens = tokenizer.tokenize(firstName);
          const firstNameLength = firstNameTokens.length;
          
          const fullPattern = tokens.map((token, idx) => {
            if (idx < firstNameLength) return 'ALPHA';
            return token.isConnective ? 'CONNECT' : 'ALPHA';
          }).join(' ');
          
          patterns.push(`'${fullPattern}' PATTERN NAME DEF`);
          
          if (firstNameLength === 1) {
            patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
          } else {
            patterns.push(`REC='GVN-NM1(1-${firstNameLength}) SRNM(${firstNameLength + 1}-)'`);
          }
        }
      } else {
        const tokenCount = tokens.length;
        const firstNameLength = tokenizer.tokenize(firstName).length || 1;
        
        if (tokenCount === 2) {
          patterns.push(`'ALPHA ALPHA' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1) SRNM(2)'`);
        } else if (tokenCount === 3 && correctParse.middle) {
          patterns.push(`'ALPHA ALPHA ALPHA' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1) GVN-NM2(2) SRNM(3)'`);
        } else if (firstNameLength > 1) {
          patterns.push(`'${'ALPHA '.repeat(tokenCount).trim()}' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1-${firstNameLength}) SRNM(${firstNameLength + 1}-)'`);
        } else {
          patterns.push(`'${'ALPHA '.repeat(tokenCount).trim()}' PATTERN NAME DEF`);
          patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
        }
        
        patterns.push('');
        patterns.push(`'${upperOriginal}' PATTERN NAME DEF`);
        patterns.push(`REC='GVN-NM1(1) SRNM(2-)'`);
      }
    } else if (entityType === 'business') {
      patterns.push(`'${upperOriginal}' PATTERN MISC DEF`);
      patterns.push(`RECODE='BRAND(1-)'`);
      patterns.push('');
      
      const businessTokens = tokens.filter(t => t.isBusinessType);
      if (businessTokens.length > 0) {
        businessTokens.forEach(token => {
          patterns.push(`'${token.text}'    WORDTYPE BUSTYPE`);
        });
        patterns.push('');
        
        const bizPattern = tokens.map(token => 
          token.isBusinessType ? 'BUSTYPE' : 'ALPHA'
        ).join(' ');
        
        patterns.push(`'${bizPattern}' PATTERN MISC DEF`);
        
        const brandEndPos = tokens.findIndex(t => t.isBusinessType);
        if (brandEndPos > 0) {
          patterns.push(`RECODE='BRAND(1-${brandEndPos}) CO-TYPE(${brandEndPos + 1}-)'`);
        } else {
          patterns.push(`RECODE='BRAND(1-)'`);
        }
      }
    } else if (entityType === 'address') {
      patterns.push('* Address parsing patterns');
      patterns.push('* Add address-specific CLWDPAT rules here');
      patterns.push('');
      
      if (address.streetType) {
        patterns.push(`'${address.streetType.toUpperCase()}'    WORDTYPE ADDRTYPE`);
      }
    }
    
  console.log("patterns to output:", patterns.join('\n'));
  setClwdpatCode(patterns.join('\n'));
    
    // Generate parser config
    const config: string[] = [];
    config.push('****************************************************');
    config.push('* Parser Configuration Updates for v7.15');
    config.push(`* Generated: ${new Date().toISOString().split('T')[0]}`);
    config.push('****************************************************');
    config.push('');
    
    let needsConfig = false;
    
    if (entityType === 'person' && correctParse.lastName) {
      const lastNameTokens = tokenizer.tokenize(correctParse.lastName);
      const hasConnectives = lastNameTokens.some(t => t.isConnective);
      
      if (hasConnectives) {
        needsConfig = true;
        config.push('* JOIN_LINES directives (general to specific order)');
        config.push('');
        
        const uniqueConnectives = [...new Set(
          lastNameTokens.filter(t => t.isConnective).map(t => t.text)
        )];
        
        config.push('* General wildcard patterns (lowest priority)');
        uniqueConnectives.forEach(conn => {
          config.push(`JOIN_LINES  "*","","${conn}",""`);
        });
        
        config.push('');
        config.push('* Alpha + connective patterns (medium priority)');
        uniqueConnectives.forEach(conn => {
          const tokenType = getTokenType(conn);
          config.push(`JOIN_LINES  "*","${TRILLIUM_TOKEN_TYPES.ALPHA}","${conn}","${tokenType}"`);
        });
        
        config.push('');
        config.push('* Specific combinations (highest priority)');
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
      }
    }
    
    config.push('');
    setParserCode(needsConfig ? config.join('\n') : '');
    
    // Generate summary
    const summary: string[] = [];
    summary.push('IMPLEMENTATION SUMMARY');
    summary.push('======================');
    summary.push('');
    summary.push(`Entity Type: ${entityType.toUpperCase()}`);
    summary.push(`Original Input: ${originalParse}`);
    summary.push(`Parse Error: ${parseErrorDescription || 'Not specified'}`);
    summary.push('');
    summary.push('Changes Applied:');
    summary.push(`- CLWDPAT patterns: ${patterns.filter(p => p.includes('PATTERN')).length} rules`);
    summary.push(`- Parser config: ${needsConfig ? 'Required' : 'Not needed'}`);
    summary.push(`- Token types used: ${tokens.length} tokens analyzed`);
    summary.push('');
    summary.push('Next Steps:');
    summary.push('1. Copy CLWDPAT patterns to production file');
    summary.push('2. Update pfprsdrv.par with JOIN_LINES directives');
    summary.push('3. Test in Trillium v7.15 environment');
    summary.push('4. Validate parsing results');
    
    setSummaryCode(summary.join('\n'));
    
    setValidationStatus('needs-review');
    
    toast({
      title: "Patterns generated",
      description: "Review the output tabs for CLWDPAT and parser configuration"
    });
  };

  const handleSave = () => {
    const newTune: TuneHistory = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      entityType,
      original: originalParse,
      status: validationStatus,
      description: parseErrorDescription || `${entityType} parsing fix`
    };
    
    setHistory(prev => [newTune, ...prev]);
    
    toast({
      title: "Tune saved",
      description: "Added to history"
    });
  };

  const loadFromHistory = (tune: TuneHistory) => {
    setEntityType(tune.entityType);
    setOriginalParse(tune.original);
    setParseErrorDescription(tune.description);
    setValidationStatus(tune.status);
    setHistoryOpen(false);
    
    toast({
      title: "Loaded from history",
      description: `Tune from ${new Date(tune.date).toLocaleDateString()}`
    });
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

  const filteredHistory = history.filter(h => 
    h.original.toLowerCase().includes(searchHistory.toLowerCase()) ||
    h.description.toLowerCase().includes(searchHistory.toLowerCase())
  );

  const getStatusBadge = (status: typeof validationStatus) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      'needs-review': 'bg-yellow-100 text-yellow-800',
      validated: 'bg-green-100 text-green-800',
      'auto-qc-passed': 'bg-blue-100 text-blue-800'
    };
    
    const icons = {
      draft: <FileText className="w-3 h-3" />,
      'needs-review': <AlertCircle className="w-3 h-3" />,
      validated: <CheckCircle2 className="w-3 h-3" />,
      'auto-qc-passed': <CheckCircle2 className="w-3 h-3" />
    };
    
    return (
      <Badge className={styles[status]}>
        {icons[status]}
        <span className="ml-1">{status.replace('-', ' ').toUpperCase()}</span>
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Single Tuner</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="space-y-6">
          {/* Header with History */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Trillium v7.15 Single Tuner</h1>
              <p className="text-muted-foreground">
                Advanced UI for precise parsing correction with AI assistance
              </p>
            </div>
            
            <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline">
                  <History className="w-4 h-4 mr-2" />
                  History ({history.length})
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Tune History</SheetTitle>
                  <SheetDescription>
                    Search and load previous parsing fixes
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-4">
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search history..."
                      value={searchHistory}
                      onChange={(e) => setSearchHistory(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3">
                      {filteredHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-8">
                          No history yet. Save a tune to get started.
                        </p>
                      ) : (
                        filteredHistory.map((tune) => (
                          <Card
                            key={tune.id}
                            className="cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => loadFromHistory(tune)}
                          >
                            <CardHeader className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{tune.entityType}</Badge>
                                    {getStatusBadge(tune.status)}
                                  </div>
                                  <p className="text-sm font-medium">{tune.original}</p>
                                  <p className="text-xs text-muted-foreground">{tune.description}</p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {new Date(tune.date).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                          </Card>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Entity Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Entity Configuration</CardTitle>
              <CardDescription>Select entity type and configure parsing parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Entity Type Tabs */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Entity Type</Label>
                <Tabs value={entityType} onValueChange={(v) => setEntityType(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="person">Person</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Separator />

              {/* Entity-Specific Fields with Bad/Correct Parse Sections */}
              {entityType === 'person' && (
                <div className="space-y-6">
                  {/* Bad Parse Section */}
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <Label htmlFor="badParsePerson" className="text-red-900 dark:text-red-100 font-semibold text-base">
                      Original Bad Name (Input) *
                    </Label>
                    <Textarea
                      id="badParsePerson"
                      value={badParse.person}
                      onChange={(e) => {
                        setBadParse({ ...badParse, person: e.target.value });
                        setOriginalParse(e.target.value);
                      }}
                      placeholder="Paste the incorrectly parsed person name here... (e.g., MARIA DE LOS SANTOS)"
                      className="mt-2 min-h-[80px] font-mono bg-white dark:bg-gray-900"
                    />
                  </div>

                  {/* Correct Parse Section */}
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 text-base">
                      Corrected Parse Components
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <Label htmlFor="prefix">Prefix</Label>
                        <Input
                          id="prefix"
                          placeholder="DR, MR, MS"
                          value={correctParse.prefix || ''}
                          onChange={(e) => updateCorrectParse('prefix', e.target.value)}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="first">First *</Label>
                        <Input
                          id="first"
                          placeholder="MARIA"
                          value={correctParse.firstName || ''}
                          onChange={(e) => updateCorrectParse('firstName', e.target.value)}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="middle">Middle</Label>
                        <Input
                          id="middle"
                          placeholder="ELENA"
                          value={correctParse.middle || ''}
                          onChange={(e) => updateCorrectParse('middle', e.target.value)}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last">Last *</Label>
                        <Input
                          id="last"
                          placeholder="DE LOS SANTOS"
                          value={correctParse.lastName || ''}
                          onChange={(e) => updateCorrectParse('lastName', e.target.value)}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="gen">Gen</Label>
                        <Input
                          id="gen"
                          placeholder="JR, SR, III"
                          value={correctParse.generation || ''}
                          onChange={(e) => updateCorrectParse('generation', e.target.value)}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {entityType === 'business' && (
                <div className="space-y-6">
                  {/* Bad Parse Section */}
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <Label htmlFor="badParseBusiness" className="text-red-900 dark:text-red-100 font-semibold text-base">
                      Full Business Name (Bad) *
                    </Label>
                    <Textarea
                      id="badParseBusiness"
                      value={badParse.business}
                      onChange={(e) => {
                        setBadParse({ ...badParse, business: e.target.value });
                        setOriginalParse(e.target.value);
                      }}
                      placeholder="Paste the incorrectly parsed business name here... (e.g., ABC PLUMBING LLC)"
                      className="mt-2 min-h-[80px] font-mono bg-white dark:bg-gray-900"
                    />
                  </div>

                  {/* Correct Parse Section */}
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 text-base">
                      Corrected Parse Components
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bizName">Corrected Business Name *</Label>
                        <Input
                          id="bizName"
                          placeholder="ABC PLUMBING"
                          value={correctParse.businessName || ''}
                          onChange={(e) => updateCorrectParse('businessName', e.target.value)}
                          className="bg-white dark:bg-gray-900"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="suffix">Known Suffix</Label>
                          <Input
                            id="suffix"
                            placeholder="LLC, INC, CORP, LTD"
                            value={correctParse.businessSuffix || ''}
                            onChange={(e) => updateCorrectParse('businessSuffix', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="terms">Key Terms / Industry Type</Label>
                          <Input
                            id="terms"
                            placeholder="PLUMBING, INSURANCE, CONSULTING"
                            value={correctParse.businessKeyTerms || ''}
                            onChange={(e) => updateCorrectParse('businessKeyTerms', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {entityType === 'address' && (
                <div className="space-y-6">
                  {/* Bad Parse Section */}
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border-2 border-red-200 dark:border-red-800">
                    <Label htmlFor="badParseAddress" className="text-red-900 dark:text-red-100 font-semibold text-base">
                      Bad Address (Raw) *
                    </Label>
                    <Textarea
                      id="badParseAddress"
                      value={badParse.address}
                      onChange={(e) => {
                        setBadParse({ ...badParse, address: e.target.value });
                        setOriginalParse(e.target.value);
                        updateAddress('badAddress', e.target.value);
                      }}
                      placeholder="Paste the incorrectly parsed address here... (e.g., 123 MAIN STREET APT 4B NEW YORK NY 10001)"
                      className="mt-2 min-h-[80px] font-mono bg-white dark:bg-gray-900"
                    />
                  </div>

                  {/* Correct Parse Section */}
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 text-base">
                      Corrected Address Components
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label htmlFor="house">House #</Label>
                          <Input
                            id="house"
                            placeholder="123"
                            value={address.houseNumber || ''}
                            onChange={(e) => updateAddress('houseNumber', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="street">Street Name *</Label>
                          <Input
                            id="street"
                            placeholder="MAIN"
                            value={address.street || ''}
                            onChange={(e) => updateAddress('street', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Street Type</Label>
                          <Select
                            value={address.streetType}
                            onValueChange={(v) => updateAddress('streetType', v)}
                          >
                            <SelectTrigger className="bg-white dark:bg-gray-900">
                              <SelectValue placeholder="ST, AVE, RD" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="STREET">Street</SelectItem>
                              <SelectItem value="AVENUE">Avenue</SelectItem>
                              <SelectItem value="ROAD">Road</SelectItem>
                              <SelectItem value="BOULEVARD">Boulevard</SelectItem>
                              <SelectItem value="DRIVE">Drive</SelectItem>
                              <SelectItem value="LANE">Lane</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit / Apt</Label>
                          <Input
                            id="unit"
                            placeholder="APT 4B, UNIT 102"
                            value={address.unit || ''}
                            onChange={(e) => updateAddress('unit', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            placeholder="NEW YORK"
                            value={address.city || ''}
                            onChange={(e) => updateAddress('city', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            value={address.state || ''}
                            onChange={(e) => updateAddress('state', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP Code</Label>
                          <Input
                            id="zip"
                            placeholder="10001"
                            value={address.zip || ''}
                            onChange={(e) => updateAddress('zip', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="USA"
                            value={address.country || ''}
                            onChange={(e) => updateAddress('country', e.target.value)}
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Parse Error Description */}
              <div className="space-y-3">
                <Label htmlFor="errorDesc" className="text-base font-semibold">
                  Parse Error Description
                </Label>
                <Textarea
                  id="errorDesc"
                  placeholder="Describe what Trillium did wrong (e.g., 'Split surname with particle into 3 parties')"
                  value={parseErrorDescription}
                  onChange={(e) => setParseErrorDescription(e.target.value)}
                  className="min-h-16"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleAISuggest}
                  variant="secondary"
                  disabled={!originalParse.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Suggest
                </Button>
                
                {entityType === 'address' && (
                  <Button
                    onClick={handleAutoFix}
                    variant="secondary"
                    disabled={!address.badAddress}
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Auto-Fix
                  </Button>
                )}
                
                <Button
                  onClick={generatePatterns}
                  className="bg-primary"
                >
                  Generate Patterns
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Output Tabs */}
          {clwdpatCode && (
            <Card>
              <CardHeader>
                <CardTitle>Pattern Output</CardTitle>
                <CardDescription>Generated Trillium v7.15 configuration code</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="clwdpat">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="clwdpat">CLWDPAT</TabsTrigger>
                    <TabsTrigger value="clwdpat2">CLWDPAT 2</TabsTrigger>
                    <TabsTrigger value="parser">pfprsdrv.par</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="clwdpat" className="space-y-4">
                    <div className="bg-muted rounded-md p-4 font-mono text-xs">
                      <pre className="whitespace-pre-wrap">{clwdpatCode}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(clwdpatCode, 'CLWDPAT')}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPattern('CLWDPAT', clwdpatCode)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="clwdpat2" className="space-y-4">
                    <div className="bg-muted rounded-md p-4">
                      <p className="text-sm text-muted-foreground">
                        Alternative CLWDPAT patterns (if applicable)
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="parser" className="space-y-4">
                    {parserCode ? (
                      <>
                        <div className="bg-muted rounded-md p-4 font-mono text-xs">
                          <pre className="whitespace-pre-wrap">{parserCode}</pre>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(parserCode, 'Parser Config')}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadPattern('parser_config', parserCode)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="bg-muted rounded-md p-4">
                        <p className="text-sm text-muted-foreground">
                          No parser configuration needed for this pattern
                        </p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="summary" className="space-y-4">
                    <div className="bg-muted rounded-md p-4 font-mono text-xs">
                      <pre className="whitespace-pre-wrap">{summaryCode}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}

          {/* Validation Status */}
          {clwdpatCode && (
            <Card>
              <CardHeader>
                <CardTitle>Validation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Label>Status:</Label>
                    <Select
                      value={validationStatus}
                      onValueChange={(v) => setValidationStatus(v as any)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="needs-review">Needs Review</SelectItem>
                        <SelectItem value="validated">Validated</SelectItem>
                        <SelectItem value="auto-qc-passed">Auto QC Passed</SelectItem>
                      </SelectContent>
                    </Select>
                    {getStatusBadge(validationStatus)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Tune
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
