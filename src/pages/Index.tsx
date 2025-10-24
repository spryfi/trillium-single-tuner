import { useState } from "react";
import { Header } from "@/components/Header";
import { CodeInput } from "@/components/CodeInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [oldCode, setOldCode] = useState("");
  const [fixedCode, setFixedCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!oldCode.trim()) {
      toast({
        title: "No code provided",
        description: "Please paste some code to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulated AI response for now - will be replaced with actual AI integration
    setTimeout(() => {
      setFixedCode(`// Modern refactored version\n// This is a placeholder - AI integration coming soon!\n\n${oldCode}`);
      setIsAnalyzing(false);
      toast({
        title: "Analysis complete!",
        description: "Your code has been modernized",
      });
    }, 2000);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to clipboard",
      description: "Fixed code is ready to use",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Transform Legacy Code Instantly
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Paste your old code patterns and get modern, optimized alternatives powered by AI
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6 flex flex-col">
              <CodeInput
                value={oldCode}
                onChange={setOldCode}
                label="Old Code Pattern"
                placeholder="// Paste your legacy code here...&#10;function oldFunction() {&#10;  // Your code&#10;}"
                disabled={isAnalyzing}
              />
            </Card>

            <Card className="p-6 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <CodeInput
                  value={fixedCode}
                  onChange={setFixedCode}
                  label="Modern Solution"
                  placeholder="// Your modernized code will appear here..."
                  disabled={isAnalyzing}
                />
              </div>
              {fixedCode && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="mt-2 self-end"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Code
                    </>
                  )}
                </Button>
              )}
            </Card>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={isAnalyzing || !oldCode.trim()}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8"
            >
              <Sparkles className="w-5 h-5" />
              {isAnalyzing ? "Analyzing..." : "Analyze & Fix Code"}
            </Button>
          </div>

          <Card className="p-6 bg-muted/50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Common Patterns We Fix
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                "Callback Hell → Async/Await",
                "Class Components → Hooks",
                "Var → Const/Let",
                "Promises → Modern Syntax",
                "Old APIs → New Standards",
                "Performance Anti-patterns",
              ].map((pattern) => (
                <div key={pattern} className="text-sm px-3 py-2 rounded-lg bg-card border border-border">
                  {pattern}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
