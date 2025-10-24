import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Issue } from "@/types/trillium";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

interface IssueCardProps {
  issue: Issue;
  original: string;
}

export const IssueCard = ({ issue, original }: IssueCardProps) => {
  const getSeverityColor = () => {
    switch (issue.severity) {
      case 'high': return 'text-red-600 bg-red-50 dark:bg-red-950';
      case 'medium': return 'text-orange-600 bg-orange-50 dark:bg-orange-950';
      case 'low': return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
    }
  };

  const getTypeLabel = () => {
    switch (issue.type) {
      case 'spanish_name': return 'Spanish Name';
      case 'cultural_name': return 'Cultural Name';
      case 'generation_suffix': return 'Generation Suffix';
      case 'business_indicator': return 'Business Indicator';
      case 'address_number': return 'Address Number';
    }
  };

  const SeverityIcon = issue.severity === 'high' ? AlertCircle : 
                       issue.severity === 'medium' ? Info : CheckCircle2;

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getSeverityColor()}`}>
          <SeverityIcon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">{getTypeLabel()}</Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              {Math.round(issue.confidence * 100)}% confidence
            </Badge>
          </div>
          
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Original:</p>
            <code className="text-sm bg-muted px-2 py-1 rounded block font-mono">
              {original}
            </code>
          </div>
          
          <div className="mb-2">
            <p className="text-sm font-medium mb-1">Pattern Detected:</p>
            <code className="text-sm bg-primary/10 px-2 py-1 rounded block font-mono text-primary">
              {issue.pattern}
            </code>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-1">Suggested Fix:</p>
            <code className="text-xs bg-code-bg text-foreground px-2 py-1 rounded block font-mono whitespace-pre-wrap">
              {issue.suggestion}
            </code>
          </div>
        </div>
      </div>
    </Card>
  );
};
