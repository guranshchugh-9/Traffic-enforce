'use client';

import React from 'react';
import { cn, formatDuration, STAGE_LABELS } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { ConfidenceBar } from '@/components/ui/ProgressBar';
import { useAnalysisStore } from '@/store/analysisStore';

// Helper to safely get a value from metadata as string
function str(metadata: Record<string, unknown>, key: string): string {
  return String(metadata[key] ?? '—');
}

// Helper to safely get a number from metadata
function num(metadata: Record<string, unknown>, key: string): number {
  return Number(metadata[key] ?? 0);
}

// Helper to safely get boolean as string
function boolStr(metadata: Record<string, unknown>, key: string, t = 'Yes', f = 'No'): string {
  return metadata[key] ? t : f;
}

export function StageOutputPanel() {
  const session = useAnalysisStore((s) => s.session);
  const { stages, selectedStageId } = session;

  const selected = stages.find((s) => s.id === selectedStageId);
  if (!selected || selected.status !== 'completed' || !selected.output) return null;

  const { metadata } = selected.output;
  const processingTimeMs = num(metadata, 'processingTimeMs');

  return (
    <div className={cn('w-full border-t border-gray-200 bg-white slide-up')}>
      <div className="mx-auto max-w-[1440px] px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Output</span>
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs text-gray-500 font-semibold">{STAGE_LABELS[selected.id]}</span>
          {processingTimeMs > 0 && (
            <span className="text-xs font-mono text-gray-400">{formatDuration(processingTimeMs)}</span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {renderStageMetadata(selected.id, metadata)}
        </div>
      </div>
    </div>
  );
}

function MetaCard({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <Card padding="sm">
      <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
      <p className={cn('text-sm font-semibold text-[#0a0a0a] truncate', mono && 'font-mono text-xs')}>
        {value}
      </p>
    </Card>
  );
}

function renderStageMetadata(stageId: string, metadata: Record<string, unknown>) {
  switch (stageId) {
    case 'preprocessing':
      return (
        <>
          <MetaCard label="Input Resolution" value={str(metadata, 'inputResolution')} />
          <MetaCard label="Output Resolution" value={str(metadata, 'outputResolution')} />
          <MetaCard label="Noise Reduction" value={str(metadata, 'noiseReduction')} mono />
          <MetaCard label="Contrast" value={str(metadata, 'contrastEnhancement')} mono />
          <MetaCard label="Compression" value={`${Math.round(num(metadata, 'compressionRatio') * 100)}%`} />
        </>
      );

    case 'detection':
      return (
        <>
          <MetaCard label="Model" value={str(metadata, 'model')} />
          <MetaCard label="Entities Detected" value={str(metadata, 'detectedEntities')} />
          <MetaCard label="Inference Device" value={str(metadata, 'inferenceDevice')} />
          <MetaCard label="GPU Memory" value={`${str(metadata, 'gpuMemoryUsedMB')} MB`} />
          <div className="col-span-1 flex flex-col gap-2">
            <Card padding="sm">
              <ConfidenceBar label="Confidence Threshold" value={num(metadata, 'confidenceThreshold')} size="sm" />
            </Card>
          </div>
        </>
      );

    case 'violation_detection':
      return (
        <>
          <MetaCard label="Model" value={str(metadata, 'model')} />
          <MetaCard label="Violations Found" value={str(metadata, 'violationsFound')} />
          <MetaCard label="Rules Evaluated" value={str(metadata, 'rulesEvaluated')} />
          <MetaCard label="Rule Engine" value={str(metadata, 'ruleEngine')} mono />
        </>
      );

    case 'classification':
      return (
        <>
          <MetaCard label="Classes" value={str(metadata, 'classesEvaluated')} />
          <MetaCard label="Model" value={str(metadata, 'model')} />
          <div className="col-span-1 flex flex-col gap-2">
            <Card padding="sm">
              <ConfidenceBar label="Top Class Confidence" value={num(metadata, 'topClassConfidence')} size="sm" />
            </Card>
          </div>
        </>
      );

    case 'lpr':
      return (
        <>
          <MetaCard label="Plates Detected" value={str(metadata, 'platesDetected')} />
          <MetaCard label="OCR Engine" value={str(metadata, 'ocrEngine')} />
          <div className="col-span-2 flex flex-col gap-2">
            <Card padding="sm">
              <ConfidenceBar label="Plate Confidence" value={num(metadata, 'plateConfidence')} size="sm" />
            </Card>
          </div>
        </>
      );

    case 'evidence':
      return (
        <>
          <MetaCard label="Annotations" value={str(metadata, 'annotationsAdded')} />
          <MetaCard label="Package Size" value={str(metadata, 'evidencePackageSize')} />
          <MetaCard label="Hash" value={str(metadata, 'hashAlgorithm')} mono />
          <MetaCard label="Watermark" value={boolStr(metadata, 'watermarkApplied', 'Applied', 'No')} />
        </>
      );

    case 'analytics':
      return (
        <>
          <div className="col-span-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card padding="sm">
                <ConfidenceBar label="Precision" value={num(metadata, 'precision')} size="sm" />
              </Card>
              <Card padding="sm">
                <ConfidenceBar label="Recall" value={num(metadata, 'recall')} size="sm" />
              </Card>
              <Card padding="sm">
                <ConfidenceBar label="F1-Score" value={num(metadata, 'f1Score')} size="sm" />
              </Card>
              <Card padding="sm">
                <ConfidenceBar label="mAP" value={num(metadata, 'mAP')} size="sm" />
              </Card>
            </div>
          </div>
        </>
      );

    case 'report':
      return (
        <>
          <MetaCard label="Format" value={str(metadata, 'reportFormat')} />
          <MetaCard label="Sections" value={str(metadata, 'sectionsGenerated')} />
          <MetaCard label="Total Findings" value={str(metadata, 'totalFindings')} />
        </>
      );

    default:
      return null;
  }
}
