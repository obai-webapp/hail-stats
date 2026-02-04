import { FileDown, Database, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { DistributionTable } from './DistributionTable';
import { DentSizeChart } from './DentSizeChart';
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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b-2 border-foreground">
        <div>
          <p className="data-label mb-2">Analysis Complete</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            {stats.totalTasks} Tasks Processed
          </h2>
        </div>
        <button 
          onClick={handleExportCSV} 
          className="flex items-center gap-3 px-6 py-3 bg-foreground text-primary-foreground font-bold text-sm uppercase tracking-wider hover:bg-foreground/90 transition-colors"
        >
          <FileDown className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      {/* Summary Cards - Asymmetric grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={Database}
        />
        <StatCard
          title="Damage"
          value={stats.damageCount}
          subtitle="hail = yes"
          icon={AlertTriangle}
          variant="damage"
        />
        <StatCard
          title="No Damage"
          value={stats.noDamageCount}
          subtitle="hail = no"
          icon={CheckCircle2}
          variant="no-damage"
        />
        <StatCard
          title="Pending"
          value={stats.pendingCount}
          subtitle="unlabeled"
          icon={Clock}
          variant="pending"
        />
      </div>

      {/* Dent Size Chart - Full width */}
      <DentSizeChart data={stats.dentSizeDistribution} />

      {/* Distributions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionTable
          title="Dent Size Distribution"
          data={dentSizeData}
          columns={['Size', 'Boxes', 'Images']}
          emptyMessage="No dent boxes found in damage images"
        />
        <DistributionTable
          title="Primary Panel"
          data={panelData}
          columns={['Panel', 'Count']}
          emptyMessage="No primary panel data available"
        />
        {methodData.length > 0 && (
          <DistributionTable
            title="Method"
            data={methodData}
            columns={['Method', 'Count']}
          />
        )}
        {gridTypeData.length > 0 && (
          <DistributionTable
            title="Hail Grid Type"
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
