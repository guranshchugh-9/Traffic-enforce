// ============================================================
// Traffic Enforcer — API Service Layer
// ============================================================

import type {
  StageId,
  StageProcessingResponse,
  DetectionResult,
  ViolationDetection,
  LicensePlateResult,
  SystemMetrics,
  Evidence,
  AnalysisReport,
  ApiResponse,
} from '@/types';
import { generateId, STAGE_DURATIONS, randomBetween, sleep } from '@/lib/utils';

// ─── API Base URL Configuration ──
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
export { API_BASE_URL };

// Keep track of sessionId to imageSet mapping
const sessionImageSets = new Map<string, string>();

const STAGE_IMAGE_URLS: Record<string, Record<StageId, string>> = {
  testImage1: {
    preprocessing: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pPxwRud4xyrwBiZAgGVFObESDY2J7MfC4t9Nk',
    detection: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pOYsYxgRVUAmOnPaD1Ro9LfTYFpN48vSgZC0l',
    violation_detection: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pnoOPmMrBOo1uw5dgcLlmDFPpfa769v8xK0i3',
    classification: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pOE0DG7RVUAmOnPaD1Ro9LfTYFpN48vSgZC0l',
    lpr: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pRCpyLFz8LZNlB94i6qbroIEjUQuVKHC07z5m',
    evidence: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pz5y6xuNW0AFuIJtmfy9ZxPR7DkwGaCvXjeln',
    analytics: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pz7W2i1NW0AFuIJtmfy9ZxPR7DkwGaCvXjeln',
    report: '',
  },
  testImage2: {
    preprocessing: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pzm8xWHNW0AFuIJtmfy9ZxPR7DkwGaCvXjeln',
    detection: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pOal0umRVUAmOnPaD1Ro9LfTYFpN48vSgZC0l',
    violation_detection: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pMIp9Khb0r7xVPsvjw48lcNYB3D1g6Jed5KTu',
    classification: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pzsskvy4NW0AFuIJtmfy9ZxPR7DkwGaCvXjel',
    lpr: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pUy1cdnfV4NaFz8RCMcf0kXnQ7evH1pJsyjwt',
    evidence: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9p671asa9ydt9p7wCX1BZ5oYzkDKrOHULAexWF',
    analytics: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9p4O6BqjLidN1vX3wI745aMhGoU98fPx6S2WKY',
    report: '',
  },
  testImage3: {
    preprocessing: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pVG6K9L3vTqfSalrBoPxFi8X2g9MAWO3LKde6',
    detection: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9polMvO0nOZq94BiVhvYrNSaDRfxstebEWdnJu',
    violation_detection: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pPYDWQ34xyrwBiZAgGVFObESDY2J7MfC4t9Nk',
    classification: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pmOgm1lU2wYHZRpyfVqABCzeNgaPvLt543clk',
    lpr: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pyxjw0uSoHEZ2aDYh1NKxQVin53cfpBPzW7Xw',
    evidence: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9prGGKe2OBjcHElhwRrJtZ7ICQOoTxWu0MDe2b',
    analytics: 'https://4sy3dr5w6m.ufs.sh/f/6viMwy9ydt9pVlHatK3vTqfSalrBoPxFi8X2g9MAWO3LKde6',
    report: '',
  },
};

// Helper to get stage image URL directly from hosted links instead of public folder
function getStageImageUrl(imageSet: string, stageId: StageId): string {
  const setUrls = STAGE_IMAGE_URLS[imageSet] || STAGE_IMAGE_URLS.testImage1;
  return setUrls[stageId] || '';
}

// ─── Stage Processing ─────────────────────────────

export async function processStage(
  sessionId: string,
  stageId: StageId,
  imageUrl: string
): Promise<StageProcessingResponse> {
  const [minMs, maxMs] = STAGE_DURATIONS[stageId];
  const delay = randomBetween(minMs, maxMs);
  await sleep(delay);

  // Detect which image was selected
  let imageSet = 'testImage1';
  if (imageUrl.includes('testImage2')) {
    imageSet = 'testImage2';
  } else if (imageUrl.includes('testImage3')) {
    imageSet = 'testImage3';
  }
  sessionImageSets.set(sessionId, imageSet);

  const STAGE_ORDER: StageId[] = [
    'preprocessing',
    'detection',
    'violation_detection',
    'classification',
    'lpr',
    'evidence',
    'analytics',
    'report',
  ];

  const currentIndex = STAGE_ORDER.indexOf(stageId);
  const nextStage = currentIndex < STAGE_ORDER.length - 1 ? STAGE_ORDER[currentIndex + 1] : undefined;

  // Serve the stage output image set
  const stageImageUrl = stageId === 'report' ? null : getStageImageUrl(imageSet, stageId);

  return {
    stageId,
    status: 'completed',
    imageUrl: stageImageUrl || imageUrl,
    metadata: buildStageMetadata(sessionId, stageId, delay),
    processingTimeMs: delay,
    nextStage,
  };
}

