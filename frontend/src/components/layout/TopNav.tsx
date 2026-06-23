'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// ─── Traffic Enforcer Logo Mark ───────────────────────────────

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Grid lines forming a road intersection */}
      <rect x="1" y="1" width="22" height="22" rx="4" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
      <line x1="1" y1="8" x2="23" y2="8" stroke="#0a0a0a" strokeWidth="1" />
      <line x1="1" y1="16" x2="23" y2="16" stroke="#0a0a0a" strokeWidth="1" />
      <line x1="8" y1="1" x2="8" y2="23" stroke="#0a0a0a" strokeWidth="1" />
      <line x1="16" y1="1" x2="16" y2="23" stroke="#0a0a0a" strokeWidth="1" />
      {/* Target dot at intersection */}
      <circle cx="12" cy="12" r="2" fill="#0a0a0a" />
      <circle cx="12" cy="12" r="1" fill="white" />
    </svg>
  );
}

// ─── Top Navigation ───────────────────────────────────────────

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const pathname = usePathname();

  const isAnalysis = pathname.startsWith('/analysis');
  const isDashboard = pathname === '/';

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-[1440px] px-6 h-14 flex items-center justify-between gap-6">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <LogoMark className="transition-opacity group-hover:opacity-70" />
          <span className="text-sm font-semibold text-[#0a0a0a] tracking-tight">Traffic Enforcer</span>
        </Link>

        {/* Center: Breadcrumb on analysis pages */}
        {isAnalysis && (
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-[#0a0a0a] font-medium">Analysis Session</span>
          </div>
        )}

        {/* Right: Nav items */}
        <div className="flex items-center gap-1">
          {isDashboard && (
            <>
              <NavItem href="#capabilities">Capabilities</NavItem>
              <NavItem href="#about">About</NavItem>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="px-3 py-1.5 text-sm text-gray-500 hover:text-[#0a0a0a] rounded-lg hover:bg-gray-50 transition-all duration-150"
    >
      {children}
    </a>
  );
}
