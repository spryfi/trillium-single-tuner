import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { INTRINSIC_TOKENS, NAME_ATTRS, STREET_ATTRS } from '@/engine/patterns';

interface TokenChipProps {
  token: string;
  onTokenChange: (newToken: string) => void;
  onRemove: () => void;
}

export const TokenChip = ({ token, onTokenChange, onRemove }: TokenChipProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allTokens = [
    ...Array.from(INTRINSIC_TOKENS),
    ...Array.from(NAME_ATTRS),
    ...Array.from(STREET_ATTRS)
  ].sort();

  const filteredTokens = search
    ? allTokens.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    : allTokens;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSelect = (selectedToken: string) => {
    onTokenChange(selectedToken);
    setIsEditing(false);
    setSearch('');
  };

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => {
            setTimeout(() => setIsEditing(false), 200);
          }}
          placeholder="Search tokens..."
          className="px-3 py-1 text-sm border rounded bg-background"
        />
        {filteredTokens.length > 0 && (
          <div className="absolute top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-popover border rounded shadow-lg z-10">
            {filteredTokens.slice(0, 20).map(t => (
              <button
                key={t}
                onClick={() => handleSelect(t)}
                className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent"
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-mono">
      <button
        onClick={() => setIsEditing(true)}
        className="hover:underline"
      >
        {token}
      </button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-4 w-4 p-0 hover:bg-destructive/20"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};
