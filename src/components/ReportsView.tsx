import React from 'react';
import { 
  BarChart3, 
  Printer, 
  Globe, 
  Layers
} from 'lucide-react';
import { ScanRecord } from '../types';

interface ReportsViewProps {
  records: ScanRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ records }) => {
  const total = records.length;
  const highRisk = records.filter(r => r.overallRisk === 'High').length;
  const mediumRisk = records.filter(r => r.overallRisk === 'Medium').length;
  const lowRisk = records.filter(r => r.overallRisk === 'Low').length;
  const watchlistHits = records.filter(r => r.blacklistStatus === 'Flagged').length;
  const modifiedDobCount = records.filter(r => !r.extractedInfo.originalDobMatch).length;
  const expiredCount = records.filter(r => r.extractedInfo.isExpired).length;
  const deepfakePhotos = records.filter(r => r.tamperScore > 60).length;
  const impersonators = records.filter(r => r.faceMatchScore < 50).length;

  // Document types breakdown
  const docTypeCounts: Record<string, { total: number; threats: number }> = {};
  records.forEach((r) => {
    const d = r.documentType;
    if (!docTypeCounts[d]) {
      docTypeCounts[d] = { total: 0, threats: 0 };
    }
    docTypeCounts[d].total += 1;
    if (r.overallRisk !== 'Low') {
      docTypeCounts[d].threats += 1;
    }
  });

  const docTypeStats = Object.entries(docTypeCounts).sort((a, b) => b[1].total - a[1].total);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="reports-view" className="space-y-6">
      {/* Reports Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-['Chakra_Petch',sans-serif] tracking-wide flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <span>INTELLIGENCE &amp; FORENSIC REPORTS</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ministry of Home Affairs &amp; SSB statistical analysis, anomaly classification &amp; border threat indicators
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>Print Official Dossier</span>
          </button>
        </div>
      </div>

      {/* High-Level Executive Summary Bento Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            // EXECUTIVE SUMMARY - SSB CHECKPOINT - INDIA BORDER // MHA
          </h3>
          <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
            GENERATED: {new Date().toISOString().substring(0, 10)}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase text-slate-400 block font-bold tracking-wider">Screenings Sampled</span>
            <span className="text-2xl font-bold font-mono text-slate-800 mt-1 block">{total}</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase text-slate-400 block font-bold tracking-wider">Threat Interception Rate</span>
            <span className="text-2xl font-bold font-mono text-red-600 mt-1 block">
              {(((highRisk + mediumRisk) / (total || 1)) * 100).toFixed(1)}%
            </span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase text-slate-400 block font-bold tracking-wider">NCRB / ICJS Watchlist Alerts</span>
            <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">{watchlistHits}</span>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] uppercase text-slate-400 block font-bold tracking-wider">Biometric Integrity Rate</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">
              {(((total - impersonators) / (total || 1)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Visual Threat Anomaly Proportions */}
        <div className="space-y-2.5 pt-2">
          <span className="text-xs font-bold text-slate-800 block uppercase tracking-wider">
            Risk Classification Breakdown
          </span>
          <div className="h-6 rounded-xl overflow-hidden flex font-mono text-[11px] font-bold text-white shadow-xs">
            <div 
              style={{ width: `${(lowRisk / total) * 100}%` }} 
              className="bg-emerald-600 flex items-center justify-center transition-all"
              title={`Low Risk: ${lowRisk} (${((lowRisk / total) * 100).toFixed(0)}%)`}
            >
              {((lowRisk / total) * 100).toFixed(0)}% Clear
            </div>
            <div 
              style={{ width: `${(mediumRisk / total) * 100}%` }} 
              className="bg-amber-500 text-slate-950 flex items-center justify-center transition-all"
              title={`Medium Risk: ${mediumRisk} (${((mediumRisk / total) * 100).toFixed(0)}%)`}
            >
              {((mediumRisk / total) * 100).toFixed(0)}% Review
            </div>
            <div 
              style={{ width: `${(highRisk / total) * 100}%` }} 
              className="bg-red-600 flex items-center justify-center transition-all"
              title={`High Risk: ${highRisk} (${((highRisk / total) * 100).toFixed(0)}%)`}
            >
              {((highRisk / total) * 100).toFixed(0)}% Detained
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
              <span>Low Risk ({lowRisk})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-sm" />
              <span>Secondary Review ({mediumRisk})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-sm" />
              <span>Detained / High Risk ({highRisk})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Bento Grid: Threat Categories & Indian Document Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Threat Categories Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase text-slate-400 font-bold tracking-wider flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Target Anomaly Distribution</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{total} Total Samples</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Deepfake &amp; Synthetic Photo Swaps</span>
                <span className="text-[11px] text-slate-500">Boundary blend artifacts &amp; GAN skin texture</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-red-600 text-sm">{deepfakePhotos}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {((deepfakePhotos / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Modified Date of Birth (DOB)</span>
                <span className="text-[11px] text-slate-500">Infrared ink erasure &amp; font kerning mismatch</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-amber-600 text-sm">{modifiedDobCount}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {((modifiedDobCount / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Identity Impersonation (Lookalikes)</span>
                <span className="text-[11px] text-slate-500">Low biometric vector correspondence (&lt; 50%)</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-purple-600 text-sm">{impersonators}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {((impersonators / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Expired &amp; Tampered Documents</span>
                <span className="text-[11px] text-slate-500">Altered validity dates &amp; invalidated stamps</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-blue-600 text-sm">{expiredCount}</span>
                <span className="text-[10px] text-slate-400 block font-mono">
                  {((expiredCount / total) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Indian Document Types Breakdown Bento Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs uppercase text-slate-400 font-bold tracking-wider flex items-center space-x-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Indian Document Screening Breakdown</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{docTypeStats.length} Document Classes</span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {docTypeStats.map(([type, stats]) => (
              <div 
                key={type}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-800">{type}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 font-mono font-semibold">
                    {stats.total} {stats.total === 1 ? 'doc' : 'docs'}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  {stats.threats > 0 ? (
                    <span className="text-[11px] font-mono font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-md">
                      {stats.threats} Flagged
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      100% Cleared
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
