import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ProMode = 'validate' | 'repair' | 'research';

interface ProModeSelectorProps {
  mode: ProMode;
  onChange: (mode: ProMode) => void;
}

export const ProModeSelector = ({ mode, onChange }: ProModeSelectorProps) => {
  return (
    <div className="flex gap-2 mb-3">
      <Button
        type="button"
        size="sm"
        variant={mode === 'validate' ? 'default' : 'outline'}
        onClick={() => onChange('validate')}
        className={cn('flex-1', mode === 'validate' && 'bg-primary text-primary-foreground')}
      >
        Validate Pattern
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === 'repair' ? 'default' : 'outline'}
        onClick={() => onChange('repair')}
        className={cn('flex-1', mode === 'repair' && 'bg-primary text-primary-foreground')}
      >
        Suggest Repair
      </Button>
      <Button
        type="button"
        size="sm"
        variant={mode === 'research' ? 'default' : 'outline'}
        onClick={() => onChange('research')}
        className={cn('flex-1', mode === 'research' && 'bg-primary text-primary-foreground')}
      >
        Research Normalization
      </Button>
    </div>
  );
};
