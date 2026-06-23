'use client';

import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAnalysisStore } from '@/store/analysisStore';
import { processStage, getFinalReport } from '@/lib/api';
import { generateId, PIPELINE_STAGE_ORDER } from '@/lib/utils';
import type { StageId, UploadedImage } from '@/types';

/**
 * usePipeline — Encapsulates all pipeline orchestration logic.
 * Replace `processStage` and `getFinalReport` imports with real
 * FastAPI calls when integrating the backend.
 */
export function usePipeline() {
  const router = useRouter();
  const store = useAnalysisStore();
  const abortRef = useRef(false);

  const runPipeline = useCallback(
    async (image: UploadedImage) => {
      abortRef.current = false;
      const startTime = Date.now();

      // Generate session ID and initialize
      const sessionId = generateId('SES');
      store.setUploadedImage(image);
      store.startSession(sessionId);

      // Navigate to the analysis page
      router.push(`/analysis/${sessionId}`);

      // Give the page a moment to mount
      await new Promise((r) => setTimeout(r, 600));

      let currentImageUrl = image.previewUrl;

      // ── Run each stage sequentially ──────────────────────────
      for (const stageId of PIPELINE_STAGE_ORDER) {
        if (abortRef.current) break;

        // Mark as processing
        store.setStageStatus(stageId, 'processing');
        store.setActiveStage(stageId);
        store.setSelectedStage(stageId);

        try {
          // Call the API (or real FastAPI endpoint when integrated)
          const result = await processStage(sessionId, stageId, currentImageUrl);

          if (abortRef.current) break;

          // Update stage output
          const outputImageUrl = result.imageUrl ?? currentImageUrl;
          store.setStageOutput(stageId, {
            imageUrl: outputImageUrl,
            metadata: result.metadata,
          });
          store.setStageStatus(stageId, 'completed');

          // The image shown in the canvas advances per stage
          currentImageUrl = outputImageUrl;
        } catch (error) {
          console.error(`Stage ${stageId} failed:`, error);
          store.setStageStatus(stageId, 'error');
          break;
        }
      }

      if (abortRef.current) return;

      // Wait for the 90 seconds timer to complete before showing the final report
      const maxTimeMs = 90000;
      const elapsed = Date.now() - startTime;
      const remaining = maxTimeMs - elapsed;
      if (remaining > 0 && !abortRef.current) {
        await new Promise((r) => setTimeout(r, remaining));
      }

      if (abortRef.current) return;

      // ── Fetch and set the final report ───────────────────────
      try {
        const reportResponse = await getFinalReport(sessionId, currentImageUrl);
        store.setReport(reportResponse.data);
        store.setView('report');
        store.setActiveStage(null);
      } catch (error) {
        console.error('Failed to generate final report:', error);
      }
    },
    [store, router]
  );

  const abort = useCallback(() => {
    abortRef.current = true;
  }, []);

  /** Derive the currently displayed image URL from the selected or active stage */
  const getDisplayImageUrl = useCallback((): string | null => {
    const { session } = useAnalysisStore.getState();
    const { selectedStageId, stages, uploadedImage } = session;

    if (selectedStageId) {
      const stage = stages.find((s) => s.id === selectedStageId);
      if (stage?.output?.imageUrl) return stage.output.imageUrl;
    }

    // Fall back to most recently completed stage's image
    const completed = [...stages].reverse().find((s) => s.status === 'completed' && s.output?.imageUrl);
    if (completed?.output?.imageUrl) return completed.output.imageUrl;

    return uploadedImage?.previewUrl ?? null;
  }, []);

  return { runPipeline, abort, getDisplayImageUrl };
}