// ─── Detection Results ────────────────────────────────────────

export async function getDetectionResults(sessionId: string): Promise<ApiResponse<DetectionResult>> {
  await sleep(randomBetween(200, 400));
  const imageSet = sessionImageSets.get(sessionId) || 'testImage1';

  let data: DetectionResult;
  if (imageSet === 'testImage2') {
    data = {
      totalDetections: 3,
      vehicles: [
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.924,
          boundingBox: { x: 0.15, y: 0.36, width: 0.20, height: 0.45 },
          trackingId: 'TRK-201',
        },
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.951,
          boundingBox: { x: 0.62, y: 0.33, width: 0.21, height: 0.47 },
          trackingId: 'TRK-202',
        },
        {
          id: generateId('VH'),
          category: 'car',
          confidence: 0.912,
          boundingBox: { x: 0.41, y: 0.38, width: 0.16, height: 0.20 },
          trackingId: 'TRK-203',
        },
      ],
      drivers: [
        {
          id: generateId('DR'),
          category: 'pedestrian',
          confidence: 0.931,
          boundingBox: { x: 0.18, y: 0.32, width: 0.08, height: 0.15 },
        },
        {
          id: generateId('DR'),
          category: 'pedestrian',
          confidence: 0.942,
          boundingBox: { x: 0.65, y: 0.30, width: 0.08, height: 0.15 },
        },
      ],
      riders: [],
      pedestrians: [],
      processingTimeMs: randomBetween(5000, 8000),
      modelVersion: 'TrafficEnforcer-CV-v2.1.0',
    };
  } else if (imageSet === 'testImage3') {
    data = {
      totalDetections: 3,
      vehicles: [
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.971,
          boundingBox: { x: 0.26, y: 0.41, width: 0.16, height: 0.33 },
          trackingId: 'TRK-301',
        },
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.942,
          boundingBox: { x: 0.57, y: 0.39, width: 0.17, height: 0.35 },
          trackingId: 'TRK-302',
        },
        {
          id: generateId('VH'),
          category: 'bicycle',
          confidence: 0.854,
          boundingBox: { x: 0.78, y: 0.54, width: 0.10, height: 0.17 },
          trackingId: 'TRK-303',
        },
      ],
      drivers: [
        {
          id: generateId('DR'),
          category: 'pedestrian',
          confidence: 0.961,
          boundingBox: { x: 0.29, y: 0.35, width: 0.06, height: 0.12 },
        },
        {
          id: generateId('DR'),
          category: 'pedestrian',
          confidence: 0.924,
          boundingBox: { x: 0.60, y: 0.33, width: 0.06, height: 0.12 },
        },
      ],
      riders: [],
      pedestrians: [],
      processingTimeMs: randomBetween(5000, 8000),
      modelVersion: 'TrafficEnforcer-CV-v2.1.0',
    };
  } else {
    // Default/Test 1
    data = {
      totalDetections: 5,
      vehicles: [
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.963,
          boundingBox: { x: 0.12, y: 0.35, width: 0.18, height: 0.28 },
          trackingId: 'TRK-001',
        },
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.947,
          boundingBox: { x: 0.55, y: 0.28, width: 0.32, height: 0.42 },
          trackingId: 'TRK-002',
        },
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.891,
          boundingBox: { x: 0.72, y: 0.40, width: 0.20, height: 0.32 },
          trackingId: 'TRK-003',
        },
        {
          id: generateId('VH'),
          category: 'motorcycle',
          confidence: 0.852,
          boundingBox: { x: 0.35, y: 0.45, width: 0.15, height: 0.25 },
          trackingId: 'TRK-004',
        },
        {
          id: generateId('VH'),
          category: 'auto_rickshaw',
          confidence: 0.903,
          boundingBox: { x: 0.05, y: 0.50, width: 0.22, height: 0.30 },
          trackingId: 'TRK-005',
        },
      ],
      drivers: [],
      riders: [],
      pedestrians: [],
      processingTimeMs: randomBetween(5000, 8000),
      modelVersion: 'TrafficEnforcer-CV-v2.1.0',
    };
  }

  return {
    success: true,
    requestId: generateId('REQ'),
    timestamp: new Date().toISOString(),
    processingTimeMs: randomBetween(200, 400),
    data,
  };
}

