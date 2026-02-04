import { FileDown, Database, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from './StatCard';
import { DistributionTable } from './DistributionTable';
import { SlackSummary } from './SlackSummary';
import type { DatasetStats } from '@/types/labelStudio';
import { generateCSV, generateSlackSummary } from '@/lib/labelStudioParser';

interface StatsDashboardProps {
  stats: DatasetStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const slackSummary = generateSlackSummary(stats);
  
  const handleExportCSV = () => {
    const csv = generateCSV(stats.processedTasks);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hail_damage_stats.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const dentSizeData = stats.dentSizeDistribution.map(d => ({
    label: d.size.replace('_', ' '),
    value: d.totalBoxes,
    secondaryValue: d.imageCount
  }));

  const panelData = Object.entries(stats.primaryPanelDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const methodData = Object.entries(stats.methodDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  const gridTypeData = Object.entries(stats.hailGridTypeDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dataset Statistics</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analysis of {stats.totalTasks} Label Studio tasks
          </p>
        </div>
        <Button onClick={handleExportCSV} className="gap-2">
          <FileDown className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={Database}
        />
        <StatCard
          title="Damage"
          value={stats.damageCount}
          subtitle="hail_present = YES"
          icon={AlertTriangle}
          variant="damage"
        />
        <StatCard
          title="No Damage"
          value={stats.noDamageCount}
          subtitle="hail_present = NO"
          icon={CheckCircle2}
          variant="no-damage"
        />
        <StatCard
          title="Pending"
          value={stats.pendingCount}
          subtitle="Unlabeled"
          icon={Clock}
          variant="pending"
        />
      </div>

      {/* Distributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionTable
          title="Dent Size Distribution"
          data={dentSizeData}
          columns={['Size', 'Total Boxes', 'Images']}
          emptyMessage="No dent boxes found in damage images"
        />
        <DistributionTable
          title="Primary Panel Distribution"
          data={panelData}
          columns={['Panel', 'Count']}
          emptyMessage="No primary panel data available"
        />
        {methodData.length > 0 && (
          <DistributionTable
            title="Method Distribution"
            data={methodData}
            columns={['Method', 'Count']}
          />
        )}
        {gridTypeData.length > 0 && (
          <DistributionTable
            title="Hail Grid Type Distribution"
            data={gridTypeData}
            columns={['Grid Type', 'Count']}
          />
        )}
      </div>

      {/* Slack Summary */}
      <SlackSummary summary={slackSummary} />
    </div>
  );
}
