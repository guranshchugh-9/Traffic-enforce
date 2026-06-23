'use client';

import React, { useEffect, useState } from 'react';
import { cn, STAGE_LABELS } from '@/lib/utils';
import { useAnalysisStore } from '@/store/analysisStore';
import type { StageId } from '@/types';

export function ImageCanvas() {
  const session = useAnalysisStore((s) => s.session);
  const { stages, selectedStageId, activeStageId, uploadedImage } = session;

  // Determine which image to display
  const displayStageId = selectedStageId ?? activeStageId;
  const displayStage = stages.find((s) => s.id === displayStageId);
  const currentImageUrl =
    displayStage?.output?.imageUrl ??
    (() => {
      // Fall back to latest completed stage
      const completed = [...stages].reverse().find((s) => s.status === 'completed' && s.output?.imageUrl);
      return completed?.output?.imageUrl ?? uploadedImage?.previewUrl ?? null;
    })();

  const activeStage = stages.find((s) => s.id === activeStageId);
  const isProcessing = activeStage?.status === 'processing';

  // Track key for fade animation on image change
  const [imageKey, setImageKey] = useState(0);
  const [prevUrl, setPrevUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (currentImageUrl !== prevUrl) {
      setImageKey((k) => k + 1);
      setPrevUrl(currentImageUrl);
      setIsImageLoading(true);
    }
  }, [currentImageUrl, prevUrl]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
      {/* Image area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Grid overlay on background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        {currentImageUrl ? (
          <div
            key={imageKey}
            className="relative max-w-full max-h-full flex items-center justify-center"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
          >
            {isImageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10 rounded-lg">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                  <span className="text-xs font-mono text-white/60">Loading stage output...</span>
                </div>
              </div>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImageUrl}
              alt={`Analysis output — ${displayStageId ? STAGE_LABELS[displayStageId] : 'Original'}`}
              className={cn(
                "max-w-full max-h-full object-contain transition-all duration-300 ease-out",
                isImageLoading ? "opacity-30 scale-[0.98] blur-sm" : "opacity-100 scale-100 blur-0"
              )}
              style={{ maxHeight: 'calc(100vh - 200px)' }}
              draggable={false}
              onLoad={() => setIsImageLoading(false)}
            />

            {/* Stage label overlay */}
            {displayStageId && (
              <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 z-20">
                <span className="text-xs font-mono text-white/60">Stage</span>
                <span className="text-xs font-semibold text-white">
                  {STAGE_LABELS[displayStageId]}
                </span>
              </div>
            )}

            {/* Processing indicator overlay */}
            {isProcessing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[1px] z-20">
                <ProcessingIndicator stageName={STAGE_LABELS[activeStageId as StageId]} />
              </div>
            )}
          </div>
        ) : (
          /* No image yet */
          <div className="flex flex-col items-center gap-4 text-white/20">
            <div className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
            <span className="text-sm font-mono">Initializing...</span>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div className="h-10 bg-[#111] border-t border-white/5 flex items-center px-5 gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs font-mono text-white/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Traffic Enforcer Vision Engine</span>
        </div>
        <div className="h-3 w-px bg-white/10" />
        {activeStageId && (
          <span className="text-xs font-mono text-white/30 truncate">
            {isProcessing ? `Running: ${STAGE_LABELS[activeStageId]}` : `Last: ${STAGE_LABELS[activeStageId]}`}
          </span>
        )}
        <div className="ml-auto text-xs font-mono text-white/20">
          {uploadedImage?.name ?? '—'}
        </div>
      </div>
    </div>
  );
}

// ─── Processing Indicator ─────────────────────────────────────

function ProcessingIndicator({ stageName }: { stageName: string }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
      <div className="text-center">
        <p className="text-sm font-semibold text-[#0a0a0a]">{stageName}</p>
        <p className="text-xs text-gray-400 font-mono mt-0.5">Processing{dots}</p>
      </div>
    </div>
  );
}
