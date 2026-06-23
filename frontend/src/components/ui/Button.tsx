import React from 'react';
import { cn } from '@/lib/utils';

// ─── Button Component ─────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      primary:
        'bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] active:bg-[#0a0a0a] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] active:scale-[0.98]',
      secondary:
        'bg-white text-[#0a0a0a] border border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f9fafb] active:bg-[#f3f4f6] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] active:scale-[0.98]',
      ghost:
        'bg-transparent text-[#6b7280] hover:text-[#0a0a0a] hover:bg-[#f3f4f6] active:bg-[#e5e7eb] active:scale-[0.98]',
    };

    const sizes = {
      sm: 'h-8 px-4 text-sm gap-1.5',
      md: 'h-10 px-6 text-sm',
      lg: 'h-12 px-8 text-base',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <LoadingSpinner size={size === 'sm' ? 14 : 16} />
        ) : (
          iconPosition === 'left' && icon && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && iconPosition === 'right' && icon && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ─── Inline Loading Spinner ────────────────────────────────────
function LoadingSpinner({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
