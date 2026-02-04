import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: LucideIcon;
  variant?: 'default' | 'damage' | 'no-damage' | 'pending';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon,
  variant = 'default',
  className 
}: StatCardProps) {
  return (
    <div className={cn(
      'relative p-6 border-2 border-foreground bg-card overflow-hidden',
      className
    )}>
      {/* Background accent stripe */}
      <div className={cn(
        'absolute top-0 left-0 w-1 h-full',
        variant === 'damage' && 'bg-status-damage',
        variant === 'no-damage' && 'bg-status-safe',
        variant === 'pending' && 'bg-status-pending',
        variant === 'default' && 'bg-foreground'
      )} />

      <div className="flex items-start justify-between">
        <div className="pl-3">
          <p className="data-label">{title}</p>
          <p className={cn(
            'mt-2 text-5xl font-black tracking-tighter tabular-nums',
            variant === 'damage' && 'text-status-damage',
            variant === 'no-damage' && 'text-status-safe',
            variant === 'pending' && 'text-status-pending',
            variant === 'default' && 'text-foreground'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-2 text-xs font-mono text-muted-foreground uppercase">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'p-2',
            variant === 'damage' && 'text-status-damage',
            variant === 'no-damage' && 'text-status-safe',
            variant === 'pending' && 'text-status-pending',
            variant === 'default' && 'text-muted-foreground'
          )}>
            <Icon className="w-6 h-6" strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
}
