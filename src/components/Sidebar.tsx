import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  History, 
  BarChart3, 
  ShieldCheck
} from 'lucide-react';

export type NavTab = 'dashboard' | 'scan' | 'history' | 'reports';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  totalScans: number;
  threatCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  totalScans,
  threatCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Border security overview'
    },
    {
      id: 'scan' as NavTab,
      label: 'Scan New',
      icon: Scan,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      description: 'Document & Webcam inspection'
    },
    {
      id: 'history' as NavTab,
      label: 'History',
      icon: History,
      badge: totalScans.toString(),
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Database of all screenings'
    },
    {
      id: 'reports' as NavTab,
      label: 'Reports',
      icon: BarChart3,
      badge: threatCount > 0 ? `${threatCount} Alerts` : null,
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/40',
      description: 'Threat forensics & stats'
    },
  ];

  return (
    <aside 
      id="deepfake-defuse-sidebar" 
      className="w-full md:w-64 bg-[#0a1628] text-white border-r border-slate-800 flex flex-col justify-between shrink-0 h-full select-none"
    >
      <div>
        {/* Brand Header with Deepfake Defuse & SSB Emblem */}
        <div className="p-5 sm:p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white block font-['Chakra_Petch',sans-serif]">
                DEEPFAKE DEFUSE
              </span>
              <span className="text-[10px] text-amber-400 font-mono tracking-wider uppercase block font-semibold">
                MHA // SSB BORDER SECURITY
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1" aria-label="Main Security Navigation">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3 py-1 mb-1">
            SSB Command Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`ml-2 px-1.5 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
                    isActive 
                      ? 'bg-blue-500/30 text-blue-300' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info with SSB Officer ID & Checkpoint info */}
      <div className="p-4 border-t border-slate-800 mt-auto bg-[#071120]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            SSB
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-200">SSB Officer ID: SSB-8492</span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SSB Checkpoint - India Border</span>
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
