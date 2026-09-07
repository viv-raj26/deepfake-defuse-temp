import React, { useState, useEffect } from 'react';
import { ShieldCheck, Volume2, VolumeX, AlertTriangle, Database } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  flaggedCount: number;
  onNavigateToScan: () => void;
}

export const Header: React.FC<HeaderProps> = ({ flaggedCount, onNavigateToScan }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [lockdownActive, setLockdownActive] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      };
      const istString = new Intl.DateTimeFormat('en-IN', options).format(now);
      setCurrentTime(`${istString} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleAudio = () => {
    soundFx.enabled = audioMuted;
    setAudioMuted(!audioMuted);
    if (audioMuted) {
      soundFx.playScanBeep();
    }
  };

  return (
    <header id="deepfake-defuse-header" className="relative bg-white border-b border-slate-200 shrink-0 z-20 shadow-xs">
      {/* Indian Flag Tricolor Strip (Saffron / White / Green) */}
      <div className="h-1.5 w-full flex" aria-hidden="true">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-[#FFFFFF] border-y border-slate-200/40"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="h-16 flex items-center justify-between px-4 sm:px-8">
        {/* Left Side: Indian Flag + Terminal Title + Status */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Flag badge */}
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center border border-slate-300 rounded overflow-hidden shadow-xs shrink-0 w-7 h-5">
              <div className="w-full h-full flex flex-col">
                <div className="h-1/3 bg-[#FF9933]"></div>
                <div className="h-1/3 bg-white flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full border-[0.5px] border-[#000080] bg-[#000080]"></div>
                </div>
                <div className="h-1/3 bg-[#138808]"></div>
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight font-['Chakra_Petch',sans-serif]">
                  SSB Checkpoint - India Border
                </h2>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase tracking-wider flex items-center space-x-1 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>ONLINE</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Sashastra Seema Bal // Raxaul ICP Border Gate
              </p>
            </div>
          </div>

          {/* NCRB / ICJS Database Indicator */}
          <div className="hidden lg:flex items-center space-x-2 text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">NCRB / ICJS Database</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-emerald-700 font-medium">CONNECTED</span>
          </div>
        </div>

        {/* Right Action Panel */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Session Time (IST) */}
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Checkpoint Clock</p>
            <p className="text-xs sm:text-sm font-mono text-slate-700 font-semibold">{currentTime || 'Loading IST...'}</p>
          </div>

          <div className="hidden sm:block w-px h-8 bg-slate-200"></div>

          {/* Flagged Threat Badge */}
          {flaggedCount > 0 && (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-red-100 border border-red-200 text-red-700 text-xs font-bold shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>{flaggedCount} Detained</span>
            </div>
          )}

          {/* Audio Feedback Toggle */}
          <button
            id="header-sound-toggle-btn"
            onClick={toggleAudio}
            title={audioMuted ? 'Unmute Security Audio' : 'Mute Security Audio'}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
          </button>

          {/* New Screen Button */}
          <button
            id="header-scan-new-btn"
            onClick={onNavigateToScan}
            className="hidden md:inline-flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Document</span>
          </button>

          {/* Emergency Lockdown button */}
          <button
            onClick={() => {
              setLockdownActive(!lockdownActive);
              soundFx.playWarning();
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-sm cursor-pointer ${
              lockdownActive
                ? 'bg-red-600 text-white animate-pulse border border-red-500 font-bold'
                : 'bg-[#0a1628] hover:bg-slate-800 text-white'
            }`}
          >
            {lockdownActive ? 'CHECKPOINT LOCKDOWN ACTIVE' : 'Checkpoint Lockdown'}
          </button>
        </div>
      </div>
    </header>
  );
};
