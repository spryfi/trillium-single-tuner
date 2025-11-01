import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProThinkingPanelProps {
  messages: string[];
  isActive: boolean;
}

export const ProThinkingPanel = ({ messages, isActive }: ProThinkingPanelProps) => {
  if (!isActive && messages.length === 0) return null;

  return (
    <Card className="border-primary/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          {isActive && <Loader2 className="h-3 w-3 animate-spin" />}
          GPT-5 PRO Thinking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-32">
          <div className="space-y-1 text-xs text-muted-foreground">
            {messages.map((msg, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>{msg}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
