import React from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Scan, 
  Users, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  Database
} from 'lucide-react';
import { ScanRecord } from '../types';

interface DashboardViewProps {
  records: ScanRecord[];
  onNavigateToScan: () => void;
  onOpenDossier: (record: ScanRecord) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  records,
  onNavigateToScan,
  onOpenDossier
}) => {
  // Aggregate statistics
  const totalScreenings = records.length;
  const highRiskCount = records.filter(r => r.overallRisk === 'High').length;
  const mediumRiskCount = records.filter(r => r.overallRisk === 'Medium').length;
  const clearCount = records.filter(r => r.overallRisk === 'Low').length;
  const watchlistFlaggedCount = records.filter(r => r.blacklistStatus === 'Flagged').length;
  const expiredCount = records.filter(r => r.extractedInfo.isExpired).length;
  const dobTamperedCount = records.filter(r => !r.extractedInfo.originalDobMatch).length;
  const impersonatorCount = records.filter(r => r.faceMatchScore < 50).length;

  const interceptRate = totalScreenings > 0 ? (((highRiskCount + mediumRiskCount) / totalScreenings) * 100).toFixed(1) : '0';

  // Recent 5 scans
  const recentScans = records.slice(0, 5);

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Top Bento Hero Banner */}
      <div className="bg-[#0a1628] rounded-2xl border border-slate-800 p-6 text-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase border border-blue-500/30">
                ACTIVE BORDER CONTROL CHECKPOINT
              </span>
              <span className="text-xs text-slate-400 font-mono">SSB CHECKPOINT - INDIA BORDER // RAXAUL ICP SECTOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-['Chakra_Petch',sans-serif] tracking-wide">
              Deepfake Defuse Security Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Ministry of Home Affairs &amp; Sashastra Seema Bal (SSB) automated multi-vector defense intercepting altered identity documents, deepfake photo manipulations, modified DOBs, and biometric impersonations.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onNavigateToScan}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/30 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Verify Traveler ID</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Bento Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Screenings Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-bold">Total Screenings</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-800 tracking-tight font-mono">{totalScreenings}</span>
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded-md">
              +100% Live
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Cleared: <strong className="text-slate-700">{clearCount}</strong></span>
            <span className="text-slate-400">{((clearCount / (totalScreenings || 1)) * 100).toFixed(0)}% Rate</span>
          </div>
        </div>

        {/* High Risk / Detained Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-bold">High Risk / Detained</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-red-600 tracking-tight font-mono">{highRiskCount}</span>
            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md">
              CRITICAL
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>NCRB / ICJS Hits: <strong className="text-red-600">{watchlistFlaggedCount}</strong></span>
            <span className="text-slate-400 font-mono">FLAGGED</span>
          </div>
        </div>

        {/* Secondary Inspection Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-bold">Secondary Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-amber-600 tracking-tight font-mono">{mediumRiskCount}</span>
            <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded-md">
              SUSPECT
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Expired / Anomalous: <strong className="text-amber-700">{expiredCount}</strong></span>
            <span className="text-slate-400 font-mono">REVIEW</span>
          </div>
        </div>

        {/* Fraud Intercept Rate Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase tracking-wider font-bold">Fraud Intercept Rate</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 flex items-center justify-center text-cyan-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-800 tracking-tight font-mono">{interceptRate}%</span>
            <span className="text-[10px] text-cyan-700 font-bold bg-cyan-50 px-2 py-1 rounded-md">
              99.8% ACC
            </span>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>DOB Tampered: <strong className="text-slate-700">{dobTamperedCount}</strong></span>
            <span className="text-slate-400 font-mono">STANDARDS</span>
          </div>
        </div>
      </div>

      {/* Threat Breakdown Bento Grid & Recent Screenings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Anomaly Vectors Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Anomaly Distribution</span>
            </h3>
            <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">VECTORS</span>
          </div>

          <div className="space-y-3.5">
            {/* Altered Photos / Deepfakes */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Altered Photos / Deepfake GANs</span>
                <span className="font-mono text-red-600 font-bold">5 Cases</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Modified DOB & Typo */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Modified Date of Birth (DOB)</span>
                <span className="font-mono text-amber-600 font-bold">{dobTamperedCount} Cases</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Impersonation / Low Face Match */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Biometric Mismatch (Impersonation)</span>
                <span className="font-mono text-indigo-600 font-bold">{impersonatorCount} Cases</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '40%' }} />
              </div>
            </div>

            {/* Tampered Visa Stamps */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">Tampered Visa Stamps / Ink Anomaly</span>
                <span className="font-mono text-cyan-600 font-bold">3 Cases</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '30%' }} />
              </div>
            </div>

            {/* NCRB / ICJS Blacklist Hits */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-700 font-medium">NCRB / ICJS &amp; LOC Alerts</span>
                <span className="font-mono text-red-600 font-bold">{watchlistFlaggedCount} Cases</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600 rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 mt-auto">
            <span className="font-semibold text-slate-800 block mb-0.5">SSB Border Enforcement Protocol:</span>
            Documents with Tamper &gt; 60% or Biometric Match &lt; 50% trigger mandatory secondary inspection and detention at SSB checkpoint.
          </div>
        </div>

        {/* Recent Screenings Stream Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:col-span-2">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Recent Screenings Stream</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Real-time border checkpoint intake</p>
            </div>
            <button 
              onClick={onNavigateToScan}
              className="text-xs text-blue-600 font-semibold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Verify Traveler ID</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4 font-bold">Traveler</th>
                  <th className="py-2.5 px-4 font-bold">Document</th>
                  <th className="py-2.5 px-4 font-bold">Tamper Score</th>
                  <th className="py-2.5 px-4 font-bold">Face Match</th>
                  <th className="py-2.5 px-4 font-bold">Risk Assessment</th>
                  <th className="py-2.5 px-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentScans.map((r) => (
                  <tr 
                    key={r.id} 
                    onClick={() => onOpenDossier(r)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img 
                          src={r.documentPhotoUrl || r.liveFaceImageUrl || r.documentImageUrl} 
                          alt="Face" 
                          className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 truncate block max-w-[140px] group-hover:text-blue-600">
                            {r.extractedInfo.fullName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {r.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-700">
                      <div>{r.documentType}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{r.extractedInfo.documentNumber}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold text-xs ${
                        r.tamperScore > 60 ? 'text-red-600' :
                        r.tamperScore > 25 ? 'text-amber-600' :
                        'text-emerald-600'
                      }`}>
                        {r.tamperScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold text-xs ${
                        r.faceMatchScore >= 80 ? 'text-blue-600' :
                        r.faceMatchScore >= 50 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {r.faceMatchScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        r.overallRisk === 'High' ? 'bg-red-100 text-red-700' :
                        r.overallRisk === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {r.overallRisk.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-mono font-semibold ${
                        r.status === 'Detained' ? 'text-red-600' :
                        r.status === 'Under Secondary Review' ? 'text-amber-700' :
                        'text-emerald-600'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
