import { useMemo } from 'react';
import { AnyPattern, emitCDPPattern, emitBDPPattern } from '@/engine/patterns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TunePreviewProps {
  pattern: AnyPattern | null;
}

export const TunePreview = ({ pattern }: TunePreviewProps) => {
  const { preview, warnings } = useMemo(() => {
    if (!pattern) return { preview: '', warnings: [] };
    try {
      if (pattern.engine === 'CDP') {
        const result = emitCDPPattern(pattern);
        return { preview: result.output, warnings: result.warnings };
      }
      return { preview: emitBDPPattern(pattern), warnings: [] };
    } catch (error) {
      return { 
        preview: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        warnings: []
      };
    }
  }, [pattern]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Live Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <pre className="text-xs font-mono bg-muted p-4 rounded overflow-x-auto whitespace-pre">
          {preview || '(Configure pattern to see preview)'}
        </pre>
        {warnings.length > 0 && (
          <Alert variant="default" className="border-yellow-500/50 bg-yellow-500/10">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warnings:</strong> {warnings.join('; ')}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
