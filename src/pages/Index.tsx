import { useState } from "react";
import { Header } from "@/components/Header";
import { InputSection } from "@/components/InputSection";
import { StatsDashboard } from "@/components/StatsDashboard";
import { OutputTabs } from "@/components/OutputTabs";
import { AnalysisResults } from "@/components/AnalysisResults";
import { ParseComparison } from "@/components/ParseComparison";
import { BatchTest } from "@/components/BatchTest";
import { EffectivenessDashboard } from "@/components/EffectivenessDashboard";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { analyzeRecords } from "@/utils/patternDetection";
import { generateCLWDPAT, generateParserConfig, generateImplementationReport, calculateStats } from "@/utils/outputGeneration";
import { 
  simulateDefaultParse, 
  simulatePatternParse, 
  generatePatternsFromRecord,
  calculateEffectiveness,
  CLWDPATPattern,
  parseCLWDPATEntry
} from "@/utils/parserSimulator";
import { ParsedRecord, AnalysisStats } from "@/types/trillium";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<ParsedRecord[] | null>(null);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [outputs, setOutputs] = useState<{
    clwdpat: string;
    parserConfig: string;
    report: string;
  } | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    const lines = input.split('\n').filter(line => line.trim());
    const analyzed = analyzeRecords(lines);
    const calculatedStats = calculateStats(analyzed);

    const clwdpat = generateCLWDPAT(analyzed);
    const parserConfig = generateParserConfig(analyzed);
    const report = generateImplementationReport(analyzed, calculatedStats);

    setResults(analyzed);
    setStats(calculatedStats);
    setOutputs({ clwdpat, parserConfig, report });
    setIsAnalyzing(false);

    const totalIssues = analyzed.filter(r => r.issues.length > 0).length;
    toast({
      title: "Analysis complete",
      description: `Found ${totalIssues} records with issues across ${lines.length} records`,
    });
  };

  // Generate patterns for simulation
  const getSimulationPatterns = (): CLWDPATPattern[] => {
    if (!results) return [];
    
    const patterns: CLWDPATPattern[] = [];
    results.forEach(record => {
      const recordPatterns = generatePatternsFromRecord(record);
      patterns.push(...recordPatterns);
    });
    
    return patterns;
  };

  // Generate test cases for batch testing
  const getTestCases = () => {
    if (!results) return [];
    
    const patterns = getSimulationPatterns();
    return results
      .filter(r => r.issues.length > 0)
      .slice(0, 10) // Show first 10
      .map(record => ({
        input: record.original,
        beforeParse: simulateDefaultParse(record.original),
        afterParse: simulatePatternParse(record.original, patterns)
      }));
  };

  // Get first record with issues for comparison demo
  const getComparisonRecord = () => {
    if (!results) return null;
    
    const recordWithIssues = results.find(r => r.issues.length > 0);
    if (!recordWithIssues) return null;

    const patterns = getSimulationPatterns();
    
    return {
      original: recordWithIssues.original,
      beforeParse: simulateDefaultParse(recordWithIssues.original),
      afterParse: simulatePatternParse(recordWithIssues.original, patterns)
    };
  };

  // Calculate effectiveness metrics
  const getEffectivenessMetrics = () => {
    if (!results) return null;
    
    const patterns = getSimulationPatterns();
    return calculateEffectiveness(results, patterns);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Batch Analyzer</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Trillium v7.15 Pattern Analyzer</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Analyze problematic name parsing patterns and generate CLWDPAT entries and parser 
              configuration for Trillium v7.15 mainframe systems. Handles Spanish names, cultural 
              particles, generation suffixes, and business indicators.
            </p>
          </div>

          {/* Input Section */}
          <Card className="p-6">
            <InputSection
              value={input}
              onChange={setInput}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </Card>

          {/* Results Section */}
          {results && (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="simulator">Parse Simulator</TabsTrigger>
                <TabsTrigger value="issues">Detailed Issues</TabsTrigger>
                <TabsTrigger value="outputs">Generated Files</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {stats && (
                  <>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Analysis Summary</h3>
                      <StatsDashboard stats={stats} />
                    </div>

                    {getEffectivenessMetrics() && (
                      <EffectivenessDashboard metrics={getEffectivenessMetrics()!} />
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="simulator" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Parse Simulator</h3>
                    <p className="text-muted-foreground">
                      See how Trillium v7.15 will parse your data before and after applying the generated patterns.
                    </p>
                  </div>

                  {getComparisonRecord() && (
                    <ParseComparison
                      original={getComparisonRecord()!.original}
                      beforeParse={getComparisonRecord()!.beforeParse}
                      afterParse={getComparisonRecord()!.afterParse}
                    />
                  )}

                  <BatchTest
                    testCases={getTestCases()}
                    patterns={getSimulationPatterns()}
                  />
                </div>
              </TabsContent>

              <TabsContent value="issues">
                <AnalysisResults records={results} />
              </TabsContent>

              <TabsContent value="outputs">
                {outputs && (
                  <OutputTabs
                    clwdpat={outputs.clwdpat}
                    parserConfig={outputs.parserConfig}
                    report={outputs.report}
                  />
                )}
              </TabsContent>
            </Tabs>
          )}

          {/* Help Section */}
          <Card className="p-6 bg-muted/50 border-blue-200 dark:border-blue-900">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  Trillium v7.15 Limitations
                </h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• <strong>NO JOIN_LINES support</strong> - This feature requires v14 or higher</li>
                  <li>• <strong>All multi-token patterns must be explicit</strong> - Each combination needs its own pattern</li>
                  <li>• <strong>Pattern precedence is length-based</strong> - Longer patterns always match first</li>
                  <li>• <strong>Test incrementally</strong> - Add patterns gradually and validate parsing results</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Pattern Categories Help */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">Pattern Categories Detected</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Spanish Names", example: "DE LOS SANTOS, DEL RIO" },
                { name: "Cultural Names", example: "VAN DER MEER, O'CONNOR" },
                { name: "Generation Suffixes", example: "JR, SR, II, III" },
                { name: "Business Indicators", example: "LLC, INC, CORP" },
                { name: "Address Numbers", example: "12345, 67890" }
              ].map((category) => (
                <div key={category.name} className="p-3 rounded-lg bg-muted border">
                  <p className="font-medium text-sm mb-1">{category.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{category.example}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
