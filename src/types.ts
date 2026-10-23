export type AppTheme = 'aurora' | 'nordic' | 'cyber';

export type ViewMode = 
  | 'overview'
  | 'risk-prediction'
  | 'pipeline-runs'
  | 'repositories'
  | 'pipeline-explorer'
  | 'failure-diagnosis'
  | 'optimization-center'
  | 'analytics'
  | 'model-evaluation'
  | '3d-mesh'
  | 'integrations'
  | 'notifications'
  | 'audit-log'
  | 'settings';

export interface PipelineRun {
  id: string;
  runNumber: number;
  repo: string;
  branch: string;
  commitSha: string;
  author: {
    name: string;
    avatar: string;
    role?: string;
  };
  duration: string;
  timestamp: string;
  status: 'passed' | 'failed' | 'building' | 'held' | 'canceled';
  predictedRisk: number; // 0-100
  riskTier: 'LOW' | 'MOD' | 'HIGH' | 'CRITICAL';
  failedStage?: string;
  signalNotes: string;
  filesChanged: number;
}

export interface DAGStage {
  id: string;
  number: string;
  title: string;
  duration: string;
  status: 'passed' | 'failed' | 'warning' | 'skipped' | 'running';
  statusBadge: string;
  riskProbability?: number;
  details: {
    label: string;
    value: string;
  }[];
  failureInfo?: {
    errorName: string;
    exception: string;
    file: string;
    line: number;
  };
}

export interface OptimizationItem {
  id: string;
  title: string;
  repo: string;
  savings: string;
  impact: string;
  category: string;
  status: 'pending' | 'approved' | 'reviewing';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}
