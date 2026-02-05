import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface DamageBreakdownChartProps {
  damageCount: number;
  noDamageCount: number;
  pendingCount: number;
  className?: string;
}

const COLORS = {
  damage: 'hsl(32, 100%, 50%)',
  noDamage: 'hsl(145, 63%, 32%)',
  pending: 'hsl(0, 0%, 45%)',
};

export function DamageBreakdownChart({ 
  damageCount, 
  noDamageCount, 
  pendingCount,
  className 
}: DamageBreakdownChartProps) {
  const total = damageCount + noDamageCount + pendingCount;
  
  const data = [
    { name: 'Damage', value: damageCount, color: COLORS.damage },
    { name: 'No Damage', value: noDamageCount, color: COLORS.noDamage },
    { name: 'Pending', value: pendingCount, color: COLORS.pending },
  ].filter(d => d.value > 0);

  const getPercentage = (value: number) => {
    if (total === 0) return '0';
    return ((value / total) * 100).toFixed(1);
  };

  if (total === 0) {
    return (
      <div className={cn('border-2 border-foreground bg-card', className)}>
        <div className="px-5 py-4 border-b-2 border-foreground">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground">
            Classification Breakdown
          </h3>
        </div>
        <div className="p-10 text-center text-muted-foreground text-sm">
          No classification data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border-2 border-foreground bg-card', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-foreground">
        <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground">
          Classification Breakdown
        </h3>
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
          Damage status distribution
        </p>
      </div>

      {/* Chart + Legend side by side */}
      <div className="p-5 flex flex-col sm:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="w-full sm:w-1/2 h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                stroke="hsl(0, 0%, 5%)"
                strokeWidth={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 5%)',
                  border: 'none',
                  padding: '12px 16px',
                  fontFamily: 'ui-monospace, monospace',
                }}
                labelStyle={{
                  color: 'hsl(60, 9%, 94%)',
                  fontWeight: 700,
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
                itemStyle={{
                  color: 'hsl(60, 9%, 94%)',
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [
                  `${value} (${getPercentage(value)}%)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full sm:w-1/2 space-y-4">
          {[
            { label: 'Damage', value: damageCount, color: COLORS.damage },
            { label: 'No Damage', value: noDamageCount, color: COLORS.noDamage },
            { label: 'Pending', value: pendingCount, color: COLORS.pending },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-4">
              <div 
                className="w-4 h-4 shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs uppercase tracking-wider font-medium text-foreground">
                    {item.label}
                  </span>
                  <span className="text-sm font-black tabular-nums">
                    {item.value}
                  </span>
                </div>
                <div className="mt-1 h-1 bg-secondary/50 w-full">
                  <div 
                    className="h-full transition-all"
                    style={{ 
                      width: `${getPercentage(item.value)}%`,
                      backgroundColor: item.color 
                    }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {getPercentage(item.value)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer total */}
      <div className="px-5 py-3 border-t-2 border-foreground bg-secondary/30 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          Total Tasks
        </span>
        <span className="text-lg font-black tabular-nums">{total}</span>
      </div>
    </div>
  );
}
