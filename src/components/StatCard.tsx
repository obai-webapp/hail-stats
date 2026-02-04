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
      'p-5 rounded-xl border bg-card transition-all',
      variant === 'damage' && 'border-status-damage/30 bg-status-damage/5',
      variant === 'no-damage' && 'border-status-safe/30 bg-status-safe/5',
      variant === 'pending' && 'border-status-pending/30 bg-status-pending/5',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            'mt-1 text-3xl font-semibold tracking-tight',
            variant === 'damage' && 'text-status-damage',
            variant === 'no-damage' && 'text-status-safe',
            variant === 'pending' && 'text-status-pending',
            variant === 'default' && 'text-foreground'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={cn(
            'p-2 rounded-lg',
            variant === 'damage' && 'bg-status-damage/10 text-status-damage',
            variant === 'no-damage' && 'bg-status-safe/10 text-status-safe',
            variant === 'pending' && 'bg-status-pending/10 text-status-pending',
            variant === 'default' && 'bg-muted text-muted-foreground'
          )}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
