import React, { useState, useEffect } from 'react';
import { ViewMode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const commands = [
    { label: 'Overview: Executive SRE Command', view: 'overview' as ViewMode, category: 'Views', icon: 'dashboard' },
    { label: 'Pre-Execution Risk Prediction Engine (#4192)', view: 'risk-prediction' as ViewMode, category: 'Intelligence', icon: 'security' },
    { label: 'Directed Acyclic Graph (DAG) Pipeline Explorer', view: 'pipeline-explorer' as ViewMode, category: 'Views', icon: 'hub' },
    { label: 'Evidence-Based Failure Diagnosis Studio (#4180)', view: 'failure-diagnosis' as ViewMode, category: 'Intelligence', icon: 'healing' },
    { label: '3D CI/CD Cluster Topology & Telemetry Mesh', view: '3d-mesh' as ViewMode, category: '3D Simulation', icon: '3d_rotation' },
    { label: 'Optimization Center ($980/mo Unlocked)', view: 'optimization-center' as ViewMode, category: 'Intelligence', icon: 'bolt' },
    { label: 'Pipeline Runs & Build History', view: 'pipeline-runs' as ViewMode, category: 'Views', icon: 'alt_route' },
    { label: 'Repositories & Branch Coverage (14 active)', view: 'repositories' as ViewMode, category: 'Workspace', icon: 'source' },
    { label: 'Model Evaluation: XGBoost v2.4-calibrated', view: 'model-evaluation' as ViewMode, category: 'Intelligence', icon: 'psychology' },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
      <div
        className="bg-surface-container-high border border-outline-variant/60 rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-outline-variant/40 gap-3 bg-surface-container">
          <span className="material-symbols-outlined text-[20px] text-primary">search</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pipelines, commit SHAs, models, or screens..."
            className="flex-1 bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none"
          />
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface text-xs font-mono bg-surface-container-highest px-2 py-1 rounded"
          >
            ESC
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-outline font-body-sm text-body-sm">
              No matching pipelines or views found for "{query}"
            </div>
          ) : (
            filtered.map((cmd) => (
              <button
                key={cmd.label}
                onClick={() => {
                  onNavigate(cmd.view);
                  onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-left hover:bg-surface-bright transition-colors text-on-surface group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
                    {cmd.icon}
                  </span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">
                    {cmd.label}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline font-mono">
                  {cmd.category}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-outline font-label-sm text-label-sm">
          <span>Navigate with arrow keys or click</span>
          <span>PipeGuard Intelligence Router</span>
        </div>
      </div>
    </div>
  );
};
