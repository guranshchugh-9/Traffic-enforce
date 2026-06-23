'use client';

import React, { useState } from 'react';
import { useAnalysisStore } from '@/store/analysisStore';
import type { Evidence } from '@/types';
import { cn } from '@/lib/utils';

interface EvidenceHeaderProps {
  evidence: Evidence;
}

export function EvidenceHeader({ evidence }: EvidenceHeaderProps) {
  const session = useAnalysisStore((s) => s.session);
  const sessionId = session.id;
  const [isImageLoading, setIsImageLoading] = useState(true);

  return (
    <div className="card rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Annotated image */}
      {evidence.annotatedImageUrl && (
        <div className="relative bg-[#0a0a0a] min-h-[200px] flex items-center justify-center">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
              <div className="w-6 h-6 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={evidence.annotatedImageUrl}
            alt="Annotated evidence image"
            className={cn(
              "w-full max-h-[480px] object-contain transition-all duration-300 ease-out",
              isImageLoading ? "opacity-30 blur-sm scale-98" : "opacity-100 blur-0 scale-100"
            )}
            onLoad={() => setIsImageLoading(false)}
          />
        </div>
      )}

      {/* Surrounding bar showing ONLY Session ID */}
      <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-400">Session ID:</span>
          <span className="text-xs font-mono font-semibold text-[#0a0a0a]">{sessionId}</span>
        </div>
      </div>
    </div>
  );
}
