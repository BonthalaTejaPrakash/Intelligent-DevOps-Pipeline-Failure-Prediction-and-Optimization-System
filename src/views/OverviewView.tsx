import React, { useState } from 'react';
import { ViewMode, PipelineRun, OptimizationItem } from '../types';
import { RiskVsDeploymentChart } from '../components/RiskVsDeploymentChart';

interface OverviewViewProps {
  onNavigate: (view: ViewMode) => void;
  runs: PipelineRun[];
  optimizations: OptimizationItem[];
  onApproveOptimization: (id: string) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  onNavigate,
  runs,
  optimizations,
  onApproveOptimization,
  onShowToast,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d' | 'custom'>('7d');
  const [selectedRepoFilter, setSelectedRepoFilter] = useState('All Repositories (14)');
  const [selectedWorkflowFilter, setSelectedWorkflowFilter] = useState('All Workflows');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const daysData = [
    { day: 'Mon (17th)', success: 225, failed: 18, canceled: 7, total: 250, rate: 7.2, barH: [135, 11, 4] },
    { day: 'Tue (18th)', success: 245, failed: 26, canceled: 9, total: 280, rate: 9.3, barH: [147, 15, 5] },
    { day: 'Wed (19th - Deploy)', success: 260, failed: 38, canceled: 12, total: 310, rate: 12.2, barH: [156, 21, 6], spike: true },
    { day: 'Thu (20th)', success: 264, failed: 22, canceled: 9, total: 295, rate: 7.5, barH: [158, 12, 4] },
    { day: 'Fri (21st)', success: 298, failed: 24, canceled: 8, total: 330, rate: 7.2, barH: [179, 13, 4] },
    { day: 'Sat (22nd)', success: 154, failed: 12, canceled: 4, total: 170, rate: 7.0, barH: [92, 7, 2] },
    { day: 'Sun (Today)', success: 180, failed: 22, canceled: 5, total: 207, rate: 10.6, barH: [108, 12, 3] },
  ];

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Date,TotalRuns,Success,Failed,Canceled,FailureRate%\n" +
      daysData.map(d => `${d.day},${d.total},${d.success},${d.failed},${d.canceled},${d.rate}%`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pipeguard_telemetry_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast("CSV Telemetry Exported", `Saved report for ${timeframe} timeframe.`, 'success');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top View Heading & Operational Scope */}
      <section className="flex flex-col gap-2 pt-4 mb-4">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
                Executive SRE Overview
              </span>
              <span className="text-outline-variant font-label-sm text-label-sm">•</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Cluster: us-east-prod-ci</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Pipeline Intelligence &amp; Reliability Command
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
              Real-time telemetry across 14 active repositories and 1,842 builds analyzed this week
            </p>
          </div>

          {/* Live Pipeline State Indicator Pill */}
          <div className="flex items-center gap-3 self-start xl:self-auto bg-surface-container-low px-4 py-2 rounded-xl shadow-sm border border-outline-variant/30">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-ping absolute opacity-75"></span>
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-label-md text-label-md text-on-surface font-semibold">
                  ML Intercept Shield
                </span>
                <span className="font-label-sm text-label-sm text-secondary bg-surface-container-high px-1.5 py-0.2 rounded font-medium border border-secondary/30">
                  ONLINE
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">
                P95 Inference: 34ms • Model v2.4
              </span>
            </div>
          </div>
        </div>

