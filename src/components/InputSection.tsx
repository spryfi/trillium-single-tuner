import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles } from "lucide-react";
import { getExampleData } from "@/utils/patternDetection";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const InputSection = ({ value, onChange, onAnalyze, isAnalyzing }: InputSectionProps) => {
  const handleLoadExamples = () => {
    onChange(getExampleData().join('\n'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Simple CSV parsing - just take first column or treat as line-separated
      const lines = text.split('\n').filter(line => line.trim());
      onChange(lines.join('\n'));
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">Problematic Records</Label>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadExamples}
            disabled={isAnalyzing}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Load Examples
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isAnalyzing}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload CSV
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste problematic records here (one per line)...&#10;&#10;Examples:&#10;MARIA DE LOS SANTOS&#10;JOHN SMITH LLC&#10;ROBERT VAN DER MEER"
        className="font-mono text-sm min-h-[300px] resize-none"
        disabled={isAnalyzing}
      />

      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={onAnalyze}
          disabled={isAnalyzing || !value.trim()}
          className="gap-2"
        >
          <Sparkles className="w-5 h-5" />
          {isAnalyzing ? "Analyzing..." : "Analyze Patterns"}
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Enter one record per line. The analyzer will detect Spanish names, cultural particles, 
        generation suffixes, business indicators, and address parsing issues.
      </p>
    </div>
  );
};
