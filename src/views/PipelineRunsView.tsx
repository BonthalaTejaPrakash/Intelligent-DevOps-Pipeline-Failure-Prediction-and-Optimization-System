import React, { useState } from 'react';
import { ViewMode, PipelineRun } from '../types';

interface PipelineRunsViewProps {
  onNavigate: (view: ViewMode) => void;
  runs: PipelineRun[];
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PipelineRunsView: React.FC<PipelineRunsViewProps> = ({
  onNavigate,
  runs,
  onShowToast,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed' | 'held'>('all');

  const filteredRuns = runs.filter((r) => {
    const matchesQuery =
      r.repo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.branch.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.commitSha.toLowerCase().includes(filterQuery.toLowerCase()) ||
      r.runNumber.toString().includes(filterQuery);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'passed' && r.status === 'passed') ||
      (statusFilter === 'failed' && r.status === 'failed') ||
      (statusFilter === 'held' && r.status === 'held');

    return matchesQuery && matchesStatus;
  });

  return (
    <div className="flex flex-col w-full pb-16">
      <div className="flex flex-col gap-2 pt-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1 font-label-sm text-label-sm text-outline">
              <span className="text-primary font-semibold uppercase">Execution Log</span>
              <span>•</span>
              <span>Cluster: us-east-prod-ci</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
              Continuous Integration Pipeline Runs
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Chronological build executions augmented with real-time pre-flight failure predictions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShowToast('Synced Runs', 'Fetched 47 new build events from GitHub Actions.', 'success')}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30 flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              <span>Sync Webhook Stream</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-2 p-3 bg-surface-container-low rounded-xl flex flex-wrap items-center justify-between gap-4 border border-outline-variant/30">
          <div className="flex items-center gap-2 flex-1 min-w-[260px]">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-outline">search</span>
              <input
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search by run #, repo, branch, commit SHA..."
                className="w-full bg-surface-container-lowest text-on-surface pl-8 pr-3 py-1.5 rounded font-label-sm text-label-sm focus:outline-none border border-outline-variant/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-lg border border-outline-variant/30">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              All Runs
            </button>
            <button
              onClick={() => setStatusFilter('failed')}
              className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors ${
                statusFilter === 'failed'
                  ? 'bg-error-container text-on-error-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Failed Only
            </button>
            <button
              onClick={() => setStatusFilter('held')}
              className={`px-3 py-1 rounded font-label-sm text-label-sm transition-colors ${
                statusFilter === 'held'
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Held by AI Shield
            </button>
          </div>
        </div>
      </div>

      {/* Runs Table */}
      <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30">
                <th className="py-3 px-4 font-semibold">Run &amp; Repository</th>
                <th className="py-3 px-4 font-semibold">Branch &amp; Committer</th>
                <th className="py-3 px-4 font-semibold">Duration &amp; Elapsed</th>
                <th className="py-3 px-4 font-semibold">ML Pre-Flight Risk</th>
                <th className="py-3 px-4 font-semibold">Failure Signal</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 font-body-sm text-body-sm">
              {filteredRuns.map((r) => {
                const isFail = r.status === 'failed';
                const isHeld = r.status === 'held';

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-surface-container-high/40 transition-colors"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md text-on-surface font-semibold font-mono">
                          #{r.runNumber}
                        </span>
                        <span className="font-label-sm text-label-sm bg-surface-container px-1.5 py-0.5 rounded text-primary border border-outline-variant/20 font-mono">
                          {r.repo}
                        </span>
                      </div>
                      <span className="font-label-sm text-label-sm text-outline block mt-0.5 font-mono">
                        commit {r.commitSha}
                      </span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1 font-mono">
                        <span className="material-symbols-outlined text-[14px] text-outline">fork_right</span>
                        <span>{r.branch}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-4 h-4 rounded-full bg-surface-bright flex items-center justify-center font-label-sm text-[10px] text-on-surface">
                          {r.author.name[0]}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">{r.author.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-on-surface font-semibold block">{r.duration}</span>
                      <span className="font-label-sm text-label-sm text-outline">{r.timestamp}</span>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-data-metric text-headline-md font-bold font-mono ${
                            r.predictedRisk > 75
                              ? 'text-error'
                              : r.predictedRisk > 40
                              ? 'text-tertiary-container'
                              : 'text-primary'
                          }`}
                        >
                          {r.predictedRisk}%
                        </span>
                        <span
                          className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded font-semibold ${
                            r.riskTier === 'CRITICAL'
                              ? 'bg-error-container text-on-error-container'
                              : r.riskTier === 'HIGH'
                              ? 'bg-surface-container-highest text-tertiary'
                              : 'bg-surface-container-highest text-primary'
                          }`}
                        >
                          {r.riskTier}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm line-clamp-2">
                        {r.signalNotes}
                      </p>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onNavigate('pipeline-explorer')}
                          className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/20 flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">hub</span>
                          <span>DAG</span>
                        </button>
                        {isFail && (
                          <button
                            onClick={() => onNavigate('failure-diagnosis')}
                            className="px-2.5 py-1 rounded bg-tertiary-container/30 hover:bg-tertiary-container text-tertiary hover:text-on-tertiary-container font-headline-sm text-headline-sm transition-colors border border-tertiary/30 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[15px]">healing</span>
                            <span>Diagnose</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
