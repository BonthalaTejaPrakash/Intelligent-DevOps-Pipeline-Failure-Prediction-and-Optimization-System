import React from 'react';
import { ViewMode, AppTheme } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  cpuLoad: number;
  ramUsage: string;
  queueCount: number;
  currentTheme: AppTheme;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  cpuLoad,
  ramUsage,
  queueCount,
  currentTheme,
  onToggleTheme,
}) => {
  const navItemClass = (view: ViewMode) => {
    const isActive = currentView === view;
    return `flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all font-headline-sm text-headline-sm ${
      isActive
        ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
        : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
    }`;
  };

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 bg-surface-container-lowest z-30 flex flex-col justify-between border-r border-outline-variant overflow-y-auto">
      <div className="p-3 flex flex-col gap-3">
        {/* Workspace section */}
        <div className="px-2 pt-1">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
            Workspace
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onSelectView('overview')}
            className={navItemClass('overview')}
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Overview</span>
          </button>
          <button
            onClick={() => onSelectView('risk-prediction')}
            className={navItemClass('risk-prediction')}
          >
            <span className="material-symbols-outlined text-[18px]">security</span>
            <span>Risk Prediction</span>
          </button>
          <button
            onClick={() => onSelectView('pipeline-runs')}
            className={navItemClass('pipeline-runs')}
          >
            <span className="material-symbols-outlined text-[18px]">alt_route</span>
            <span>Pipeline Runs</span>
          </button>
          <button
            onClick={() => onSelectView('repositories')}
            className={navItemClass('repositories')}
          >
            <span className="material-symbols-outlined text-[18px]">source</span>
            <span>Repositories</span>
          </button>
          <button
            onClick={() => onSelectView('pipeline-explorer')}
            className={navItemClass('pipeline-explorer')}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>Pipeline Explorer</span>
          </button>
          {/* User Requested 3D Scene View */}
          <button
            onClick={() => onSelectView('3d-mesh')}
            className={navItemClass('3d-mesh')}
          >
            <span className="material-symbols-outlined text-[18px] text-tertiary">3d_rotation</span>
            <div className="flex items-center justify-between flex-1">
              <span>3D Cluster Mesh</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 bg-tertiary-container/30 text-tertiary rounded font-bold">
                WebGL
              </span>
            </div>
          </button>
        </nav>

        {/* Intelligence section */}
        <div className="px-2 pt-1">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
            Intelligence
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onSelectView('failure-diagnosis')}
            className={navItemClass('failure-diagnosis')}
          >
            <span className="material-symbols-outlined text-[18px]">healing</span>
            <span>Failure Diagnosis</span>
          </button>
          <button
            onClick={() => onSelectView('optimization-center')}
            className={navItemClass('optimization-center')}
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>Optimization Center</span>
          </button>
          <button
            onClick={() => onSelectView('analytics')}
            className={navItemClass('analytics')}
          >
            <span className="material-symbols-outlined text-[18px]">bar_chart</span>
            <span>Analytics</span>
          </button>
          <button
            onClick={() => onSelectView('model-evaluation')}
            className={navItemClass('model-evaluation')}
          >
            <span className="material-symbols-outlined text-[18px]">psychology</span>
            <span>Model Evaluation</span>
          </button>
        </nav>

        {/* System section */}
        <div className="px-2 pt-1">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
            System
          </span>
        </div>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => onSelectView('integrations')}
            className={navItemClass('integrations')}
          >
            <span className="material-symbols-outlined text-[18px]">extension</span>
            <span>Integrations</span>
          </button>
          <button
            onClick={() => onSelectView('notifications')}
            className={navItemClass('notifications')}
          >
            <span className="material-symbols-outlined text-[18px]">notifications_active</span>
            <span>Notifications</span>
          </button>
          <button
            onClick={() => onSelectView('audit-log')}
            className={navItemClass('audit-log')}
          >
            <span className="material-symbols-outlined text-[18px]">article</span>
            <span>Audit Log</span>
          </button>
          <button
            onClick={() => onSelectView('settings')}
            className={navItemClass('settings')}
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Bottom Telemetry & Utility Footer */}
      <div className="p-3 bg-surface-container-low/60 flex flex-col gap-2 border-t border-outline-variant">
        <div className="bg-surface-container-lowest p-2.5 rounded-lg flex flex-col gap-1 border border-outline-variant">
          <div className="flex justify-between items-center text-outline font-label-sm text-label-sm">
            <span>Telemetry</span>
            <span className="text-primary font-semibold flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Active
            </span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant flex justify-between font-mono">
            <span>CPU: {cpuLoad}%</span>
            <span>RAM: {ramUsage}</span>
          </div>
          <div className="font-label-sm text-label-sm text-on-surface-variant flex justify-between font-mono">
            <span>Queue: {queueCount} jobs</span>
            <span className="text-secondary">P95: 34ms</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-outline px-1">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="font-label-sm text-label-sm hover:text-on-surface flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">description</span>
            <span>Docs</span>
          </a>
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-surface-container-high hover:text-on-surface transition-colors border border-outline-variant/40 text-xs font-mono"
            title={`Switch Theme (Current: ${currentTheme})`}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {currentTheme === 'nordic' ? 'light_mode' : currentTheme === 'cyber' ? 'terminal' : 'dark_mode'}
            </span>
            <span className="capitalize">{currentTheme}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