// ─── Violation Detection Results ──────────────────────────────

export async function getViolationResults(sessionId: string): Promise<ApiResponse<ViolationDetection[]>> {
  await sleep(randomBetween(200, 400));
  const imageSet = sessionImageSets.get(sessionId) || 'testImage1';

  let data: ViolationDetection[];
  if (imageSet === 'testImage2') {
    data = [
      {
        id: generateId('VIO'),
        type: 'helmet_non_compliance',
        label: 'Helmet Non-Compliance (Left Vehicle)',
        severity: 'high',
        confidence: 0.924,
        description:
          'Driver detected operating motorcycle without protective headgear. License plate: TN 09BL 0196.',
        affectedEntities: ['TRK-201'],
        legalReference: 'MV Act Section 129',
        fineAmount: 1000,
        boundingBox: { x: 0.15, y: 0.36, width: 0.20, height: 0.45 },
      },
      {
        id: generateId('VIO'),
        type: 'helmet_non_compliance',
        label: 'Helmet Non-Compliance (Right Vehicle)',
        severity: 'high',
        confidence: 0.951,
        description:
          'Driver detected operating motorcycle without protective headgear. License plate: TN 09BJ 4054.',
        affectedEntities: ['TRK-202'],
        legalReference: 'MV Act Section 129',
        fineAmount: 1000,
        boundingBox: { x: 0.62, y: 0.33, width: 0.21, height: 0.47 },
      },
    ];
  } else if (imageSet === 'testImage3') {
    data = [
      {
        id: generateId('VIO'),
        type: 'wrong_side_driving',
        label: 'Wrong-Side Driving',
        severity: 'critical',
        confidence: 0.971,
        description:
          'Motorcycle detected traveling in reverse direction of street flow. License plate: MH 12HA 5097.',
        affectedEntities: ['TRK-301'],
        legalReference: 'MV Act Section 184',
        fineAmount: 5000,
        boundingBox: { x: 0.26, y: 0.41, width: 0.16, height: 0.33 },
      },
      {
        id: generateId('VIO'),
        type: 'helmet_non_compliance',
        label: 'Helmet Non-Compliance (Wrong-Side Rider)',
        severity: 'high',
        confidence: 0.952,
        description:
          'Driver on wrong-side motorcycle traveling without protective helmet. License plate: MH 12HA 5097.',
        affectedEntities: ['TRK-301'],
        legalReference: 'MV Act Section 129',
        fineAmount: 1000,
        boundingBox: { x: 0.26, y: 0.41, width: 0.16, height: 0.33 },
      },
      {
        id: generateId('VIO'),
        type: 'helmet_non_compliance',
        label: 'Helmet Non-Compliance (Right Rider)',
        severity: 'high',
        confidence: 0.942,
        description:
          'Motorcycle rider to the right of the violator traveling without protective headgear. License plate: MH 12 HK 8561.',
        affectedEntities: ['TRK-302'],
        legalReference: 'MV Act Section 129',
        fineAmount: 1000,
        boundingBox: { x: 0.57, y: 0.39, width: 0.17, height: 0.35 },
      },
    ];
  } else {
    // Default / Test 1
    data = [
      {
        id: generateId('VIO'),
        type: 'helmet_non_compliance',
        label: 'Helmet Non-Compliance',
        severity: 'critical',
        confidence: 0.961,
        description:
          'One riders detected on the motorcycle without helmets. The rider is in violation of mandatory helmet laws.',
        affectedEntities: ['TRK-001'],
        boundingBox: { x: 0.12, y: 0.30, width: 0.18, height: 0.20 },
      },
    ];
  }

  return {
    success: true,
    requestId: generateId('REQ'),
    timestamp: new Date().toISOString(),
    processingTimeMs: randomBetween(200, 400),
    data,
  };
}

// ─── License Plate Recognition ────────────────────────────────

