import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { cn } from '@/lib/utils';

interface DentSizeChartProps {
  data: { size: string; totalBoxes: number; imageCount: number }[];
  className?: string;
}

const COLORS = [
  'hsl(48, 96%, 53%)',   // accent yellow
  'hsl(32, 100%, 50%)',  // damage orange
  'hsl(145, 63%, 32%)',  // safe green
  'hsl(0, 0%, 40%)',     // gray
  'hsl(0, 0%, 20%)',     // dark
];

export function DentSizeChart({ data, className }: DentSizeChartProps) {
  const chartData = data.map(d => ({
    name: d.size.replace('_', ' '),
    boxes: d.totalBoxes,
    images: d.imageCount,
  }));

  if (chartData.length === 0) {
    return (
      <div className={cn('border-2 border-foreground bg-card', className)}>
        <div className="px-5 py-4 border-b-2 border-foreground">
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground">
            Dent Size Breakdown
          </h3>
        </div>
        <div className="p-10 text-center text-muted-foreground text-sm">
          No dent data available
        </div>
      </div>
    );
  }

  return (
    <div className={cn('border-2 border-foreground bg-card', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-foreground flex items-center justify-between">
        <div>
          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-foreground">
            Dent Size Breakdown
          </h3>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">
            Total boxes by category
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-foreground" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Boxes</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-5">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
            <XAxis 
              type="number" 
              axisLine={{ stroke: 'hsl(0, 0%, 82%)' }}
              tickLine={false}
              tick={{ 
                fontSize: 10, 
                fill: 'hsl(0, 0%, 35%)',
                fontFamily: 'ui-monospace, monospace'
              }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 11, 
                fill: 'hsl(0, 0%, 5%)',
                fontWeight: 700,
              }}
              width={100}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(48, 30%, 90%)' }}
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
                marginBottom: 8,
              }}
              itemStyle={{
                color: 'hsl(60, 9%, 94%)',
                fontSize: 12,
                padding: '2px 0',
              }}
              formatter={(value: number, name: string) => [
                value,
                name === 'boxes' ? 'Total Boxes' : 'Images'
              ]}
            />
            <Bar 
              dataKey="boxes" 
              radius={0}
              maxBarSize={40}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats footer */}
      <div className="px-5 py-4 border-t-2 border-foreground bg-secondary/30 grid grid-cols-2 sm:grid-cols-5 gap-4">
        {chartData.map((item, i) => (
          <div key={item.name} className="text-center">
            <div 
              className="w-full h-1 mb-2" 
              style={{ backgroundColor: COLORS[i % COLORS.length] }} 
            />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.name}</p>
            <p className="text-lg font-black tabular-nums">{item.boxes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
