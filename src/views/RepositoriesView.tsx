import React from 'react';
import { ViewMode } from '../types';

interface RepositoriesViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const RepositoriesView: React.FC<RepositoriesViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const repos = [
    {
      name: 'api-gateway',
      branch: 'main',
      status: 'critical',
      failureRate: '12.4%',
      lastRun: '#4192 (2m ago)',
      sla: '99.85%',
      activePRs: 6,
    },
    {
      name: 'data-pipeline',
      branch: 'master',
      status: 'warning',
      failureRate: '8.2%',
      lastRun: '#4189 (8m ago)',
      sla: '99.94%',
      activePRs: 4,
    },
    {
      name: 'frontend-portal',
      branch: 'main',
      status: 'healthy',
      failureRate: '3.1%',
      lastRun: '#4185 (16m ago)',
      sla: '99.99%',
      activePRs: 9,
    },
    {
      name: 'microservices-backend',
      branch: 'release',
      status: 'warning',
      failureRate: '9.6%',
      lastRun: '#4180 (32m ago)',
      sla: '99.92%',
      activePRs: 3,
    },
    {
      name: 'auth-core',
      branch: 'main',
      status: 'healthy',
      failureRate: '4.5%',
      lastRun: '#4172 (1h ago)',
      sla: '99.99%',
      activePRs: 2,
    },
    {
      name: 'notification-service',
      branch: 'main',
      status: 'healthy',
      failureRate: '2.8%',
      lastRun: '#4168 (2h ago)',
      sla: '99.99%',
      activePRs: 1,
    },
  ];

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="flex flex-col gap-2 pt-4 mb-6">
        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline">
          <span className="text-primary font-semibold uppercase">Workspace Mesh</span>
          <span>•</span>
          <span>14 Active Connected Codebases</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
          Monitored Repositories &amp; Guardrails
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Per-repository telemetry health, branch protection status, and automated failure intercept policies
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {repos.map((r) => (
          <div
            key={r.name}
            className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-3 hover:border-outline-variant/60 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-label-md text-label-md text-primary font-mono font-semibold">
                  {r.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-label-sm text-[10px] font-semibold uppercase ${
                    r.status === 'critical'
                      ? 'bg-error-container text-on-error-container'
                      : r.status === 'warning'
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <div className="font-label-sm text-label-sm text-outline">
                Default: <code className="text-on-surface-variant font-mono">{r.branch}</code> • {r.activePRs} Active PRs
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-surface-container-lowest p-2 rounded-lg text-center border border-outline-variant/20 font-label-sm text-label-sm">
              <div>
                <span className="text-outline text-[10px] block">Failure Rate</span>
                <span className="text-on-surface font-semibold font-mono">{r.failureRate}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block">CI SLA</span>
                <span className="text-primary font-semibold font-mono">{r.sla}</span>
              </div>
              <div>
                <span className="text-outline text-[10px] block">Latest</span>
                <span className="text-secondary font-semibold font-mono truncate">{r.lastRun.split(' ')[0]}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onNavigate('risk-prediction')}
                className="flex-1 py-1.5 px-3 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30 text-center"
              >
                Risk Engine
              </button>
              <button
                onClick={() => onNavigate('pipeline-explorer')}
                className="py-1.5 px-3 rounded bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-semibold hover:opacity-90 transition-opacity"
              >
                DAG Explorer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
