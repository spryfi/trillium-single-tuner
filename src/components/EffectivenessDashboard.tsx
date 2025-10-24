import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { EffectivenessMetrics } from '@/utils/parserSimulator';
import { TrendingDown, CheckCircle, FileCode } from 'lucide-react';

interface EffectivenessDashboardProps {
  metrics: EffectivenessMetrics;
}

export function EffectivenessDashboard({ metrics }: EffectivenessDashboardProps) {
  const issueTypes = [
    { key: 'spanish_name', label: 'Spanish Names' },
    { key: 'cultural_name', label: 'Cultural Names' },
    { key: 'generation_suffix', label: 'Generation Suffixes' },
    { key: 'business_indicator', label: 'Business Indicators' },
    { key: 'address_number', label: 'Address Numbers' }
  ];

  const getFixRate = (type: string) => {
    const data = metrics.issueTypeBreakdown[type];
    if (!data || data.total === 0) return 0;
    return Math.round((data.fixed / data.total) * 100);
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Pattern Effectiveness</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-900">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div className="text-sm text-muted-foreground">Records Fixed</div>
          </div>
          <div className="text-3xl font-bold text-green-600">
            {metrics.fixedRecords}/{metrics.totalRecords}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-muted-foreground">Party Reduction</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">
            {metrics.partyReduction}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-900">
          <div className="flex items-center gap-2 mb-2">
            <FileCode className="w-5 h-5 text-purple-600" />
            <div className="text-sm text-muted-foreground">Patterns Created</div>
          </div>
          <div className="text-3xl font-bold text-purple-600">
            {metrics.patternsGenerated}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-muted-foreground">Fix Rate by Issue Type</h4>
        
        {issueTypes.map(({ key, label }) => {
          const data = metrics.issueTypeBreakdown[key];
          if (!data || data.total === 0) return null;
          
          const fixRate = getFixRate(key);
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>{label}</span>
                <span className="font-medium">
                  {data.fixed}/{data.total} ({fixRate}%)
                </span>
              </div>
              <Progress value={fixRate} className="h-2" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
