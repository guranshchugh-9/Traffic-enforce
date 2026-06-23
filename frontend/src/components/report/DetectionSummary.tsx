'use client';

import React from 'react';
import { Car } from 'lucide-react';
import { Card, MetricCard } from '@/components/ui/Card';
import type { DetectionResult } from '@/types';

interface DetectionSummaryProps {
  detection: DetectionResult;
}

export function DetectionSummary({ detection }: DetectionSummaryProps) {
  // Count by category
  const vehicleCounts = detection.vehicles.reduce(
    (acc, v) => {
      acc[v.category] = (acc[v.category] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-4">
      <SectionHeader title="Detection Results" subtitle="Entities identified in the scene" />

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-3">
        <MetricCard
          icon={<Car size={16} strokeWidth={1.5} />}
          label="Vehicles"
          value={detection.vehicles.length}
        />
      </div>

      {/* Vehicle detail rows */}
      {detection.vehicles.length > 0 && (
        <Card padding="md">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Vehicle Detections
          </p>
          <div className="space-y-0 divide-y divide-gray-50">
            {detection.vehicles.map((v) => (
              <div key={v.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                    <Car size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#0a0a0a] capitalize">
                      {v.category.replace('_', ' ')}
                    </p>
                    {v.trackingId && (
                      <p className="text-xs font-mono text-gray-400">{v.trackingId}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500">
                    {(v.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Model info */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 font-mono">
        <span className="truncate">Model: {detection.modelVersion}</span>
        <span className="hidden sm:inline">·</span>
        <span className="whitespace-nowrap">{detection.totalDetections} total detections</span>
        <span className="hidden sm:inline">·</span>
        <span className="whitespace-nowrap">{(detection.processingTimeMs / 1000).toFixed(1)}s</span>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h2 className="text-base font-bold text-[#0a0a0a] tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
