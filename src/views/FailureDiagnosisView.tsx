import React, { useState } from 'react';
import { ViewMode } from '../types';

interface FailureDiagnosisViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const FailureDiagnosisView: React.FC<FailureDiagnosisViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [logFilter, setLogFilter] = useState('');
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [wrapLines, setWrapLines] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'accurate' | 'partial' | 'incorrect'>('accurate');
  const [feedbackAnnotation, setFeedbackAnnotation] = useState(
    'Spot on. Telemetry SDK needed the React 18 peerDep bump.'
  );

  const initialLogLines = [
    { num: 120, time: '14:02:18.102', text: '$ npm ci --prefer-offline --no-audit', isError: false },
    { num: 121, time: '14:02:18.420', text: 'npm info using npm@9.6.7', isError: false },
    { num: 122, time: '14:02:18.421', text: 'npm info using node@v18.17.0', isError: false },
    { num: 123, time: '14:02:19.011', text: 'npm verb cache add [REDACTED_REGISTRY_TOKEN]', isError: false },
    { num: 124, time: '14:02:19.340', text: 'npm http fetch GET 200 https://npm.pkg.github.com/@acme%2fauth 184ms', isError: false },
    { num: 125, time: '14:02:20.122', text: 'npm http fetch GET 200 https://registry.npmjs.org/react 89ms', isError: false },
    { num: '...', time: '...', text: '[19 dependency tree resolution entries truncated for brevity]', isError: false, italic: true },
    { num: 145, time: '14:02:23.901', text: 'npm verb idealTree:buildDeps starting peer dependency audit', isError: false },
    { num: 146, time: '14:02:24.015', text: 'npm ERR! code ERESOLVE', isError: true, badge: 'AST ERROR MATCH' },
    { num: 147, time: '14:02:24.016', text: 'npm ERR! ERESOLVE could not resolve', isError: true },
    { num: 148, time: '14:02:24.017', text: 'npm ERR! While resolving: @acme/telemetry-sdk@3.2.0', isSecondary: true },
    { num: 149, time: '14:02:24.018', text: 'npm ERR! Found: react@18.3.1 in root project', isSecondary: true },
    { num: 150, time: '14:02:24.019', text: 'npm ERR! Could not resolve dependency: peer react@"^17.0.0" from @acme/telemetry-sdk', isError: true, isBold: true, badge: 'Anchor Fact' },
    { num: 151, time: '14:02:24.020', text: 'npm ERR! Conflicting peer dependency: react@17.0.2', isError: false },
    { num: 152, time: '14:02:24.021', text: 'npm ERR! Fix the upstream dependency conflict, or retry with --legacy-peer-deps', isError: false },
    { num: 153, time: '14:02:24.180', text: 'npm ERR! A complete log of this run can be found in:', isError: false },
    { num: 154, time: '14:02:24.181', text: 'npm ERR! /root/.npm/_logs/2025-02-23T14_02_24_020Z-eresolve.log', isError: false },
    { num: 155, time: '14:02:24.210', text: '##[error]Process completed with exit code 1.', isError: true },
  ];

  const handleJumpToError = () => {
    const errorEl = document.getElementById('target-error-line');
    if (errorEl) {
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      onShowToast('Focused Anchor Fact', 'Navigated to line 150 peer conflict.', 'info');
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('npm install @acme/telemetry-sdk@3.3.0-rc.1');
    onShowToast('Copied to Clipboard', 'npm install @acme/telemetry-sdk@3.3.0-rc.1', 'success');
  };

  const handleSanitizeDownload = () => {
    const logText = initialLogLines.map(l => `${l.time} ${l.text}`).join('\n');
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sanitized_run_4180_audit.log';
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('Sanitized Logs Ready', 'Tokens masked: 4 tokens redacted.', 'success');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    onShowToast('Permalink Copied', 'Shareable forensic diagnosis link created.', 'info');
  };

  const filteredLines = initialLogLines.filter(
    (line) => !logFilter || line.text.toLowerCase().includes(logFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Bar / Diagnostic Header Area */}
      <div className="flex flex-col gap-2 pt-4 mb-6">
        {/* Meta Breadcrumb & Live Mode */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline">
            <span className="text-on-surface-variant font-medium">Workflows</span>
            <span>/</span>
            <span className="text-on-surface-variant">acme/microservices-backend</span>
            <span>/</span>
            <span className="text-primary font-medium">run-4180</span>
            <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline-variant font-data-metric text-[10px] border border-outline-variant/30">
              SHA: 8cf3a19
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1.5 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
              AST Deterministic Engine Online
            </span>
          </div>
        </div>

        {/* Title and Core Identity Banner */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
                Evidence-Based Failure Diagnosis Studio
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container/30 text-error font-label-sm text-label-sm border border-error/30">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                Diagnosed: Dependency Resolution Conflict
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
                Confidence: 94%
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Target: <span className="font-label-md text-label-md text-on-surface font-semibold">Run #4180</span> — repo:{' '}
              <code className="font-data-metric text-[13px] text-secondary">acme/microservices-backend</code> (workflow:{' '}
              <span className="text-on-surface">release-build</span>)
            </p>

            <div className="flex items-center gap-2 mt-0.5 text-outline font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[15px] text-primary">memory</span>
              <span>
                Method: <strong className="text-on-surface-variant font-medium">Deterministic Regex Classifier + AST Log Pattern Engine</strong> (No external LLM required)
              </span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleSanitizeDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
              <span>Sanitize &amp; Download Logs</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Share Diagnosis</span>
            </button>

            <button
              onClick={() => onShowToast('Diagnosis Flagged', 'Sent note to SRE calibration review board.', 'warning')}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-error-container/20 hover:bg-error-container/40 text-error font-headline-sm text-headline-sm transition-colors border border-error/30"
            >
              <span className="material-symbols-outlined text-[18px]">flag</span>
              <span>Flag Incorrect</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Deep Inspection Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Sanitized Log Viewer */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex flex-col rounded-xl bg-surface-container-lowest overflow-hidden shadow-md border border-outline-variant/30">
            {/* Viewer Top Controls Bar */}
            <div className="p-3 bg-surface-container-low flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider pl-1">Stage:</span>
                <div className="relative">
                  <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-surface-container-high text-error font-label-md text-label-md font-semibold hover:bg-surface-container-highest transition-colors border border-error/30">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span>build:npm-install [Failed]</span>
                    <span className="material-symbols-outlined text-[16px] text-outline">arrow_drop_down</span>
                  </button>
                </div>
              </div>

              {/* Tokens Masked Notice */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm shrink-0 border border-outline-variant/20">
                <span className="material-symbols-outlined text-[15px] text-primary">lock_reset</span>
                <span>
                  Secrets Redacted: <strong className="text-primary font-semibold">4 tokens masked</strong>
                </span>
              </div>
            </div>

            {/* Secondary Toolbar: Search & View Options */}
            <div className="px-4 py-2 bg-surface-container-low/60 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20">
              {/* Filter Search */}
              <div className="relative flex-1 min-w-[200px]">
                <span className="material-symbols-outlined absolute left-2.5 top-2 text-[17px] text-outline">search</span>
                <input
                  value={logFilter}
                  onChange={(e) => setLogFilter(e.target.value)}
                  className="w-full bg-surface-container-lowest text-on-surface placeholder:text-outline font-label-sm text-label-sm rounded pl-8 pr-3 py-1.5 focus:outline-none focus:bg-surface-container transition-all border border-outline-variant/30"
                  placeholder="Filter log lines... e.g. error, ERESOLVE, react"
                  type="text"
                />
              </div>

              {/* Toggle Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWrapLines(!wrapLines)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors border ${
                    wrapLines
                      ? 'bg-surface-container-high text-primary border-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">wrap_text</span>
                  <span>Wrap Lines</span>
                </button>

                <button
                  onClick={() => setShowTimestamps(!showTimestamps)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded font-label-sm text-label-sm transition-colors border ${
                    showTimestamps
                      ? 'bg-surface-container-high text-primary border-primary/30'
                      : 'bg-surface-container text-on-surface-variant hover:text-on-surface border-outline-variant/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">schedule</span>
                  <span>Timestamps</span>
                </button>

                <button
                  onClick={handleJumpToError}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-error-container/20 hover:bg-error-container/40 text-error font-label-sm text-label-sm transition-colors border border-error/30"
                >
                  <span className="material-symbols-outlined text-[15px]">keyboard_double_arrow_down</span>
                  <span>Jump to Error</span>
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              className={`p-3 max-h-[580px] font-mono text-[12px] leading-[22px] select-text overflow-y-auto ${
                wrapLines ? 'whitespace-normal' : 'overflow-x-auto whitespace-pre'
              }`}
            >
              <div className="flex flex-col min-w-[580px]">
                {filteredLines.map((l, index) => {
                  const isAnchor = l.num === 150;
                  const isTargetError = l.num === 146;

                  return (
                    <div
                      key={index}
                      id={isTargetError ? 'target-error-line' : undefined}
                      className={`flex items-start px-2 py-0.5 rounded transition-colors ${
                        isAnchor
                          ? 'bg-error-container/30 border border-error/30'
                          : l.isError
                          ? 'bg-error-container/20'
                          : l.isSecondary
                          ? 'bg-secondary-container/20'
                          : 'hover:bg-surface-container-high/40 text-outline'
                      }`}
                    >
                      <span className="w-10 text-right pr-3 select-none text-outline-variant font-label-sm text-label-sm">
                        {l.num}
                      </span>
                      {showTimestamps && (
                        <span className="text-outline-variant text-[11px] pr-3 select-none font-mono">
                          {l.time}
                        </span>
                      )}
                      <span
                        className={`flex-1 ${
                          l.isError
                            ? 'text-error font-medium'
                            : l.isSecondary
                            ? 'text-secondary font-medium'
                            : l.italic
                            ? 'text-outline italic'
                            : 'text-on-surface-variant'
                        } ${l.isBold ? 'font-bold' : ''}`}
                      >
                        {l.text}
                      </span>

                      {l.badge && (
                        <span
                          className={`ml-auto px-1.5 py-0.2 rounded font-label-sm text-[10px] uppercase font-bold shrink-0 ${
                            isAnchor
                              ? 'bg-primary-container text-on-primary-container'
                              : 'bg-error/20 text-error'
                          }`}
                        >
                          {l.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terminal Footer Diagnostic Status */}
            <div className="px-4 py-2 bg-surface-container-low flex items-center justify-between font-label-sm text-label-sm text-outline border-t border-outline-variant/30">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-error">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  <span>1 fatal syntax match</span>
                </span>
                <span>•</span>
                <span className="text-on-surface-variant font-mono">
                  Regex: <code className="text-primary font-mono">/^npm ERR! code (E[A-Z0-9]+)/</code>
                </span>
              </div>
              <span className="font-mono">155 lines analyzed in 18ms</span>
            </div>
          </div>

          {/* AST Pattern Token Matches */}
          <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">account_tree</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  AST Pattern Token Matches
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                Node.js Engine v18.x
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              <div className="p-3 rounded bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline">Error Grammar Token</span>
                <span className="font-mono text-on-surface text-[14px] font-semibold">ERESOLVE</span>
                <span className="text-[11px] font-mono text-primary">npm:package-spec:peer</span>
              </div>

              <div className="p-3 rounded bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline">Conflicting Package</span>
                <span className="font-mono text-on-surface text-[14px] font-semibold">react@18.3.1</span>
                <span className="text-[11px] font-mono text-secondary">Target: ^17.0.0</span>
              </div>

              <div className="p-3 rounded bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
                <span className="font-label-sm text-label-sm text-outline">Culprit Consumer</span>
                <span className="font-mono text-on-surface text-[14px] font-semibold">@acme/telemetry</span>
                <span className="text-[11px] font-mono text-error">Strict peerDep failure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence, Cause & Remediation Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* 1. Failure Classification Card */}
          <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold">
                Classification Results
              </span>
              <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container/30 text-error font-headline-sm text-headline-sm font-semibold border border-error/30">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    Dependency Resolution Error
                  </span>
                  <span className="font-mono text-headline-sm text-error font-semibold">96%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-error rounded-full" style={{ width: '96%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-md text-label-md border border-outline-variant/20">
                    Configuration Problem
                  </span>
                  <span className="font-mono text-label-md text-on-surface-variant">42%</span>
                </div>
                <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-outline rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-outline font-label-sm text-label-sm">
                <span>Failing Stage:</span>
                <span className="font-label-md text-label-md text-on-surface font-medium">
                  Step 2: Install Node Dependencies (job: build-frontend)
                </span>
              </div>
            </div>
          </div>

          {/* 2. Separated Evidence vs Inferred Cause */}
          <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-3 border border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-secondary">balance</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Evidence vs Inferred Cause
              </span>
            </div>

            {/* Observed Evidence */}
            <div className="p-3 rounded-lg bg-surface-container flex flex-col gap-1.5 border border-primary/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase font-semibold text-primary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">fact_check</span>
                  Observed Evidence (Direct Fact)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-label-sm text-[10px] font-mono border border-primary/30">
                  VERIFIED LOG
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-snug">
                Log line <strong className="text-error font-mono font-semibold">150</strong> explicitly records peer dependency conflict between project <code className="font-mono text-secondary font-medium">react@18.3.1</code> and <code className="font-mono text-on-surface font-medium">@acme/telemetry-sdk</code> requesting <code className="font-mono text-error font-medium">react@^17.0.0</code>.
              </p>
            </div>

            {/* Inferred Root Cause */}
            <div className="p-3 rounded-lg bg-surface-container flex flex-col gap-1.5 border border-secondary/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">psychology_alt</span>
                  Inferred Root Cause (Probable)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-secondary-container/20 text-secondary font-label-sm text-[10px] font-mono border border-secondary/30">
                  GIT DIFF CORRELATED
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface leading-snug">
                PR <strong className="text-secondary font-mono font-semibold">#142</strong> upgraded top-level React version without publishing corresponding patch for internal <code className="font-mono text-secondary font-medium">@acme/telemetry-sdk</code> library.
              </p>
            </div>
          </div>

          {/* 3. Recommended Remediation & Verification */}
          <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">build_circle</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Recommended Remediation &amp; Verification
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-sm text-label-sm font-semibold">
                Actionable
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              {/* Step 1 */}
              <div className="p-3 rounded-lg bg-surface-container flex items-start gap-3 border border-outline-variant/20">
                <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                  1
                </div>
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Update Telemetry SDK (Recommended)
                  </span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Update <code className="text-secondary font-mono text-[13px]">@acme/telemetry-sdk</code> to version <code className="text-primary font-mono text-[13px] font-semibold">3.3.0-rc.1</code> which supports React 18.
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={handleCopyCommand}
                      className="px-2.5 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm flex items-center gap-1.5 transition-colors border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-[14px]">content_copy</span>
                      <code className="text-primary font-mono">npm install @acme/telemetry-sdk@3.3.0-rc.1</code>
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3 rounded-lg bg-surface-container flex items-start gap-3 border border-outline-variant/20">
                <div className="w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-label-md text-label-md font-bold shrink-0 border border-outline-variant/30">
                  2
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Temporary CI Workaround
                  </span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Or temporarily add <code className="text-primary font-mono text-[13px]">--legacy-peer-deps</code> flag to CI workflow <span className="font-mono text-outline text-[12px]">.github/workflows/ci.yml:42</span>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-3 rounded-lg bg-surface-container flex items-start gap-3 border border-outline-variant/20">
                <div className="w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-md text-label-md font-bold shrink-0">
                  <span className="material-symbols-outlined text-[15px]">check</span>
                </div>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                    Local Verification Step
                  </span>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Run <code className="text-secondary font-mono text-[13px]">npm install --dry-run</code> locally in target branch.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Reviewer Feedback & Ground-Truth Verification */}
          <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">rate_review</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Reviewer Ground-Truth Feedback
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Verified
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Was this diagnosis helpful and accurate?
            </p>

            {/* Feedback Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setFeedbackState('accurate');
                  onShowToast('Feedback Submitted', 'Diagnostic precision marked as 100% accurate.', 'success');
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded font-headline-sm text-headline-sm font-semibold transition-transform active:scale-95 shadow-sm ${
                  feedbackState === 'accurate'
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                <span>Yes, Accurate</span>
              </button>

              <button
                onClick={() => {
                  setFeedbackState('partial');
                  onShowToast('Feedback Noted', 'Partially accurate status recorded for offline model tuning.', 'info');
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded font-headline-sm text-headline-sm transition-colors ${
                  feedbackState === 'partial'
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">remove_done</span>
                <span>Partially</span>
              </button>

              <button
                onClick={() => {
                  setFeedbackState('incorrect');
                  onShowToast('Feedback Flagged', 'Diagnostic will be forwarded to SRE on-call for re-labeling.', 'warning');
                }}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded font-headline-sm text-headline-sm transition-colors ${
                  feedbackState === 'incorrect'
                    ? 'bg-error-container text-on-error-container font-semibold'
                    : 'bg-surface-container text-on-surface-variant hover:text-error'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                <span>Incorrect</span>
              </button>
            </div>

            {/* Notes Input Area */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="font-label-sm text-label-sm text-outline">Verification Annotation</label>
              <input
                value={feedbackAnnotation}
                onChange={(e) => setFeedbackAnnotation(e.target.value)}
                className="w-full bg-surface-container text-on-surface font-body-md text-body-md rounded px-3 py-2 focus:outline-none focus:bg-surface-container-high transition-colors border border-outline-variant/30"
                type="text"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-outline font-label-sm text-label-sm">
              <span>
                Recorded Reviewer: <strong className="text-on-surface-variant font-medium">Alex Rivera (Staff SRE)</strong>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">history</span>
                20 mins ago
              </span>
            </div>
          </div>

          {/* 5. Similar Historical Failures */}
          <div className="p-4 rounded-xl bg-surface-container-low shadow-sm flex flex-col gap-2 border border-outline-variant/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-outline">history_edu</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                  Similar Historical Failures
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-outline font-mono">Pattern Cluster #89</span>
            </div>

            <div className="flex flex-col gap-2">
              <div
                onClick={() => onShowToast('Historical Reference', 'Inspecting archived Run #3902 resolution post-mortem.', 'info')}
                className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between gap-3 group cursor-pointer border border-outline-variant/20"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1 rounded bg-error-container/20 text-error">
                    <span className="material-symbols-outlined text-[16px]">link_off</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] text-on-surface font-semibold group-hover:text-primary transition-colors">
                        Run #3902
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-outline font-label-sm text-[10px]">
                        3 days ago
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                      Identical npm ERESOLVE in portal repo (Resolved in 12m)
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </div>

              <div
                onClick={() => onShowToast('Historical Reference', 'Inspecting archived Run #3210 yarn lockfile checksum trace.', 'info')}
                className="p-3 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex items-center justify-between gap-3 group cursor-pointer border border-outline-variant/20"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 p-1 rounded bg-surface-container-high text-secondary">
                    <span className="material-symbols-outlined text-[16px]">tag</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] text-on-surface font-semibold group-hover:text-primary transition-colors">
                        Run #3210
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-outline font-label-sm text-[10px]">
                        2 weeks ago
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant line-clamp-1">
                      Yarn lockfile checksum failure
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-outline group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
