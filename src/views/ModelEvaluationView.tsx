import React from 'react';
import { ViewMode } from '../types';

interface ModelEvaluationViewProps {
  onNavigate: (view: ViewMode) => void;
  onShowToast: (title: string, desc?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const ModelEvaluationView: React.FC<ModelEvaluationViewProps> = ({
  onNavigate,
  onShowToast,
}) => {
  return (
    <div className="flex flex-col w-full pb-16">
      <div className="flex flex-col gap-2 pt-4 mb-6">
        <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-outline">
          <span className="text-tertiary font-semibold uppercase">Offline Validation Matrix</span>
          <span>•</span>
          <span>14,200 Ground-Truth Labelled CI Runs</span>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface font-semibold tracking-tight">
          Machine Learning Model Evaluation &amp; Benchmarking
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Statistical calibration comparing production XGBoost v2.4 against Logistic Regression v1.2 baseline
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">PR-AUC Score</span>
          <span className="font-data-metric text-data-metric text-primary font-bold my-2">0.941</span>
          <span className="font-label-sm text-label-sm text-emerald-400">+18.4% vs baseline</span>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Precision @ 75% Risk</span>
          <span className="font-data-metric text-data-metric text-secondary font-bold my-2">0.884</span>
          <span className="font-label-sm text-label-sm text-on-surface-variant">Zero False Stops</span>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">False Positive Rate</span>
          <span className="font-data-metric text-data-metric text-on-surface font-bold my-2">3.2%</span>
          <span className="font-label-sm text-label-sm text-emerald-400">Target: &lt;5%</span>
        </div>

        <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between">
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Inference P95</span>
          <span className="font-data-metric text-data-metric text-tertiary font-bold my-2">34ms</span>
          <span className="font-label-sm text-label-sm text-tertiary font-mono">Real-time gate</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Confusion Matrix Card */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Confusion Matrix (Test Fold: 2,840 Runs)
            </h2>
            <span className="font-label-sm text-label-sm text-outline font-mono">Threshold: 0.70</span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-2">
            <div className="bg-surface-container p-4 rounded-lg flex flex-col border border-emerald-500/30">
              <span className="font-label-sm text-label-sm text-emerald-400 font-semibold uppercase">
                True Positives (Correctly Halted)
              </span>
              <span className="font-data-metric text-headline-xl text-on-surface font-bold mt-1">294 runs</span>
              <span className="font-body-sm text-body-sm text-outline mt-1">
                Saved 118 vCPU runner-hours before failure
              </span>
            </div>

            <div className="bg-surface-container p-4 rounded-lg flex flex-col border border-error/30">
              <span className="font-label-sm text-label-sm text-error font-semibold uppercase">
                False Positives (Unnecessary Hold)
              </span>
              <span className="font-data-metric text-headline-xl text-on-surface font-bold mt-1">11 runs</span>
              <span className="font-body-sm text-body-sm text-outline mt-1">
                Bypassed cleanly by developers in &lt;1m
              </span>
            </div>

            <div className="bg-surface-container p-4 rounded-lg flex flex-col border border-outline-variant/30">
              <span className="font-label-sm text-label-sm text-outline font-semibold uppercase">
                False Negatives (Missed Failures)
              </span>
              <span className="font-data-metric text-headline-xl text-on-surface font-bold mt-1">28 runs</span>
              <span className="font-body-sm text-body-sm text-outline mt-1">
                Fell back to standard failure diagnosis
              </span>
            </div>

            <div className="bg-surface-container p-4 rounded-lg flex flex-col border border-primary/30">
              <span className="font-label-sm text-label-sm text-primary font-semibold uppercase">
                True Negatives (Passed Cleanly)
              </span>
              <span className="font-data-metric text-headline-xl text-on-surface font-bold mt-1">2,507 runs</span>
              <span className="font-body-sm text-body-sm text-outline mt-1">
                Fast path, zero overhead added to execution
              </span>
            </div>
          </div>
        </div>

        {/* Feature Importance Card */}
        <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h2 className="font-headline-md text-headline-md text-on-surface font-semibold">
              Global Gini Feature Importance
            </h2>
            <span className="font-label-sm text-label-sm text-primary font-mono">Top 5 Predictors</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div>
              <div className="flex justify-between font-label-md text-label-md mb-1">
                <span>Lockfile &amp; Dependency Churn Index</span>
                <span className="font-mono text-primary font-semibold">0.324</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-label-md text-label-md mb-1">
                <span>Repository PR Churn Percentile</span>
                <span className="font-mono text-primary font-semibold">0.218</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '68%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-label-md text-label-md mb-1">
                <span>Subsystem Historical Failure Rate (auth-core)</span>
                <span className="font-mono text-primary font-semibold">0.142</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-label-md text-label-md mb-1">
                <span>Flaky Test Assertions in Target Suite</span>
                <span className="font-mono text-primary font-semibold">0.115</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between font-label-md text-label-md mb-1">
                <span>Branch Main Skew (Commits Behind)</span>
                <span className="font-mono text-primary font-semibold">0.083</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-right">
            <button
              onClick={() => onShowToast('Model Retrained', 'XGBoost v2.4-calibrated promoted to live inference gate.', 'success')}
              className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm transition-colors border border-outline-variant/30"
            >
              Trigger Retraining Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
