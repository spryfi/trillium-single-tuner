// components/SingleTuner.tsx (core rendering & validation)
import React from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { EngineMode, makeCdpNamePattern, makeTmNamePattern, inboundNameTokens, previewPrepos, PersonParts } from '../utils/trillium';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Sparkles, AlertCircle } from 'lucide-react';

export default function SingleTuner() {
  const { toast } = useToast();
  const [mode, setMode] = React.useState<EngineMode>('CDP');
  const [entity, setEntity] = React.useState<'person'|'business'|'address'>('person');
  const [orig, setOrig] = React.useState('');
  const [parts, setParts] = React.useState<PersonParts>({ first:'', last:'' });
  const [out, setOut] = React.useState<string>('');
  const [err, setErr] = React.useState<string>('');

  const onGenerate = () => {
    try {
      setErr('');
      if (!orig.trim()) throw new Error('Original Bad Name is required.');
      if (!parts.first.trim() || !parts.last.trim()) throw new Error('First and Last are required.');
      const inbound = inboundNameTokens(orig).join(' ');
      if (mode === 'CDP') {
        const cd = makeCdpNamePattern(orig, parts);
        const pre = previewPrepos(parts);
        setOut(`${cd.inbound}\n${cd.rec}\n\n# PREPOS preview: Surname1=${pre.surname1} Surname2=${pre.surname2} Surname3=${pre.surname3}`);
      } else {
        const tm = makeTmNamePattern(orig, parts);
        const pre = previewPrepos(parts);
        setOut(`${tm.insert}\n${tm.rec}\n${tm.exp}\n\n# PREPOS preview: Surname1=${pre.surname1} Surname2=${pre.surname2} Surname3=${pre.surname3}`);
      }
      toast({
        title: "Patterns Generated",
        description: `${mode} pattern created successfully`
      });
    } catch(e:any){ 
      setErr(e.message);
      toast({
        title: "Generation Error",
        description: e.message,
        variant: "destructive"
      });
    }
  };

  const onAISuggest = () => {
    toast({
      title: "AI Suggestion",
      description: "AI pattern suggestion will be implemented with backend integration"
    });
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Trillium v7.16 Single Tuner</h1>
            <p className="text-muted-foreground">
              CDP/TM correct pattern generator with particle intelligence
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engine Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="engine-mode">Engine Mode</Label>
                <Tabs value={mode} onValueChange={(v) => setMode(v as EngineMode)} className="w-full mt-2">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="CDP">CDP v7.16</TabsTrigger>
                    <TabsTrigger value="TM">Table Maintenance (CLWDPAT)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label htmlFor="entity-type">Entity Type</Label>
                <Tabs value={entity} onValueChange={(v) => setEntity(v as 'person'|'business'|'address')} className="w-full mt-2">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="person">Person</TabsTrigger>
                    <TabsTrigger value="business">Business</TabsTrigger>
                    <TabsTrigger value="address">Address</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardContent>
          </Card>

          {entity === 'person' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Original Bad Name *</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Textarea 
                    value={orig} 
                    onChange={e=>setOrig(e.target.value)} 
                    placeholder="e.g., DE LA ROSA ANNA MARIE"
                    className="min-h-[80px]"
                  />
                  <div className="text-sm text-muted-foreground">
                    <strong>Inbound tokens:</strong> {inboundNameTokens(orig).join(' ') || '—'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corrected Components</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prefix">Prefix (Dr, Mr...)</Label>
                      <Input 
                        id="prefix"
                        placeholder="Prefix" 
                        onChange={e=>setParts(p=>({...p, prefix:e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="first">First Name *</Label>
                      <Input 
                        id="first"
                        placeholder="First" 
                        onChange={e=>setParts(p=>({...p, first:e.target.value}))}
                        className={!parts.first ? 'border-red-500' : ''}
                      />
                    </div>
                    <div>
                      <Label htmlFor="middle">Middle Name</Label>
                      <Input 
                        id="middle"
                        placeholder="Middle" 
                        onChange={e=>setParts(p=>({...p, middle:e.target.value}))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last">Last Name *</Label>
                      <Input 
                        id="last"
                        placeholder="Last" 
                        onChange={e=>setParts(p=>({...p, last:e.target.value}))}
                        className={!parts.last ? 'border-red-500' : ''}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Supports multiple words; particles recognized automatically
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="generation">Generation (Jr, III...)</Label>
                      <Input 
                        id="generation"
                        placeholder="Generation" 
                        onChange={e=>setParts(p=>({...p, gen:e.target.value}))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={onAISuggest} variant="outline">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Suggest
                    </Button>
                    <Button onClick={onGenerate}>
                      Generate Patterns
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {entity === 'business' && (
            <Card>
              <CardHeader>
                <CardTitle>Business Entity</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Business pattern generation will be implemented in a future update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {entity === 'address' && (
            <Card>
              <CardHeader>
                <CardTitle>Address Entity</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Address pattern generation will be implemented in a future update.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {err && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          )}

          {out && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Pattern</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
{out}
                </pre>
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigator.clipboard.writeText(out);
                      toast({ title: "Copied!", description: "Pattern copied to clipboard" });
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Validation Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Alert>
                <AlertDescription>
                  <strong>CDP NAME patterns:</strong> Name numbers (1) are required on each REC attribute (GVN-NM1(1), SRNM(1)).
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertDescription>
                  <strong>TM NAME patterns:</strong> EXPORT is required (Error 67). REC and EXPORT token counts must match (Error 52). No blanks inside EXPORT parentheses (Error 9).
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertDescription>
                  <strong>Attributes:</strong> Only standard Trillium v7.16 attributes (GVN-NM1, GVN-NM2, SRNM, GENR, TITLE, CONCATENEE, CONNECTOR, ALPHA) are allowed.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
