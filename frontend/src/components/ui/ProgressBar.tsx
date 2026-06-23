import React from 'react';
import { cn, formatConfidence } from '@/lib/utils';

// ─── Confidence Bar ───────────────────────────────────────────

interface ConfidenceBarProps {
  value: number; // 0–1
  label?: string;
  showValue?: boolean;
  accent?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  delay?: number; // animation delay in ms
}

export function ConfidenceBar({
  value,
  label,
  showValue = true,
  accent = false,
  size = 'md',
  className,
  delay = 0,
}: ConfidenceBarProps) {
  const percentage = Math.round(value * 100);
  const heights = { sm: 'h-1', md: 'h-1.5' };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-2">
          {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono font-semibold text-[#0a0a0a] tabular-nums">
              {formatConfidence(value)}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all',
            accent
              ? 'accent-gradient'
              : percentage >= 90
                ? 'bg-emerald-500'
                : percentage >= 75
                  ? 'bg-gray-700'
                  : percentage >= 60
                    ? 'bg-amber-500'
                    : 'bg-red-500'
          )}
          style={{
            width: `${percentage}%`,
            transitionDelay: `${delay}ms`,
            transitionDuration: '600ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// ─── Processing Progress ──────────────────────────────────────

interface ProcessingProgressProps {
  label?: string;
  className?: string;
}

export function ProcessingProgress({ label = 'Processing...', className }: ProcessingProgressProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="text-xs text-gray-500">{label}</span>}
      <div className="h-0.5 w-full rounded-full overflow-hidden bg-gray-100">
        <div className="progress-shimmer h-full w-full rounded-full" />
      </div>
    </div>
  );
}

// ─── Radial Metric ────────────────────────────────────────────

interface RadialMetricProps {
  value: number; // 0–1
  label: string;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function RadialMetric({ value, label, size = 72, strokeWidth = 5, className }: RadialMetricProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - value * circumference;
  const percentage = Math.round(value * 100);

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#0a0a0a"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 800ms cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold tabular-nums text-[#0a0a0a]">{percentage}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500 text-center font-medium leading-tight">{label}</span>
    </div>
  );
}