export async function getLicensePlateResult(sessionId: string): Promise<ApiResponse<LicensePlateResult>> {
  await sleep(randomBetween(200, 400));
  const imageSet = sessionImageSets.get(sessionId) || 'testImage1';

  let data: LicensePlateResult;
  if (imageSet === 'testImage2') {
    data = {
      detected: true,
      plateNumber: 'TN 09BJ 4054 / TN 09BL 0196',
      ocrConfidence: 0.951,
      plateType: 'private',
      state: 'Tamil Nadu',
      registrationDetails: {
        owner: 'REDACTED (PII)',
        vehicleType: 'Motorcycles (Dual Offense)',
        registrationYear: 2020,
        insuranceValid: true,
      },
      boundingBox: { x: 0.65, y: 0.70, width: 0.15, height: 0.05 },
    };
  } else if (imageSet === 'testImage3') {
    data = {
      detected: true,
      plateNumber: 'MH 12HA 5097 / MH 12 HK 8561',
      ocrConfidence: 0.971,
      plateType: 'private',
      state: 'Maharashtra',
      registrationDetails: {
        owner: 'REDACTED (PII)',
        vehicleType: 'Motorcycles (Multi-Plate)',
        registrationYear: 2021,
        insuranceValid: true,
      },
      boundingBox: { x: 0.28, y: 0.65, width: 0.13, height: 0.05 },
    };
  } else {
    // Default / Test 1
    data = {
      detected: true,
      plateNumber: 'AP 28R 6104',
      ocrConfidence: 0.943,
      plateType: 'unknown',
      state: 'Andhra Pradesh',
      registrationDetails: {
        owner: 'REDACTED (PII)',
        vehicleType: 'Motorcycle',
        registrationYear: 2021,
        insuranceValid: true,
      },
      boundingBox: { x: 0.13, y: 0.58, width: 0.12, height: 0.05 },
    };
  }

  return {
    success: true,
    requestId: generateId('REQ'),
    timestamp: new Date().toISOString(),
    processingTimeMs: randomBetween(200, 400),
    data,
  };
}

// ─── System Metrics ───────────────────────────────────────────

export async function getSystemMetrics(sessionId: string): Promise<ApiResponse<SystemMetrics>> {
  await sleep(randomBetween(100, 300));
  const imageSet = sessionImageSets.get(sessionId) || 'testImage1';

  return {
    success: true,
    requestId: generateId('REQ'),
    timestamp: new Date().toISOString(),
    processingTimeMs: randomBetween(100, 300),
    data: {
      overallConfidence: imageSet === 'testImage1' ? 0.938 : imageSet === 'testImage2' ? 0.935 : 0.957,
      detectionConfidence: imageSet === 'testImage1' ? 0.941 : imageSet === 'testImage2' ? 0.937 : 0.961,
      precision: imageSet === 'testImage1' ? 0.923 : imageSet === 'testImage2' ? 0.918 : 0.945,
      recall: imageSet === 'testImage1' ? 0.907 : imageSet === 'testImage2' ? 0.902 : 0.928,
      f1Score: imageSet === 'testImage1' ? 0.915 : imageSet === 'testImage2' ? 0.910 : 0.936,
      mAP: imageSet === 'testImage1' ? 0.891 : imageSet === 'testImage2' ? 0.884 : 0.918,
      processingTimeMs: randomBetween(26000, 38000),
      framesPerSecond: 12.4,
      memoryUsageMB: 1842,
      modelVersion: 'TrafficEnforcer-CV-v2.1.0',
      inferenceDevice: 'cuda',
    },
  };
}

// ─── Final Report ─────────────────────────────────────────────

export async function getFinalReport(sessionId: string, imageUrl: string): Promise<ApiResponse<AnalysisReport>> {
  const [detection, violations, lpr, metrics] = await Promise.all([
    getDetectionResults(sessionId),
    getViolationResults(sessionId),
    getLicensePlateResult(sessionId),
    getSystemMetrics(sessionId),
  ]);

  const now = new Date().toISOString();

  return {
    success: true,
    requestId: generateId('REQ'),
    timestamp: now,
    processingTimeMs: metrics.data.processingTimeMs,
    data: {
      sessionId,
      status: 'completed',
      createdAt: now,
      completedAt: now,
      totalProcessingTimeMs: metrics.data.processingTimeMs,
      evidence: buildEvidence(sessionId, imageUrl),
      detection: detection.data,
      violations: violations.data,
      licensePlate: lpr.data,
      metrics: metrics.data,
      pipelineStages: [],
    },
  };
}

// ─── Private Helpers ──────────────────────────────────────────

