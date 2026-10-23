import React, { useState } from 'react';
import { ViewMode, DAGStage } from '../types';
import { MOCK_DAG_STAGES } from '../data/mockData';

interface PipelineExplorerViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const PipelineExplorerView: React.FC<PipelineExplorerViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  const [stages, setStages] = useState<DAGStage[]>(MOCK_DAG_STAGES);
  const [selectedStageId, setSelectedStageId] = useState('stage-5');
  const [patchApplied, setPatchApplied] = useState(false);
  const [isReRunning, setIsReRunning] = useState(false);

  const selectedStage = stages.find((s) => s.id === selectedStageId) || stages[4];

  const handleApplyPatch = () => {
    setPatchApplied(true);
    onShowToast(
      'Quick Remediation PR Created',
      'Config updated: wiremock.threads increased from 8 to 16 in .ci/wiremock-test.yaml',
      'success'
    );
  };

  const handleCopyTrace = () => {
    const trace = `[14:28:10] INFO Starting mock WireMock server on port 8089...
[14:28:14] WARN WireMock connection pool saturated
[14:28:32] ERROR java.net.SocketTimeoutException: Read timed out after 15000ms
  at com.acme.gateway.client.PaymentClient.authorizeToken(PaymentClient.java:184)
[14:28:32] FAIL PaymentGatewayClientTest.test_auth_timeout -> assertion failed`;
    navigator.clipboard.writeText(trace);
    onShowToast('Trace Copied', 'Execution snippet copied to clipboard.', 'info');
  };

  const handleReRun = () => {
    setIsReRunning(true);
    onShowToast('Re-run Initiated', 'Restarting Stage 5 on warm runner pod runner-matrix-03...', 'info');
    setTimeout(() => {
      setIsReRunning(false);
      onShowToast('Stage Re-running', 'Runner assigned. ETA: 2m 15s.', 'success');
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-12">
      {/* Top Command & Execution Banner Bar */}
      <section className="bg-surface-container-low rounded-xl p-4 shadow-sm mb-4 border border-outline-variant/30">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          {/* Breadcrumb + Core Title */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 font-label-sm text-label-sm text-outline">
              <span onClick={() => onNavigate('overview')} className="hover:text-primary transition-colors cursor-pointer">
                Pipelines
              </span>
              <span className="text-outline-variant">/</span>
              <span className="hover:text-primary transition-colors cursor-pointer text-on-surface-variant font-medium">
                api-gateway
              </span>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-semibold">Run #4192</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
                api-gateway <span className="text-outline font-normal">::</span> CI/CD Pipeline #4192
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container/30 text-error font-label-sm text-label-sm font-semibold border border-error/30">
                <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                FAILED AT STAGE 5
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-sm text-label-sm font-semibold border border-tertiary/20">
                <span className="material-symbols-outlined text-[14px]">psychology</span>
                84% Failure Risk Confirmed
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 flex-wrap self-start xl:self-center">
            <button
              onClick={() => onShowToast('Raw Stream', 'Loading full 1,420 lines from CloudWatch stream.', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-headline-sm text-headline-sm shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">terminal</span>
              <span>Raw Logs</span>
            </button>
            <button
              onClick={() => onShowToast('Distributed Trace', 'Jaeger / OpenTelemetry span link dispatched.', 'info')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-headline-sm text-headline-sm shadow-sm border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-outline">timeline</span>
              <span>Trace</span>
            </button>
            <button
              onClick={() => onNavigate('failure-diagnosis')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-tertiary hover:bg-surface-container-high transition-colors font-headline-sm text-headline-sm shadow-sm border border-tertiary/30"
            >
              <span className="material-symbols-outlined text-[16px]">biotech</span>
              <span>Open Diagnosis</span>
            </button>
            <button
              onClick={handleReRun}
              disabled={isReRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary-container hover:bg-primary transition-colors font-headline-sm text-headline-sm font-semibold shadow-md"
            >
              <span className={`material-symbols-outlined text-[16px] ${isReRunning ? 'animate-spin' : ''}`}>
                replay
              </span>
              <span>{isReRunning ? 'Re-running...' : 'Re-run Failed Jobs'}</span>
            </button>
          </div>
        </div>

        {/* Metadata Grid Strip */}
        <div className="mt-4 pt-3 bg-surface-container-lowest/60 rounded-lg p-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 border border-outline-variant/20">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-medium">Branch</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-on-surface font-label-md text-label-md truncate">
              <span className="material-symbols-outlined text-[15px] text-secondary">fork_right</span>
              <span className="truncate font-semibold text-secondary">feat/payment-v2</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-medium">Commit SHA</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-on-surface font-label-md text-label-md">
              <span className="material-symbols-outlined text-[15px] text-outline">commit</span>
              <span className="font-mono text-primary font-semibold">7a8f19c</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-medium">Author</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-on-surface font-headline-sm text-headline-sm">
              <img
                className="w-4 h-4 rounded-full object-cover ring-1 ring-primary/40"
                alt="Sarah Kim"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWDhkW8A37kq9L2ejJ6w1bWMBMiKZfyZTm1GuAf7Tkig_nKjv11Fj_su7WaggieD-ix7cGT76Lx083zzSQxXkQjlOICoX1TnUcEa4Izc0BhctLMcQ6k2_bK9CO0wfXOaLDvS7Q2_cWN67oiX5zUmndZlDSsn07U00P-1D6ZrQNG5S3GsinlSo7rgPOc_qEKkryH-Aq3BBkYb1f6IsB7_lTmroFxxB8lOavd4uXHMvJjGGzaAWcabyJ"
              />
              <span className="text-on-surface font-medium truncate">Sarah Kim</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-medium">Elapsed Duration</span>
            <div className="flex items-center gap-1.5 mt-0.5 text-on-surface font-label-md text-label-md">
              <span className="material-symbols-outlined text-[15px] text-outline">schedule</span>
              <span className="text-on-surface font-semibold font-mono">14m 28s</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-medium">ML Risk Score</span>
            <div className="flex items-center gap-1.5 mt-0.5 font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="text-error font-semibold font-mono">84%</span>
              <span className="text-outline text-label-sm">(Critical)</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline font-medium">Inference Signal</span>
            <div className="flex items-center gap-1 mt-0.5 font-label-sm text-label-sm text-tertiary">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
              <span className="truncate">Accurate Pre-flight Alert</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive DAG Map & Contextual Drawer Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Central DAG Topology Board */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-2 bg-surface-container-low rounded-xl p-4 shadow-sm border border-outline-variant/30">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-surface-container text-primary border border-outline-variant/20">
                <span className="material-symbols-outlined text-[18px]">account_tree</span>
              </div>
              <div>
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Directed Acyclic Graph (DAG) Topology
                </h2>
                <p className="font-label-sm text-label-sm text-outline">
                  Click any stage node below to inspect execution trace &amp; diagnostics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-surface-container-lowest px-2.5 py-1 rounded font-label-sm text-label-sm text-outline border border-outline-variant/30">
              <span className="material-symbols-outlined text-[15px] text-primary">layers</span>
              <span>7 Pipeline Nodes</span>
              <span className="text-outline-variant">|</span>
              <span className="text-error font-semibold">1 Critical Halt</span>
            </div>
          </div>

          {/* Graph Container Canvas */}
          <div className="relative bg-surface-container-lowest rounded-lg p-4 overflow-x-auto min-h-[580px] flex flex-col justify-between border border-outline-variant/20">
            {/* Ambient Telemetry Dot Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#8c909f 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            ></div>

            <div className="flex flex-col gap-1 relative z-10">
              {stages.map((stage, idx) => {
                const isSelected = stage.id === selectedStageId;
                const isLast = idx === stages.length - 1;

                let icon = 'check_circle';
                let iconBg = 'bg-surface-container-high text-primary';
                let connectorBg = 'bg-primary/40';

                if (stage.status === 'failed') {
                  icon = 'close';
                  iconBg = 'bg-error text-on-error shadow-lg shadow-error/30 animate-pulse';
                  connectorBg = 'bg-surface-container-highest';
                } else if (stage.status === 'warning') {
                  icon = 'warning';
                  iconBg = 'bg-surface-container-high text-tertiary';
                  connectorBg = 'bg-tertiary-container/40';
                } else if (stage.status === 'skipped') {
                  icon = stage.id === 'stage-6' ? 'skip_next' : 'block';
                  iconBg = 'bg-surface-container-highest text-outline';
                  connectorBg = 'bg-surface-container-highest';
                }

                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedStageId(stage.id)}
                    className={`flex items-start gap-3 cursor-pointer group transition-all ${
                      stage.status === 'skipped' ? 'opacity-50 hover:opacity-80' : ''
                    }`}
                  >
                    {/* Node marker & connector stem */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform group-hover:scale-110 ${iconBg}`}>
                        <span className="material-symbols-outlined text-[18px]">{icon}</span>
                      </div>
                      {!isLast && <div className={`w-0.5 h-12 my-1 transition-colors ${connectorBg}`}></div>}
                    </div>

                    {/* Node Card Container */}
                    <div
                      className={`flex-1 p-3 rounded-lg transition-all shadow-sm border ${
                        isSelected
                          ? 'bg-surface-container-high border-primary ring-1 ring-primary/40 shadow-xl'
                          : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-label-sm text-label-sm uppercase tracking-wide font-semibold ${
                              stage.status === 'failed' ? 'text-error' : 'text-outline'
                            }`}
                          >
                            {stage.number} {isSelected && '• Selected'}
                          </span>
                          <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                            {stage.title}
                          </span>
                          {stage.riskProbability && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm font-semibold">
                              <span className="material-symbols-outlined text-[13px]">psychology</span>
                              Predicted failure zone ({stage.riskProbability}%)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-label-sm text-label-sm text-on-surface-variant font-mono bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant/20">
                            {stage.duration}
                          </span>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-label-sm font-mono font-semibold ${
                              stage.status === 'failed'
                                ? 'bg-error/20 text-error'
                                : stage.status === 'warning'
                                ? 'bg-tertiary-container/20 text-tertiary'
                                : stage.status === 'skipped'
                                ? 'bg-surface-container-highest text-outline'
                                : 'bg-surface-container-highest text-secondary'
                            }`}
                          >
                            {stage.statusBadge}
                          </span>
                        </div>
                      </div>

                      {/* Error Preview Banner on failed stage */}
                      {stage.failureInfo && (
                        <div className="mt-2 bg-surface-container-lowest/90 p-2.5 rounded flex flex-col gap-1 border border-error/30">
                          <div className="flex items-center gap-2 text-error font-mono font-label-md text-label-md">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            <span>{stage.failureInfo.errorName}</span>
                          </div>
                          <span className="font-label-sm text-label-sm text-outline pl-6">
                            {stage.failureInfo.exception} at {stage.failureInfo.file}:{stage.failureInfo.line}
                          </span>
                        </div>
                      )}

                      {/* Details row */}
                      <div className="mt-1.5 flex items-center gap-4 text-outline font-label-sm text-label-sm flex-wrap">
                        {stage.details.map((d) => (
                          <span key={d.label}>
                            <strong className="text-on-surface-variant font-normal">{d.label}:</strong> {d.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Telemetry Sub-panel Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Total Graph CPU Cost</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-data-metric text-data-metric text-on-surface">
                  32.4 <span className="font-label-sm text-label-sm text-outline">vCPU-hrs</span>
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-mono">-14% vs avg</span>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">AI Interception Confidence</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-data-metric text-data-metric text-tertiary">96.2%</span>
                <span className="font-label-sm text-label-sm text-tertiary font-mono">Model v4.1</span>
              </div>
            </div>

            <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/20">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Time Saved via Pre-Halt</span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-data-metric text-data-metric text-primary">18m 40s</span>
                <span className="font-label-sm text-label-sm text-primary font-mono">Prevented Deploy</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right-hand Contextual Inspection Drawer (Active Node: Stage 5) */}
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <div className="bg-surface-container-low rounded-xl p-4 shadow-md flex flex-col gap-4 border border-outline-variant/30">
            {/* Drawer Header */}
            <div className="flex items-start justify-between pb-2 border-b border-outline-variant/20">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 font-label-sm text-label-sm uppercase tracking-wider text-error font-bold">
                  <span className="material-symbols-outlined text-[15px]">report</span>
                  <span>Active Node Inspector</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mt-0.5">
                  {selectedStage.number}: {selectedStage.title}
                </h3>
              </div>
              <button
                onClick={() => onShowToast('Node Zoom', `Expanded inspection drawer for ${selectedStage.number}.`, 'info')}
                className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-outline hover:text-on-surface transition-colors border border-outline-variant/20"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_full</span>
              </button>
            </div>

            {/* Failure Classification Tag & Meta */}
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-1.5 border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-outline font-medium uppercase">Failure Classification</span>
                <span className="font-label-sm text-label-sm text-secondary font-mono">Deterministic Classifier v2.1</span>
              </div>
              <div className="text-error font-headline-sm text-headline-sm font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">dns</span>
                <span>Network Timeout / Downstream Mock Unresponsive</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Exit Code 1 returned from runner container <code className="font-mono text-outline">runner-matrix-integ-node-02</code>.
              </p>
            </div>

            {/* Live Streaming Log Excerpt */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between px-1">
                <span className="font-label-sm text-label-sm uppercase font-semibold text-outline">
                  Execution Stream Snippet
                </span>
                <button
                  onClick={handleCopyTrace}
                  className="font-label-sm text-label-sm text-primary hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[13px]">content_copy</span>
                  <span>Copy Trace</span>
                </button>
              </div>

              <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-label-sm leading-relaxed overflow-x-auto text-on-surface select-text shadow-inner border border-outline-variant/20">
                <div className="text-on-surface-variant/80">
                  <span className="text-outline">[14:28:10]</span> <span className="text-secondary font-semibold">INFO</span> Starting mock WireMock server on port 8089...
                </div>
                <div className="text-tertiary">
                  <span className="text-outline">[14:28:14]</span> <span className="text-tertiary font-semibold">WARN</span> WireMock connection pool saturated
                </div>
                <div className="text-error">
                  <span className="text-outline">[14:28:32]</span> <span className="text-error font-bold">ERROR</span> java.net.SocketTimeoutException: Read timed out after 15000ms
                </div>
                <div className="text-error pl-4">
                  <span className="text-outline">[14:28:32]</span> at com.acme.gateway.client.PaymentClient.authorizeToken(PaymentClient.java:184)
                </div>
                <div className="text-error font-bold">
                  <span className="text-outline">[14:28:32]</span> <span className="bg-error/20 px-1 py-0.5 rounded text-error">FAIL</span> PaymentGatewayClientTest.test_auth_timeout -&gt; assertion failed
                </div>
              </div>
            </div>

            {/* Instant Diagnostic Insight Box */}
            <div className="bg-surface-container p-3 rounded-lg flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-tertiary-container/20 text-tertiary">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                </div>
                <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Instant Diagnostic Insight
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-normal">
                Identified socket timeout during simulated token authorization. Root cause: mock server worker pool exhaustion under concurrent test runner threads.
              </p>
            </div>

            {/* Recommended Quick Remediation Box */}
            <div className="bg-surface-container-high p-3 rounded-lg flex flex-col gap-2 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary">auto_fix_high</span>
                  <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                    Recommended Quick Remediation
                  </span>
                </div>
                <span className="font-label-sm text-label-sm px-1.5 py-0.5 rounded bg-primary-container/20 text-primary font-mono border border-primary/30">
                  1-Click PR
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Increase WireMock worker thread pool in test container config or throttle concurrent worker threads from <span className="font-mono text-on-surface font-semibold">8</span> to <span className="font-mono text-on-surface font-semibold">4</span>.
              </p>
              <div className="mt-1 bg-surface-container-lowest p-2 rounded font-mono text-label-sm text-outline flex items-center justify-between border border-outline-variant/20">
                <code>wiremock.threads: 8 -&gt; 16</code>
                {patchApplied ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    Patch Staged
                  </span>
                ) : (
                  <button
                    onClick={handleApplyPatch}
                    className="px-2.5 py-1 rounded bg-primary hover:bg-primary-fixed-dim text-on-primary transition-colors text-label-sm font-semibold shadow-sm"
                  >
                    Apply Patch
                  </button>
                )}
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={() => onNavigate('failure-diagnosis')}
              className="w-full py-2.5 px-4 rounded-lg bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-container/90 transition-all font-headline-sm text-headline-sm font-semibold flex items-center justify-center gap-2 shadow-md"
            >
              <span className="material-symbols-outlined text-[20px]">healing</span>
              <span>Open Full Failure Diagnosis Studio</span>
            </button>
          </div>

          {/* Historical Context Card */}
          <div className="bg-surface-container-low rounded-xl p-4 shadow-sm flex flex-col gap-2 border border-outline-variant/20">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-outline">
                Historical Flake Telemetry
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Last 30 days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">12.4%</span>
                <span className="font-label-sm text-label-sm text-outline">Stage Failure Rate</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-headline-md text-headline-md font-bold text-secondary">3.4 min</span>
                <span className="font-label-sm text-label-sm text-outline">MTTR with PipeGuard</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden flex">
              <div className="bg-secondary h-full" style={{ width: '78%' }}></div>
              <div className="bg-tertiary h-full" style={{ width: '10%' }}></div>
              <div className="bg-error h-full" style={{ width: '12%' }}></div>
            </div>
            <div className="flex items-center justify-between font-label-sm text-label-sm text-outline">
              <span>78% Pass</span>
              <span>10% Warn</span>
              <span className="text-error font-semibold">12% Fail</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
