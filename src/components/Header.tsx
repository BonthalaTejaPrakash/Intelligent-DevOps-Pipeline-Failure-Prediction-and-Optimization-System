import React, { useState } from 'react';
import { AppTheme } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenTriggerRun: () => void;
  currentRepo: string;
  onSelectRepo: (repo: string) => void;
  demoDataActive: boolean;
  onToggleDemoData: () => void;
  unreadAlertsCount: number;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenTriggerRun,
  currentRepo,
  onSelectRepo,
  demoDataActive,
  onToggleDemoData,
  unreadAlertsCount,
  currentTheme,
  onSelectTheme,
}) => {
  const [showRepoMenu, setShowRepoMenu] = useState(false);
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const repos = [
    'acme-cloud-platform / production',
    'api-gateway / main',
    'data-pipeline / master',
    'microservices-backend / release',
    'frontend-portal / staging',
  ];

  const themes: { id: AppTheme; label: string; desc: string; icon: string; preview: string }[] = [
    {
      id: 'aurora',
      label: 'Aurora Cyan',
      desc: 'Deep carbon & electric cyan — high contrast & clarity',
      icon: 'dark_mode',
      preview: 'bg-[#080d16] border-[#38bdf8]',
    },
    {
      id: 'nordic',
      label: 'Nordic Studio',
      desc: 'Clean paper & slate light mode — easy on daytime eyes',
      icon: 'light_mode',
      preview: 'bg-[#f1f5f9] border-[#0284c7]',
    },
    {
      id: 'cyber',
      label: 'Cyber Amber',
      desc: 'Tactical terminal command — amber & emerald accents',
      icon: 'terminal',
      preview: 'bg-[#090a0d] border-[#f59e0b]',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.2)] border-b border-outline-variant">
      <div className="h-14 w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Brand & Repo Selector */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <img
              alt="PipeGuard AI Logo"
              className="w-7 h-7 rounded-lg object-cover shadow-sm ring-1 ring-primary/30"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XfgPaviWiZA0Cb7aUF8hfcLP-sV-_kUb7F1pCkt6r7AzOiXd1MGz5QPX0FvZdOopz1MRTon6PvSbW6INgq8gaLKIqKAqUoU9zQgfkldjDpibWfkGoj-wOYVSNXuc32I9M4OhtsvboPz4Y1QynfpRRQEtFzgnPbwAtwq6gcNYD512f_cRTpmqzm-ZCCcM-ZBLZh03pbBLPIVjBIgMYeaO5Z_eXaq3VbyT_oWm4qviIftHbM8rrblvDozG8"
            />
            <div className="flex items-center gap-1.5">
              <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface font-bold">
                PipeGuard AI
              </span>
              <span className="font-label-sm text-label-sm bg-surface-container-high text-primary px-1.5 py-0.5 rounded border border-outline-variant font-mono">
                v2.4
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-outline-variant hidden sm:block" />

          {/* Repository Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRepoMenu(!showRepoMenu)}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors border border-outline-variant"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">cloud_done</span>
              <span className="font-label-sm text-label-sm truncate max-w-[200px]">{currentRepo}</span>
              <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
            </button>

            {showRepoMenu && (
              <div className="absolute left-0 mt-1 w-64 bg-surface-container-high border border-outline rounded-xl shadow-2xl py-1 z-50">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider font-mono text-outline">
                  Switch Target Cluster / Repo
                </div>
                {repos.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onSelectRepo(r);
                      setShowRepoMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 font-label-sm text-label-sm flex items-center justify-between hover:bg-surface-bright transition-colors ${
                      r === currentRepo ? 'text-primary bg-surface-container font-semibold' : 'text-on-surface-variant'
                    }`}
                  >
                    <span className="truncate">{r}</span>
                    {r === currentRepo && (
                      <span className="material-symbols-outlined text-[16px] text-primary">check</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Search input & Status badges */}
        <div className="flex-1 max-w-2xl hidden md:flex items-center gap-3">
          <div
            onClick={onOpenSearch}
            className="relative flex-1 cursor-pointer group"
          >
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[18px] text-outline group-hover:text-primary transition-colors">
              search
            </span>
            <input
              readOnly
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-label-sm text-label-sm rounded-lg pl-8 pr-16 py-1.5 focus:outline-none group-hover:bg-surface-container transition-all cursor-pointer border border-outline-variant"
              placeholder="Search pipelines, run IDs, models, commits..."
              type="text"
            />
            <span className="absolute right-2 top-1.5 font-mono text-[10px] text-outline bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant">
              ⌘K
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap">
              LIVE CI (3 repos)
            </span>
          </div>

          <button
            onClick={onToggleDemoData}
            title="Click to toggle synthetic test fixtures"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0 transition-colors border ${
              demoDataActive
                ? 'bg-surface-container-high border-secondary/40 text-secondary'
                : 'bg-surface-container-low border-outline-variant text-outline'
            }`}
          >
            <span className="font-label-sm text-label-sm font-semibold">
              {demoDataActive ? 'DEMO DATA ACTIVE' : 'LIVE DATA'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                demoDataActive ? 'bg-secondary' : 'bg-emerald-400'
              }`}
            ></span>
          </button>
        </div>

        {/* Right Section: Theme Switcher, SLA, Notifications, Trigger Run, Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* THEME SWITCHER BUTTON */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors border border-outline-variant shadow-sm"
              title="Change Theme & Colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                {currentTheme === 'nordic' ? 'light_mode' : currentTheme === 'cyber' ? 'terminal' : 'palette'}
              </span>
              <span className="font-label-sm text-label-sm capitalize hidden lg:inline font-semibold">
                {currentTheme}
              </span>
              <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-surface-container-high border border-outline rounded-xl shadow-2xl p-2 z-50 animate-in fade-in duration-100">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-mono text-outline font-semibold">
                  Select Visual Theme
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                        currentTheme === t.id
                          ? 'bg-surface-container border border-primary/40'
                          : 'hover:bg-surface-bright border border-transparent'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${t.preview}`}>
                        <span className="material-symbols-outlined text-[14px] text-primary">
                          {t.icon}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-headline-sm text-headline-sm text-on-surface font-semibold flex items-center justify-between">
                          <span>{t.label}</span>
                          {currentTheme === t.id && (
                            <span className="material-symbols-outlined text-[14px] text-primary">check</span>
                          )}
                        </div>
                        <p className="font-body-sm text-[11px] text-outline leading-tight mt-0.5">
                          {t.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-low border border-outline-variant">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">99.98% SLA</span>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="relative p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant/40"
              title="Recent SRE Alerts"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
              )}
            </button>

            {showAlertsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-high border border-outline rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant">
                  <span className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                    Real-time SRE Alerts
                  </span>
                  <span className="font-label-sm text-label-sm text-error bg-error-container/30 px-1.5 py-0.5 rounded font-bold">
                    3 Active
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-2 max-h-72 overflow-y-auto">
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-error/30 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-error font-semibold">HIGH RISK #4192</span>
                      <span className="font-label-sm text-label-sm text-outline">2m ago</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-1">
                      Run #4192 intercepted at 84% failure likelihood (api-gateway).
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-secondary font-semibold">DIAGNOSIS COMPLETE</span>
                      <span className="font-label-sm text-label-sm text-outline">14m ago</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-1">
                      npm ERESOLVE peer conflict mapped on microservices-backend #4180.
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface-container-low border border-outline-variant text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-tertiary font-semibold">NEW OPTIMIZATION</span>
                      <span className="font-label-sm text-label-sm text-outline">45m ago</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface mt-1">
                      Docker layer cache recommendation ready to unlock $360/mo.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trigger Run button */}
          <button
            onClick={onOpenTriggerRun}
            className="flex items-center gap-1.5 bg-primary-container text-on-primary-container px-3 py-1.5 rounded-lg font-headline-sm text-headline-sm font-semibold hover:opacity-90 transition-opacity shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            <span>Trigger Run</span>
          </button>

          {/* User profile avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-outline-variant">
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/40"
              src="https://lh3.googleusercontent.com/aida/AEtjO1XfgPaviWiZA0Cb7aUF8hfcLP-sV-_kUb7F1pCkt6r7AzOiXd1MGz5QPX0FvZdOopz1MRTon6PvSbW6INgq8gaLKIqKAqUoU9zQgfkldjDpibWfkGoj-wOYVSNXuc32I9M4OhtsvboPz4Y1QynfpRRQEtFzgnPbwAtwq6gcNYD512f_cRTpmqzm-ZCCcM-ZBLZh03pbBLPIVjBIgMYeaO5Z_eXaq3VbyT_oWm4qviIftHbM8rrblvDozG8"
            />
            <div className="hidden 2xl:flex flex-col text-left">
              <span className="font-headline-sm text-headline-sm leading-none text-on-surface">Alex Rivera</span>
              <span className="font-label-sm text-label-sm text-outline mt-0.5">Staff SRE / Owner</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
