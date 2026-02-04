import { useState } from 'react';
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
      {/* Header - Editorial masthead style */}
      <header className="border-b-2 border-foreground">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-baseline justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
                HAILSTATS
              </h1>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-1">
                Damage Analysis Terminal
              </p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                System Status
              </p>
              <p className="text-sm font-mono text-status-safe">● READY</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {!stats ? (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left - Hero text */}
            <div className="space-y-8">
              <div>
                <p className="data-label mb-4">Input Required</p>
                <h2 className="text-4xl sm:text-5xl font-black leading-none tracking-tight text-foreground">
                  Drop your
                  <br />
                  export file
                  <span className="text-accent">.</span>
                </h2>
              </div>
              
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Upload a Label Studio JSON export. We'll crunch the numbers and give you 
                the raw breakdown—damage rates, dent distributions, panel stats.
              </p>

              {/* CLI hint */}
              <div className="border-2 border-foreground p-4 inline-block">
                <p className="data-label mb-2">CLI Usage</p>
                <code className="text-sm font-mono text-foreground">
                  stats --in export.json --out stats.csv
                </code>
              </div>
            </div>

            {/* Right - Upload zone */}
            <div>
              <FileUpload onFileLoad={handleFileLoad} />
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setStats(null)}
              className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <span className="inline-block transform group-hover:-translate-x-1 transition-transform">←</span>
              NEW ANALYSIS
            </button>
            <StatsDashboard stats={stats} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-foreground mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Built for damage assessment workflows
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
