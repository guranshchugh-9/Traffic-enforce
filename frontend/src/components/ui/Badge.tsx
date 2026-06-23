import React from 'react';
import { cn, getSeverityClasses } from '@/lib/utils';
import type { ViolationSeverity, StageStatus } from '@/types';

// ─── Severity Badge ───────────────────────────────────────────

interface SeverityBadgeProps {
  severity: ViolationSeverity;
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const { badge } = getSeverityClasses(severity);
  const labels: Record<ViolationSeverity, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border tracking-wide',
        badge,
        className
      )}
    >
      <span
        className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-red-500': severity === 'critical',
          'bg-orange-500': severity === 'high',
          'bg-amber-500': severity === 'medium',
          'bg-gray-400': severity === 'low',
        })}
      />
      {labels[severity]}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────

interface StatusBadgeProps {
  status: StageStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles: Record<StageStatus, string> = {
    pending: 'bg-gray-50 text-gray-400 border-gray-200',
    processing: 'bg-amber-50 text-amber-600 border-amber-200',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    error: 'bg-red-50 text-red-600 border-red-200',
  };

  const labels: Record<StageStatus, string> = {
    pending: 'Pending',
    processing: 'Processing',
    completed: 'Completed',
    error: 'Error',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        styles[status],
        className
      )}
    >
      <StatusDot status={status} />
      {labels[status]}
    </span>
  );
}

// ─── Status Dot ───────────────────────────────────────────────

export function StatusDot({ status, size = 'sm' }: { status: StageStatus; size?: 'xs' | 'sm' | 'md' }) {
  const sizes = { xs: 'w-1.5 h-1.5', sm: 'w-2 h-2', md: 'w-2.5 h-2.5' };
  const dotColors: Record<StageStatus, string> = {
    pending: 'bg-gray-300',
    processing: 'bg-amber-400',
    completed: 'bg-emerald-500',
    error: 'bg-red-500',
  };

  return (
    <span className="relative inline-flex items-center justify-center">
      <span className={cn('rounded-full', sizes[size], dotColors[status])} />
      {status === 'processing' && (
        <span
          className={cn(
            'absolute rounded-full bg-amber-400 opacity-60',
            sizes[size],
            'animate-ping'
          )}
        />
      )}
    </span>
  );
}

// ─── Generic Label Badge ──────────────────────────────────────

interface LabelBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline';
  className?: string;
}

export function LabelBadge({ children, variant = 'default', className }: LabelBadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    accent: 'accent-subtle-bg text-red-700 border-red-100',
    outline: 'bg-white text-gray-600 border-gray-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
