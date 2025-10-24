import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { ParseResult, CLWDPATPattern } from '@/utils/parserSimulator';

interface TestCase {
  input: string;
  beforeParse: ParseResult;
  afterParse: ParseResult;
}

interface BatchTestProps {
  testCases: TestCase[];
  patterns: CLWDPATPattern[];
}

export function BatchTest({ testCases, patterns }: BatchTestProps) {
  const calculateStatus = (testCase: TestCase): 'pass' | 'fail' | 'warn' => {
    if (testCase.afterParse.matchedPattern === 'NONE - DEFAULT PARSING') {
      return 'fail';
    }
    if (testCase.afterParse.partyCount < testCase.beforeParse.partyCount) {
      return 'pass';
    }
    return 'warn';
  };

  const passCount = testCases.filter(tc => calculateStatus(tc) === 'pass').length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Batch Test Results</h3>
        <Badge variant={passCount === testCases.length ? "default" : "secondary"}>
          {passCount}/{testCases.length} Fixed
        </Badge>
      </div>

      <div className="space-y-3">
        {testCases.map((testCase, index) => {
          const status = calculateStatus(testCase);
          
          return (
            <div 
              key={index} 
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Input</div>
                  <div className="font-mono text-sm">{testCase.input}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">Before</div>
                  <Badge variant="outline" className="text-xs">
                    {testCase.beforeParse.partyCount} {testCase.beforeParse.partyCount === 1 ? 'party' : 'parties'}
                  </Badge>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground mb-1">After</div>
                  <Badge 
                    variant={status === 'pass' ? 'default' : status === 'fail' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {testCase.afterParse.partyCount} {testCase.afterParse.partyCount === 1 ? 'party' : 'parties'}
                  </Badge>
                </div>

                <div className="flex justify-end">
                  {status === 'pass' && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                  {status === 'fail' && (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  {status === 'warn' && (
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
              </div>

              {testCase.afterParse.matchedPattern !== 'NONE - DEFAULT PARSING' && (
                <div className="mt-2 text-xs text-muted-foreground font-mono bg-muted rounded px-2 py-1">
                  Pattern: {testCase.afterParse.matchedPattern.substring(0, 60)}...
                </div>
              )}
            </div>
          );
        })}
      </div>

      {testCases.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No test cases available. Analyze some data first.
        </div>
      )}
    </Card>
  );
}
