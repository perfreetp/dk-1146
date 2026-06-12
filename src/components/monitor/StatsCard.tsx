import { clsx } from 'clsx';
import type { LucideIcon } from 'lucide-react';

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return clsx(inputs);
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'accent' | 'warning' | 'info';
}

export function StatsCard({ title, value, change, changeType = 'neutral', icon: Icon, color = 'primary' }: StatsCardProps) {
  const colorStyles = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-blue-100 text-blue-600',
  };

  const changeStyles = {
    positive: 'text-accent',
    negative: 'text-red-500',
    neutral: 'text-dark-400',
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-dark-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-dark-900 mb-2">{value}</p>
          {change && (
            <p className={cn('text-sm font-medium', changeStyles[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div className={cn('p-3 rounded-xl', colorStyles[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
