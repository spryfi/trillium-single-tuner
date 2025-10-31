import { CDPRecItem } from '@/engine/patterns';
import { NAME_ATTRS, STREET_ATTRS } from '@/engine/patterns';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecEditorProps {
  recode: CDPRecItem[];
  tokenCount: number;
  onChange: (recode: CDPRecItem[]) => void;
}

export const RecEditor = ({ recode, tokenCount, onChange }: RecEditorProps) => {
  const allAttrs = [...Array.from(NAME_ATTRS), ...Array.from(STREET_ATTRS)].sort();

  const addRecItem = () => {
    onChange([...recode, { attr: 'GVN-NM1', index: 1 }]);
  };

  const updateRecItem = (idx: number, field: 'attr' | 'index', value: string | number) => {
    const updated = [...recode];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };

  const removeRecItem = (idx: number) => {
    onChange(recode.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">REC Mapping</label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRecItem}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Item
        </Button>
      </div>
      <div className="space-y-2">
        {recode.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              value={item.attr}
              onChange={(e) => updateRecItem(idx, 'attr', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border rounded bg-background"
            >
              {allAttrs.map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
            <span className="text-sm text-muted-foreground">(</span>
            <input
              type="number"
              min={1}
              max={tokenCount}
              value={item.index}
              onChange={(e) => updateRecItem(idx, 'index', parseInt(e.target.value) || 1)}
              className="w-16 px-2 py-2 text-sm border rounded bg-background text-center"
            />
            <span className="text-sm text-muted-foreground">)</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeRecItem(idx)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
      {recode.length === 0 && (
        <p className="text-sm text-muted-foreground">No REC items. Click "Add Item" to start.</p>
      )}
    </div>
  );
};
