import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileSpreadsheet,
  Globe,
  Fingerprint,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import { ScanRecord, RiskLevel, BlacklistStatus } from '../types';

interface HistoryViewProps {
  records: ScanRecord[];
  onOpenDossier: (record: ScanRecord) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ records, onOpenDossier }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'timestamp' | 'tamper' | 'faceMatch'>('timestamp');

  // Filtered & sorted records
  const filteredRecords = useMemo(() => {
    return records
      .filter((rec) => {
        // Search term matching
        const q = searchTerm.toLowerCase().trim();
        const matchesQuery = 
          !q ||
          rec.id.toLowerCase().includes(q) ||
          rec.extractedInfo.fullName.toLowerCase().includes(q) ||
          rec.extractedInfo.documentNumber.toLowerCase().includes(q) ||
          rec.extractedInfo.issuingCountry.toLowerCase().includes(q) ||
          rec.documentType.toLowerCase().includes(q);

        // Risk filter
        const matchesRisk = riskFilter === 'ALL' || rec.overallRisk === riskFilter;

        // Status filter
        const matchesStatus = 
          statusFilter === 'ALL' ||
          (statusFilter === 'FLAGGED' && (rec.blacklistStatus === 'Flagged' || rec.status === 'Detained')) ||
          (statusFilter === 'EXPIRED' && rec.extractedInfo.isExpired) ||
          (statusFilter === 'CLEAR' && rec.overallRisk === 'Low' && rec.blacklistStatus === 'Clear');

        return matchesQuery && matchesRisk && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'tamper') {
          return b.tamperScore - a.tamperScore;
        } else if (sortBy === 'faceMatch') {
          return a.faceMatchScore - b.faceMatchScore; // lowest match first (impersonators)
        } else {
          return b.timestamp.localeCompare(a.timestamp);
        }
      });
  }, [records, searchTerm, riskFilter, statusFilter, sortBy]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'ScanID',
      'Timestamp',
      'DocumentType',
      'FullName',
      'DOB',
      'DocumentNumber',
      'ExpiryDate',
      'IssuingCountry',
      'TamperScore',
      'FaceMatchScore',
      'OverallRisk',
      'BlacklistStatus',
      'BorderStatus'
    ];

    const rows = filteredRecords.map((r) => [
      r.id,
      r.timestamp,
      r.documentType,
      `"${r.extractedInfo.fullName}"`,
      r.extractedInfo.dob,
      r.extractedInfo.documentNumber,
      r.extractedInfo.expiryDate,
      `"${r.extractedInfo.issuingCountry}"`,
      r.tamperScore,
      r.faceMatchScore,
      r.overallRisk,
      r.blacklistStatus,
      r.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `DeepfakeDefuse_BorderLog_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'High':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <ShieldAlert className="w-3 h-3 mr-1 text-red-600" />
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
            MEDIUM
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
            LOW
          </span>
        );
    }
  };

  const getBlacklistPill = (status: BlacklistStatus) => {
    switch (status) {
      case 'Flagged':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-700">WATCHLIST HIT</span>;
      case 'Warning':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">ALERT</span>;
      case 'Clear':
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700">CLEAR</span>;
    }
  };

  return (
    <div id="history-log-view" className="space-y-6">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-['Chakra_Petch',sans-serif] tracking-wide flex items-center space-x-2">
            <span>AUDIT LOG &amp; SCREENING HISTORY</span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
              {records.length} Records in Database
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable forensic archive of border identity verifications and fraud interceptions
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Export Border Audit CSV</span>
        </button>
      </div>

      {/* Search & Filter Toolbar Bento Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by passenger name, document number, issuing country, or Scan ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-500 font-medium shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="timestamp">Most Recent First</option>
              <option value="tamper">Highest Tamper Score</option>
              <option value="faceMatch">Lowest Face Match (Impersonation)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1">Risk:</span>
          {['ALL', 'Low', 'Medium', 'High'].map((risk) => (
            <button
              key={risk}
              onClick={() => setRiskFilter(risk)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                riskFilter === risk 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {risk === 'ALL' ? 'All Risks' : `${risk} Risk`}
            </button>
          ))}

          <div className="h-4 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'All Records' },
            { id: 'FLAGGED', label: 'Watchlist Flagged' },
            { id: 'EXPIRED', label: 'Expired Documents' },
            { id: 'CLEAR', label: 'Cleared Entries' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st.id 
                  ? 'bg-slate-800 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}

          <span className="ml-auto text-xs text-slate-400 font-mono font-medium">
            Showing {filteredRecords.length} of {records.length}
          </span>
        </div>
      </div>

      {/* History Table Bento Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 font-bold">Record ID / Timestamp</th>
                <th className="py-3 px-4 font-bold">Traveler / Document</th>
                <th className="py-3 px-4 font-bold">Issuing Country</th>
                <th className="py-3 px-4 font-bold">Tamper Score</th>
                <th className="py-3 px-4 font-bold">Face Match</th>
                <th className="py-3 px-4 font-bold">Risk Assessment</th>
                <th className="py-3 px-4 font-bold">Watchlist Status</th>
                <th className="py-3 px-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No border records match the specified search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr 
                    key={rec.id}
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => onOpenDossier(rec)}
                  >
                    {/* ID and Timestamp */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-600 group-hover:text-blue-700">
                        {rec.id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {rec.timestamp}
                      </div>
                    </td>

                    {/* Traveler Photo & Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img 
                          src={rec.documentPhotoUrl || rec.liveFaceImageUrl || rec.documentImageUrl} 
                          alt="Face" 
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-800 truncate max-w-[170px]">
                            {rec.extractedInfo.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {rec.documentType} • {rec.extractedInfo.documentNumber}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Country & DOB */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="text-slate-800 font-semibold">
                        {rec.extractedInfo.issuingCountry}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        DOB: {rec.extractedInfo.dob}
                        {!rec.extractedInfo.originalDobMatch && (
                          <span className="ml-1 text-red-600 font-bold">(!)</span>
                        )}
                      </div>
                    </td>

                    {/* Tamper Score */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-bold text-xs ${
                          rec.tamperScore > 60 ? 'text-red-600' :
                          rec.tamperScore > 25 ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {rec.tamperScore}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              rec.tamperScore > 60 ? 'bg-red-500' :
                              rec.tamperScore > 25 ? 'bg-amber-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${rec.tamperScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Face Match */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`font-mono font-bold text-xs ${
                          rec.faceMatchScore >= 80 ? 'text-blue-600' :
                          rec.faceMatchScore >= 50 ? 'text-amber-600' :
                          'text-red-600'
                        }`}>
                          {rec.faceMatchScore}%
                        </span>
                        <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              rec.faceMatchScore >= 80 ? 'bg-blue-500' :
                              rec.faceMatchScore >= 50 ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${rec.faceMatchScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Overall Risk */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getRiskBadge(rec.overallRisk)}
                    </td>

                    {/* Watchlist */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getBlacklistPill(rec.blacklistStatus)}
                    </td>

                    {/* Action Button */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDossier(rec);
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-500 hover:text-white transition-colors cursor-pointer"
                        title="View Full Forensic Dossier"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
