// ============================================================
// Traffic Enforcer — Utility Functions
// ============================================================

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ViolationSeverity, ViolationType, StageId, VehicleCategory } from '@/types';

/** Merges Tailwind class names intelligently */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a confidence value (0–1) as a percentage string */
export function formatConfidence(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

/** Format a timestamp string to locale display */
export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}

/** Format bytes to human-readable file size */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Format milliseconds to human-readable duration */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/** Generate a unique session/evidence ID */
export function generateId(prefix = 'TE'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/** Get Tailwind color classes for violation severity */
export function getSeverityClasses(severity: ViolationSeverity): {
  badge: string;
  text: string;
  border: string;
  bg: string;
} {
  switch (severity) {
    case 'critical':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        text: 'text-red-700',
        border: 'border-red-200',
        bg: 'bg-red-50',
      };
    case 'high':
      return {
        badge: 'bg-orange-50 text-orange-700 border-orange-200',
        text: 'text-orange-700',
        border: 'border-orange-200',
        bg: 'bg-orange-50',
      };
    case 'medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        text: 'text-amber-700',
        border: 'border-amber-200',
        bg: 'bg-amber-50',
      };
    case 'low':
      return {
        badge: 'bg-gray-50 text-gray-600 border-gray-200',
        text: 'text-gray-600',
        border: 'border-gray-200',
        bg: 'bg-gray-50',
      };
  }
}

/** Human-readable label for violation types */
export const VIOLATION_LABELS: Record<ViolationType, string> = {
  helmet_non_compliance: 'Helmet Non-Compliance',
  seatbelt_non_compliance: 'Seatbelt Non-Compliance',
  triple_riding: 'Triple Riding',
  wrong_side_driving: 'Wrong-Side Driving',
  stop_line_violation: 'Stop-Line Violation',
  red_light_violation: 'Red-Light Violation',
  illegal_parking: 'Illegal Parking',
};

/** Human-readable label for vehicle categories */
export const VEHICLE_LABELS: Record<VehicleCategory, string> = {
  car: 'Car',
  motorcycle: 'Motorcycle',
  truck: 'Truck',
  bus: 'Bus',
  bicycle: 'Bicycle',
  auto_rickshaw: 'Auto-Rickshaw',
  pedestrian: 'Pedestrian',
};

/** Human-readable labels for pipeline stages */
export const STAGE_LABELS: Record<StageId, string> = {
  preprocessing: 'Image Preprocessing',
  detection: 'Vehicle & Road User Detection',
  violation_detection: 'Traffic Violation Detection',
  classification: 'Violation Classification',
  lpr: 'License Plate Recognition',
  evidence: 'Evidence Generation',
  analytics: 'Analytics Generation',
  report: 'Final Report',
};

/** Short description for each pipeline stage */
export const STAGE_DESCRIPTIONS: Record<StageId, string> = {
  preprocessing: 'Noise reduction, contrast normalization, resolution enhancement',
  detection: 'YOLO-based detection of vehicles, riders, and pedestrians',
  violation_detection: 'Rule-based and ML detection of traffic violations',
  classification: 'Multi-label classification of violation categories',
  lpr: 'License plate localization and OCR extraction',
  evidence: 'Annotation overlays and evidence package generation',
  analytics: 'Statistical aggregation and metric computation',
  report: 'Final report compilation and serialization',
};

/** Ordered pipeline stage IDs */
export const PIPELINE_STAGE_ORDER: StageId[] = [
  'preprocessing',
  'detection',
  'violation_detection',
  'classification',
  'lpr',
  'evidence',
  'analytics',
  'report',
];

/** Realistic processing time ranges per stage (in ms) */
export const STAGE_DURATIONS: Record<StageId, [number, number]> = {
  preprocessing: [6000, 10000],
  detection: [6000, 10000],
  violation_detection: [6000, 10000],
  classification: [6000, 10000],
  lpr: [6000, 10000],
  evidence: [6000, 10000],
  analytics: [6000, 10000],
  report: [6000, 10000],
};

/** Get a random integer between min and max (inclusive) */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Sleep for a given number of milliseconds */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
