import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download, FileCode, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ValidationStatus } from "./ValidationStatus";

interface OutputTabsProps {
  clwdpat: string;
  parserConfig: string;
  report: string;
}

export const OutputTabs = ({ clwdpat, parserConfig, report }: OutputTabsProps) => {
  const { toast } = useToast();

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} copied successfully`,
    });
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: `${filename} downloaded successfully`,
    });
  };

  const handleDownloadAll = () => {
    handleDownload(clwdpat, 'CLWDPAT.txt');
    setTimeout(() => handleDownload(parserConfig, 'pfprsdrv.par'), 100);
    setTimeout(() => handleDownload(report, 'implementation-report.md'), 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Generated Configuration Files</h3>
          <p className="text-sm text-muted-foreground">Ready to implement in your Trillium v7.15 system</p>
        </div>
        <Button onClick={handleDownloadAll} variant="default" size="lg">
          <Download className="w-4 h-4 mr-2" />
          Download All Files
        </Button>
      </div>

      <Tabs defaultValue="clwdpat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clwdpat" className="gap-2">
            <FileCode className="w-4 h-4" />
            CLWDPAT File
          </TabsTrigger>
          <TabsTrigger value="parser" className="gap-2">
            <Settings className="w-4 h-4" />
            pfprsdrv.par File
          </TabsTrigger>
          <TabsTrigger value="report">Implementation Guide</TabsTrigger>
        </TabsList>

        <TabsContent value="clwdpat" className="space-y-3">
          <ValidationStatus clwdpat={clwdpat} />
          
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium">CLWDPAT Pattern Dictionary</p>
                <p className="text-xs text-muted-foreground">
                  Add these patterns to your existing CLWDPAT file (do not replace entire file)
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(clwdpat, "CLWDPAT patterns")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(clwdpat, 'CLWDPAT_updates.txt')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-code-bg text-foreground p-4 rounded-lg overflow-x-auto text-sm font-mono border border-code-border max-h-[500px] overflow-y-auto">
              {clwdpat}
            </pre>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100 font-medium mb-1">
                ⚠️ Important: Pattern Order Matters
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Longer patterns must appear before shorter patterns in CLWDPAT. The patterns above are already sorted correctly.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="parser" className="space-y-3">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium">pfprsdrv.par Parser Configuration</p>
                <p className="text-xs text-muted-foreground">
                  Update these specific parameters in your pfprsdrv.par file
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(parserConfig, "Parser configuration")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(parserConfig, 'pfprsdrv_updates.par')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-code-bg text-foreground p-4 rounded-lg overflow-x-auto text-sm font-mono border border-code-border max-h-[500px] overflow-y-auto">
              {parserConfig}
            </pre>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-900">
              <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium mb-1">
                ⚠️ Important: Do Not Replace Entire File
              </p>
              <p className="text-xs text-yellow-800 dark:text-yellow-200">
                Only update the specific parameters shown above. Keep all other pfprsdrv.par settings unchanged.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-3">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm font-medium">Step-by-Step Implementation Guide</p>
                <p className="text-xs text-muted-foreground">
                  Complete instructions for applying these changes
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(report, "Implementation report")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(report, 'implementation_guide.md')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <div className="bg-background p-4 rounded-lg border max-h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-sm font-sans">
                {report}
              </pre>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
