import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParsedRecord } from "@/types/trillium";
import { IssueCard } from "./IssueCard";
import { Badge } from "@/components/ui/badge";

interface AnalysisResultsProps {
  records: ParsedRecord[];
}

export const AnalysisResults = ({ records }: AnalysisResultsProps) => {
  const recordsWithIssues = records.filter(r => r.issues.length > 0);
  
  if (recordsWithIssues.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          No issues detected. Your data looks clean!
        </p>
      </Card>
    );
  }

  const spanishIssues = recordsWithIssues.filter(r => 
    r.issues.some(i => i.type === 'spanish_name')
  );
  const culturalIssues = recordsWithIssues.filter(r => 
    r.issues.some(i => i.type === 'cultural_name')
  );
  const suffixIssues = recordsWithIssues.filter(r => 
    r.issues.some(i => i.type === 'generation_suffix')
  );
  const businessIssues = recordsWithIssues.filter(r => 
    r.issues.some(i => i.type === 'business_indicator')
  );
  const addressIssues = recordsWithIssues.filter(r => 
    r.issues.some(i => i.type === 'address_number')
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Detected Issues</h3>
        <Badge variant="secondary">
          {recordsWithIssues.length} records with issues
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">
            All ({recordsWithIssues.length})
          </TabsTrigger>
          <TabsTrigger value="spanish">
            Spanish ({spanishIssues.length})
          </TabsTrigger>
          <TabsTrigger value="cultural">
            Cultural ({culturalIssues.length})
          </TabsTrigger>
          <TabsTrigger value="suffix">
            Suffix ({suffixIssues.length})
          </TabsTrigger>
          <TabsTrigger value="business">
            Business ({businessIssues.length})
          </TabsTrigger>
          <TabsTrigger value="address">
            Address ({addressIssues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {recordsWithIssues.map((record, idx) => (
            <div key={idx}>
              {record.issues.map((issue, issueIdx) => (
                <IssueCard key={issueIdx} issue={issue} original={record.original} />
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="spanish" className="space-y-3 mt-4">
          {spanishIssues.map((record, idx) => (
            <div key={idx}>
              {record.issues.filter(i => i.type === 'spanish_name').map((issue, issueIdx) => (
                <IssueCard key={issueIdx} issue={issue} original={record.original} />
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="cultural" className="space-y-3 mt-4">
          {culturalIssues.map((record, idx) => (
            <div key={idx}>
              {record.issues.filter(i => i.type === 'cultural_name').map((issue, issueIdx) => (
                <IssueCard key={issueIdx} issue={issue} original={record.original} />
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="suffix" className="space-y-3 mt-4">
          {suffixIssues.map((record, idx) => (
            <div key={idx}>
              {record.issues.filter(i => i.type === 'generation_suffix').map((issue, issueIdx) => (
                <IssueCard key={issueIdx} issue={issue} original={record.original} />
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="business" className="space-y-3 mt-4">
          {businessIssues.map((record, idx) => (
            <div key={idx}>
              {record.issues.filter(i => i.type === 'business_indicator').map((issue, issueIdx) => (
                <IssueCard key={issueIdx} issue={issue} original={record.original} />
              ))}
            </div>
          ))}
        </TabsContent>

        <TabsContent value="address" className="space-y-3 mt-4">
          {addressIssues.map((record, idx) => (
            <div key={idx}>
              {record.issues.filter(i => i.type === 'address_number').map((issue, issueIdx) => (
                <IssueCard key={issueIdx} issue={issue} original={record.original} />
              ))}
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