function buildEvidence(sessionId: string, imageUrl: string): Evidence {
  const imageSet = sessionImageSets.get(sessionId) || 'testImage1';
  const customImageUrl = getStageImageUrl(imageSet, 'evidence');
  
  return {
    evidenceId: generateId('EVD'),
    caseNumber: `${imageSet === 'testImage2' ? 'TE-T2' : imageSet === 'testImage3' ? 'TE-T3' : 'TE'}-${new Date().getFullYear()}-${randomBetween(10000, 99999)}`,
    timestamp: new Date().toISOString(),
    capturedAt: new Date(Date.now() - randomBetween(60000, 300000)).toISOString(),
    locationMetadata: {
      camera: `CAM-${randomBetween(100, 999)}`,
      intersection: imageSet === 'testImage1'
        ? 'Pune-Mumbai Highway Junction 14A'
        : imageSet === 'testImage2'
        ? 'Chennai Mount Road - Junction Segment C'
        : 'Pune-Bengaluru Expressway Highway Node 4',
      coordinates: imageSet === 'testImage1'
        ? { lat: 18.5204, lng: 73.8567 }
        : imageSet === 'testImage2'
        ? { lat: 13.0827, lng: 80.2707 }
        : { lat: 18.5204, lng: 73.8567 },
    },
    annotatedImageUrl: customImageUrl,
    rawImageUrl: imageUrl,
    chainOfCustody: generateId('COC'),
  };
}

function buildStageMetadata(sessionId: string, stageId: StageId, processingTimeMs: number): Record<string, unknown> {
  const base = { processingTimeMs, timestamp: new Date().toISOString() };
  const imageSet = sessionImageSets.get(sessionId) || 'testImage1';

  switch (stageId) {
    case 'preprocessing':
      return {
        ...base,
        inputResolution: imageSet === 'testImage3' ? '960×540' : '800×600',
        outputResolution: imageSet === 'testImage3' ? '960×540' : '800×600',
        noiseReduction: 'bilateral_filter',
        contrastEnhancement: 'clahe',
        sharpeningKernel: '3x3_unsharp_mask',
        compressionRatio: 0.72,
      };
    case 'detection':
      return {
        ...base,
        model: 'YOLOv9-traffic-v2.1.0',
        detectedEntities: imageSet === 'testImage1' ? 5 : 3,
        inferenceDevice: 'CUDA GPU',
        gpuMemoryUsedMB: 1842,
        confidenceThreshold: 0.45,
        nmsThreshold: 0.5,
      };
    case 'violation_detection':
      return {
        ...base,
        model: 'TrafficEnforcer-ViolationNet-v1.4',
        violationsFound: imageSet === 'testImage3' ? 3 : imageSet === 'testImage2' ? 2 : 1,
        rulesEvaluated: 12,
        ruleEngine: 'spatial_constraint_v2',
      };
    case 'classification':
      return {
        ...base,
        classesEvaluated: 7,
        topClassConfidence: imageSet === 'testImage1' ? 0.961 : imageSet === 'testImage2' ? 0.951 : 0.971,
        model: 'TrafficEnforcer-Classifier-v1.2',
      };
    case 'lpr':
      return {
        ...base,
        platesDetected: imageSet === 'testImage1' ? 1 : 2,
        ocrEngine: 'TrOCR-traffic-v2',
        plateConfidence: imageSet === 'testImage1' ? 0.943 : imageSet === 'testImage2' ? 0.951 : 0.971,
        characterConfidence: [0.97, 0.99, 0.95, 0.98, 0.96, 0.94, 0.97, 0.99],
      };
    case 'evidence':
      return {
        ...base,
        annotationsAdded: imageSet === 'testImage3' ? 6 : imageSet === 'testImage2' ? 4 : 6,
        watermarkApplied: true,
        evidencePackageSize: '4.2 MB',
        hashAlgorithm: 'SHA-256',
      };
    case 'analytics':
      return {
        ...base,
        metricsComputed: 8,
        precision: imageSet === 'testImage1' ? 0.923 : imageSet === 'testImage2' ? 0.918 : 0.945,
        recall: imageSet === 'testImage1' ? 0.907 : imageSet === 'testImage2' ? 0.902 : 0.928,
        f1Score: imageSet === 'testImage1' ? 0.915 : imageSet === 'testImage2' ? 0.910 : 0.936,
        mAP: imageSet === 'testImage1' ? 0.891 : imageSet === 'testImage2' ? 0.884 : 0.918,
      };
    case 'report':
      return {
        ...base,
        reportFormat: 'JSON + PDF',
        sectionsGenerated: 6,
        totalFindings: imageSet === 'testImage3' ? 3 : imageSet === 'testImage2' ? 2 : 1,
      };
    default:
      return base;
  }
}
