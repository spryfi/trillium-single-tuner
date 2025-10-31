import { useState } from "react";
import { Header } from "@/components/Header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuildTuneForm } from "@/components/release-builder/BuildTuneForm";
import { QueuePanel } from "@/components/release-builder/QueuePanel";
import { CompilePanel } from "@/components/release-builder/CompilePanel";
import { AnyPattern } from "@/engine/patterns";

export default function ReleaseBuilder() {
  const [queue, setQueue] = useState<AnyPattern[]>([]);
  const defaultCountryCode = "US";

  const handleAddToQueue = (pattern: AnyPattern) => {
    setQueue([...queue, pattern]);
  };

  const handleRemoveFromQueue = (index: number) => {
    setQueue(queue.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newQueue = [...queue];
    [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
    setQueue(newQueue);
  };

  const handleMoveDown = (index: number) => {
    if (index === queue.length - 1) return;
    const newQueue = [...queue];
    [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
    setQueue(newQueue);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Release Builder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Release Builder</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Build and manage your Trillium v7.15 pattern releases. Configure CDP/BDP patterns, queue them, and compile release packages.
            </p>
          </div>

          <Tabs defaultValue="build" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="build">Build Tune</TabsTrigger>
              <TabsTrigger value="queue">Queue ({queue.length})</TabsTrigger>
              <TabsTrigger value="compile">Compile</TabsTrigger>
            </TabsList>
            
            <TabsContent value="build" className="mt-6">
              <BuildTuneForm 
                onAddToQueue={handleAddToQueue} 
                defaultCountryCode={defaultCountryCode}
              />
            </TabsContent>
            
            <TabsContent value="queue" className="mt-6">
              <QueuePanel
                queue={queue}
                onRemove={handleRemoveFromQueue}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            </TabsContent>
            
            <TabsContent value="compile" className="mt-6">
              <CompilePanel
                queue={queue}
                defaultCountryCode={defaultCountryCode}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
