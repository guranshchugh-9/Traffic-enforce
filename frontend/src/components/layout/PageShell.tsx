import React from 'react';
import { cn } from '@/lib/utils';
import { TopNav } from './TopNav';

// ─── Page Shell ───────────────────────────────────────────────

interface PageShellProps {
  children: React.ReactNode;
  showNav?: boolean;
  gridBackground?: boolean;
  className?: string;
}

export function PageShell({
  children,
  showNav = true,
  gridBackground = false,
  className,
}: PageShellProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Subtle grid background */}
      {gridBackground && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          aria-hidden="true"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      )}

      {/* Decorative corner textures */}
      {gridBackground && (
        <>
          <div
            className="fixed top-0 right-0 w-64 h-64 pointer-events-none z-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              maskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at top right, black 20%, transparent 80%)',
            }}
          />
          <div
            className="fixed bottom-0 left-0 w-64 h-64 pointer-events-none z-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
              backgroundSize: '12px 12px',
              maskImage: 'radial-gradient(ellipse at bottom left, black 20%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at bottom left, black 20%, transparent 80%)',
            }}
          />
        </>
      )}

      {showNav && <TopNav />}

      <main className={cn('relative z-10 flex-1 flex flex-col', className)}>{children}</main>
    </div>
  );
}
