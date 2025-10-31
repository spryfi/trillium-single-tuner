import { useMemo } from 'react';
import { AnyPattern, emitCDPPattern, emitBDPPattern } from '@/engine/patterns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TunePreviewProps {
  pattern: AnyPattern | null;
}

export const TunePreview = ({ pattern }: TunePreviewProps) => {
  const preview = useMemo(() => {
    if (!pattern) return '';
    try {
      return pattern.engine === 'CDP' 
        ? emitCDPPattern(pattern) 
        : emitBDPPattern(pattern);
    } catch (error) {
      return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  }, [pattern]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs font-mono bg-muted p-4 rounded overflow-x-auto whitespace-pre">
          {preview || '(Configure pattern to see preview)'}
        </pre>
      </CardContent>
    </Card>
  );
};