        {/* Filter Control Bar */}
        <div className="mt-2 p-2 bg-surface-container-low rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-4 border border-outline-variant/20">
          <div className="flex flex-wrap items-center gap-2">
            {/* Date Range Filter Tabs */}
            <div className="flex items-center bg-surface-container rounded-lg p-0.5 border border-outline-variant/30">
              <button
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  timeframe === '7d'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setTimeframe('7d')}
                type="button"
              >
                Last 7 Days
              </button>
              <button
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  timeframe === '14d'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setTimeframe('14d')}
                type="button"
              >
                Last 14 Days
              </button>
              <button
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors ${
                  timeframe === '30d'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setTimeframe('30d')}
                type="button"
              >
                Last 30 Days
              </button>
              <button
                className={`px-3 py-1 rounded font-label-sm text-label-sm font-medium transition-colors flex items-center gap-1 ${
                  timeframe === 'custom'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                onClick={() => setTimeframe('custom')}
                type="button"
              >
                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                <span>Custom Range</span>
              </button>
            </div>

            <div className="h-5 w-[1px] bg-outline-variant/30 hidden sm:block"></div>

            {/* Repository Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  const opts = ['All Repositories (14)', 'api-gateway', 'data-pipeline', 'frontend-portal', 'microservices-backend'];
                  const next = opts[(opts.indexOf(selectedRepoFilter) + 1) % opts.length];
                  setSelectedRepoFilter(next);
                  onShowToast("Filtered Repositories", `Viewing telemetry for: ${next}`, 'info');
                }}
                className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">source</span>
                <span>{selectedRepoFilter}</span>
                <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
              </button>
            </div>

            {/* Workflow Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  const wf = ['All Workflows', 'CI Test & Lint', 'Release Matrix', 'Nightly Regression', 'Security Scan'];
                  const next = wf[(wf.indexOf(selectedWorkflowFilter) + 1) % wf.length];
                  setSelectedWorkflowFilter(next);
                  onShowToast("Filtered Workflows", `Active workflow set: ${next}`, 'info');
                }}
                className="flex items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">alt_route</span>
                <span>{selectedWorkflowFilter}</span>
                <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prominent Demo Data Badge */}
            <div className="flex items-center gap-1.5 bg-surface-container-highest px-3 py-1 rounded-full text-secondary border border-secondary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-sm text-label-sm tracking-wide uppercase font-semibold">
                DEMO DATA ACTIVE • Consistent Synthetic Fixtures
              </span>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-bright text-on-surface px-3 py-1.5 rounded-lg font-headline-sm text-headline-sm transition-colors shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">file_download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Metrics Bento Grid (8 Metric Cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Total Pipeline Runs */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Total Runs (7D)</span>
            <span className="material-symbols-outlined text-[18px] text-primary">developer_board</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-on-surface">1,842</span>
            <span className="inline-flex items-center gap-0.5 font-label-sm text-label-sm text-primary font-medium">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>+12.4%
            </span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>vs. 1,638 last week</span>
            <span className="text-on-surface-variant font-medium">99.1% queued &lt;5s</span>
          </div>
        </div>

        {/* 2. Success Rate */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">CI Success Rate</span>
            <div className="flex items-center gap-1 text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-label-sm font-semibold">Live</span>
            </div>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-on-surface">88.4%</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant font-medium bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant/20">
              Target: &gt;90%
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '88.4%' }}></div>
          </div>
        </div>

        {/* 3. Failed Runs */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Failed Runs</span>
            <span className="material-symbols-outlined text-[18px] text-error">cancel</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-on-surface">184</span>
            <span className="font-label-sm text-label-sm text-error font-medium">10.0% failure rate</span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>32 canceled in-flight</span>
            <span className="text-error font-medium">28 unreviewed</span>
          </div>
        </div>

        {/* 4. High-Risk Runs Pre-empted */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all relative overflow-hidden border border-outline-variant/20">
          <div className="absolute -right-4 -top-4 w-16 h-16 bg-tertiary-container/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-tertiary">
              Pre-empted by AI
            </span>
            <span className="material-symbols-outlined text-[18px] text-tertiary">shield</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-tertiary font-bold">47</span>
            <span className="font-label-sm text-label-sm text-tertiary bg-surface-container-high px-1.5 py-0.5 rounded font-medium border border-tertiary/20">
              &gt;75% Risk
            </span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span className="text-on-surface-variant font-medium">Saved ~18.5 dev hrs</span>
            <span className="text-tertiary font-semibold">Zero False Stops</span>
          </div>
        </div>

        {/* 5. Median Duration */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Median Duration</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">timer</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-on-surface">11m 42s</span>
            <span className="font-label-sm text-label-sm text-primary font-medium flex items-center">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span>-1m 15s
            </span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Post-cache optimization</span>
            <span className="text-on-surface-variant font-medium">P90: 19m 04s</span>
          </div>
        </div>

        {/* 6. Mean Time to Diagnose (MTTD) */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Automated MTTD</span>
            <span className="material-symbols-outlined text-[18px] text-primary">psychology</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-on-surface">4.2m</span>
            <span className="font-label-sm text-label-sm text-primary font-medium">85% reduction</span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span className="line-through text-outline/60">28.5m manual triage</span>
            <span className="text-primary font-medium">Auto-root-caused</span>
          </div>
        </div>

        {/* 7. Repeat Failure Rate */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">Repeat Failure Rate</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">repeat</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-on-surface">6.8%</span>
            <span className="font-label-sm text-label-sm text-primary font-medium">-4.1% MoM</span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Flaky-test suppression active</span>
            <span className="text-on-surface-variant font-medium">12 flakies quarantined</span>
          </div>
        </div>

        {/* 8. Est. Monthly Compute Savings */}
        <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col justify-between hover:bg-surface-container transition-all relative overflow-hidden border border-outline-variant/20">
          <div className="flex items-center justify-between text-outline">
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold text-secondary">
              Compute Savings
            </span>
            <span className="material-symbols-outlined text-[18px] text-secondary">savings</span>
          </div>
          <div className="my-2 flex items-baseline justify-between">
            <span className="font-data-metric text-data-metric text-secondary font-bold">$3,840</span>
            <span className="font-label-sm text-label-sm text-secondary bg-surface-container-high px-1.5 py-0.5 rounded font-medium border border-secondary/20">
              / month
            </span>
          </div>
          <div className="flex items-center justify-between text-outline font-label-sm text-label-sm">
            <span>Parallel test split + caching</span>
            <span className="text-on-surface-variant font-medium">6,120 runner-hrs</span>
          </div>
        </div>
      </section>
      
      {/* 30-Day Longitudinal Data Visualization: Risk Score vs. Deployment Frequency */}
      <section className="mb-6">
        <RiskVsDeploymentChart onShowToast={onShowToast} />
      </section>

      {/* Main Dashboard Content Grid: 2/3 and 1/3 split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Central (8 Cols / 2/3 width) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* 1. Primary Chart: Pipeline Runs & Reliability Trend */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Pipeline Runs &amp; Reliability Trend
                  </h2>
                  <span className="font-label-sm text-label-sm bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded border border-outline-variant/30">
                    Dual-Axis
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">
                  Execution volume breakdown paired with failure risk curve over 7-day period
                </p>
              </div>

              {/* Legend Items */}
              <div className="flex flex-wrap items-center gap-3 font-label-sm text-label-sm">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary-container"></span>
                  <span className="text-on-surface-variant">Success</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-error"></span>
                  <span className="text-on-surface-variant">Failed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-outline-variant"></span>
                  <span className="text-on-surface-variant">Canceled</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-secondary"></span>
                  <span className="text-secondary font-medium">Failure Rate (%)</span>
                </div>
              </div>
            </div>

            {/* SVG Dual Axis Chart (Stacked Bars + Spline Line Chart) */}
            <div className="relative w-full h-72 mt-2 bg-surface-container-lowest/60 rounded-lg p-3 flex flex-col justify-between border border-outline-variant/20">
              {/* Threshold Bands & Background Grid */}
              <div className="absolute inset-x-8 top-6 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-error"></div>
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="w-full h-px bg-outline-variant"></div>
                <div className="w-full h-px bg-primary-container"></div>
              </div>

              <div className="absolute right-3 top-6 flex flex-col items-end gap-1 pointer-events-none">
                <span className="font-label-sm text-label-sm text-error/80 text-[10px]">High Risk (&gt;15%)</span>
              </div>

              {/* Tooltip on Hover */}
              {hoveredDay !== null && (
                <div
                  className="absolute z-20 bg-surface-container-high border border-outline-variant/50 p-2 rounded shadow-xl text-left pointer-events-none"
                  style={{ left: `${hoveredDay * 14 + 8}%`, top: '15%' }}
                >
                  <div className="font-label-sm text-label-sm text-primary font-bold">
                    {daysData[hoveredDay].day}
                  </div>
                  <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                    Total: <strong className="text-on-surface">{daysData[hoveredDay].total} runs</strong>
                  </div>
                  <div className="font-body-sm text-[11px] text-emerald-400">
                    Success: {daysData[hoveredDay].success}
                  </div>
                  <div className="font-body-sm text-[11px] text-error">
                    Failed: {daysData[hoveredDay].failed} ({daysData[hoveredDay].rate}%)
                  </div>
                </div>
              )}

              {/* Dual Axis Chart Render */}
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 700 240">
                {/* Mon */}
                <g onMouseEnter={() => setHoveredDay(0)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="135" rx="3" width="34" x="45" y="60" />
                  <rect className="fill-error" height="11" rx="2" width="34" x="45" y="48" />
                  <rect className="fill-outline-variant" height="4" rx="1" width="34" x="45" y="43" />
                </g>
                {/* Tue */}
                <g onMouseEnter={() => setHoveredDay(1)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="147" rx="3" width="34" x="135" y="44" />
                  <rect className="fill-error" height="15" rx="2" width="34" x="135" y="28" />
                  <rect className="fill-outline-variant" height="5" rx="1" width="34" x="135" y="22" />
                </g>
                {/* Wed */}
                <g onMouseEnter={() => setHoveredDay(2)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="156" rx="3" width="34" x="225" y="38" />
                  <rect className="fill-error" height="21" rx="2" width="34" x="225" y="16" />
                  <rect className="fill-outline-variant" height="6" rx="1" width="34" x="225" y="9" />
                </g>
                {/* Thu */}
                <g onMouseEnter={() => setHoveredDay(3)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="158" rx="3" width="34" x="315" y="36" />
                  <rect className="fill-error" height="12" rx="2" width="34" x="315" y="23" />
                  <rect className="fill-outline-variant" height="4" rx="1" width="34" x="315" y="18" />
                </g>
                {/* Fri */}
                <g onMouseEnter={() => setHoveredDay(4)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="179" rx="3" width="34" x="405" y="22" />
                  <rect className="fill-error" height="13" rx="2" width="34" x="405" y="8" />
                  <rect className="fill-outline-variant" height="4" rx="1" width="34" x="405" y="3" />
                </g>
                {/* Sat */}
                <g onMouseEnter={() => setHoveredDay(5)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="92" rx="3" width="34" x="495" y="105" />
                  <rect className="fill-error" height="7" rx="2" width="34" x="495" y="97" />
                  <rect className="fill-outline-variant" height="2" rx="1" width="34" x="495" y="94" />
                </g>
                {/* Sun */}
                <g onMouseEnter={() => setHoveredDay(6)} onMouseLeave={() => setHoveredDay(null)} className="cursor-pointer">
                  <rect className="fill-primary-container hover:opacity-80 transition-opacity" height="108" rx="3" width="34" x="585" y="88" />
                  <rect className="fill-error" height="12" rx="2" width="34" x="585" y="75" />
                  <rect className="fill-outline-variant" height="3" rx="1" width="34" x="585" y="71" />
                </g>

                {/* Failure Rate Overlay Spline (Right Axis: 0% to 20%) */}
                <path
                  className="text-secondary"
                  d="M62,142 Q 152,118 242,88 T 332,138 T 422,144 T 512,148 T 602,106"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                {/* Spline Coordinate Dots */}
                <circle className="fill-background stroke-secondary cursor-pointer hover:r-5 transition-all" cx="62" cy="142" r="3.5" strokeWidth="2" />
                <circle className="fill-background stroke-secondary cursor-pointer hover:r-5 transition-all" cx="152" cy="118" r="3.5" strokeWidth="2" />
                <circle className="fill-error stroke-background cursor-pointer hover:r-6 transition-all" cx="242" cy="88" r="4.5" strokeWidth="2" />
                <circle className="fill-background stroke-secondary cursor-pointer hover:r-5 transition-all" cx="332" cy="138" r="3.5" strokeWidth="2" />
                <circle className="fill-background stroke-secondary cursor-pointer hover:r-5 transition-all" cx="422" cy="144" r="3.5" strokeWidth="2" />
                <circle className="fill-background stroke-secondary cursor-pointer hover:r-5 transition-all" cx="512" cy="148" r="3.5" strokeWidth="2" />
                <circle className="fill-background stroke-secondary cursor-pointer hover:r-5 transition-all" cx="602" cy="106" r="3.5" strokeWidth="2" />
              </svg>

              {/* Day Labels Axis */}
              <div className="flex justify-between px-10 font-label-sm text-label-sm text-outline border-t-0 pt-1">
                {daysData.map((d) => (
                  <span key={d.day} className={d.spike ? 'text-error font-medium' : ''}>
                    {d.day}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between text-outline font-label-sm text-label-sm px-1">
              <span>Target reliability line: ≤10% Failure threshold</span>
              <span className="text-primary font-medium">
                Anomaly detected: Wed 19th (12.2%) due to Node 20 runtime mismatch
              </span>
            </div>
          </div>

          {/* 2. Failure Categories Distribution */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Failure Categories Distribution
                </h2>
                <p className="font-body-sm text-body-sm text-outline">
                  Categorized via PipeGuard Diagnostic Classifier across 184 failed runs
                </p>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-medium bg-surface-container-high px-2 py-1 rounded border border-primary/20">
                100% Classified
              </span>
            </div>

            <div className="flex flex-col gap-3 mt-3">
              {/* Category 1 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-error">science</span>
                    <span>Test Failures &amp; Assertion Timeouts</span>
                  </span>
                  <span className="text-on-surface font-semibold font-data-metric text-body-md">
                    38% <span className="text-outline font-normal font-label-sm">(70 runs)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-error h-full rounded-full" style={{ width: '38%' }}></div>
                </div>
                <div className="flex justify-between text-outline font-label-sm text-label-sm pl-6">
                  <span>Primary source: <code className="text-on-surface-variant font-label-sm">test_auth_tokens_spec.ts</code></span>
                  <span className="text-error font-medium">14 flaky suites detected</span>
                </div>
              </div>

              {/* Category 2 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">inventory_2</span>
                    <span>Dependency Resolution &amp; Lockfile Conflicts</span>
                  </span>
                  <span className="text-on-surface font-semibold font-data-metric text-body-md">
                    22% <span className="text-outline font-normal font-label-sm">(41 runs)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full rounded-full" style={{ width: '22%' }}></div>
                </div>
                <div className="flex justify-between text-outline font-label-sm text-label-sm pl-6">
                  <span>npm ERESOLVE peer dependencies, pip hashes mismatch</span>
                  <button
                    onClick={() => onNavigate('failure-diagnosis')}
                    className="text-secondary font-medium hover:underline"
                  >
                    Automatic Lock Sync available →
                  </button>
                </div>
              </div>

              {/* Category 3 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">code</span>
                    <span>Build &amp; Compilation Syntax / Type Errors</span>
                  </span>
                  <span className="text-on-surface font-semibold font-data-metric text-body-md">
                    18% <span className="text-outline font-normal font-label-sm">(33 runs)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary-container h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
                <div className="flex justify-between text-outline font-label-sm text-label-sm pl-6">
                  <span>TypeScript strict nulls, Go vet type errors</span>
                  <span className="text-on-surface-variant font-medium">Median fix time: 9m</span>
                </div>
              </div>

              {/* Category 4 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-outline">dns</span>
                    <span>Infrastructure Timeout &amp; Runner Exhaustion</span>
                  </span>
                  <span className="text-on-surface font-semibold font-data-metric text-body-md">
                    12% <span className="text-outline font-normal font-label-sm">(22 runs)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-surface-bright h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
                <div className="flex justify-between text-outline font-label-sm text-label-sm pl-6">
                  <span>Docker socket lockup, AWS spot termination</span>
                  <span className="text-on-surface-variant font-medium">Auto-retry handled: 18</span>
                </div>
              </div>

              {/* Category 5 */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-md text-label-md">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-primary">settings_suggest</span>
                    <span>CI/CD Workflow &amp; Environment Config Errors</span>
                  </span>
                  <span className="text-on-surface font-semibold font-data-metric text-body-md">
                    10% <span className="text-outline font-normal font-label-sm">(18 runs)</span>
                  </span>
                </div>
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
                <div className="flex justify-between text-outline font-label-sm text-label-sm pl-6">
                  <span>Invalid YAML schema, missing secret references</span>
                  <span className="text-primary font-medium">Lint-at-PR prevents 94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Active At-Risk Builds Table ('Live Pre-Execution Guard') */}
          <div className="bg-surface-container-low rounded-xl shadow-sm overflow-hidden border border-outline-variant/20">
            <div className="p-4 bg-surface-container-high/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Live Pre-Execution Guard
                  </h2>
                  <span className="font-label-sm text-label-sm bg-error-container text-on-error-container px-2 py-0.5 rounded font-semibold">
                    {runs.length} Active Runs Monitored
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-outline mt-0.5">
                  Real-time risk scoring evaluated before heavy runner nodes are provisioned
                </p>
              </div>
              <button
                onClick={() => onNavigate('risk-prediction')}
                className="flex items-center gap-1 text-primary hover:text-primary-container font-headline-sm text-headline-sm transition-colors self-start sm:self-auto"
              >
                <span>Configure AI Guardrails</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Table View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/20">
                    <th className="py-2.5 px-4 font-semibold">Run &amp; Repo</th>
                    <th className="py-2.5 px-4 font-semibold">Branch &amp; Author</th>
                    <th className="py-2.5 px-4 font-semibold">Predicted Risk</th>
                    <th className="py-2.5 px-4 font-semibold">Signals &amp; Anomalies</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 font-body-sm text-body-sm">
                  {runs.map((run) => {
                    const isCritical = run.riskTier === 'CRITICAL';
                    const isHigh = run.riskTier === 'HIGH';

                    return (
                      <tr
                        key={run.id}
                        className={`transition-colors ${
                          isCritical
                            ? 'bg-surface-container-high/20 hover:bg-surface-container-high/50'
                            : 'bg-surface-container-low hover:bg-surface-container-high/40'
                        }`}
                      >
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-label-md text-label-md text-on-surface font-semibold">
                              #{run.runNumber}
                            </span>
                            <span className="font-label-sm text-label-sm bg-surface-container px-1.5 py-0.5 rounded text-primary border border-outline-variant/30">
                              {run.repo}
                            </span>
                          </div>
                          <span className="font-label-sm text-label-sm text-outline block mt-0.5">
                            commit {run.commitSha} • {run.timestamp}
                          </span>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-label-md text-label-md text-on-surface font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-outline">fork_right</span>
                            <span>{run.branch}</span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-4 h-4 rounded-full bg-surface-bright flex items-center justify-center font-label-sm text-[10px] text-on-surface">
                              {run.author.name[0]}
                            </span>
                            <span className="font-label-sm text-label-sm text-outline">{run.author.name}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-data-metric text-headline-md font-bold ${
                                isCritical ? 'text-error' : isHigh ? 'text-tertiary-container' : 'text-primary'
                              }`}
                            >
                              {run.predictedRisk}%
                            </span>
                            <span
                              className={`font-label-sm text-label-sm px-1.5 py-0.5 rounded font-semibold ${
                                isCritical
                                  ? 'bg-error-container text-on-error-container animate-pulse'
                                  : isHigh
                                  ? 'bg-surface-container-highest text-tertiary'
                                  : 'bg-surface-container-highest text-primary'
                              }`}
                            >
                              {run.riskTier}
                            </span>
                          </div>
                          <span className="font-label-sm text-label-sm text-outline block mt-0.5">
                            {isCritical ? 'Failure Likelihood High' : isHigh ? 'Historical Flaky Trigger' : 'Running Stage 3/5'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-body-sm text-body-sm text-on-surface max-w-xs line-clamp-2">
                            {run.signalNotes}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {isCritical ? (
                            <button
                              onClick={() => onNavigate('pipeline-explorer')}
                              className="bg-error-container hover:bg-error text-on-error-container hover:text-on-error font-headline-sm text-headline-sm px-3 py-1.5 rounded-lg shadow-sm transition-all flex items-center gap-1 ml-auto"
                            >
                              <span className="material-symbols-outlined text-[16px]">pause_circle</span>
                              <span>Inspect &amp; Intercept</span>
                            </button>
                          ) : isHigh ? (
                            <button
                              onClick={() => onNavigate('risk-prediction')}
                              className="bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ml-auto border border-outline-variant/30"
                            >
                              <span className="material-symbols-outlined text-[16px]">visibility</span>
                              <span>View Risk</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-primary bg-surface-container px-2.5 py-1 rounded-full border border-primary/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                              <span>Building (Est. 4m left)</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar / Activity Panel (4 Cols / 1/3 width) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* 1. Recent System Activity & AI Interventions */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm border border-outline-variant/20">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">bolt</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Real-Time AI Interventions
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Live Feed</span>
            </div>

            <div className="flex flex-col gap-4 mt-3 relative">
              <div className="absolute left-3.5 top-3 bottom-3 w-0.5 bg-surface-container-highest"></div>

              {/* Event 1 */}
              <div className="relative pl-8">
                <span className="absolute left-2 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-error border-2 border-background"></span>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-error font-semibold bg-error-container/40 px-1.5 py-0.2 rounded">
                    HIGH RISK PREVENTED
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">2m ago</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface mt-1">
                  Run <strong className="font-medium text-on-surface">#4192</strong> flagged 84% failure probability on commit <code className="font-label-sm text-label-sm text-primary">7a8f19c</code>. Interception alert dispatched to Slack channel <span className="text-secondary">#sre-deployments</span>.
                </p>
              </div>

              {/* Event 2 */}
              <div className="relative pl-8">
                <span className="absolute left-2 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-secondary border-2 border-background"></span>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-secondary font-semibold bg-surface-container-high px-1.5 py-0.2 rounded">
                    FAILURE DIAGNOSED
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">14m ago</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface mt-1">
                  Run <strong className="font-medium text-on-surface">#4180</strong> failed in 3m 12s. Category: <span className="text-on-surface font-medium">Dependency Resolution</span> (<code className="font-label-sm text-label-sm text-outline">npm ERESOLVE</code> peer mismatch). Root cause verified by on-call engineer.
                </p>
              </div>

              {/* Event 3 */}
              <div className="relative pl-8">
                <span className="absolute left-2 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-tertiary-container border-2 border-background"></span>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-tertiary font-semibold bg-surface-container-high px-1.5 py-0.2 rounded">
                    OPTIMIZATION PROPOSED
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">45m ago</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface mt-1">
                  <strong className="font-medium text-on-surface">#OPT-104:</strong> Gradle daemon caching recommended on <span className="text-primary font-medium">microservices</span> repo. Estimated ~4m 10s reduction per build.
                </p>
              </div>

              {/* Event 4 */}
              <div className="relative pl-8">
                <span className="absolute left-2 top-1.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-background"></span>
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-primary font-semibold bg-surface-container-high px-1.5 py-0.2 rounded">
                    MODEL RETRAINED
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">1h ago</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface mt-1">
                  XGBoost <code className="font-label-sm text-label-sm text-on-surface font-medium">v2.4-calibrated</code> promoted to production CI gate. PR-AUC: <span className="text-primary font-semibold">0.882</span>, Precision: <span className="text-primary font-semibold">0.84</span>.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Pending Optimization Reviews Widget */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm relative overflow-hidden border border-outline-variant/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">auto_awesome</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Optimization Queue
                </h2>
              </div>
              <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                {optimizations.filter(o => o.status === 'pending').length} Pending
              </span>
            </div>

            <div className="bg-surface-container p-3 rounded-lg mb-4 border border-outline-variant/20">
              <div className="flex items-baseline justify-between">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  Est. Unlocked Savings
                </span>
                <span className="font-data-metric text-data-metric text-secondary font-bold">
                  $980<span className="text-body-sm font-normal text-outline">/mo</span>
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Applying recommended caching &amp; parallel runner splits across 3 identified repositories.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {optimizations.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="bg-surface-container p-3 rounded-lg flex items-center justify-between hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                >
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium">
                      {item.title}
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {item.repo} • Saves {item.savings}
                    </span>
                  </div>

                  {item.status === 'approved' ? (
                    <span className="font-label-sm text-label-sm text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      Approved
                    </span>
                  ) : (
                    <button
                      onClick={() => onApproveOptimization(item.id)}
                      className="bg-primary hover:bg-primary-fixed-dim text-on-primary font-label-md text-label-md px-2.5 py-1 rounded transition-colors font-medium shadow-sm"
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-1 text-center">
              <button
                onClick={() => onNavigate('optimization-center')}
                className="font-headline-sm text-headline-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Explore all 12 optimization candidates</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* 3. System Health & Gateway Telemetry Banner */}
          <div className="bg-surface-container-low p-4 rounded-xl shadow-sm flex flex-col gap-2 border border-outline-variant/20">
            <div className="flex items-center justify-between text-outline font-label-sm text-label-sm uppercase tracking-wider font-semibold">
              <span className="flex items-center gap-1.5 text-on-surface">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>CI Telemetry Mesh Health</span>
              </span>
              <span className="text-primary font-mono">99.98% SLA</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-surface-container p-2 rounded flex flex-col border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline">Webhook Lag</span>
                <span className="font-data-metric text-body-md text-on-surface font-bold mt-0.5">120ms</span>
                <span className="font-label-sm text-label-sm text-primary">Normal</span>
              </div>
              <div className="bg-surface-container p-2 rounded flex flex-col border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline">DB Latency</span>
                <span className="font-data-metric text-body-md text-on-surface font-bold mt-0.5">8ms</span>
                <span className="font-label-sm text-label-sm text-primary">Optimal</span>
              </div>
              <div className="bg-surface-container p-2 rounded flex flex-col border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline">ML Inference</span>
                <span className="font-data-metric text-body-md text-secondary font-bold mt-0.5">34ms</span>
                <span className="font-label-sm text-label-sm text-secondary">Realtime</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-outline font-label-sm text-label-sm mt-1 px-1">
              <span>Worker Pods: 16 active</span>
              <span>Last sync: 4 seconds ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
