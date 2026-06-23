// ============================================================
// Traffic Enforcer — Traffic Violation Detection System
// Type Definitions
// ============================================================

// ─── Pipeline Stage Types ────────────────────────────────────

export type StageStatus = 'pending' | 'processing' | 'completed' | 'error';

export type StageId =
  | 'preprocessing'
  | 'detection'
  | 'violation_detection'
  | 'classification'
  | 'lpr'
  | 'evidence'
  | 'analytics'
  | 'report';

export interface PipelineStage {
  id: StageId;
  label: string;
  description: string;
  status: StageStatus;
  durationMs?: number;
  startedAt?: string;
  completedAt?: string;
  output?: StageOutput;
}

export interface StageOutput {
  imageUrl: string | null;
  metadata: Record<string, unknown>;
}

// ─── Upload Types ─────────────────────────────────────────────

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  sizeBytes: number;
  mimeType: string;
  uploadedAt: string;
}

// ─── Detection Types ──────────────────────────────────────────

export type VehicleCategory =
  | 'car'
  | 'motorcycle'
  | 'truck'
  | 'bus'
  | 'bicycle'
  | 'auto_rickshaw'
  | 'pedestrian';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectedEntity {
  id: string;
  category: VehicleCategory;
  confidence: number;
  boundingBox: BoundingBox;
  trackingId?: string;
}

export interface DetectionResult {
  totalDetections: number;
  vehicles: DetectedEntity[];
  drivers: DetectedEntity[];
  riders: DetectedEntity[];
  pedestrians: DetectedEntity[];
  processingTimeMs: number;
  modelVersion: string;
}

// ─── Violation Types ──────────────────────────────────────────

export type ViolationType =
  | 'helmet_non_compliance'
  | 'seatbelt_non_compliance'
  | 'triple_riding'
  | 'wrong_side_driving'
  | 'stop_line_violation'
  | 'red_light_violation'
  | 'illegal_parking';

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface ViolationDetection {
  id: string;
  type: ViolationType;
  label: string;
  severity: ViolationSeverity;
  confidence: number;
  description: string;
  affectedEntities: string[];
  legalReference?: string;
  fineAmount?: number;
  boundingBox?: BoundingBox;
}

// ─── License Plate Recognition Types ─────────────────────────

export interface LicensePlateResult {
  detected: boolean;
  plateNumber: string | null;
  ocrConfidence: number;
  plateType: 'private' | 'commercial' | 'government' | 'unknown';
  state?: string;
  registrationDetails?: {
    owner?: string;
    vehicleType?: string;
    registrationYear?: number;
    insuranceValid?: boolean;
  };
  boundingBox?: BoundingBox;
}

// ─── System Metrics Types ─────────────────────────────────────

export interface SystemMetrics {
  overallConfidence: number;
  detectionConfidence: number;
  precision: number;
  recall: number;
  f1Score: number;
  mAP: number;
  processingTimeMs: number;
  framesPerSecond?: number;
  memoryUsageMB?: number;
  modelVersion: string;
  inferenceDevice: 'cpu' | 'cuda' | 'mps';
}

// ─── Evidence Types ───────────────────────────────────────────

export interface Evidence {
  evidenceId: string;
  caseNumber: string;
  timestamp: string;
  capturedAt: string;
  locationMetadata: {
    camera?: string;
    intersection?: string;
    coordinates?: { lat: number; lng: number };
  };
  annotatedImageUrl: string | null;
  rawImageUrl: string | null;
  chainOfCustody: string;
}

// ─── Full Analysis Report ─────────────────────────────────────

export interface AnalysisReport {
  sessionId: string;
  status: 'processing' | 'completed' | 'error';
  createdAt: string;
  completedAt?: string;
  totalProcessingTimeMs: number;
  evidence: Evidence;
  detection: DetectionResult;
  violations: ViolationDetection[];
  licensePlate: LicensePlateResult;
  metrics: SystemMetrics;
  pipelineStages: PipelineStage[];
}

// ─── API Response Wrapper ─────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  requestId: string;
  timestamp: string;
  processingTimeMs: number;
}

export interface StageProcessingResponse {
  stageId: StageId;
  status: 'completed' | 'error';
  imageUrl: string | null;
  metadata: Record<string, unknown>;
  processingTimeMs: number;
  nextStage?: StageId;
}

// ─── UI State Types ───────────────────────────────────────────

export type AppView = 'dashboard' | 'processing' | 'report';

export interface AnalysisSession {
  id: string;
  uploadedImage: UploadedImage | null;
  stages: PipelineStage[];
  activeStageId: StageId | null;
  selectedStageId: StageId | null;
  report: AnalysisReport | null;
  view: AppView;
  startedAt: string | null;
}
