'use client';

import React from 'react';
import { CreditCard, Check, X } from 'lucide-react';
import { Card, StatRow } from '@/components/ui/Card';
import { ConfidenceBar } from '@/components/ui/ProgressBar';
import { LabelBadge } from '@/components/ui/Badge';
import type { LicensePlateResult } from '@/types';

interface LicensePlateCardProps {
  lpr: LicensePlateResult;
}

export function LicensePlateCard({ lpr }: LicensePlateCardProps) {
  if (!lpr.detected) {
    return (
      <Card padding="lg" className="flex flex-col items-center gap-3 text-center">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
          <CreditCard size={18} strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-600">No Plate Detected</p>
          <p className="text-xs text-gray-400 mt-1">License plate could not be localized in this image.</p>
        </div>
      </Card>
    );
  }

  const plateTypeLabel: Record<string, string> = {
    private: 'Private Vehicle',
    commercial: 'Commercial',
    government: 'Government',
    unknown: 'Unknown',
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-[#0a0a0a] tracking-tight">License Plate Recognition</h2>
        <p className="text-xs text-gray-500 mt-0.5">OCR extraction and registration lookup</p>
      </div>

      <Card padding="lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Plate display */}
          <div className="flex-shrink-0">
            <div className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-[#0a0a0a] bg-white min-w-[180px]">
              <span className="text-2xl font-bold font-mono tracking-[0.15em] text-[#0a0a0a] tabular-nums">
                {lpr.plateNumber}
              </span>
            </div>
            <div className="flex justify-center mt-2">
              <LabelBadge variant="default">{plateTypeLabel[lpr.plateType]}</LabelBadge>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-3 w-full">
            <ConfidenceBar
              label="OCR Confidence"
              value={lpr.ocrConfidence}
              size="md"
            />

            <div className="space-y-0">
              {lpr.state && <StatRow label="State" value={lpr.state} />}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
