import { cn } from '@/lib/utils';

interface DistributionTableProps {
  title: string;
  data: { label: string; value: number; secondaryValue?: number }[];
  columns: string[];
  emptyMessage?: string;
  className?: string;
}

export function DistributionTable({ 
  title, 
  data, 
  columns,
  emptyMessage = 'No data available',
  className 
}: DistributionTableProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const hasSecondary = data.some(item => item.secondaryValue !== undefined);
  
  return (
    <div className={cn('border-2 border-foreground bg-card', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-foreground">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground">{title}</h3>
      </div>

      {data.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {/* Column headers */}
          <div className={cn(
            'grid gap-4 px-5 py-3 bg-secondary/30 text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium',
            hasSecondary ? 'grid-cols-4' : 'grid-cols-3'
          )}>
            <div>{columns[0]}</div>
            <div className="text-right">{columns[1]}</div>
            {hasSecondary && <div className="text-right">{columns[2]}</div>}
            <div className="text-right">%</div>
          </div>

          {/* Data rows */}
          {data.map((item, i) => {
            const percentage = total > 0 ? ((item.value / total) * 100) : 0;
            return (
              <div 
                key={i} 
                className={cn(
                  'grid gap-4 px-5 py-3 items-center hover:bg-secondary/20 transition-colors',
                  hasSecondary ? 'grid-cols-4' : 'grid-cols-3'
                )}
              >
                <div className="font-medium text-sm uppercase tracking-wide">{item.label}</div>
                <div className="text-right font-mono text-sm tabular-nums font-bold">{item.value}</div>
                {hasSecondary && (
                  <div className="text-right font-mono text-sm tabular-nums text-muted-foreground">
                    {item.secondaryValue ?? '—'}
                  </div>
                )}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-border overflow-hidden">
                      <div 
                        className="h-full bg-foreground transition-all" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs tabular-nums w-12 text-right text-muted-foreground">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Total row */}
          <div className={cn(
            'grid gap-4 px-5 py-3 bg-foreground text-primary-foreground font-bold',
            hasSecondary ? 'grid-cols-4' : 'grid-cols-3'
          )}>
            <div className="text-sm uppercase tracking-wide">Total</div>
            <div className="text-right font-mono text-sm tabular-nums">{total}</div>
            {hasSecondary && <div className="text-right">—</div>}
            <div className="text-right font-mono text-sm">100%</div>
          </div>
        </div>
      )}
    </div>
  );
}
