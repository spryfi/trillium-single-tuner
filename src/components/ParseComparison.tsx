import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { ParseResult } from '@/utils/parserSimulator';

interface ParseComparisonProps {
  original: string;
  beforeParse: ParseResult;
  afterParse: ParseResult;
}

export function ParseComparison({ original, beforeParse, afterParse }: ParseComparisonProps) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Parse Simulation</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Before */}
        <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-4 border border-red-200 dark:border-red-900">
          <h4 className="font-medium text-red-800 dark:text-red-200 mb-3 flex items-center justify-between">
            Before (Current)
            <Badge variant="destructive">{beforeParse.partyCount} parties</Badge>
          </h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Input:</span>
              <div className="font-mono mt-1 text-xs break-all">{original}</div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Tokens:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {beforeParse.tokens.map((token, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {token}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="w-8 h-8 text-muted-foreground" />
        </div>

        {/* After */}
        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-3 flex items-center justify-between">
            After (With Patterns)
            <Badge className="bg-green-600">{afterParse.partyCount} party</Badge>
          </h4>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Matched Pattern:</span>
              <div className="font-mono mt-1 text-xs break-all bg-green-100 dark:bg-green-950 rounded px-2 py-1">
                {afterParse.matchedPattern !== 'NONE - DEFAULT PARSING' 
                  ? '✓ Pattern matched' 
                  : 'No pattern'}
              </div>
            </div>
            {afterParse.parties[0] && (
              <div className="text-sm space-y-1">
                {afterParse.parties[0].firstName && (
                  <div>
                    <span className="text-muted-foreground">First:</span>{' '}
                    <span className="font-medium">{afterParse.parties[0].firstName}</span>
                  </div>
                )}
                {afterParse.parties[0].lastName && (
                  <div>
                    <span className="text-muted-foreground">Last:</span>{' '}
                    <span className="font-medium">{afterParse.parties[0].lastName}</span>
                  </div>
                )}
                {afterParse.parties[0].businessName && (
                  <div>
                    <span className="text-muted-foreground">Business:</span>{' '}
                    <span className="font-medium">{afterParse.parties[0].businessName}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Parse Steps */}
      <div className="mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSteps(!showSteps)}
          className="text-sm"
        >
          {showSteps ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
          {showSteps ? 'Hide' : 'Show'} Parse Logic Steps
        </Button>

        {showSteps && (
          <div className="mt-3 bg-muted rounded-lg p-4">
            <h5 className="font-medium text-sm mb-2">Parsing Steps:</h5>
            <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
              {afterParse.parseSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </Card>
  );
}
