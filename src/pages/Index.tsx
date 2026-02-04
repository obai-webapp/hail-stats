import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { FileUpload } from '@/components/FileUpload';
import { StatsDashboard } from '@/components/StatsDashboard';
import { parseDataset } from '@/lib/labelStudioParser';
import type { LabelStudioTask, DatasetStats } from '@/types/labelStudio';

const Index = () => {
  const [stats, setStats] = useState<DatasetStats | null>(null);

  const handleFileLoad = (data: unknown) => {
    const tasks = data as LabelStudioTask[];
    const parsedStats = parseDataset(tasks);
    setStats(parsedStats);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Hail Damage Stats</h1>
              <p className="text-xs text-muted-foreground">Label Studio Export Analyzer</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!stats ? (
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Upload Your Export
              </h2>
              <p className="text-muted-foreground">
                Drop a Label Studio JSON export to compute hail damage statistics
              </p>
            </div>
            <FileUpload onFileLoad={handleFileLoad} />
            
            {/* CLI Usage */}
            <div className="mt-8 p-4 rounded-xl bg-muted/30 border">
              <h3 className="text-sm font-medium text-foreground mb-2">CLI Usage</h3>
              <code className="text-xs text-muted-foreground font-mono">
                stats --in export.json --out stats.csv
              </code>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setStats(null)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Upload another file
              </button>
            </div>
            <StatsDashboard stats={stats} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
