/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, PipelineRun, OptimizationItem, ToastMessage, AppTheme } from './types';
import { MOCK_RUNS, MOCK_OPTIMIZATIONS } from './data/mockData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { TriggerRunModal } from './components/TriggerRunModal';
import { ToastContainer } from './components/Toast';

import { OverviewView } from './views/OverviewView';
import { RiskPredictionView } from './views/RiskPredictionView';
import { PipelineExplorerView } from './views/PipelineExplorerView';
import { FailureDiagnosisView } from './views/FailureDiagnosisView';
import { ThreeClusterMeshView } from './views/ThreeClusterMeshView';
import { PipelineRunsView } from './views/PipelineRunsView';
import { OptimizationCenterView } from './views/OptimizationCenterView';
import { RepositoriesView } from './views/RepositoriesView';
import { ModelEvaluationView } from './views/ModelEvaluationView';
import { GenericSystemView } from './views/GenericSystemView';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('aurora');
  const [runs, setRuns] = useState<PipelineRun[]>(MOCK_RUNS);
  const [optimizations, setOptimizations] = useState<OptimizationItem[]>(MOCK_OPTIMIZATIONS);
  const [currentRepo, setCurrentRepo] = useState('acme-cloud-platform / production');
  const [demoDataActive, setDemoDataActive] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTriggerRunOpen, setIsTriggerRunOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Telemetry metrics
  const cpuLoad = 18;
  const ramUsage = '4.2GB';
  const queueCount = 2;

  // Synchronize theme classes on html tag for clean high-contrast multi-theme styling
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-aurora', 'theme-nordic', 'theme-cyber', 'dark');

    if (currentTheme === 'nordic') {
      root.classList.add('theme-nordic');
    } else if (currentTheme === 'cyber') {
      root.classList.add('dark', 'theme-cyber');
    } else {
      root.classList.add('dark', 'theme-aurora');
    }
  }, [currentTheme]);

  const showToast = (
    title: string,
    description?: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleThemeChange = (newTheme: AppTheme) => {
    setCurrentTheme(newTheme);
    const themeNames: Record<AppTheme, string> = {
      aurora: 'Aurora Cyan (Deep Carbon & High Clarity)',
      nordic: 'Nordic Studio (Clean Daylight Light Mode)',
      cyber: 'Cyber Amber (Tactical Midnight Command)',
    };
    showToast('Theme Changed', `Switched visual appearance to ${themeNames[newTheme]}.`, 'info');
  };

  const handleToggleTheme = () => {
    const order: AppTheme[] = ['aurora', 'nordic', 'cyber'];
    const next = order[(order.indexOf(currentTheme) + 1) % order.length];
    handleThemeChange(next);
  };

  const handleApproveOptimization = (id: string) => {
    setOptimizations((prev) =>
      prev.map((opt) => (opt.id === id ? { ...opt, status: 'approved' } : opt))
    );
    showToast(
      'Optimization Approved',
      'PR generated and queued for automated merge.',
      'success'
    );
  };

  const handleTriggerRun = (newRunPartial: Partial<PipelineRun>) => {
    const newRun: PipelineRun = {
      id: `run-${Date.now().toString().slice(-4)}`,
      runNumber: 4193,
      repo: newRunPartial.repo || 'api-gateway',
      branch: newRunPartial.branch || 'feat/payment-v2',
      commitSha: newRunPartial.commitSha || '8d19f2a',
      author: {
        name: 'Alex Rivera',
        avatar: 'https://lh3.googleusercontent.com/aida/AEtjO1XfgPaviWiZA0Cb7aUF8hfcLP-sV-_kUb7F1pCkt6r7AzOiXd1MGz5QPX0FvZdOopz1MRTon6PvSbW6INgq8gaLKIqKAqUoU9zQgfkldjDpibWfkGoj-wOYVSNXuc32I9M4OhtsvboPz4Y1QynfpRRQEtFzgnPbwAtwq6gcNYD512f_cRTpmqzm-ZCCcM-ZBLZh03pbBLPIVjBIgMYeaO5Z_eXaq3VbyT_oWm4qviIftHbM8rrblvDozG8',
        role: 'Staff SRE',
      },
      duration: '0m 18s',
      timestamp: 'Just now',
      status: (newRunPartial.predictedRisk || 0) > 75 ? 'held' : 'building',
      predictedRisk: newRunPartial.predictedRisk || 42,
      riskTier: (newRunPartial.predictedRisk || 0) > 75 ? 'CRITICAL' : 'LOW',
      signalNotes: newRunPartial.signalNotes || 'Dispatched from PipeGuard command palette.',
      filesChanged: 12,
    };

    setRuns((prev) => [newRun, ...prev]);
    showToast(
      `Pipeline #${newRun.runNumber} Dispatched`,
      `Repository: ${newRun.repo} (${newRun.branch}) • Risk: ${newRun.predictedRisk}%`,
      newRun.predictedRisk > 75 ? 'warning' : 'success'
    );
  };

  return (
    <div className="bg-background text-on-surface min-h-screen antialiased selection:bg-primary-container selection:text-on-primary-container transition-colors duration-200">
      {/* Top Universal Command Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTriggerRun={() => setIsTriggerRunOpen(true)}
        currentRepo={currentRepo}
        onSelectRepo={(repo) => {
          setCurrentRepo(repo);
          showToast('Switched Workspace Cluster', `Active context: ${repo}`, 'info');
        }}
        demoDataActive={demoDataActive}
        onToggleDemoData={() => {
          setDemoDataActive(!demoDataActive);
          showToast(
            demoDataActive ? 'Live Mode Active' : 'Demo Fixtures Active',
            demoDataActive ? 'Connecting to live GitHub Actions webhook stream.' : 'Using validated synthetic SRE dataset.',
            'info'
          );
        }}
        unreadAlertsCount={3}
        currentTheme={currentTheme}
        onSelectTheme={handleThemeChange}
      />

      {/* Side Navigation Rail */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        cpuLoad={cpuLoad}
        ramUsage={ramUsage}
        queueCount={queueCount}
        currentTheme={currentTheme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Viewport Content Area */}
      <div className="pl-64">
        <main className={`pt-14 w-full min-h-screen bg-background transition-colors duration-200 ${currentView === '3d-mesh' ? 'p-0 overflow-hidden' : 'px-4 md:px-6'}`}>
          {currentView === 'overview' && (
            <OverviewView
              onNavigate={(v) => setCurrentView(v)}
              runs={runs}
              optimizations={optimizations}
              onApproveOptimization={handleApproveOptimization}
              onShowToast={showToast}
            />
          )}

          {currentView === 'risk-prediction' && (
            <RiskPredictionView
              onNavigate={(v) => setCurrentView(v)}
              runs={runs}
              onShowToast={showToast}
            />
          )}

          {currentView === 'pipeline-explorer' && (
            <PipelineExplorerView
              onNavigate={(v) => setCurrentView(v)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'failure-diagnosis' && (
            <FailureDiagnosisView
              onNavigate={(v) => setCurrentView(v)}
              onShowToast={showToast}
            />
          )}

          {currentView === '3d-mesh' && (
            <ThreeClusterMeshView
              onNavigate={(v) => setCurrentView(v)}
              onShowToast={showToast}
              currentTheme={currentTheme}
            />
          )}

          {currentView === 'pipeline-runs' && (
            <PipelineRunsView
              onNavigate={(v) => setCurrentView(v)}
              runs={runs}
              onShowToast={showToast}
            />
          )}

          {currentView === 'optimization-center' && (
            <OptimizationCenterView
              onNavigate={(v) => setCurrentView(v)}
              optimizations={optimizations}
              onApprove={handleApproveOptimization}
              onShowToast={showToast}
            />
          )}

          {currentView === 'repositories' && (
            <RepositoriesView
              onNavigate={(v) => setCurrentView(v)}
              onShowToast={showToast}
            />
          )}

          {currentView === 'model-evaluation' && (
            <ModelEvaluationView
              onNavigate={(v) => setCurrentView(v)}
              onShowToast={showToast}
            />
          )}

          {(currentView === 'integrations' ||
            currentView === 'notifications' ||
            currentView === 'audit-log' ||
            currentView === 'settings' ||
            currentView === 'analytics') && (
            <GenericSystemView
              view={currentView as any}
              onNavigate={(v) => setCurrentView(v)}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(v) => setCurrentView(v)}
      />

      {/* Trigger Pipeline Run Modal */}
      <TriggerRunModal
        isOpen={isTriggerRunOpen}
        onClose={() => setIsTriggerRunOpen(false)}
        onTrigger={handleTriggerRun}
      />

      {/* Universal Floating Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
