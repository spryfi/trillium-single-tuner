import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { nameToPattern } from '@/engine/examples';
import { Wand2 } from 'lucide-react';

interface NameParsingHelperProps {
  onApply: (tokens: string[], rec: string, raw: string) => void;
}

export const NameParsingHelper = ({ onApply }: NameParsingHelperProps) => {
  const [first, setFirst] = useState('');
  const [middle, setMiddle] = useState('');
  const [last, setLast] = useState('');
  const [title, setTitle] = useState('');
  const [generation, setGeneration] = useState('');

  const handleApply = () => {
    const result = nameToPattern({ first, middle, last, title, generation });
    if (result.tokens.length > 0) {
      onApply(result.tokens, result.rec, result.raw);
    }
  };

  return (
    <Card className="bg-accent/50">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Name Parsing Helper (CDP)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Build a CDP NAME pattern by filling in name components. This will generate tokens and REC mapping automatically.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <Label htmlFor="title" className="text-xs">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dr, Mr, Ms"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="first" className="text-xs">First</Label>
            <Input
              id="first"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              placeholder="John"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="middle" className="text-xs">Middle</Label>
            <Input
              id="middle"
              value={middle}
              onChange={(e) => setMiddle(e.target.value)}
              placeholder="William"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="last" className="text-xs">Last</Label>
            <Input
              id="last"
              value={last}
              onChange={(e) => setLast(e.target.value)}
              placeholder="Smith"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="generation" className="text-xs">Generation</Label>
            <Input
              id="generation"
              value={generation}
              onChange={(e) => setGeneration(e.target.value)}
              placeholder="Jr, Sr, III"
              className="h-8 text-sm"
            />
          </div>
        </div>
        <Button
          type="button"
          onClick={handleApply}
          size="sm"
          variant="secondary"
        >
          Apply to Pattern
        </Button>
      </CardContent>
    </Card>
  );
};
