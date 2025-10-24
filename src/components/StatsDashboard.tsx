import { Card } from "@/components/ui/card";
import { AnalysisStats } from "@/types/trillium";
import { AlertCircle, Users, Building2, Hash, FileText } from "lucide-react";

interface StatsDashboardProps {
  stats: AnalysisStats;
}

export const StatsDashboard = ({ stats }: StatsDashboardProps) => {
  const statItems = [
    {
      label: "Total Records",
      value: stats.totalRecords,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950"
    },
    {
      label: "Spanish Names",
      value: stats.spanishNames,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950"
    },
    {
      label: "Cultural Names",
      value: stats.culturalNames,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-950"
    },
    {
      label: "Generation Suffixes",
      value: stats.generationSuffixes,
      icon: Hash,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-950"
    },
    {
      label: "Business Indicators",
      value: stats.businessIndicators,
      icon: Building2,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950"
    },
    {
      label: "Address Issues",
      value: stats.addressIssues,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground truncate">{item.label}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
