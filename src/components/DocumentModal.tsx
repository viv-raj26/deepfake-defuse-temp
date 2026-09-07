import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Download, 
  Fingerprint,
  UserX,
  FileSearch,
  ScanFace,
  IdCard,
  Camera,
  Layers,
  FileText
} from 'lucide-react';
import { ScanRecord } from '../types';

interface DocumentModalProps {
  record: ScanRecord | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: ScanRecord['status']) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ record, onClose, onUpdateStatus }) => {
  if (!record) return null;

  const getRiskBadge = (risk: ScanRecord['overallRisk']) => {
    switch (risk) {
      case 'High':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-600" />
            HIGH RISK
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            MEDIUM RISK
          </span>
        );
      case 'Low':
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            LOW RISK
          </span>
        );
    }
  };

  const getBlacklistBadge = (status: ScanRecord['blacklistStatus']) => {
    switch (status) {
      case 'Flagged':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-700">
            FLAGGED IN WATCHLIST
          </span>
        );
      case 'Warning':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-800">
            CAUTION / ALERT
          </span>
        );
      case 'Clear':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700">
            CLEARED
          </span>
        );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `DeepfakeDefuse_Dossier_${record.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const documentPhotoSource = record.documentPhotoUrl || record.documentImageUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="document-inspection-modal"
        className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 my-8"
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 border border-blue-100 rounded-xl text-blue-600">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-slate-800 font-['Chakra_Petch',sans-serif]">
                  BORDER SECURITY FORENSIC DOSSIER
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-600 border border-blue-100">
                  {record.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Deepfake Defuse Automated Forensic &amp; Facial Verification Report // SSB Border Control
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Banners */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Overall Risk</span>
                <div className="mt-1">{getRiskBadge(record.overallRisk)}</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Blacklist Status</span>
                <div className="mt-1">{getBlacklistBadge(record.blacklistStatus)}</div>
              </div>
              <div className="h-8 w-[1px] bg-slate-200" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Current Status</span>
                <span className="mt-1 inline-block text-xs font-mono font-bold text-slate-800">
                  {record.status}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>Print Dossier</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Blacklist Warning Message if applicable */}
          {record.blacklistReason && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start space-x-3">
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-red-900 block mb-0.5">NCRB / ICJS BORDER WATCHLIST ALERT:</span>
                <p className="text-red-700">{record.blacklistReason}</p>
              </div>
            </div>
          )}

          {/* ================= 1. BIOMETRIC COMPARISON VIEW (Document Left, Webcam Right, Match Score) ================= */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <ScanFace className="w-4 h-4 text-blue-600" />
                  <span>Biometric Facial Comparison (ICAO ISO/IEC 19794-5)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct cross-verification between authentic document photo and live webcam traveler capture
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                  record.faceMatchScore >= 80 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : record.faceMatchScore >= 50 
                    ? 'bg-amber-50 text-amber-800 border-amber-200' 
                    : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                  MATCH: {record.faceMatchScore}%
                </span>
              </div>
            </div>

            {/* Side-by-side comparison container: Document Photo (Left), Match Score (Center), Webcam (Right) */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-2">
              
              {/* LEFT: Document Photo */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <IdCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Document Photo</span>
                </div>
                
                {/* 150x200 px Passport Headshot Box */}
                <div className="w-[150px] h-[200px] rounded-lg border-2 border-blue-400 shadow-md overflow-hidden bg-[#e0ecf8] relative group">
                  <img
                    src={documentPhotoSource}
                    alt="Document Photo"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue-900/80 text-cyan-300 rounded text-[9px] font-mono font-bold tracking-wider">
                    DOCUMENT
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] font-mono text-cyan-300 px-1.5 py-0.5 text-center font-bold">
                    35x45mm // 150x200
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    {record.documentType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {record.extractedInfo.documentNumber}
                  </span>
                </div>
              </div>

              {/* CENTER: Match Score (0-100%) Gauge & Biometric Indicators */}
              <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Biometric Facial Match Score
                </span>

                <div className="my-3 flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-bold shadow-sm transition-all ${
                    record.faceMatchScore >= 80 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-500/10' 
                      : record.faceMatchScore >= 50 
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-amber-500/10' 
                      : 'border-red-500 bg-red-50 text-red-700 shadow-red-500/10'
                  }`}>
                    <span className="text-3xl font-black font-mono leading-none">{record.faceMatchScore}%</span>
                    <span className="text-[9px] font-mono uppercase tracking-wider font-semibold mt-1">MATCH</span>
                  </div>
                </div>

                <div className="mt-1">
                  {record.faceMatchScore >= 80 ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>MATCH VERIFIED</span>
                    </span>
                  ) : record.faceMatchScore >= 50 ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>SECONDARY REVIEW</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-red-100 text-red-800 animate-pulse">
                      <XCircle className="w-3.5 h-3.5 text-red-600" />
                      <span>IMPERSONATION SUSPECTED</span>
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 mt-2.5 max-w-[210px] leading-tight">
                  {record.faceMatchScore >= 80
                    ? 'Nodal distance & facial landmark vectors match traveler identity.'
                    : record.faceMatchScore >= 50
                    ? 'Slight variance in jawline or age vector. Secondary inspection advised.'
                    : 'Severe biometric divergence (>50%). Live traveler does not match credential photo.'}
                </p>
              </div>

              {/* RIGHT: Webcam Capture */}
              <div className="flex flex-col items-center">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Webcam Capture</span>
                </div>

                {/* 150x200 px Webcam Box */}
                <div className="w-[150px] h-[200px] rounded-lg border-2 border-emerald-400 shadow-md overflow-hidden bg-slate-900 relative group">
                  {record.liveFaceImageUrl ? (
                    <img
                      src={record.liveFaceImageUrl}
                      alt="Webcam Capture"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
                      <UserX className="w-8 h-8 mb-1 text-slate-500" />
                      <span>No Webcam Capture</span>
                    </div>
                  )}
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-emerald-900/80 text-emerald-300 rounded text-[9px] font-mono font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>LIVE</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] font-mono text-white px-1.5 py-0.5 text-center font-semibold">
                    150 x 200 px
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-[11px] font-semibold text-slate-700 block">
                    Border Terminal Scan
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {record.timestamp.split(' ')[0]}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* ================= 2. EXTRACTED INFORMATION (Showing Document Photo next to info) ================= */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span>Extracted Identity &amp; Document Credentials</span>
              </h4>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {record.documentType}
              </span>
            </div>

            {/* Layout showing Document Photo on Left directly next to extracted info cards */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Document Photo Card with 'Document Photo' label above */}
              <div className="w-[150px] shrink-0 self-center sm:self-start">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <IdCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Document Photo</span>
                </div>
                <div className="w-[150px] h-[200px] rounded-lg border-2 border-slate-300 shadow-sm overflow-hidden bg-[#e0ecf8] relative group">
                  <img
                    src={documentPhotoSource}
                    alt="Document Photo"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] font-mono text-cyan-300 px-1 py-0.5 text-center font-bold">
                    35x45mm // 150x200
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 block text-center mt-1 font-medium">
                  Formal Passport Spec
                </span>
              </div>

              {/* Extracted Credentials Grid next to the photo */}
              <div className="flex-1 w-full space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Full Name</span>
                    <span className="font-bold text-slate-800 mt-1 block truncate">{record.extractedInfo.fullName}</span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Date of Birth (DOB)</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="font-bold text-slate-800">{record.extractedInfo.dob}</span>
                      {!record.extractedInfo.originalDobMatch && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold font-mono">
                          MODIFIED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Document Number</span>
                    <span className="font-mono font-bold text-blue-600 mt-1 block">
                      {record.extractedInfo.documentNumber}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Expiry Date</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="font-bold text-slate-800">{record.extractedInfo.expiryDate}</span>
                      {record.extractedInfo.isExpired && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold font-mono">
                          EXPIRED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Issuing Country</span>
                    <span className="font-bold text-slate-800 mt-1 block">
                      {record.extractedInfo.issuingCountry} ({record.extractedInfo.countryCode})
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Gender / Nationality</span>
                    <span className="font-bold text-slate-800 mt-1 block">
                      {record.extractedInfo.gender} / {record.extractedInfo.nationality}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">Verification Time</span>
                    <span className="font-mono text-slate-600 mt-1 block text-[11px] font-medium">
                      {record.timestamp}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase tracking-wider">SSB Inspecting Officer</span>
                    <span className="font-bold text-blue-600 mt-1 block text-[11px]">
                      {record.officerId}
                    </span>
                  </div>
                </div>

                {/* Optical MRZ Data Strip */}
                {record.extractedInfo.mrzLine1 && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
                    <div className="text-[9px] text-slate-400 mb-1 uppercase font-sans font-semibold">Optical Machine Readable Zone (MRZ):</div>
                    <div className="tracking-wider">{record.extractedInfo.mrzLine1}</div>
                    <div className="tracking-wider">{record.extractedInfo.mrzLine2}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ================= 3. FORENSIC CHECKS AUDIT TRAIL ================= */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3.5 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Deepfake Defuse Forensic Audit Matrix</span>
            </h4>
            <div className="space-y-2">
              {record.forensicChecks.map((check) => (
                <div 
                  key={check.id}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-xs"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${check.passed ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {check.passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">{check.name}</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                          {check.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{check.details}</p>
                    </div>
                  </div>
                  <div className="text-right pl-4">
                    <span className={`text-xs font-mono font-bold ${
                      check.score >= 80 ? 'text-emerald-600' :
                      check.score >= 50 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {check.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Notes & Status Management */}
          {record.inspectionNotes && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Forensic Officer Observations</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3.5 rounded-xl border border-slate-200">
                "{record.inspectionNotes}"
              </p>

              {onUpdateStatus && (
                <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-semibold">Change Border Clearance Status:</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onUpdateStatus(record.id, 'Approved')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        record.status === 'Approved'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200'
                      }`}
                    >
                      Approve Entry
                    </button>
                    <button
                      onClick={() => onUpdateStatus(record.id, 'Under Secondary Review')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        record.status === 'Under Secondary Review'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-white hover:bg-amber-50 text-amber-700 border border-slate-200'
                      }`}
                    >
                      Secondary Review
                    </button>
                    <button
                      onClick={() => onUpdateStatus(record.id, 'Detained')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        record.status === 'Detained'
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-white hover:bg-red-50 text-red-700 border border-slate-200'
                      }`}
                    >
                      Detain Traveler
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Ministry of Home Affairs - Government of India</span>
            <span className="text-slate-300">|</span>
            <span>SSB Checkpoint - India Border</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
