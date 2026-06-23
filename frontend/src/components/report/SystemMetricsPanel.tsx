'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { RadialMetric } from '@/components/ui/ProgressBar';
import type { SystemMetrics } from '@/types';

interface SystemMetricsPanelProps {
  metrics: SystemMetrics;
}

export function SystemMetricsPanel({ metrics }: SystemMetricsPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-[#0a0a0a] tracking-tight">System Metrics</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          End-to-end pipeline performance and model evaluation scores
        </p>
      </div>

      {/* Radial metrics row */}
      <Card padding="lg">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
          Model Evaluation
        </p>
        <div className="flex flex-wrap gap-6 justify-around">
          <RadialMetric value={metrics.overallConfidence} label="Overall Confidence" size={80} />
          <RadialMetric value={metrics.precision} label="Precision" size={80} />
          <RadialMetric value={metrics.recall} label="Recall" size={80} />
          <RadialMetric value={metrics.f1Score} label="F1 Score" size={80} />
          <RadialMetric value={metrics.mAP} label="mAP" size={80} />
        </div>
      </Card>
    </div>
  );
}
