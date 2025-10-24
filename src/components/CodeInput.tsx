import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  disabled?: boolean;
}

export const CodeInput = ({ value, onChange, label, placeholder, disabled }: CodeInputProps) => {
  return (
    <div className="flex flex-col gap-2 h-full">
      <Label className="text-sm font-medium">{label}</Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 font-mono text-sm bg-code-bg border-code-border resize-none min-h-[300px] focus-visible:ring-primary"
      />
    </div>
  );
};
