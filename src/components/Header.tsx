import { Database } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Trillium Pattern Analyzer</h1>
            <p className="text-xs text-muted-foreground">Generate CLWDPAT patterns for v7.15</p>
          </div>
        </div>
      </div>
    </header>
  );
};
