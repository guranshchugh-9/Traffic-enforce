'use client';

import React from 'react';
import {
  ScanEye,
  Car,
  AlertTriangle,
  Tag,
  CreditCard,
  Shield,
  BarChart3,
  FileText,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusDot } from '@/components/ui/Badge';
import { useAnalysisStore } from '@/store/analysisStore';
import type { StageId, StageStatus } from '@/types';

const STAGE_ICONS: Record<StageId, React.ReactNode> = {
  preprocessing: <ScanEye size={15} strokeWidth={1.5} />,
  detection: <Car size={15} strokeWidth={1.5} />,
  violation_detection: <AlertTriangle size={15} strokeWidth={1.5} />,
  classification: <Tag size={15} strokeWidth={1.5} />,
  lpr: <CreditCard size={15} strokeWidth={1.5} />,
  evidence: <Shield size={15} strokeWidth={1.5} />,
  analytics: <BarChart3 size={15} strokeWidth={1.5} />,
  report: <FileText size={15} strokeWidth={1.5} />,
};

export function PipelineSidebar() {
  const session = useAnalysisStore((s) => s.session);
  const setSelectedStage = useAnalysisStore((s) => s.setSelectedStage);
  const { stages, selectedStageId } = session;

  const handleStageClick = (stageId: StageId, status: StageStatus) => {
    if (status === 'completed' || status === 'processing') {
      setSelectedStage(stageId);
    }
  };

  return (
    <aside
      className="w-72 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col"
      aria-label="Pipeline navigator"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-200">
        <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Pipeline</p>
        <p className="text-sm font-semibold text-[#0a0a0a] mt-0.5">Processing Stages</p>
      </div>

      {/* Session ID */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">Session</p>
        <p className="text-xs font-mono text-gray-600 mt-0.5 truncate">{session.id}</p>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto py-3">
        <ol className="relative" aria-label="Pipeline stages">
          {stages.map((stage, index) => {
            const isSelected = selectedStageId === stage.id;
            const isClickable = stage.status === 'completed' || stage.status === 'processing';
            const isLast = index === stages.length - 1;

            return (
              <li key={stage.id} className="relative">
                {/* Vertical connector */}
                {!isLast && (
                  <div
                    className={cn(
                      'absolute left-[27px] top-[44px] w-px z-0',
                      stage.status === 'completed' ? 'bg-emerald-200' : 'bg-gray-100'
                    )}
                    style={{ height: 'calc(100% - 12px)' }}
                    aria-hidden="true"
                  />
                )}

                <button
                  id={`stage-btn-${stage.id}`}
                  onClick={() => handleStageClick(stage.id, stage.status)}
                  disabled={!isClickable}
                  className={cn(
                    'relative z-10 w-full flex items-start gap-3 px-4 py-3 text-left transition-all duration-150 rounded-none',
                    isSelected && 'bg-gray-50',
                    isClickable && !isSelected && 'hover:bg-gray-50 cursor-pointer',
                    !isClickable && 'cursor-default'
                  )}
                  aria-current={isSelected ? 'step' : undefined}
                  aria-label={`${stage.label}: ${stage.status}`}
                >
                  {/* Status icon */}
                  <div className="flex-shrink-0 mt-0.5">
                    <StageStatusIcon status={stage.status} icon={STAGE_ICONS[stage.id]} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          'text-xs font-semibold leading-tight',
                          stage.status === 'completed'
                            ? 'text-[#0a0a0a]'
                            : stage.status === 'processing'
                              ? 'text-[#0a0a0a]'
                              : 'text-gray-400'
                        )}
                      >
                        {stage.label}
                      </span>
                      <StatusDot status={stage.status} size="xs" />
                    </div>

                    {/* Duration badge */}
                    {stage.status === 'completed' && stage.output?.metadata?.processingTimeMs != null && (
                      <span className="inline-block mt-1.5 text-xs font-mono text-gray-400">
                        {(Number(stage.output.metadata.processingTimeMs) / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

// ─── Stage Status Icon ────────────────────────────────────────

function StageStatusIcon({
  status,
  icon,
}: {
  status: StageStatus;
  icon: React.ReactNode;
}) {
  if (status === 'completed') {
    return (
      <div className="w-8 h-8 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
        <Check size={14} strokeWidth={2.5} />
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-600">
          {icon}
        </div>
        <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="w-8 h-8 rounded-full bg-red-100 border border-red-200 flex items-center justify-center text-red-500">
        {icon}
      </div>
    );
  }

  // pending
  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300">
      {icon}
    </div>
  );
}
