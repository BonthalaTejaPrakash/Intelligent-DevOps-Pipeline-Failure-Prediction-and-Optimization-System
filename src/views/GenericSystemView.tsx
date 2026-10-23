import React, { useState } from 'react';
import { ViewMode } from '../types';

interface GenericSystemViewProps {
  view: 'integrations' | 'notifications' | 'audit-log' | 'settings' | 'analytics';
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const GenericSystemView: React.FC<GenericSystemViewProps> = ({
  view,
  onNavigate,
  onShowToast,
}) => {
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');
  const [githubToken, setGithubToken] = useState('ghp_918239129831928391283');
  const [riskThreshold, setRiskThreshold] = useState(75);

  if (view === 'integrations') {
    return (
      <div className="flex flex-col w-full pb-16">
        <div className="flex flex-col gap-2 pt-4 mb-6">
          <span className="font-label-sm text-label-sm text-primary uppercase font-semibold">Connectors &amp; Webhooks</span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            System Integrations
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Connect PipeGuard AI to your source control, CI runners, communication channels, and observability clusters
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline-md text-headline-md font-semibold text-on-surface">GitHub Actions</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-label-sm text-label-sm font-semibold">
                  Connected
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Synchronizing 14 repositories. Webhook ingress latency: 120ms.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded font-mono text-label-sm text-outline border border-outline-variant/20 truncate">
              Token: {githubToken.slice(0, 10)}******************
            </div>
            <button
              onClick={() => onShowToast('Webhook Verified', 'GitHub webhook handshake OK (HTTP 200).', 'success')}
              className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30 self-start"
            >
              Test Connection
            </button>
          </div>

          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline-md text-headline-md font-semibold text-on-surface">Slack Alerts</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-label-sm text-label-sm font-semibold">
                  Connected
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Broadcasting high-risk interventions to channel <code className="text-secondary font-mono">#sre-deployments</code>.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-2.5 rounded font-mono text-label-sm text-outline border border-outline-variant/20 truncate">
              {slackWebhook}
            </div>
            <button
              onClick={() => onShowToast('Slack Dispatch', 'Sent test intervention notification to #sre-deployments.', 'info')}
              className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30 self-start"
            >
              Send Test Alert
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'audit-log') {
    const logs = [
      { id: 1, action: 'Autonomous Interception', target: 'Run #4192 (api-gateway)', user: 'PipeGuard Shield v2.4', time: '2m ago' },
      { id: 2, action: 'Override Approved', target: 'Run #4189 (data-pipeline)', user: 'Sarah Kim (Staff Backend)', time: '18m ago' },
      { id: 3, action: 'Optimization Approved', target: '#OPT-102 Docker Layer Cache', user: 'Alex Rivera (Staff SRE)', time: '45m ago' },
      { id: 4, action: 'Model Retrained', target: 'XGBoost v2.4-calibrated promoted', user: 'ML Auto-Tuner', time: '1h ago' },
      { id: 5, action: 'Quarantine Flaky Suite', target: 'test_token_exchange in auth-core', user: 'Flake Shield Engine', time: '2h ago' },
    ];

    return (
      <div className="flex flex-col w-full pb-16">
        <div className="flex flex-col gap-2 pt-4 mb-6">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Security &amp; Compliance</span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
            Immutable Audit Trail
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Cryptographically sealed record of pre-flight interceptions, manual developer overrides, and autonomous policy triggers
          </p>
        </div>

        <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-outline font-label-sm text-label-sm uppercase tracking-wider border-b border-outline-variant/30">
                <th className="py-3 px-4 font-semibold">Action &amp; Policy</th>
                <th className="py-3 px-4 font-semibold">Target Unit</th>
                <th className="py-3 px-4 font-semibold">Actor / Origin</th>
                <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 font-body-sm text-body-sm">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-on-surface">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-mono text-primary text-label-sm">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-on-surface-variant">
                    {log.user}
                  </td>
                  <td className="py-3 px-4 text-right text-outline font-mono">
                    {log.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Default Settings & Analytics View
  return (
    <div className="flex flex-col w-full pb-16">
      <div className="flex flex-col gap-2 pt-4 mb-6">
        <span className="font-label-sm text-label-sm text-primary uppercase font-semibold">Engine Configuration</span>
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
          Cluster &amp; SRE Guardrail Settings
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Adjust risk threshold partitions, notification routes, and diagnostic verbosity levels
        </p>
      </div>

      <div className="max-w-2xl bg-surface-container-low p-6 rounded-xl border border-outline-variant/30 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Autonomous Pre-Flight Intercept Threshold: {riskThreshold}%
          </label>
          <input
            type="range"
            min="40"
            max="95"
            value={riskThreshold}
            onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <span className="font-body-sm text-body-sm text-outline">
            Builds with failure probability exceeding this limit are held before heavy runner resources are allocated.
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/20">
          <label className="font-headline-sm text-headline-sm font-semibold text-on-surface">
            Default Production Cluster
          </label>
          <input
            readOnly
            value="us-east-prod-ci (16 active worker pods, 99.98% SLA)"
            className="bg-surface-container-lowest text-on-surface p-2.5 rounded font-mono text-sm border border-outline-variant/30"
          />
        </div>

        <div className="pt-2">
          <button
            onClick={() => onShowToast('Settings Saved', `Autonomous threshold updated to ${riskThreshold}%.`, 'success')}
            className="px-4 py-2 rounded bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            Save Policy Configurations
          </button>
        </div>
      </div>
    </div>
  );
};
