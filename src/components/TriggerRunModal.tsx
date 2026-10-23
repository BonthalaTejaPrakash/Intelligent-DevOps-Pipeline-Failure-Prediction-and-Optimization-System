import React, { useState } from 'react';
import { PipelineRun } from '../types';

interface TriggerRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrigger: (run: Partial<PipelineRun>) => void;
}

export const TriggerRunModal: React.FC<TriggerRunModalProps> = ({
  isOpen,
  onClose,
  onTrigger,
}) => {
  const [repo, setRepo] = useState('api-gateway');
  const [branch, setBranch] = useState('feat/payment-tokenization');
  const [commitSha, setCommitSha] = useState('8d19f2a');
  const [enableHold, setEnableHold] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onTrigger({
        repo,
        branch,
        commitSha,
        predictedRisk: repo === 'api-gateway' ? 84 : 26,
        riskTier: repo === 'api-gateway' ? 'CRITICAL' : 'LOW',
        signalNotes: 'Newly triggered run evaluated by XGBoost v2.4-calibrated.',
      });
      setIsSubmitting(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-surface-container rounded-xl border border-outline-variant/60 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col">
        <div className="p-4 bg-surface-container-high border-b border-outline-variant/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">play_circle</span>
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
                Trigger CI Pipeline Run
              </h2>
              <p className="font-label-sm text-label-sm text-outline">
                With Pre-Execution ML Intercept Shield
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-bright transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase text-outline">Repository</label>
            <select
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="bg-surface-container-lowest text-on-surface p-2 rounded border border-outline-variant/40 font-mono text-sm focus:outline-none focus:border-primary"
            >
              <option value="api-gateway">api-gateway (Production Core)</option>
              <option value="data-pipeline">data-pipeline (ETL / Spark)</option>
              <option value="microservices-backend">microservices-backend (APIs)</option>
              <option value="frontend-portal">frontend-portal (React App)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase text-outline">Target Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="bg-surface-container-lowest text-on-surface p-2 rounded border border-outline-variant/40 font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. feat/payment-v2"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-sm text-label-sm uppercase text-outline">Commit SHA Reference</label>
            <input
              type="text"
              value={commitSha}
              onChange={(e) => setCommitSha(e.target.value)}
              className="bg-surface-container-lowest text-on-surface p-2 rounded border border-outline-variant/40 font-mono text-sm focus:outline-none focus:border-primary"
              placeholder="e.g. 7a8f19c"
            />
          </div>

          <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-start gap-3">
            <input
              type="checkbox"
              id="hold-check"
              checked={enableHold}
              onChange={(e) => setEnableHold(e.target.checked)}
              className="mt-1 w-4 h-4 rounded bg-surface-container-lowest accent-primary"
            />
            <label htmlFor="hold-check" className="cursor-pointer text-left">
              <span className="font-headline-sm text-headline-sm text-on-surface block font-medium">
                Autonomous Pre-Flight Hold (Risk &gt; 75%)
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                Prevents runner allocation and alerts author if failure probability is critical.
              </span>
            </label>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface font-headline-sm text-headline-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-primary-container text-on-primary-container font-headline-sm text-headline-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  <span>Dispatch Pipeline</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
