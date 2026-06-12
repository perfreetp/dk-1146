import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ReactNode, HTMLAttributes } from 'react';

export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: ReactNode;
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-dark-100 text-dark-600',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-accent/10 text-accent-600',
    warning: 'bg-warning/10 text-warning-600',
    danger: 'bg-red-100 text-red-600',
    info: 'bg-blue-100 text-blue-600',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface ComplianceBadgeProps {
  level: 'S' | 'A' | 'B' | 'C';
}

export function ComplianceBadge({ level }: ComplianceBadgeProps) {
  const configs = {
    S: { variant: 'success' as BadgeVariant, label: 'S级' },
    A: { variant: 'primary' as BadgeVariant, label: 'A级' },
    B: { variant: 'warning' as BadgeVariant, label: 'B级' },
    C: { variant: 'default' as BadgeVariant, label: 'C级' },
  };

  const config = configs[level];

  return (
    <Badge variant={config.variant} className="font-mono">
      {config.label}
    </Badge>
  );
}
