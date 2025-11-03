import { Database, Wrench, Package, GraduationCap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Trillium Pattern Analyzer</h1>
            <p className="text-xs text-muted-foreground">Generate CLWDPAT patterns for v7.15</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              size="sm"
            >
              Batch Analyzer
            </Button>
          </Link>
          <Link to="/single-tuner">
            <Button 
              variant={location.pathname === '/single-tuner' ? 'default' : 'ghost'}
              size="sm"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Single Tuner
            </Button>
          </Link>
          <Link to="/release-builder">
            <Button 
              variant={location.pathname === '/release-builder' ? 'default' : 'ghost'}
              size="sm"
            >
              <Package className="w-4 h-4 mr-2" />
              Release Builder
            </Button>
          </Link>
          <Link to="/labs">
            <Button 
              variant={location.pathname === '/labs' ? 'default' : 'ghost'}
              size="sm"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Labs
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
