'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  AnalysisSession,
  UploadedImage,
  PipelineStage,
  StageId,
  AnalysisReport,
  StageStatus,
  StageOutput,
  AppView,
} from '@/types';
import { PIPELINE_STAGE_ORDER, STAGE_LABELS, STAGE_DESCRIPTIONS } from '@/lib/utils';

// ─── Initial Pipeline Stages ──────────────────────────────────

function buildInitialStages(): PipelineStage[] {
  return PIPELINE_STAGE_ORDER.map((id) => ({
    id,
    label: STAGE_LABELS[id],
    description: STAGE_DESCRIPTIONS[id],
    status: 'pending' as StageStatus,
    output: undefined,
  }));
}

// ─── Store State ──────────────────────────────────────────────

interface AnalysisStore {
  session: AnalysisSession;

  // Actions
  setUploadedImage: (image: UploadedImage) => void;
  startSession: (sessionId: string) => void;
  setStageStatus: (stageId: StageId, status: StageStatus) => void;
  setStageOutput: (stageId: StageId, output: StageOutput) => void;
  setActiveStage: (stageId: StageId | null) => void;
  setSelectedStage: (stageId: StageId | null) => void;
  setReport: (report: AnalysisReport) => void;
  setView: (view: AppView) => void;
  resetSession: () => void;
}

const initialSession: AnalysisSession = {
  id: '',
  uploadedImage: null,
  stages: buildInitialStages(),
  activeStageId: null,
  selectedStageId: null,
  report: null,
  view: 'dashboard',
  startedAt: null,
};

// ─── Zustand Store ────────────────────────────────────────────

export const useAnalysisStore = create<AnalysisStore>()(
  devtools(
    (set) => ({
      session: initialSession,

      setUploadedImage: (image) =>
        set((state) => ({
          session: { ...state.session, uploadedImage: image },
        })),

      startSession: (sessionId) =>
        set((state) => ({
          session: {
            ...state.session,
            id: sessionId,
            stages: buildInitialStages(),
            activeStageId: null,
            selectedStageId: null,
            report: null,
            view: 'processing',
            startedAt: new Date().toISOString(),
          },
        })),

      setStageStatus: (stageId, status) =>
        set((state) => ({
          session: {
            ...state.session,
            stages: state.session.stages.map((s) =>
              s.id === stageId
                ? {
                    ...s,
                    status,
                    startedAt: status === 'processing' ? new Date().toISOString() : s.startedAt,
                    completedAt: status === 'completed' ? new Date().toISOString() : s.completedAt,
                  }
                : s
            ),
          },
        })),

      setStageOutput: (stageId, output) =>
        set((state) => ({
          session: {
            ...state.session,
            stages: state.session.stages.map((s) =>
              s.id === stageId ? { ...s, output } : s
            ),
          },
        })),

      setActiveStage: (stageId) =>
        set((state) => ({
          session: { ...state.session, activeStageId: stageId },
        })),

      setSelectedStage: (stageId) =>
        set((state) => ({
          session: { ...state.session, selectedStageId: stageId },
        })),

      setReport: (report) =>
        set((state) => ({
          session: { ...state.session, report },
        })),

      setView: (view) =>
        set((state) => ({
          session: { ...state.session, view },
        })),

      resetSession: () =>
        set(() => ({
          session: { ...initialSession, stages: buildInitialStages() },
        })),
    }),
    { name: 'TrafficEnforcer.AnalysisStore' }
  )
);
