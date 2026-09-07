import React from 'react';
import { ShieldCheck, Lock, Database } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="deepfake-defuse-footer" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs text-slate-500 text-xs mt-auto">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left: Branding & Ministry */}
        <div className="flex items-center space-x-3 text-center lg:text-left">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-slate-800 font-bold tracking-wider font-['Chakra_Petch',sans-serif]">
                DEEPFAKE DEFUSE
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                MHA / SSB
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ministry of Home Affairs - Government of India // Sashastra Seema Bal (SSB)
            </p>
          </div>
        </div>

        {/* Center: Protocol & NCRB Integration Badges */}
        <div className="flex items-center flex-wrap justify-center gap-3 text-slate-600 text-[11px]">
          <span className="flex items-center space-x-1.5 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>FIPS 140-3 Cryptographic Isolation</span>
          </span>
          <span className="flex items-center space-x-1.5 font-medium bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>NCRB / ICJS Database Sync</span>
          </span>
          <span className="text-slate-700 font-mono font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg border border-amber-200">
            OFFICIAL USE ONLY
          </span>
        </div>

        {/* Right: Copyright */}
        <div className="text-[11px] text-slate-400 font-medium text-center lg:text-right">
          © {new Date().getFullYear()} Ministry of Home Affairs. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};
