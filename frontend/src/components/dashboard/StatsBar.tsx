import React from 'react';

const STATS = [
  { value: '94.1%', label: 'Detection Accuracy' },
  { value: '91.5%', label: 'F1 Score' },
  { value: '7', label: 'Violation Categories' },
  { value: '< 40s', label: 'Avg. Processing Time' },
  { value: '8', label: 'Pipeline Stages' },
  { value: '99.9%', label: 'System Uptime' },
];

export function StatsBar() {
  return (
    <div className="w-full border border-gray-200 rounded-2xl bg-gray-50/50 overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-gray-200">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`px-5 py-4 flex flex-col gap-1 ${i < STATS.length - 1 ? 'border-b sm:border-b-0 border-gray-200' : ''}`}
          >
            <span className="text-xl font-bold text-[#0a0a0a] tabular-nums tracking-tight">
              {stat.value}
            </span>
            <span className="text-xs text-gray-500 leading-snug">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
