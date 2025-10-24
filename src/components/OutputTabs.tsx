import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
        <h3 className="text-lg font-semibold">Generated Output Files</h3>
        <Button onClick={handleDownloadAll} variant="default">
          <Download className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      <Tabs defaultValue="clwdpat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="clwdpat">CLWDPAT Patterns</TabsTrigger>
          <TabsTrigger value="parser">Parser Config</TabsTrigger>
          <TabsTrigger value="report">Implementation Report</TabsTrigger>
        </TabsList>

        <TabsContent value="clwdpat">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Copy these patterns to your CLWDPAT file
              </p>
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
                  onClick={() => handleDownload(clwdpat, 'CLWDPAT.txt')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-code-bg text-foreground p-4 rounded-lg overflow-x-auto text-sm font-mono border border-code-border max-h-[400px] overflow-y-auto">
              {clwdpat}
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="parser">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Parser configuration for pfprsdrv.par
              </p>
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
                  onClick={() => handleDownload(parserConfig, 'pfprsdrv.par')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-code-bg text-foreground p-4 rounded-lg overflow-x-auto text-sm font-mono border border-code-border max-h-[400px] overflow-y-auto">
              {parserConfig}
            </pre>
          </Card>
        </TabsContent>

        <TabsContent value="report">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                Implementation guide and statistics
              </p>
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
                  onClick={() => handleDownload(report, 'implementation-report.md')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            <pre className="bg-background text-foreground p-4 rounded-lg overflow-x-auto text-sm font-mono border max-h-[400px] overflow-y-auto whitespace-pre-wrap">
              {report}
            </pre>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
