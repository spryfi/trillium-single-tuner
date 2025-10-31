import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnyPattern, emitCDPPattern, emitBDPPattern } from '@/engine/patterns';
import { Trash2, MoveUp, MoveDown } from 'lucide-react';

interface QueuePanelProps {
  queue: AnyPattern[];
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export const QueuePanel = ({ queue, onRemove, onMoveUp, onMoveDown }: QueuePanelProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queue ({queue.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {queue.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No tunes in queue. Add patterns from the form above.
          </p>
        ) : (
          queue.map((pattern, idx) => {
            const preview = pattern.engine === 'CDP' 
              ? emitCDPPattern(pattern)
              : emitBDPPattern(pattern);
            
            return (
              <div key={idx} className="border rounded p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {pattern.engine} · {pattern.lineType} · {pattern.countryCode}
                    </div>
                    <pre className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto">
                      {preview}
                    </pre>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveUp(idx)}
                      disabled={idx === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMoveDown(idx)}
                      disabled={idx === queue.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(idx)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
