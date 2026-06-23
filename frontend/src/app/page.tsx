import React from 'react';
import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/PageShell';
import { UploadZone } from '@/components/dashboard/UploadZone';
import { CapabilitiesGrid } from '@/components/dashboard/CapabilitiesGrid';
import { StatsBar } from '@/components/dashboard/StatsBar';

export const metadata: Metadata = {
  title: 'Traffic Enforcer — AI Traffic Violation Detection',
  description:
    'Upload traffic footage for automated violation detection, license plate recognition, and evidence generation.',
};

export default function DashboardPage() {
  return (
    <PageShell gridBackground>
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-24">
        {/* ── Hero Section ───────────────────────────────────────── */}
        <section className="pt-20 pb-16 relative">
          {/* Decorative horizontal rule */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" aria-hidden="true" />

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-5 w-5 rounded flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(252,165,165,0.3), rgba(252,211,77,0.2))',
                border: '1px solid rgba(252,165,165,0.3)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            </div>
            <span className="text-xs font-mono text-gray-400 tracking-widest uppercase">
              AI Enforcement Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0a0a0a] tracking-tight leading-[1.0] mb-6 max-w-3xl">
            Automated
            <br />
            Traffic Violation
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #fca5a5, #f97316)' }}
            >
              Intelligence.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base text-gray-500 max-w-xl leading-relaxed mb-10">
            Upload traffic imagery for end-to-end AI analysis — from vehicle detection and violation
            classification to license plate recognition and tamper-proof evidence generation.
          </p>

          {/* System labels */}
          <div className="flex flex-wrap gap-2 mb-16">
            {[
              'Computer Vision',
              'YOLOv9 Detection',
              'TrOCR OCR Engine',
              'Evidence Chain-of-Custody',
              'FastAPI Backend',
            ].map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs font-mono text-gray-500 border border-gray-200 rounded-full bg-white"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Upload zone */}
          <div className="relative">
            {/* Architectural bracket lines */}
            <div className="absolute -top-4 -left-4 w-6 h-6 border-t border-l border-gray-300" aria-hidden="true" />
            <div className="absolute -top-4 -right-4 w-6 h-6 border-t border-r border-gray-300" aria-hidden="true" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 border-b border-l border-gray-300" aria-hidden="true" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 border-b border-r border-gray-300" aria-hidden="true" />

            <UploadZone />
          </div>
        </section>

        {/* ── Stats Bar ───────────────────────────────────────────── */}
        <StatsBar />

        {/* ── Capabilities Grid ───────────────────────────────────── */}
        <CapabilitiesGrid />

        {/* ── Footer note ─────────────────────────────────────────── */}
        <section id="about" className="border-t border-gray-100 pt-10 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-gray-400">
            <div className="space-y-1">
              <p className="font-semibold text-gray-600">AI Enforcement Platform</p>
              <p>
                Built for government agencies, traffic enforcement teams, and road safety organizations.
                Upload images for immediate processing.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-gray-300">
              <span>Traffic-CV</span>
              <span>·</span>
              <span>FastAPI</span>
              <span>·</span>
              <span>YOLOv9</span>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
