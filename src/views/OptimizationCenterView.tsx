import React, { useState } from 'react';
import { ViewMode, OptimizationItem } from '../types';

interface OptimizationCenterViewProps {
  onNavigate: (view: ViewMode) => void;
  optimizations: OptimizationItem[];
  onApprove: (id: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const OptimizationCenterView: React.FC<OptimizationCenterViewProps> = ({
  onNavigate,
  optimizations,
  onApprove,
  onShowToast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Caching', 'Concurrency', 'Network', 'Pre-warming'];

  const filtered = selectedCategory === 'all'
    ? optimizations
    : optimizations.filter((o) => o.category.toLowerCase() === selectedCategory.toLowerCase());

  const approvedCount = optimizations.filter((o) => o.status === 'approved').length;
  const unlockedMonthlySavings = 980 + approvedCount * 360;

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="flex flex-col gap-2 pt-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1 font-label-sm text-label-sm text-outline">
              <span className="text-secondary font-semibold uppercase">Cost &amp; Velocity Intelligence</span>
              <span>•</span>
              <span>Cluster: us-east-prod-ci</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
              CI/CD Pipeline Optimization Center
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Autonomous recommendations to eliminate redundant compilation, parallelize test suites, and cut runner hours
            </p>
          </div>

          <div className="bg-surface-container p-3 rounded-xl border border-secondary/30 flex items-center gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-outline uppercase block">Unlocked Monthly Savings</span>
              <span className="font-data-metric text-data-metric text-secondary font-bold">
                ${unlockedMonthlySavings.toLocaleString()}
                <span className="text-body-sm font-normal text-outline">/mo</span>
              </span>
            </div>
            <span className="material-symbols-outlined text-secondary text-[28px]">savings</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 mt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-label-sm text-label-sm transition-colors border ${
                selectedCategory === cat
                  ? 'bg-primary-container text-on-primary-container font-semibold border-primary/40'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/30'
              }`}
            >
              {cat === 'all' ? 'All Candidates (12)' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Optimization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const isApproved = item.status === 'approved';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl flex flex-col justify-between gap-4 border transition-all ${
                isApproved
                  ? 'bg-surface-container-high/40 border-emerald-500/40'
                  : 'bg-surface-container-low border-outline-variant/30 hover:border-outline-variant/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm bg-surface-container px-2 py-0.5 rounded text-primary font-mono border border-outline-variant/20">
                      {item.repo}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-headline-md text-headline-md text-on-surface font-semibold mt-1">
                    {item.title}
                  </h3>
                </div>

                <div className="text-right">
                  <span className="font-data-metric text-body-lg text-secondary font-bold block">
                    {item.savings}
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    Impact: {item.impact}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between font-label-sm text-label-sm">
                <span className="text-outline">PR Automation:</span>
                <span className="text-primary font-mono">1-Click GitHub Actions PR</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => onShowToast('Telemetry Preview', `Inspected cache hit ratios for ${item.repo}`, 'info')}
                  className="font-headline-sm text-headline-sm text-outline hover:text-on-surface transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">query_stats</span>
                  <span>View Telemetry</span>
                </button>

                {isApproved ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-headline-sm text-headline-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Approved &amp; Deployed</span>
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      onApprove(item.id);
                      onShowToast('Optimization Approved', `Applied ${item.title} to ${item.repo}.`, 'success');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-fixed-dim text-on-primary font-headline-sm text-headline-sm font-semibold transition-colors shadow-md"
                  >
                    Approve &amp; Generate PR
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
