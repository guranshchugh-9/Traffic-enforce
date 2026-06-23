import React from 'react';
import { cn } from '@/lib/utils';

// ─── Card ──────────────────────────────────────────────────────

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  hover?: boolean;
  accent?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  elevated = false,
  hover = false,
  accent = false,
  padding = 'md',
  children,
  className,
  ...props
}: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'card rounded-[14px]',
        elevated && 'card-elevated',
        hover && 'cursor-pointer hover:translate-y-[-1px] transition-transform duration-200',
        accent && 'border-red-100',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Card Header ──────────────────────────────────────────────

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, icon, className }: CardHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="flex items-start gap-3">
        {icon && (
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-[#0a0a0a] tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ─── Metric Card ──────────────────────────────────────────────

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  accent?: boolean;
  className?: string;
}

export function MetricCard({ label, value, subValue, icon, accent, className }: MetricCardProps) {
  return (
    <div
      className={cn(
        'card rounded-[14px] p-5 flex flex-col gap-3',
        accent && 'border-red-100',
        className
      )}
    >
      {icon && (
        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
      )}
      <div>
        <div
          className={cn(
            'text-2xl font-bold tracking-tight tabular-nums',
            accent ? 'accent-text' : 'text-[#0a0a0a]'
          )}
        >
          {value}
        </div>
        {subValue && <div className="text-xs text-gray-400 font-mono mt-0.5">{subValue}</div>}
        <div className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider truncate">{label}</div>
      </div>
    </div>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────

interface StatRowProps {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
  className?: string;
}

export function StatRow({ label, value, mono = false, className }: StatRowProps) {
  return (
    <div className={cn('flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0', className)}>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <span className={cn('text-xs text-[#0a0a0a] font-semibold', mono && 'font-mono')}>{value}</span>
    </div>
  );
}
