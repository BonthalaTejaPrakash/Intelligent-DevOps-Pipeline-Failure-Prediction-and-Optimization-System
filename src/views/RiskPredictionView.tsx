import React, { useState } from 'react';
import { ViewMode, PipelineRun } from '../types';
import { MOCK_KNN_MATCHES } from '../data/mockData';

interface RiskPredictionViewProps {
  onNavigate: (view: ViewMode) => void;
  runs: PipelineRun[];
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const RiskPredictionView: React.FC<RiskPredictionViewProps> = ({
  onNavigate,
  runs,
  onShowToast,
}) => {
  const [selectedRunId, setSelectedRunId] = useState('run-4192');
  const [isSimulated, setIsSimulated] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Autonomous action toggles
  const [slackAlert, setSlackAlert] = useState(true);
  const [requireReview, setRequireReview] = useState(true);
  const [diagnosticVerbosity, setDiagnosticVerbosity] = useState(true);

  const selectedRun = runs.find((r) => r.id === selectedRunId) || runs[0];

  const handleReEvaluate = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      setIsEvaluating(false);
      onShowToast(
        'Matrix Re-Evaluated',
        `Re-computed SHAP attribution for commit ${selectedRun.commitSha} against 14,200 baselines.`,
        'success'
      );
    }, 850);
  };

  const handleSimulateToggle = () => {
    const nextState = !isSimulated;
    setIsSimulated(nextState);
    if (nextState) {
      onShowToast(
        'Synthetic What-If Engaged',
        'Excluded cargo.lock modification: failure likelihood dropped to 52% (Moderate Tier).',
        'info'
      );
    } else {
      onShowToast(
        'Simulation Reset',
        'Restored original feature vector (+32.4% dependency churn).',
        'warning'
      );
    }
  };

  const currentRiskScore = isSimulated ? 52 : (selectedRun.predictedRisk || 84);
  const isCritical = currentRiskScore > 75;

  // 427 is full circumference of circle r=68 (2 * pi * 68 ~= 427)
  const strokeDashoffset = Math.round(427 * (1 - currentRiskScore / 100));

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command Strip */}
      <section className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 pb-6">
        <div className="flex flex-col gap-2 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-sm text-label-sm bg-surface-container-high text-primary px-2 py-0.5 rounded flex items-center gap-1 border border-primary/20">
              <span className="material-symbols-outlined text-[14px]">psychology</span>
              Model: XGBoost Classifier v2.4-calibrated
            </span>
            <span className="font-label-sm text-label-sm text-outline">|</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Last Trained: Today 04:00 UTC</span>
            <span className="font-label-sm text-label-sm text-outline">|</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Baseline: Logistic Regression v1.2</span>
            <span className="bg-error-container text-error font-label-sm text-label-sm px-2 py-0.5 rounded flex items-center gap-1 border border-error/30">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
              DEMO FIXTURES ACTIVE • Ground-Truth Verified
            </span>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            Pre-Execution Risk Prediction Engine
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Inference engine trained on chronological commit features, dependency churn, historical workflow patterns, and test stability to intercept continuous integration failure before computational resources are provisioned.
          </p>
        </div>

        {/* Active Target Selector Bar */}
        <div className="bg-surface-container-low rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-md border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">
              Inspecting Execution Unit
            </span>
            <div className="relative mt-1">
              <select
                value={selectedRunId}
                onChange={(e) => {
                  setSelectedRunId(e.target.value);
                  setIsSimulated(false);
                }}
                className="bg-surface-container-high px-3 py-1.5 rounded text-left text-on-surface font-headline-sm text-headline-sm hover:bg-surface-bright transition-colors w-full sm:w-[380px] border border-outline-variant/40 focus:outline-none"
              >
                {runs.map((r) => (
                  <option key={r.id} value={r.id}>
                    Run #{r.runNumber} — {r.repo} ({r.branch})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 sm:pt-0">
            <button
              onClick={handleReEvaluate}
              disabled={isEvaluating}
              className="flex items-center justify-center gap-1.5 bg-primary text-on-primary px-4 py-2 rounded-lg font-headline-sm text-headline-sm hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
            >
              <span className={`material-symbols-outlined text-[18px] ${isEvaluating ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isEvaluating ? 'Computing SHAP...' : 'Re-Evaluate Matrix'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pinned Metadata Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-surface-container rounded-lg mb-6 text-on-surface-variant border border-outline-variant/30">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase">Branch / Target</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold truncate">
            {selectedRun.branch} → main
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase">Commit SHA</span>
          <span className="font-label-md text-label-md text-primary font-mono truncate">
            {selectedRun.commitSha}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase">Committer</span>
          <span className="font-label-md text-label-md text-on-surface truncate">
            {selectedRun.author.name} ({selectedRun.author.role || 'Contributor'})
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase">Event Trigger</span>
          <span className="font-label-md text-label-md text-secondary truncate">
            pull_request.opened
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase">Elapsed Since Ingest</span>
          <span className="font-label-md text-label-md text-on-surface truncate">
            {selectedRun.timestamp}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-outline uppercase">Interception Status</span>
          <span className={`font-label-sm text-label-sm font-semibold flex items-center gap-1 ${
            isCritical ? 'text-error' : 'text-emerald-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isCritical ? 'bg-error' : 'bg-emerald-400'}`}></span>
            {isCritical ? 'DISPATCH HELD (High Risk)' : 'DISPATCH APPROVED'}
          </span>
        </div>
      </div>

      {/* Primary Intelligence Canvas: Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Risk Gauge & Deep Confidence Telemetry */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Elevated Dark Risk Panel */}
          <div className="relative bg-surface-container p-6 rounded-xl shadow-xl overflow-hidden flex flex-col justify-between border border-outline-variant/30">
            {/* Ambient radial glow */}
            <div className={`absolute -top-12 -left-12 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-700 ${
              isCritical ? 'bg-error-container/30' : 'bg-secondary-container/30'
            }`}></div>
            <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-tertiary-container/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[20px] ${isCritical ? 'text-error' : 'text-secondary'}`}>
                  {isCritical ? 'warning' : 'verified_user'}
                </span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                  Pre-Flight Failure Probability
                </span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded text-on-surface-variant font-mono border border-outline-variant/30">
                XGB-Inf-0.988
              </span>
            </div>

            {/* Risk Gauge Centerpiece */}
            <div className="relative z-10 my-6 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* Inline SVG Circular Gauge Meter */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  {/* Background Ring Track */}
                  <circle
                    className="text-surface-container-highest"
                    cx="80"
                    cy="80"
                    fill="none"
                    r="68"
                    stroke="currentColor"
                    strokeDasharray="427"
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                  {/* Active Segment Stroke */}
                  <circle
                    className={`transition-all duration-700 ease-out ${
                      isCritical ? 'text-error' : 'text-secondary'
                    }`}
                    cx="80"
                    cy="80"
                    fill="none"
                    r="68"
                    stroke="currentColor"
                    strokeDasharray="427"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="12"
                  />
                </svg>

                {/* Center Metric Hub */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span
                    className={`font-data-metric text-data-metric font-bold tracking-tight drop-shadow-[0_0_12px_rgba(255,180,171,0.5)] transition-colors duration-500 ${
                      isCritical ? 'text-error' : 'text-secondary'
                    }`}
                  >
                    {currentRiskScore}%
                  </span>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline mt-0.5">
                    Failure Likelihood
                  </span>
                  <div className="mt-2 flex items-center gap-1 bg-surface-container-lowest/80 px-2.5 py-0.5 rounded-full border border-outline-variant/30">
                    <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-error animate-ping' : 'bg-secondary'}`}></span>
                    <span className={`font-label-sm text-label-sm font-medium ${isCritical ? 'text-error' : 'text-secondary'}`}>
                      {isCritical ? 'CRITICAL RISK' : 'MODERATE RISK'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 text-center">
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">Confidence Interval</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">
                    {isSimulated ? '95% CI: [46% – 58%]' : '95% CI: [79% – 88%]'}
                  </span>
                </div>
                <div className="w-px h-6 bg-surface-container-highest"></div>
                <div>
                  <span className="font-label-sm text-label-sm text-outline block">Model Uncertainty</span>
                  <span className="font-label-md text-label-md text-primary font-semibold">
                    Low (σ=0.06)
                  </span>
                </div>
              </div>
            </div>

            {/* Actionable Directive Banner */}
            <div className="relative z-10 bg-surface-container-lowest p-4 rounded-lg flex flex-col gap-2 border border-outline-variant/20">
              <div className={`flex items-center gap-2 ${isCritical ? 'text-error' : 'text-secondary'}`}>
                <span className="material-symbols-outlined text-[18px]">flip_camera_ios</span>
                <span className="font-headline-sm text-headline-sm font-semibold">Primary Recommendation</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {isCritical
                  ? 'Advise pre-flight dependency dry-run and targeted test execution before full matrix spawn. Automated hold engaged to prevent cascading runner saturation.'
                  : 'Simulated profile is within tolerable safety boundaries. Targeted test execution is ready for dispatch.'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => onShowToast('Targeted Subset Dispatched', 'Running 18 isolated test fixtures on ephemeral runner.', 'success')}
                  className="bg-primary text-on-primary px-3 py-1 rounded font-headline-sm text-headline-sm hover:opacity-90 transition-opacity shadow-sm"
                >
                  Trigger Targeted Subset
                </button>
                <button
                  onClick={() => onShowToast('Safety Hold Bypassed', 'Override token logged to SRE audit trail.', 'warning')}
                  className="bg-surface-container-high text-on-surface-variant hover:text-on-surface px-3 py-1 rounded font-headline-sm text-headline-sm transition-colors border border-outline-variant/30"
                >
                  Bypass Safety Hold
                </button>
              </div>
            </div>
          </div>

          {/* Historical Precedent Match (K-Nearest Neighbors) */}
          <div className="bg-surface-container p-4 rounded-xl flex flex-col gap-3 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">scatter_plot</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  K-Nearest Neighbor Pipeline Matches
                </span>
              </div>
              <span className="font-label-sm text-label-sm bg-surface-container-lowest px-2 py-0.5 rounded text-outline font-mono border border-outline-variant/30">
                k=4 Euclidean
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Historical CI runs exhibiting the closest high-dimensional feature vectors to commit <span className="text-primary font-mono">{selectedRun.commitSha}</span>:
            </p>

            {/* KNN Runs Table */}
            <div className="flex flex-col gap-2 mt-1">
              {MOCK_KNN_MATCHES.map((item) => (
                <div
                  key={item.runId}
                  className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between hover:bg-surface-container-high transition-colors border border-outline-variant/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        item.isFailure ? 'bg-error' : 'bg-primary-container'
                      }`}
                    ></span>
                    <div className="flex flex-col truncate">
                      <span className="font-label-md text-label-md text-on-surface font-medium truncate">
                        {item.runId}
                      </span>
                      <span className="font-label-sm text-label-sm text-outline truncate">
                        {item.summary}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span className="font-label-sm text-label-sm text-primary font-bold">
                      {item.matchPct}
                    </span>
                    <span className={`font-label-sm text-label-sm font-mono ${
                      item.isFailure ? 'text-error' : 'text-primary'
                    }`}>
                      {item.result}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest p-2 rounded text-center border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-outline font-mono">
                Cosine Similarity Vector: [0.892, 0.741, 0.965, 0.412] • Distance Metric: 0.14
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SHAP Value Decomposition & Configurable Intervention Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Feature Impact Breakdown (SHAP Values) */}
          <div className="bg-surface-container p-6 rounded-xl shadow-lg flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">analytics</span>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                    Explainability &amp; Feature SHAP Attribution
                  </h2>
                  <p className="font-body-sm text-body-sm text-outline">
                    Additive feature attribution values calibrated against 14,200 baseline runs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-low px-2 py-1 rounded border border-outline-variant/30">
                <span className="font-label-sm text-label-sm text-error font-medium">
                  {isSimulated ? '+55.8% Total Risk' : '+88.2% Total Risk'}
                </span>
                <span className="font-label-sm text-label-sm text-outline">/</span>
                <span className="font-label-sm text-label-sm text-secondary font-medium">
                  -4.2% Mitigating
                </span>
              </div>
            </div>

            {/* Waterfall / Horizontal Bar Visualizations */}
            <div className="flex flex-col gap-3 pt-1">
              {/* Feature 1: Lockfiles */}
              <div className={`p-3 rounded-lg flex flex-col gap-1.5 transition-colors border ${
                isSimulated
                  ? 'bg-surface-container-lowest/50 border-dashed border-outline-variant/30 opacity-40'
                  : 'bg-surface-container-low border-outline-variant/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-error text-[18px]">inventory_2</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">
                      Dependency files modified
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono truncate hidden sm:inline">
                      (+package-lock.json, +cargo.lock)
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-error font-bold font-mono shrink-0">
                    {isSimulated ? 'Excluded' : '+32.4% Risk'}
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
                  <div
                    className="bg-error h-full rounded-full transition-all duration-700"
                    style={{ width: isSimulated ? '0%' : '75%' }}
                  ></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>High volatility index in cargo.lock dependency resolution graph</span>
                  <span className="text-outline font-mono">Weight: {isSimulated ? '0.000' : '0.324'}</span>
                </div>
              </div>

              {/* Feature 2: Extreme Code Churn */}
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-error text-[18px]">difference</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">
                      Extreme Code Churn Dynamics
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono truncate hidden sm:inline">
                      (+482 / -310 in 14 modules)
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-error font-bold font-mono shrink-0">
                    +21.8% Risk
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
                  <div className="bg-error h-full rounded-full transition-all duration-700" style={{ width: '55%' }}></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Exceeds repository 90th percentile churn per pull request</span>
                  <span className="text-outline font-mono">Weight: 0.218</span>
                </div>
              </div>

              {/* Feature 3: Component Context */}
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-tertiary text-[18px]">person_alert</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">
                      Component Context Failure Probability
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono truncate hidden sm:inline">
                      (auth-core failure rate: 38%)
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-tertiary font-bold font-mono shrink-0">
                    +14.2% Risk
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
                  <div className="bg-tertiary-container h-full rounded-full transition-all duration-700" style={{ width: '38%' }}></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Historical CI failures on auth subsystem across previous 5 sprints</span>
                  <span className="text-outline font-mono">Weight: 0.142</span>
                </div>
              </div>

              {/* Feature 4: Flaky Test in Execution Suite */}
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-secondary text-[18px]">bug_report</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">
                      Flaky Test in Target Execution Suite
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono truncate hidden sm:inline">
                      (test_token_exchange failed 3/10)
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-secondary font-bold font-mono shrink-0">
                    +11.5% Risk
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
                  <div className="bg-secondary-container h-full rounded-full transition-all duration-700" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Unstable assertion detected in auth-token suite test harness</span>
                  <span className="text-outline font-mono">Weight: 0.115</span>
                </div>
              </div>

              {/* Feature 5: Branch Divergence */}
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-outline text-[18px]">call_split</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">
                      Branch Divergence / Main Skew
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono truncate hidden sm:inline">
                      (Branch is 14 commits behind main)
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-outline font-bold font-mono shrink-0">
                    +8.3% Risk
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex">
                  <div className="bg-surface-bright h-full rounded-full transition-all duration-700" style={{ width: '22%' }}></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>High likelihood of post-merge integration collision</span>
                  <span className="text-outline font-mono">Weight: 0.083</span>
                </div>
              </div>

              {/* Mitigating Counteracting Feature */}
              <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1.5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">verified</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-medium truncate">
                      Declared High Unit Test Coverage
                    </span>
                    <span className="font-label-sm text-label-sm text-outline font-mono truncate hidden sm:inline">
                      (88.2% test statements verified)
                    </span>
                  </div>
                  <span className="font-label-md text-label-md text-primary font-bold font-mono shrink-0">
                    -4.2% Risk (Mitigating)
                  </span>
                </div>
                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden flex justify-end">
                  <div className="bg-primary-container h-full rounded-full transition-all duration-700" style={{ width: '15%' }}></div>
                </div>
                <div className="flex justify-between font-label-sm text-label-sm text-on-surface-variant">
                  <span>Author included 18 targeted unit test fixtures within PR diff</span>
                  <span className="text-primary font-mono">Weight: -0.042</span>
                </div>
              </div>
            </div>
          </div>

          {/* Configurable Policies & Autonomous Actions */}
          <div className="bg-surface-container p-6 rounded-xl flex flex-col gap-4 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">tune</span>
                <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
                  Configurable Policies &amp; Autonomous Actions
                </h2>
              </div>
              <span className="font-label-sm text-label-sm text-outline font-mono">
                Policy Set: strict-sre-v4
              </span>
            </div>

            {/* Multi-tier threshold indicator slider visual */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-outline font-label-sm text-label-sm">
                <span>Risk Partition Boundaries</span>
                <span>
                  Current Score: <strong className={isCritical ? 'text-error font-mono' : 'text-secondary font-mono'}>
                    {currentRiskScore}% ({isCritical ? 'Critical' : 'Moderate'})
                  </strong>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-3 rounded-full overflow-hidden bg-surface-container-lowest p-0.5 border border-outline-variant/30">
                <div className="bg-surface-bright rounded-l-full relative flex items-center justify-center">
                  <span className="font-label-sm text-[9px] text-on-surface-variant hidden md:inline">LOW &lt;30%</span>
                </div>
                <div className={`relative flex items-center justify-center ${!isCritical ? 'bg-secondary-container shadow-[inset_0_0_8px_rgba(164,201,255,0.4)]' : 'bg-secondary-container/60'}`}>
                  <span className="font-label-sm text-[9px] text-on-surface hidden md:inline">MOD 30-60%</span>
                </div>
                <div className="bg-tertiary-container/60 relative flex items-center justify-center">
                  <span className="font-label-sm text-[9px] text-on-surface hidden md:inline">HIGH 60-80%</span>
                </div>
                <div className={`relative flex items-center justify-center ${isCritical ? 'bg-error-container shadow-[inset_0_0_8px_rgba(255,180,171,0.4)]' : 'bg-error-container/40'}`}>
                  <span className="font-label-sm text-[9px] text-error font-bold">CRITICAL &gt;80%</span>
                </div>
              </div>
            </div>

            {/* Interactive Automated Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Toggle 1 */}
              <label className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between gap-3 cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-secondary text-[20px]">notifications_active</span>
                  <input
                    checked={slackAlert}
                    onChange={(e) => setSlackAlert(e.target.checked)}
                    className="w-4 h-4 rounded bg-surface-container-lowest accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Author Slack Alert</span>
                  <span className="font-label-sm text-label-sm text-outline">Trigger on risk score &gt;70%</span>
                </div>
              </label>

              {/* Toggle 2 */}
              <label className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between gap-3 cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-error text-[20px]">gavel</span>
                  <input
                    checked={requireReview}
                    onChange={(e) => setRequireReview(e.target.checked)}
                    className="w-4 h-4 rounded bg-surface-container-lowest accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Require 2nd Review</span>
                  <span className="font-label-sm text-label-sm text-outline">Enforced on Critical Tier</span>
                </div>
              </label>

              {/* Toggle 3 */}
              <label className="bg-surface-container-low p-3 rounded-lg flex flex-col justify-between gap-3 cursor-pointer hover:bg-surface-container-high transition-colors border border-outline-variant/20">
                <div className="flex items-start justify-between">
                  <span className="material-symbols-outlined text-tertiary text-[20px]">developer_board</span>
                  <input
                    checked={diagnosticVerbosity}
                    onChange={(e) => setDiagnosticVerbosity(e.target.checked)}
                    className="w-4 h-4 rounded bg-surface-container-lowest accent-primary cursor-pointer"
                    type="checkbox"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-medium">Diagnostic Verbosity</span>
                  <span className="font-label-sm text-label-sm text-outline">Inject DEBUG log agents</span>
                </div>
              </label>
            </div>

            {/* Custom Parameter Adjustment Sub-panel (Collapsible/Interactive) */}
            <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-3 border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[18px]">science</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Simulate Synthetic What-If: Exclude cargo.lock modifications
                </span>
              </div>
              <button
                onClick={handleSimulateToggle}
                className="bg-surface-container-high hover:bg-surface-bright text-primary font-label-sm text-label-sm px-3 py-1.5 rounded transition-colors whitespace-nowrap border border-primary/30"
              >
                {isSimulated ? 'Reset Simulation (+32.4%)' : 'Recalculate (Simulate -32.4%)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Visual Asset Panel: CI Worker Topology & Historical Matrix Telemetry */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Visual 1: Pre-Execution Model Telemetry */}
        <div className="bg-surface-container p-4 rounded-xl flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px]">insights</span>
              Model Precision Calibration
            </span>
            <span className="font-label-sm text-label-sm text-primary font-mono">AUC: 0.941</span>
          </div>

          <div className="w-full h-24 bg-surface-container-lowest rounded-lg p-2 flex items-end border border-outline-variant/20">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 240 80">
              <path
                className="text-primary"
                d="M0,70 Q30,65 60,40 T120,45 T180,20 T240,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                className="text-primary/10"
                d="M0,70 Q30,65 60,40 T120,45 T180,20 T240,15 L240,80 L0,80 Z"
                fill="currentColor"
              />
              <line
                className="text-outline-variant"
                stroke="currentColor"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="240"
                y1="50"
                y2="50"
              />
            </svg>
          </div>

          <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-outline">
            <span>F1-Score: 0.884</span>
            <span>False Positive Rate: 3.2%</span>
          </div>
        </div>

        {/* Visual 2: Fleet Cluster Resource Impact */}
        <div className="bg-surface-container p-4 rounded-xl flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-secondary text-[18px]">memory</span>
              Predicted Compute Savings
            </span>
            <span className="font-label-sm text-label-sm text-secondary font-mono">-$142.50 / run</span>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg flex flex-col gap-2 border border-outline-variant/20">
            <div className="flex justify-between text-on-surface font-label-sm text-label-sm">
              <span>Runner CPU Hours Saved</span>
              <span className="text-primary font-bold">18.4 vCPU-hrs</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-secondary-container h-full rounded-full" style={{ width: '72%' }}></div>
            </div>

            <div className="flex justify-between text-on-surface font-label-sm text-label-sm">
              <span>Failed Test Matrix Jobs Aborted</span>
              <span className="text-error font-bold">12 / 16 jobs</span>
            </div>
            <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
              <div className="bg-error h-full rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>

          <span className="font-label-sm text-label-sm text-outline mt-2">
            Computed via AWS EC2 c6i.2xlarge spot rates
          </span>
        </div>

        {/* Visual 3: Automated Diagnostic Snapshot / 3D Gateway */}
        <div className="bg-surface-container p-4 rounded-xl flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-center justify-between mb-1">
            <span className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center gap-1.5">
              <span className="material-symbols-outlined text-tertiary text-[18px]">device_hub</span>
              Dependency Conflict Vector
            </span>
            <span className="font-label-sm text-label-sm bg-surface-container-highest px-2 py-0.5 rounded text-outline font-mono">
              AST-Tree
            </span>
          </div>

          <div
            onClick={() => onNavigate('3d-mesh')}
            className="h-24 w-full bg-surface-container-lowest rounded-lg flex items-center justify-center relative overflow-hidden cursor-pointer group border border-outline-variant/20"
          >
            <img
              alt="Dependency graph"
              className="object-cover w-full h-full opacity-60 rounded-lg group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5B44y1CYotOa4UYRuUslh9waKvCAfssrV4p9J50dpLhHHAiGqZpwhYkuYPcFPcBO6YQvHfTS2-uD3NIJqP-PgfsGqbQAp318WKzVLb0Gk0Tyj2c9lIHdyu6nC1WEnl1PjUetnDfI370tNiO_shmxGGXsN0SbLxrJ9tVLo6gpjEU2JHlEuUX_KMRCUztwZjUSvsdN_bK4ClvN2slwuV5ndmyLq5HiGFF0x9L2YrwlTJ6QJwp3aLJZ3"
            />
            <div className="absolute inset-0 bg-surface-container-lowest/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="font-label-sm text-label-sm text-on-surface bg-surface-container-highest/90 px-3 py-1 rounded border border-outline-variant/30 flex items-center gap-1 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined text-[14px] text-tertiary">3d_rotation</span>
                <span>Open in 3D Cluster Topology →</span>
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-2 font-label-sm text-label-sm text-outline">
            <span>Transitive Dependencies: 42</span>
            <span className="text-tertiary font-mono">3 Circular Links</span>
          </div>
        </div>
      </div>
    </div>
  );
};
