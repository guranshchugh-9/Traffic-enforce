'use client';

import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  HardHat,
  Ban,
  Users,
  ArrowLeftRight,
  OctagonX,
  TrafficCone,
  ParkingSquare,
} from 'lucide-react';
import { cn, getSeverityClasses, formatConfidence } from '@/lib/utils';
import { SeverityBadge } from '@/components/ui/Badge';
import { ConfidenceBar } from '@/components/ui/ProgressBar';
import { Card } from '@/components/ui/Card';
import type { ViolationDetection, ViolationType } from '@/types';

const VIOLATION_ICONS: Record<ViolationType, React.ReactNode> = {
  helmet_non_compliance: <HardHat size={15} strokeWidth={1.5} />,
  seatbelt_non_compliance: <Ban size={15} strokeWidth={1.5} />,
  triple_riding: <Users size={15} strokeWidth={1.5} />,
  wrong_side_driving: <ArrowLeftRight size={15} strokeWidth={1.5} />,
  stop_line_violation: <OctagonX size={15} strokeWidth={1.5} />,
  red_light_violation: <TrafficCone size={15} strokeWidth={1.5} />,
  illegal_parking: <ParkingSquare size={15} strokeWidth={1.5} />,
};

interface ViolationsPanelProps {
  violations: ViolationDetection[];
}

export function ViolationsPanel({ violations }: ViolationsPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(violations[0]?.id ?? null);

  const criticalCount = violations.filter((v) => v.severity === 'critical').length;
  const highCount = violations.filter((v) => v.severity === 'high').length;

  const groupedViolations = violations.reduce((acc, v) => {
    const entity = v.affectedEntities?.[0] || 'Unknown Vehicle';
    if (!acc[entity]) acc[entity] = [];
    acc[entity].push(v);
    return acc;
  }, {} as Record<string, ViolationDetection[]>);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-[#0a0a0a] tracking-tight">Violations Detected</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {violations.length} violation{violations.length !== 1 ? 's' : ''} detected
            {criticalCount > 0 && ` · ${criticalCount} critical`}
            {highCount > 0 && ` · ${highCount} high severity`}
          </p>
        </div>
        {violations.length > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-100 bg-red-50">
            <AlertTriangle size={12} className="text-red-500" />
            <span className="text-xs font-semibold text-red-600">{violations.length} Violations</span>
          </div>
        )}
      </div>

      {/* Violations list */}
      <div className="space-y-6">
        {Object.entries(groupedViolations).map(([entityId, entityViolations]) => (
          <div key={entityId} className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block">
              Vehicle ID: {entityId}
            </h3>
            <div className="space-y-2">
              {entityViolations.map((violation) => (
                <ViolationRow
                  key={violation.id}
                  violation={violation}
                  isExpanded={expandedId === violation.id}
                  onToggle={() =>
                    setExpandedId((prev) => (prev === violation.id ? null : violation.id))
                  }
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {violations.length === 0 && (
        <Card padding="lg" className="text-center">
          <div className="flex flex-col items-center gap-3 text-gray-300">
            <AlertTriangle size={32} strokeWidth={1} />
            <p className="text-sm font-medium text-gray-500">No violations detected</p>
          </div>
        </Card>
      )}
    </div>
  );
}

function ViolationRow({
  violation,
  isExpanded,
  onToggle,
}: {
  violation: ViolationDetection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const { bg, border } = getSeverityClasses(violation.severity);
  const isCritical = violation.severity === 'critical';

  return (
    <div
      className={cn(
        'rounded-[14px] border overflow-hidden transition-all duration-200',
        isCritical ? 'border-red-100' : border,
        isCritical && 'shadow-[0_2px_8px_rgba(252,165,165,0.15)]'
      )}
    >
      {/* Row header */}
      <button
        id={`violation-toggle-${violation.id}`}
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-3 p-4 text-left transition-colors duration-150',
          isCritical ? 'bg-red-50/50 hover:bg-red-50' : 'bg-white hover:bg-gray-50'
        )}
        aria-expanded={isExpanded}
        aria-label={`Toggle details for ${violation.label}`}
      >
        {/* Icon */}
        <div
          className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
            isCritical ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
          )}
        >
          {VIOLATION_ICONS[violation.type]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-[#0a0a0a]">{violation.label}</span>
            <SeverityBadge severity={violation.severity} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{violation.description}</p>
        </div>

        {/* Confidence + toggle */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-sm font-mono font-bold text-[#0a0a0a] tabular-nums">
            {formatConfidence(violation.confidence)}
          </span>
          <div className="text-gray-400">
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div
          className={cn(
            'px-4 pb-4 border-t space-y-4',
            isCritical ? 'border-red-100 bg-red-50/30' : 'border-gray-100 bg-gray-50/50'
          )}
        >
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Description */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</p>
              <p className="text-sm text-[#0a0a0a] leading-relaxed">{violation.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-2">
              {violation.legalReference && (
                <DetailRow label="Legal Reference" value={violation.legalReference} />
              )}
              {violation.fineAmount && (
                <DetailRow label="Fine Amount" value={`₹${violation.fineAmount.toLocaleString()}`} />
              )}
              <div className="pt-1">
                <ConfidenceBar
                  label="Detection Confidence"
                  value={violation.confidence}
                  accent={isCritical}
                  size="sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-semibold text-[#0a0a0a]">{value}</span>
    </div>
  );
}
