import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

export interface DayTrendData {
  dayIndex: number;
  dateStr: string;
  shortDate: string;
  deployments: number;
  prodDeployments: number;
  stagingDeployments: number;
  riskScore: number; // 0 - 100
  failureRate: number; // %
  quarantinedRuns: number;
  event?: string;
  eventType?: 'release' | 'hotfix' | 'infra' | 'freeze';
}

// 30 days of realistic DevOps & SRE telemetry for PipeGuard AI
export const LAST_30_DAYS_DATA: DayTrendData[] = [
  { dayIndex: 1, dateStr: 'Sep 24, 2026', shortDate: 'Sep 24', deployments: 18, prodDeployments: 5, stagingDeployments: 13, riskScore: 28, failureRate: 5.5, quarantinedRuns: 1 },
  { dayIndex: 2, dateStr: 'Sep 25, 2026', shortDate: 'Sep 25', deployments: 22, prodDeployments: 7, stagingDeployments: 15, riskScore: 31, failureRate: 6.2, quarantinedRuns: 0 },
  { dayIndex: 3, dateStr: 'Sep 26, 2026', shortDate: 'Sep 26', deployments: 26, prodDeployments: 9, stagingDeployments: 17, riskScore: 35, failureRate: 7.0, quarantinedRuns: 2 },
  { dayIndex: 4, dateStr: 'Sep 27, 2026', shortDate: 'Sep 27', deployments: 14, prodDeployments: 4, stagingDeployments: 10, riskScore: 24, failureRate: 4.8, quarantinedRuns: 0 },
  { dayIndex: 5, dateStr: 'Sep 28, 2026', shortDate: 'Sep 28', deployments: 8, prodDeployments: 1, stagingDeployments: 7, riskScore: 19, failureRate: 3.5, quarantinedRuns: 0 },
  { dayIndex: 6, dateStr: 'Sep 29, 2026', shortDate: 'Sep 29', deployments: 10, prodDeployments: 2, stagingDeployments: 8, riskScore: 21, failureRate: 3.9, quarantinedRuns: 0 },
  { dayIndex: 7, dateStr: 'Sep 30, 2026', shortDate: 'Sep 30', deployments: 24, prodDeployments: 8, stagingDeployments: 16, riskScore: 33, failureRate: 6.8, quarantinedRuns: 1, event: 'Sprint 42 Kickoff', eventType: 'release' },
  { dayIndex: 8, dateStr: 'Oct 01, 2026', shortDate: 'Oct 01', deployments: 27, prodDeployments: 10, stagingDeployments: 17, riskScore: 38, failureRate: 7.8, quarantinedRuns: 2 },
  { dayIndex: 9, dateStr: 'Oct 02, 2026', shortDate: 'Oct 02', deployments: 31, prodDeployments: 12, stagingDeployments: 19, riskScore: 45, failureRate: 9.1, quarantinedRuns: 3, event: 'PostgreSQL 17 Migration', eventType: 'infra' },
  { dayIndex: 10, dateStr: 'Oct 03, 2026', shortDate: 'Oct 03', deployments: 19, prodDeployments: 6, stagingDeployments: 13, riskScore: 42, failureRate: 8.4, quarantinedRuns: 1, event: 'DB Schema Hotfix', eventType: 'hotfix' },
  { dayIndex: 11, dateStr: 'Oct 04, 2026', shortDate: 'Oct 04', deployments: 15, prodDeployments: 3, stagingDeployments: 12, riskScore: 29, failureRate: 5.6, quarantinedRuns: 0 },
  { dayIndex: 12, dateStr: 'Oct 05, 2026', shortDate: 'Oct 05', deployments: 7, prodDeployments: 1, stagingDeployments: 6, riskScore: 18, failureRate: 3.2, quarantinedRuns: 0 },
  { dayIndex: 13, dateStr: 'Oct 06, 2026', shortDate: 'Oct 06', deployments: 9, prodDeployments: 2, stagingDeployments: 7, riskScore: 20, failureRate: 3.6, quarantinedRuns: 0 },
  { dayIndex: 14, dateStr: 'Oct 07, 2026', shortDate: 'Oct 07', deployments: 28, prodDeployments: 11, stagingDeployments: 17, riskScore: 36, failureRate: 7.2, quarantinedRuns: 2 },
  { dayIndex: 15, dateStr: 'Oct 08, 2026', shortDate: 'Oct 08', deployments: 33, prodDeployments: 13, stagingDeployments: 20, riskScore: 40, failureRate: 8.0, quarantinedRuns: 2 },
  { dayIndex: 16, dateStr: 'Oct 09, 2026', shortDate: 'Oct 09', deployments: 36, prodDeployments: 14, stagingDeployments: 22, riskScore: 48, failureRate: 9.5, quarantinedRuns: 3 },
  { dayIndex: 17, dateStr: 'Oct 10, 2026', shortDate: 'Oct 10', deployments: 23, prodDeployments: 7, stagingDeployments: 16, riskScore: 37, failureRate: 7.3, quarantinedRuns: 1 },
  { dayIndex: 18, dateStr: 'Oct 11, 2026', shortDate: 'Oct 11', deployments: 12, prodDeployments: 2, stagingDeployments: 10, riskScore: 25, failureRate: 4.9, quarantinedRuns: 0 },
  { dayIndex: 19, dateStr: 'Oct 12, 2026', shortDate: 'Oct 12', deployments: 11, prodDeployments: 3, stagingDeployments: 8, riskScore: 23, failureRate: 4.5, quarantinedRuns: 0 },
  { dayIndex: 20, dateStr: 'Oct 13, 2026', shortDate: 'Oct 13', deployments: 30, prodDeployments: 11, stagingDeployments: 19, riskScore: 41, failureRate: 8.1, quarantinedRuns: 2 },
  { dayIndex: 21, dateStr: 'Oct 14, 2026', shortDate: 'Oct 14', deployments: 44, prodDeployments: 18, stagingDeployments: 26, riskScore: 72, failureRate: 14.8, quarantinedRuns: 5, event: 'Release v2.4.0 (Auth Overhaul)', eventType: 'release' },
  { dayIndex: 22, dateStr: 'Oct 15, 2026', shortDate: 'Oct 15', deployments: 38, prodDeployments: 15, stagingDeployments: 23, riskScore: 64, failureRate: 12.6, quarantinedRuns: 4, event: 'Node 20 Runtime Patch', eventType: 'hotfix' },
  { dayIndex: 23, dateStr: 'Oct 16, 2026', shortDate: 'Oct 16', deployments: 25, prodDeployments: 8, stagingDeployments: 17, riskScore: 46, failureRate: 8.9, quarantinedRuns: 2 },
  { dayIndex: 24, dateStr: 'Oct 17, 2026', shortDate: 'Oct 17', deployments: 21, prodDeployments: 6, stagingDeployments: 15, riskScore: 34, failureRate: 6.8, quarantinedRuns: 1 },
  { dayIndex: 25, dateStr: 'Oct 18, 2026', shortDate: 'Oct 18', deployments: 13, prodDeployments: 3, stagingDeployments: 10, riskScore: 26, failureRate: 5.1, quarantinedRuns: 0 },
  { dayIndex: 26, dateStr: 'Oct 19, 2026', shortDate: 'Oct 19', deployments: 12, prodDeployments: 2, stagingDeployments: 10, riskScore: 22, failureRate: 4.2, quarantinedRuns: 0, event: 'Code Freeze Window', eventType: 'freeze' },
  { dayIndex: 27, dateStr: 'Oct 20, 2026', shortDate: 'Oct 20', deployments: 29, prodDeployments: 10, stagingDeployments: 19, riskScore: 32, failureRate: 6.3, quarantinedRuns: 1 },
  { dayIndex: 28, dateStr: 'Oct 21, 2026', shortDate: 'Oct 21', deployments: 34, prodDeployments: 13, stagingDeployments: 21, riskScore: 37, failureRate: 7.2, quarantinedRuns: 2 },
  { dayIndex: 29, dateStr: 'Oct 22, 2026', shortDate: 'Oct 22', deployments: 28, prodDeployments: 9, stagingDeployments: 19, riskScore: 30, failureRate: 5.9, quarantinedRuns: 1 },
  { dayIndex: 30, dateStr: 'Oct 23, 2026', shortDate: 'Today', deployments: 32, prodDeployments: 12, stagingDeployments: 20, riskScore: 34, failureRate: 6.6, quarantinedRuns: 2, event: 'Active Release Window', eventType: 'release' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const dataPoint = payload[0]?.payload as DayTrendData;
  if (!dataPoint) return null;

  const isCriticalRisk = dataPoint.riskScore >= 60;
  const isElevatedRisk = dataPoint.riskScore >= 40 && dataPoint.riskScore < 60;

  return (
    <div className="bg-[var(--bg-surface-low)] border border-[var(--border-default)] p-3.5 rounded-lg shadow-xl text-left min-w-[240px] backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2 mb-2.5">
        <div>
          <span className="font-label-md text-label-md text-[var(--text-on-surface)] font-semibold block">
            {dataPoint.dateStr}
          </span>
          <span className="text-[11px] text-[var(--text-outline)]">Day {dataPoint.dayIndex} of 30</span>
        </div>
        {dataPoint.event && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
              dataPoint.eventType === 'hotfix'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                : dataPoint.eventType === 'freeze'
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {dataPoint.event}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {/* Risk Score */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-[var(--text-on-surface-variant)]">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCriticalRisk ? 'bg-rose-500' : isElevatedRisk ? 'bg-amber-400' : 'bg-sky-400'
              }`}
            />
            Risk Score
          </span>
          <span className="font-semibold font-mono text-[var(--text-on-surface)]">
            {dataPoint.riskScore} <span className="text-[10px] text-[var(--text-outline)] font-normal">/ 100</span>
            <span
              className={`ml-1.5 text-[10px] font-bold ${
                isCriticalRisk ? 'text-rose-400' : isElevatedRisk ? 'text-amber-400' : 'text-sky-400'
              }`}
            >
              ({isCriticalRisk ? 'CRITICAL' : isElevatedRisk ? 'ELEVATED' : 'STABLE'})
            </span>
          </span>
        </div>

        {/* Deployments */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-[var(--text-on-surface-variant)]">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            Total Deployments
          </span>
          <span className="font-semibold font-mono text-[var(--text-on-surface)]">
            {dataPoint.deployments} <span className="text-[10px] text-[var(--text-outline)] font-normal">deploys</span>
          </span>
        </div>

        {/* Environment Breakdown */}
        <div className="pt-1.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-outline)]">
          <span>Prod: <strong className="text-[var(--text-on-surface)]">{dataPoint.prodDeployments}</strong></span>
          <span>·</span>
          <span>Staging: <strong className="text-[var(--text-on-surface)]">{dataPoint.stagingDeployments}</strong></span>
          <span>·</span>
          <span>Quarantined: <strong className="text-amber-400">{dataPoint.quarantinedRuns}</strong></span>
        </div>
      </div>
    </div>
  );
};

interface RiskVsDeploymentChartProps {
  onShowToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const RiskVsDeploymentChart: React.FC<RiskVsDeploymentChartProps> = ({ onShowToast }) => {
  const [viewMode, setViewMode] = useState<'dual' | 'risk-only' | 'deploys-only'>('dual');
  const [envFilter, setEnvFilter] = useState<'all' | 'prod' | 'staging'>('all');
  const [selectedRange, setSelectedRange] = useState<'30d' | '14d'>('30d');
  const [highlightSpike, setHighlightSpike] = useState(true);

  // Compute filtered dataset
  const chartData = useMemo(() => {
    let data = selectedRange === '14d' ? LAST_30_DAYS_DATA.slice(-14) : LAST_30_DAYS_DATA;

    return data.map((d) => {
      const deployValue =
        envFilter === 'prod'
          ? d.prodDeployments
          : envFilter === 'staging'
          ? d.stagingDeployments
          : d.deployments;

      return {
        ...d,
        activeDeployments: deployValue,
      };
    });
  }, [selectedRange, envFilter]);

  // Summary Metrics calculations
  const summary = useMemo(() => {
    const totalDeploys = chartData.reduce((acc, curr) => acc + curr.activeDeployments, 0);
    const avgRisk = (chartData.reduce((acc, curr) => acc + curr.riskScore, 0) / chartData.length).toFixed(1);
    const maxRiskPoint = chartData.reduce((max, curr) => (curr.riskScore > max.riskScore ? curr : max), chartData[0]);
    const maxDeployPoint = chartData.reduce((max, curr) => (curr.activeDeployments > max.activeDeployments ? curr : max), chartData[0]);
    const totalQuarantined = chartData.reduce((acc, curr) => acc + curr.quarantinedRuns, 0);

    return {
      totalDeploys,
      avgDailyDeploy: (totalDeploys / chartData.length).toFixed(1),
      avgRisk,
      maxRisk: maxRiskPoint.riskScore,
      maxRiskDate: maxRiskPoint.shortDate,
      maxDeploy: maxDeployPoint.activeDeployments,
      maxDeployDate: maxDeployPoint.shortDate,
      totalQuarantined,
    };
  }, [chartData]);

  const handleExportInsights = () => {
    if (onShowToast) {
      onShowToast(
        'Telemetry Insights Exported',
        `30-day Risk Score vs. Deployment correlation report (${summary.totalDeploys} total deployments analyzed).`,
        'success'
      );
    }
  };

  return (
    <div className="bg-[var(--bg-surface-low)] p-5 rounded-xl shadow-sm border border-[var(--border-subtle)] flex flex-col gap-4">
      {/* Header and Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">insights</span>
            <h2 className="font-headline-md text-headline-md text-[var(--text-on-surface)] font-semibold">
              Risk Score vs. Deployment Frequency
            </h2>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-primary/10 text-primary border border-primary/20">
              30-Day Longitudinal
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-[var(--text-outline)] mt-1">
            Correlation analysis between daily release cadence and pre-execution pipeline failure risk engine
          </p>
        </div>

        {/* Interactive Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Segmented Control */}
          <div className="flex items-center bg-[var(--bg-surface-container)] rounded-lg p-1 border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                viewMode === 'dual'
                  ? 'bg-primary text-[var(--on-primary)] font-semibold shadow-sm'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              Dual Trend
            </button>
            <button
              onClick={() => setViewMode('risk-only')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                viewMode === 'risk-only'
                  ? 'bg-primary text-[var(--on-primary)] font-semibold shadow-sm'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              Risk Score
            </button>
            <button
              onClick={() => setViewMode('deploys-only')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                viewMode === 'deploys-only'
                  ? 'bg-primary text-[var(--on-primary)] font-semibold shadow-sm'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              Deploys
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-[var(--bg-surface-container)] rounded-lg p-1 border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setSelectedRange('30d')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                selectedRange === '30d'
                  ? 'bg-secondary text-[var(--on-secondary)] font-semibold shadow-sm'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              30 Days
            </button>
            <button
              onClick={() => setSelectedRange('14d')}
              className={`px-2.5 py-1 rounded transition-colors font-medium ${
                selectedRange === '14d'
                  ? 'bg-secondary text-[var(--on-secondary)] font-semibold shadow-sm'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              14 Days
            </button>
          </div>

          {/* Environment Filter Selector */}
          <div className="flex items-center bg-[var(--bg-surface-container)] rounded-lg p-1 border border-[var(--border-subtle)] text-xs">
            <button
              onClick={() => setEnvFilter('all')}
              className={`px-2.5 py-1 rounded transition-colors ${
                envFilter === 'all'
                  ? 'bg-[var(--bg-surface-high)] text-[var(--text-on-surface)] font-semibold'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              All Envs
            </button>
            <button
              onClick={() => setEnvFilter('prod')}
              className={`px-2.5 py-1 rounded transition-colors ${
                envFilter === 'prod'
                  ? 'bg-[var(--bg-surface-high)] text-[var(--text-on-surface)] font-semibold'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              Prod Only
            </button>
            <button
              onClick={() => setEnvFilter('staging')}
              className={`px-2.5 py-1 rounded transition-colors ${
                envFilter === 'staging'
                  ? 'bg-[var(--bg-surface-high)] text-[var(--text-on-surface)] font-semibold'
                  : 'text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)]'
              }`}
              type="button"
            >
              Staging
            </button>
          </div>

          {/* Export Report */}
          <button
            onClick={handleExportInsights}
            className="p-1.5 rounded-lg bg-[var(--bg-surface-container)] hover:bg-[var(--bg-surface-high)] text-[var(--text-on-surface-variant)] hover:text-[var(--text-on-surface)] border border-[var(--border-subtle)] transition-colors"
            title="Export Correlation Telemetry"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Avg Risk */}
        <div className="bg-[var(--bg-surface-lowest)] p-3 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-outline)] font-medium">
            30-Day Mean Risk Score
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-mono font-bold text-sky-400">{summary.avgRisk}</span>
            <span className="text-[11px] text-emerald-400 font-medium">↓ 14.2% MoM</span>
          </div>
          <div className="text-[11px] text-[var(--text-outline)] mt-0.5">
            Target baseline: &lt;35.0 (Nominal)
          </div>
        </div>

        {/* Metric 2: Total Deploys */}
        <div className="bg-[var(--bg-surface-lowest)] p-3 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-outline)] font-medium">
            Deployment Volume
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-mono font-bold text-emerald-400">{summary.totalDeploys}</span>
            <span className="text-[11px] text-[var(--text-outline)]">({summary.avgDailyDeploy} / day)</span>
          </div>
          <div className="text-[11px] text-[var(--text-outline)] mt-0.5">
            Peak: {summary.maxDeploy} deploys on {summary.maxDeployDate}
          </div>
        </div>

        {/* Metric 3: Correlation Quotient */}
        <div className="bg-[var(--bg-surface-lowest)] p-3 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-outline)] font-medium">
            Risk-Velocity Correlation
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-mono font-bold text-teal-400">+0.21</span>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase">Decoupled</span>
          </div>
          <div className="text-[11px] text-[var(--text-outline)] mt-0.5">
            Velocity increase does not cause risk surge
          </div>
        </div>

        {/* Metric 4: Intercepted Quarantines */}
        <div className="bg-[var(--bg-surface-lowest)] p-3 rounded-lg border border-[var(--border-subtle)]">
          <div className="text-[11px] uppercase tracking-wider text-[var(--text-outline)] font-medium">
            Pre-Deploy Interceptions
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-mono font-bold text-amber-400">{summary.totalQuarantined}</span>
            <span className="text-[11px] text-amber-400/80 font-medium">Runs quarantined</span>
          </div>
          <div className="text-[11px] text-[var(--text-outline)] mt-0.5">
            Zero prod rollbacks in 19 days
          </div>
        </div>
      </div>

      {/* Main Recharts Container */}
      <div className="relative w-full h-80 sm:h-96 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
          >
            <defs>
              {/* Risk Score Area Gradient */}
              <linearGradient id="riskAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
              </linearGradient>

              {/* Deployments Bar Gradient */}
              <linearGradient id="deployBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
              opacity={0.6}
            />

            {/* X Axis: Days / Dates */}
            <XAxis
              dataKey="shortDate"
              stroke="var(--text-outline)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: 'var(--border-subtle)' }}
              dy={6}
            />

            {/* Left Y Axis: Risk Score (0 to 100) */}
            {(viewMode === 'dual' || viewMode === 'risk-only') && (
              <YAxis
                yAxisId="left"
                domain={[0, 100]}
                stroke="var(--text-outline)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
                dx={-4}
                label={{
                  value: 'Risk Score (0-100)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: 'var(--text-outline)', fontSize: 10 },
                  dx: -2,
                }}
              />
            )}

            {/* Right Y Axis: Deployment Frequency */}
            {(viewMode === 'dual' || viewMode === 'deploys-only') && (
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 50]}
                stroke="var(--text-outline)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
                dx={4}
                label={{
                  value: 'Deployments / Day',
                  angle: 90,
                  position: 'insideRight',
                  style: { textAnchor: 'middle', fill: 'var(--text-outline)', fontSize: 10 },
                  dx: 4,
                }}
              />
            )}

            {/* High-Risk Warning Threshold line at score 60 */}
            {(viewMode === 'dual' || viewMode === 'risk-only') && (
              <ReferenceLine
                yAxisId="left"
                y={60}
                stroke="#fb7185"
                strokeDasharray="4 4"
                label={{
                  value: 'Elevated Risk Threshold (60)',
                  fill: '#fb7185',
                  fontSize: 10,
                  position: 'top',
                }}
              />
            )}

            {/* Custom Rich Tooltip */}
            <Tooltip content={<CustomChartTooltip />} />

            {/* Deployment Frequency Bars or Area (Right Axis) */}
            {(viewMode === 'dual' || viewMode === 'deploys-only') && (
              <Bar
                yAxisId={viewMode === 'deploys-only' ? 'left' : 'right'}
                dataKey="activeDeployments"
                name="Deployments"
                fill="url(#deployBarGradient)"
                stroke="#10b981"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
              />
            )}

            {/* Risk Score Area & Line (Left Axis) */}
            {(viewMode === 'dual' || viewMode === 'risk-only') && (
              <>
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Area"
                  fill="url(#riskAreaGradient)"
                  stroke="none"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="riskScore"
                  name="Risk Score"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#080d16', stroke: '#38bdf8', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#38bdf8', stroke: '#ffffff', strokeWidth: 2 }}
                />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer Legend & Engineering Observations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs pt-2 border-t border-[var(--border-subtle)] text-[var(--text-outline)]">
        {/* Visual Legend */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-sky-400 rounded-full" />
            <span className="text-[var(--text-on-surface)] font-medium">Risk Score (Pre-Exec AI Model)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-emerald-500/40 border border-emerald-500 rounded-sm" />
            <span className="text-[var(--text-on-surface)] font-medium">Daily Deployments</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-dashed border-rose-400" />
            <span className="text-rose-400">Risk Threshold (60)</span>
          </div>
        </div>

        {/* SRE Root-Cause Insight */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-on-surface-variant)]">
          <span className="material-symbols-outlined text-[15px] text-amber-400">warning</span>
          <span>
            Oct 14 Spike: <strong>72 Risk Score</strong> occurred during <strong>Release v2.4.0 (Auth Overhaul)</strong> with 44 concurrent deploys.
          </span>
        </div>
      </div>
    </div>
  );
};
