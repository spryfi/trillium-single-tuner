import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Sparkles, FileText } from "lucide-react";
import { getExampleData } from "@/utils/patternDetection";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const InputSection = ({ value, onChange, onAnalyze, isAnalyzing }: InputSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleLoadExamples = () => {
    onChange(getExampleData().join('\n'));
    toast({
      title: "Examples loaded",
      description: "Sample problematic records have been loaded",
    });
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Simple CSV parsing - just take first column or treat as line-separated
      const lines = text.split('\n').filter(line => line.trim());
      onChange(lines.join('\n'));
      toast({
        title: "File uploaded",
        description: `Loaded ${lines.length} records`,
      });
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Failed to read file",
        variant: "destructive",
      });
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'text/csv' || file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv'))) {
      processFile(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or TXT file",
        variant: "destructive",
      });
    }
  };

  const lineCount = value.split('\n').filter(l => l.trim()).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label className="text-lg font-semibold">Problematic Records</Label>
          {lineCount > 0 && (
            <span className="text-sm text-muted-foreground">({lineCount} records)</span>
          )}
        </div>
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
            Upload File
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

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border'
        }`}
      >
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg z-10">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium text-primary">Drop your file here</p>
            </div>
          </div>
        )}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste problematic records here (one per line)...&#10;&#10;Or drag & drop a CSV/TXT file&#10;&#10;Examples:&#10;MARIA DE LOS SANTOS&#10;JOHN SMITH LLC&#10;ROBERT VAN DER MEER"
          className="font-mono text-sm min-h-[300px] resize-none border-0"
          disabled={isAnalyzing}
        />
      </div>

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
        generation suffixes, business indicators, and address parsing issues. Supports drag & drop for CSV/TXT files.
      </p>
    </div>
  );
};
