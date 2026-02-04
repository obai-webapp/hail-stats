import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  
  return (
    <div className={cn('rounded-xl border bg-card overflow-hidden', className)}>
      <div className="px-5 py-4 border-b bg-muted/30">
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      {data.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((col, i) => (
                <TableHead key={i} className={i > 0 ? 'text-right' : ''}>
                  {col}
                </TableHead>
              ))}
              <TableHead className="text-right">%</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell className="text-right tabular-nums">{item.value}</TableCell>
                {item.secondaryValue !== undefined && (
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {item.secondaryValue}
                  </TableCell>
                )}
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/30 font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right tabular-nums">{total}</TableCell>
              {data[0]?.secondaryValue !== undefined && (
                <TableCell className="text-right tabular-nums">—</TableCell>
              )}
              <TableCell className="text-right tabular-nums">100%</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}
