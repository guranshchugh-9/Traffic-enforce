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
} from 'lucide-react';

interface Capability {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}

const CAPABILITIES: Capability[] = [
  {
    icon: <ScanEye size={18} strokeWidth={1.5} />,
    title: 'Image Preprocessing',
    description: 'Noise reduction, CLAHE contrast enhancement, and resolution normalization for optimal inference.',
    tag: 'Stage 01',
  },
  {
    icon: <Car size={18} strokeWidth={1.5} />,
    title: 'Vehicle & Road User Detection',
    description: 'YOLOv9-based multi-class detection of vehicles, motorcycles, bicycles, and pedestrians.',
    tag: 'Stage 02',
  },
  {
    icon: <AlertTriangle size={18} strokeWidth={1.5} />,
    title: 'Traffic Violation Detection',
    description: 'Spatial constraint engine identifying violations against defined traffic rules and zones.',
    tag: 'Stage 03',
  },
  {
    icon: <Tag size={18} strokeWidth={1.5} />,
    title: 'Violation Classification',
    description: 'Multi-label classification across 7 violation categories with severity grading.',
    tag: 'Stage 04',
  },
  {
    icon: <CreditCard size={18} strokeWidth={1.5} />,
    title: 'License Plate Recognition',
    description: 'High-accuracy plate localization with TrOCR character-level extraction and validation.',
    tag: 'Stage 05',
  },
  {
    icon: <Shield size={18} strokeWidth={1.5} />,
    title: 'Evidence Generation',
    description: 'Tamper-proof annotated evidence packages with chain-of-custody hashing.',
    tag: 'Stage 06',
  },
  {
    icon: <BarChart3 size={18} strokeWidth={1.5} />,
    title: 'Analytics & Reporting',
    description: 'Statistical aggregation of detection metrics: precision, recall, F1, and mAP computation.',
    tag: 'Stage 07',
  },
  {
    icon: <FileText size={18} strokeWidth={1.5} />,
    title: 'Performance Evaluation',
    description: 'End-to-end pipeline benchmarking with per-stage latency and GPU utilization telemetry.',
    tag: 'Stage 08',
  },
];

export function CapabilitiesGrid() {
  return (
    <section id="capabilities" className="py-16">
      {/* Section header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 max-w-8 bg-gray-200" />
          <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Pipeline</span>
        </div>
        <h2 className="text-2xl font-bold text-[#0a0a0a] tracking-tight">
          Eight-Stage Detection Pipeline
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-lg leading-relaxed">
          Each image is processed through a sequential AI pipeline, with full explainability at every stage.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 border border-gray-200 rounded-2xl overflow-hidden">
        {CAPABILITIES.map((cap, i) => (
          <CapabilityCell key={cap.tag} capability={cap} index={i} />
        ))}
      </div>
    </section>
  );
}

function CapabilityCell({
  capability,
  index,
}: {
  capability: Capability;
  index: number;
}) {
  // Accent the first cell slightly
  const isFirst = index === 0;

  return (
    <div
      className={`bg-white p-6 flex flex-col gap-4 group hover:bg-gray-50 transition-colors duration-150 ${
        isFirst ? 'sm:col-span-2 lg:col-span-1' : ''
      }`}
    >
      {/* Stage tag + icon */}
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-gray-200 transition-colors">
          {capability.icon}
        </div>
        <span className="text-xs font-mono text-gray-300">{capability.tag}</span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-[#0a0a0a] leading-snug tracking-tight">
          {capability.title}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">{capability.description}</p>
      </div>
    </div>
  );
}
