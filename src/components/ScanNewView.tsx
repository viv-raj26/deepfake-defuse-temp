import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Camera, 
  RefreshCw, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  AlertOctagon, 
  Fingerprint, 
  Eye, 
  FileText, 
  Printer, 
  Sparkles,
  Layers,
  HelpCircle,
  Database,
  IdCard,
  ScanFace,
  Globe
} from 'lucide-react';
import { ScanRecord, DocumentType } from '../types';
import { SAMPLE_DOCUMENTS_PRESETS } from '../data/mockDocuments';
import { soundFx } from '../utils/audio';

interface ScanNewViewProps {
  onSaveScan: (record: ScanRecord) => void;
  onOpenDossier: (record: ScanRecord) => void;
}

export const ScanNewView: React.FC<ScanNewViewProps> = ({ onSaveScan, onOpenDossier }) => {
  // Document state - initialized to uploaded PAN Card
  const [docImage, setDocImage] = useState<string | null>('/pan-front-1536x977.svg');
  const [docType, setDocType] = useState<DocumentType>('PAN Card');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(3);

  // Webcam state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [liveFaceImage, setLiveFaceImage] = useState<string | null>('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=450&h=600&auto=format&fit=crop&crop=faces,top&q=80');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scanning & Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<ScanRecord | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start live webcam
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        soundFx.playScanBeep();
      } else {
        setCameraError('Webcam API is not supported in this browser.');
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setCameraError('Camera access denied or unavailable. You can use the preset photos or upload directly.');
    }
  };

  // Capture face snapshot from video feed
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setLiveFaceImage(dataUrl);
      soundFx.playSuccess();
      stopCamera();
    }
  };

  // Handle uploaded document file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const resultUrl = uploadEvent.target?.result as string;
        setDocImage(resultUrl);
        setSelectedPresetIndex(null);
        setAnalysisResult(null);
        setSavedSuccess(false);
        soundFx.playScanBeep();
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and drop support
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setDocImage(uploadEvent.target?.result as string);
        setSelectedPresetIndex(null);
        setAnalysisResult(null);
        setSavedSuccess(false);
        soundFx.playScanBeep();
      };
      reader.readAsDataURL(file);
    }
  };

  // Apply Quick Indian Document Test Case Preset
  const applyPreset = (index: number) => {
    const preset = SAMPLE_DOCUMENTS_PRESETS[index];
    if (!preset) return;
    setSelectedPresetIndex(index);
    setDocImage(preset.docImage);
    setDocType(preset.type);
    setLiveFaceImage(preset.travelerImage);
    setAnalysisResult(null);
    setSavedSuccess(false);
    stopCamera();
    soundFx.playScanBeep();
  };

  // Run AI Inspection Simulation
  const runAnalysis = () => {
    if (!docImage) return;

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setCurrentAnalysisStep('Optical Character Recognition (OCR & Data Verification)...');
    soundFx.playScanBeep();

    const preset = selectedPresetIndex !== null ? SAMPLE_DOCUMENTS_PRESETS[selectedPresetIndex] : null;

    // Multi-stage scan animation
    setTimeout(() => {
      setAnalysisProgress(35);
      setCurrentAnalysisStep('Forensic raster analysis: Checking altered photo, modified DOB & ink fluorescence...');
      soundFx.playScanBeep();
    }, 600);

    setTimeout(() => {
      setAnalysisProgress(65);
      setCurrentAnalysisStep('Deepfake GAN synthetic artifact screening & facial boundary analysis...');
      soundFx.playScanBeep();
    }, 1300);

    setTimeout(() => {
      setAnalysisProgress(85);
      setCurrentAnalysisStep('Querying NCRB / ICJS & Indian Border Watchlist databases...');
    }, 2000);

    setTimeout(() => {
      setAnalysisProgress(100);
      setCurrentAnalysisStep('Screening complete. Compiling risk evaluation dossier...');

      // Synthesize scan result
      const now = new Date();
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
      const timestamp = new Intl.DateTimeFormat('en-IN', options).format(now) + ' IST';
      const scanId = `SSB-IN-${Math.floor(1000 + Math.random() * 9000)}`;

      let result: ScanRecord;

      if (preset) {
        // Preset based result
        result = {
          id: scanId,
          timestamp,
          documentType: preset.type,
          documentImageUrl: docImage,
          documentPhotoUrl: preset.type === 'PAN Card' ? '/pan-photo-sample-kumar.svg' : docImage,
          liveFaceImageUrl: liveFaceImage || preset.travelerImage,
          extractedInfo: {
            fullName: preset.person.fullName,
            dob: preset.person.dob,
            originalDobMatch: preset.person.originalDobMatch,
            documentNumber: preset.person.documentNumber,
            expiryDate: preset.person.expiryDate,
            isExpired: preset.person.isExpired,
            issuingCountry: preset.person.issuingCountry,
            countryCode: preset.person.countryCode,
            gender: preset.person.gender,
            nationality: preset.person.nationality,
            mrzLine1: `P<${preset.person.countryCode}${preset.person.fullName.split(' ')[0]}<<<<<<<<<<<<<<<<<<<`,
            mrzLine2: `${preset.person.documentNumber.replace(/\s+/g, '')}9${preset.person.countryCode}${preset.person.dob.replace(/-/g, '').substring(2)}1${preset.person.gender}<<<<<<<<<<<<<<`,
            mrzValid: preset.person.mrzValid
          },
          tamperScore: preset.tamperScore,
          faceMatchScore: liveFaceImage && liveFaceImage !== preset.travelerImage ? 64 : preset.faceMatchScore,
          overallRisk: preset.risk,
          blacklistStatus: preset.blacklist,
          blacklistReason: preset.blacklistReason,
          officerId: 'SSB Officer ID: SSB-8492 (SSB Checkpoint - India Border)',
          inspectionNotes: preset.notes,
          forensicChecks: [
            {
              id: 'c-1',
              name: 'Face Photo Manipulation (Deepfake GAN Test)',
              category: 'Photo/Biometrics',
              passed: preset.tamperScore < 50,
              score: Math.max(10, 100 - preset.tamperScore),
              details: preset.tamperScore > 50 
                ? 'Synthetic skin tone gradients and boundary artifacts detected.' 
                : 'High-frequency noise patterns consistent with authentic camera sensor.'
            },
            {
              id: 'c-2',
              name: 'DOB & Microtypography Check',
              category: 'Typography/DOB',
              passed: preset.person.originalDobMatch,
              score: preset.person.originalDobMatch ? 98 : 22,
              details: preset.person.originalDobMatch
                ? 'Standard official type alignment and crisp letterforms.'
                : 'Differential ink opacity and digital pixelation detected on date numerals.'
            },
            {
              id: 'c-3',
              name: 'State Emblem / Hologram Foil',
              category: 'Security Foil',
              passed: preset.tamperScore < 40,
              score: preset.tamperScore < 40 ? 95 : 34,
              details: preset.tamperScore < 40
                ? 'Diffractive optics reflect authentic three-dimensional State Emblem.'
                : 'Reflective optical foil missing holographic wavelength transition.'
            },
            {
              id: 'c-4',
              name: 'NCRB / ICJS Checksum & Watchlist Parity',
              category: 'MRZ/Database',
              passed: preset.person.mrzValid && preset.blacklist === 'Clear',
              score: preset.person.mrzValid ? 100 : 38,
              details: preset.blacklist !== 'Clear'
                ? `Active flag returned in central NCRB / ICJS database: ${preset.blacklistReason}`
                : 'Check digits and identification numbers validated against central registry.'
            }
          ],
          status: preset.risk === 'High' ? 'Detained' : preset.risk === 'Medium' ? 'Under Secondary Review' : 'Approved'
        };
      } else {
        // Custom upload evaluation (realistic automated heuristic)
        const customTamper = 12;
        const customMatch = liveFaceImage ? 95 : 88;

        let generatedDocNum = 'Z4829104';
        if (docType === 'Indian Passport') {
          generatedDocNum = `Z${Math.floor(1000000 + Math.random() * 9000000)}`;
        } else if (docType === 'Aadhaar Card') {
          generatedDocNum = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
        } else if (docType === 'PAN Card') {
          generatedDocNum = `ABCPS${Math.floor(1000 + Math.random() * 9000)}F`;
        } else if (docType === 'Indian Visa') {
          generatedDocNum = `V-IND-${Math.floor(1000000 + Math.random() * 9000000)}`;
        }

        result = {
          id: scanId,
          timestamp,
          documentType: docType,
          documentImageUrl: docImage,
          documentPhotoUrl: docType === 'PAN Card' ? '/pan-photo-sample-kumar.svg' : docImage,
          liveFaceImageUrl: liveFaceImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=450&h=600&auto=format&fit=crop&crop=faces,top&q=80',
          extractedInfo: {
            fullName: 'RAJESH KUMAR SHARMA',
            dob: '1988-10-14',
            originalDobMatch: true,
            documentNumber: generatedDocNum,
            expiryDate: '2032-08-20',
            isExpired: false,
            issuingCountry: 'India',
            countryCode: 'IND',
            gender: 'M',
            nationality: 'Indian',
            mrzLine1: 'P<INDSHARMA<<RAJESH<KUMAR<<<<<<<<<<<<<<<<<<',
            mrzLine2: `${generatedDocNum.replace(/\s+/g, '')}4IND8810141M3208204<<<<<<<<<<<<<<02`,
            mrzValid: true
          },
          tamperScore: customTamper,
          faceMatchScore: customMatch,
          overallRisk: 'Low',
          blacklistStatus: 'Clear',
          officerId: 'SSB Officer ID: SSB-8492 (SSB Checkpoint - India Border)',
          inspectionNotes: 'All primary security features verified. No deepfake synthetic manipulation detected. Cleared against NCRB / ICJS central repository.',
          forensicChecks: [
            { id: 'c-1', name: 'Face Photo Biometric Integrity', category: 'Photo/Biometrics', passed: true, score: 96, details: 'Clear portrait without GAN edge blending or facial warping.' },
            { id: 'c-2', name: 'Typography & DOB Kerning', category: 'Typography/DOB', passed: true, score: 95, details: 'Font matches official Government of India typography baseline.' },
            { id: 'c-3', name: 'State Emblem & Holographic Layer', category: 'Security Foil', passed: true, score: 94, details: 'Optically variable ink shifts correctly under oblique inspection.' },
            { id: 'c-4', name: 'NCRB / ICJS Repository Check', category: 'MRZ/Database', passed: true, score: 100, details: 'No adverse records or Look-Out Circulars (LOC) located.' }
          ],
          status: 'Approved'
        };
      }

      setAnalysisResult(result);
      setIsAnalyzing(false);

      if (result.overallRisk === 'High') {
        soundFx.playWarning();
      } else {
        soundFx.playSuccess();
      }
    }, 2600);
  };

  const handleSaveToLog = () => {
    if (analysisResult) {
      onSaveScan(analysisResult);
      setSavedSuccess(true);
      soundFx.playSuccess();
    }
  };

  const handleReset = () => {
    setDocImage(null);
    setLiveFaceImage(null);
    setSelectedPresetIndex(null);
    setAnalysisResult(null);
    setSavedSuccess(false);
    stopCamera();
  };

  return (
    <div id="scan-new-view" className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800 font-['Chakra_Petch',sans-serif] tracking-wide flex items-center space-x-2">
            <span>INDIAN BORDER DOCUMENT &amp; BIOMETRIC VERIFICATION</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ministry of Home Affairs &amp; SSB real-time forensic screening: Passports, Aadhaar, Visas &amp; PAN
          </p>
        </div>

        {/* Reset / Clear Button */}
        {(docImage || liveFaceImage || analysisResult) && (
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl border border-slate-200 transition-colors shadow-xs cursor-pointer w-fit"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Terminal</span>
          </button>
        )}
      </div>

      {/* Quick Indian Border Security Test Cases (1-Click Presets) Bento Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quick Border Security Test Cases (1-Click Presets)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Simulate clear and flagged Indian documents
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SAMPLE_DOCUMENTS_PRESETS.map((preset, idx) => {
            const isSelected = selectedPresetIndex === idx;
            return (
              <button
                key={idx}
                id={`sample-preset-${idx}`}
                onClick={() => applyPreset(idx)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500'
                    : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-base">{preset.flag}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                    preset.risk === 'High' ? 'bg-red-100 text-red-700' :
                    preset.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {preset.risk}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-800 truncate">
                  {preset.type}
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {preset.person.fullName.split(' ')[0]} • {preset.risk === 'High' ? 'Flagged/Tampered' : 'Genuine Credential'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Two-Step Input Section: Document Upload + Live Webcam Capture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ================= STEP 1: Upload Document Section (Bento Card) ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  Upload Indian Identity Document
                </h3>
              </div>
              <div className="flex items-center space-x-1.5 text-xs">
                <label className="text-slate-500 text-[11px] font-medium mr-1">Type:</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1 focus:outline-none focus:border-blue-500"
                >
                  <option value="Indian Passport">Indian Passport</option>
                  <option value="Aadhaar Card">Aadhaar Card</option>
                  <option value="Indian Visa">Indian Visa</option>
                  <option value="PAN Card">PAN Card</option>
                </select>
              </div>
            </div>

            {/* Document Preview or Dropzone */}
            {docImage ? (
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center space-x-1.5 self-start">
                  <IdCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Document Photo (Uploaded)</span>
                </div>
                <div className={`${docType === 'PAN Card' ? 'w-full max-w-[320px] aspect-[1.57/1]' : 'w-[150px] h-[200px]'} rounded-xl border-2 border-blue-400/80 shadow-md overflow-hidden bg-[#e0ecf8] relative group transition-all`}>
                  <img 
                    src={docImage || '/pan-front-1536x977.svg'} 
                    alt="Indian Identity Document" 
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-blue-950/80 text-[9px] font-mono text-cyan-300 font-bold">
                    {docType}
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-[9px] font-mono text-cyan-300 px-1 py-0.5 text-center font-bold">
                    {docType === 'PAN Card' ? 'CR80 // 85.6×54mm (PAN Card)' : '35×45mm // 150×200'}
                  </div>
                </div>

                {/* Change photo button */}
                <div className="mt-3 flex items-center space-x-2">
                  <label 
                    htmlFor="file-upload-input"
                    className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer transition-all shadow-xs"
                  >
                    Replace Document
                  </label>
                </div>
              </div>
            ) : (
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all flex flex-col items-center justify-center h-56 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 mb-3 transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 block">
                  Drop Indian Passport, Aadhaar, Visa, or PAN Card
                </span>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Supports JPEG, PNG, WEBP (Official Government Format)
                </span>
                <label 
                  htmlFor="file-upload-input"
                  className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  Browse Document File
                </label>
              </div>
            )}
            <input 
              id="file-upload-input"
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>OCR: Automated Indian ID &amp; MRZ parser ready</span>
            <span className="text-blue-600 font-mono font-semibold">MHA STANDARDS COMPLIANT</span>
          </div>
        </div>

        {/* ================= STEP 2: Live Webcam Capture (Clean Government Design) ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <span className="text-xs uppercase text-slate-500 font-bold tracking-wider">
                  Live Webcam Face Verification
                </span>
              </div>
              {liveFaceImage && (
                <span className="text-[11px] font-mono text-emerald-700 flex items-center space-x-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Face Stored</span>
                </span>
              )}
            </div>

            {/* Clean Government Camera Feed / Snapshot Preview Area */}
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-56 flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                  {/* Clean Government Framing Box */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
                    <div className="w-36 h-48 border border-white/50 rounded-2xl"></div>
                  </div>

                  {/* Clean Live Feed Status Pill */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>LIVE FEED</span>
                  </div>
                </div>
              ) : liveFaceImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={liveFaceImage} 
                    alt="Captured Live Face" 
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-slate-600 text-[10px] font-mono text-emerald-400 font-bold">
                    BIOMETRIC CAPTURED
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 mx-auto">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Camera Standby
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Capture traveler live portrait to cross-verify against document photo
                    </span>
                  </div>
                  <button
                    onClick={startCamera}
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Activate Live Webcam</span>
                  </button>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute bottom-2 inset-x-2 bg-red-950/90 text-red-200 text-[11px] p-2 rounded-lg border border-red-800 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Camera Controls */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {isCameraActive ? (
              <div className="flex items-center space-x-2 w-full justify-between">
                <button
                  onClick={stopCamera}
                  className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={captureSnapshot}
                  className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Capture Face</span>
                </button>
              </div>
            ) : liveFaceImage ? (
              <div className="flex items-center space-x-2 w-full justify-between">
                <button
                  onClick={() => setLiveFaceImage(null)}
                  className="px-2.5 py-1 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
                >
                  Clear Photo
                </button>
                <button
                  onClick={startCamera}
                  className="flex items-center space-x-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg border border-slate-200 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retake Webcam</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full text-xs">
                <button
                  onClick={startCamera}
                  className="text-blue-600 hover:text-blue-700 font-semibold flex items-center space-x-1 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Start Camera</span>
                </button>
                <button
                  onClick={() => {
                    setLiveFaceImage('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80');
                    soundFx.playScanBeep();
                  }}
                  className="text-slate-500 hover:text-slate-700 text-[11px] underline cursor-pointer"
                >
                  Use sample traveler photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= STEP 3: Run AI Inspection Trigger (Bento Card) ================= */}
      <div className="bg-[#0a1628] rounded-2xl border border-slate-800 p-5 text-white shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-base font-bold text-white font-['Chakra_Petch',sans-serif] tracking-wider flex items-center justify-center md:justify-start space-x-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>EXECUTE DEEPFAKE DEFUSE MULTI-VECTOR AUDIT</span>
            </h3>
            <p className="text-xs text-slate-300">
              Evaluates GAN boundary gradients, font kerning anomalies, modified DOB, fluorescence stamp chemical integrity, and live biometric 3D facial vectors.
            </p>
          </div>

          <button
            id="run-ai-scan-btn"
            disabled={!docImage || isAnalyzing}
            onClick={runAnalysis}
            className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer ${
              !docImage || isAnalyzing
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>SCREENING IN PROGRESS...</span>
              </>
            ) : (
              <>
                <Fingerprint className="w-4 h-4 text-cyan-300" />
                <span>START AI SCREENING</span>
              </>
            )}
          </button>
        </div>

        {/* Scan Progress Bar */}
        {isAnalyzing && (
          <div className="mt-4 pt-4 border-t border-blue-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan-300 font-mono animate-pulse">{currentAnalysisStep}</span>
              <span className="font-mono font-bold text-white">{analysisProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-blue-900">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= STEP 4: Analysis Dashboard Result Bento Section ================= */}
      {analysisResult && (
        <div id="analysis-results-card" className="space-y-5">
          {/* Top Result Banner Bento Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {analysisResult.id}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {analysisResult.timestamp}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-1 font-['Chakra_Petch',sans-serif] tracking-wide">
                DOCUMENT &amp; IDENTITY FORENSIC RESULTS
              </h3>
            </div>

            {/* Overall Risk Assessment Badge with RED / YELLOW / GREEN */}
            <div className="flex items-center space-x-3">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Risk Level:</span>
              {analysisResult.overallRisk === 'High' && (
                <div className="px-4 py-2 rounded-full bg-red-600 text-white font-extrabold text-xs tracking-wider shadow-md shadow-red-500/20 flex items-center space-x-1.5 animate-pulse">
                  <ShieldAlert className="w-4 h-4 text-white" />
                  <span>HIGH RISK // DETENTION RECOMMENDED</span>
                </div>
              )}
              {analysisResult.overallRisk === 'Medium' && (
                <div className="px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs tracking-wider shadow-md shadow-amber-500/20 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-slate-950" />
                  <span>MEDIUM RISK // SECONDARY INSPECTION</span>
                </div>
              )}
              {analysisResult.overallRisk === 'Low' && (
                <div className="px-4 py-2 rounded-full bg-emerald-600 text-white font-extrabold text-xs tracking-wider shadow-md shadow-emerald-500/20 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>LOW RISK // ENTRY APPROVED</span>
                </div>
              )}
            </div>
          </div>

          {/* Primary Metrics Bento Grid (Scores, Risk, Blacklist Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* 1. Tamper Detection Score Bento Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Tamper Score</span>
                <span className={`text-xs font-bold ${
                  analysisResult.tamperScore > 60 ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded-md' :
                  analysisResult.tamperScore > 25 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md' :
                  'text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md'
                }`}>
                  {analysisResult.tamperScore > 60 ? 'Altered' : analysisResult.tamperScore > 25 ? 'Suspicious' : 'Authentic'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {analysisResult.tamperScore}%
                </span>
                <span className="text-xs text-slate-400">Probability</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className={`w-9 h-9 rounded-full border-3 flex items-center justify-center font-bold text-[10px] ${
                  analysisResult.tamperScore > 60 ? 'border-red-500 text-red-600' :
                  analysisResult.tamperScore > 25 ? 'border-amber-500 text-amber-600' :
                  'border-emerald-500 text-emerald-600'
                }`}>
                  {analysisResult.tamperScore}%
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                  analysisResult.tamperScore > 60 ? 'bg-red-50 text-red-700' :
                  analysisResult.tamperScore > 25 ? 'bg-amber-50 text-amber-700' :
                  'bg-emerald-50 text-emerald-700'
                }`}>
                  {analysisResult.tamperScore > 60 ? 'Manipulated Document' : 'Official Credentials'}
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full ${
                    analysisResult.tamperScore > 60 ? 'bg-red-500' :
                    analysisResult.tamperScore > 25 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${analysisResult.tamperScore}%` }}
                />
              </div>
            </div>

            {/* 2. Face Match Score Bento Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Face Match</span>
                <span className={`text-xs font-bold ${
                  analysisResult.faceMatchScore >= 80 ? 'text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md' :
                  analysisResult.faceMatchScore >= 50 ? 'text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md' :
                  'text-red-600 bg-red-50 px-2 py-0.5 rounded-md'
                }`}>
                  {analysisResult.faceMatchScore >= 80 ? 'High' : analysisResult.faceMatchScore >= 50 ? 'Borderline' : 'Mismatch'}
                </span>
              </div>
              <div className="flex items-baseline gap-2 my-2">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {analysisResult.faceMatchScore}%
                </span>
                <span className="text-xs text-slate-400">Confidence</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="w-9 h-9 rounded-full border-3 border-blue-500 border-t-transparent flex items-center justify-center font-bold text-[10px] text-blue-600">
                  {analysisResult.faceMatchScore}%
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                  analysisResult.faceMatchScore >= 80 ? 'bg-blue-50 text-blue-700' :
                  analysisResult.faceMatchScore >= 50 ? 'bg-amber-50 text-amber-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  {analysisResult.faceMatchScore >= 80 ? 'Verified Subject' : 'Unconfirmed'}
                </div>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-3">
                <div 
                  className={`h-full ${
                    analysisResult.faceMatchScore >= 80 ? 'bg-blue-500' :
                    analysisResult.faceMatchScore >= 50 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${analysisResult.faceMatchScore}%` }}
                />
              </div>
            </div>

            {/* 3. Overall Risk Assessment Bento Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Risk Assessment</span>
              <div className="flex flex-col items-center justify-center py-2">
                <div className={`text-white px-5 py-2 rounded-full font-bold text-sm tracking-wide shadow-md ${
                  analysisResult.overallRisk === 'High' ? 'bg-red-600 shadow-red-500/20' :
                  analysisResult.overallRisk === 'Medium' ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' :
                  'bg-emerald-600 shadow-emerald-500/20'
                }`}>
                  {analysisResult.overallRisk.toUpperCase()} RISK
                </div>
                <p className="text-[10px] mt-2 text-slate-400 text-center italic">
                  {analysisResult.overallRisk === 'High' ? 'Flagged for port-of-entry detention' :
                   analysisResult.overallRisk === 'Medium' ? 'Direct to secondary interview' :
                   'Cleared for transit entry'}
                </p>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    analysisResult.overallRisk === 'High' ? 'bg-red-500 w-[95%]' :
                    analysisResult.overallRisk === 'Medium' ? 'bg-amber-500 w-[55%]' :
                    'bg-emerald-500 w-[12%]'
                  }`}
                />
              </div>
            </div>

            {/* 4. Blacklist Status Bento Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-slate-400 font-bold tracking-wider">Blacklist Status</span>
                <span className="text-xs text-slate-400 font-mono">NCRB / ICJS</span>
              </div>
              <div className="flex items-center gap-3 my-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  analysisResult.blacklistStatus === 'Flagged' ? 'bg-red-100 text-red-600' :
                  analysisResult.blacklistStatus === 'Warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {analysisResult.blacklistStatus === 'Flagged' ? (
                    <AlertOctagon className="w-5 h-5" />
                  ) : analysisResult.blacklistStatus === 'Warning' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className={`font-bold text-base leading-none ${
                    analysisResult.blacklistStatus === 'Flagged' ? 'text-red-700' :
                    analysisResult.blacklistStatus === 'Warning' ? 'text-amber-700' :
                    'text-slate-800'
                  }`}>
                    {analysisResult.blacklistStatus.toUpperCase()}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px]">
                    {analysisResult.blacklistReason || 'No watchlist hits found'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400">Queried NCRB / ICJS Database</span>
            </div>
          </div>

          {/* ================= BIOMETRIC COMPARISON VIEW (Document Left, Webcam Right, Match Score) ================= */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                  <ScanFace className="w-4 h-4 text-blue-600" />
                  <span>Biometric Facial Comparison (ICAO ISO/IEC 19794-5)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Direct cross-verification between authentic document photo and live border checkpoint webcam capture
                </p>
              </div>
              <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                analysisResult.faceMatchScore >= 80 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : analysisResult.faceMatchScore >= 50 
                  ? 'bg-amber-50 text-amber-800 border-amber-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                MATCH: {analysisResult.faceMatchScore}%
              </span>
            </div>

            {/* Comparison view layout: Document Photo (Left), Match Score (Center), Webcam Capture (Right) */}
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
                    src={analysisResult.documentPhotoUrl || analysisResult.documentImageUrl}
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
                    {analysisResult.documentType}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {analysisResult.extractedInfo.documentNumber}
                  </span>
                </div>
              </div>

              {/* CENTER: Match Score Gauge & Indicators */}
              <div className="flex flex-col items-center justify-center px-4 py-2 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Biometric Facial Match Score
                </span>

                <div className="my-3 flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-bold shadow-sm transition-all ${
                    analysisResult.faceMatchScore >= 80 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-500/10' 
                      : analysisResult.faceMatchScore >= 50 
                      ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-amber-500/10' 
                      : 'border-red-500 bg-red-50 text-red-700 shadow-red-500/10'
                  }`}>
                    <span className="text-3xl font-black font-mono leading-none">{analysisResult.faceMatchScore}%</span>
                    <span className="text-[9px] font-mono uppercase tracking-wider font-semibold mt-1">MATCH</span>
                  </div>
                </div>

                <div className="mt-1">
                  {analysisResult.faceMatchScore >= 80 ? (
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>MATCH VERIFIED</span>
                    </span>
                  ) : analysisResult.faceMatchScore >= 50 ? (
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
                  {analysisResult.faceMatchScore >= 80
                    ? 'Nodal distance & facial landmark vectors match traveler identity.'
                    : analysisResult.faceMatchScore >= 50
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
                  {analysisResult.liveFaceImageUrl ? (
                    <img
                      src={analysisResult.liveFaceImageUrl}
                      alt="Webcam Capture"
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-2 text-center">
                      <Fingerprint className="w-8 h-8 mb-1 text-slate-500" />
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
                    SSB Border Terminal Scan
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {analysisResult.timestamp.split(' ')[0]}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Extracted Information Detailed Bento Card (Showing Document Photo next to extracted info) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-800 text-sm">Extracted Identity Information</h4>
              </div>
              <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md font-semibold">
                Type: {analysisResult.documentType}
              </span>
            </div>

            {/* Layout: Document Photo on Left, next to Extracted Info Grid */}
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              {/* Document Photo Card with 'Document Photo' label */}
              <div className="w-[150px] shrink-0 self-center sm:self-start">
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                  <IdCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Document Photo</span>
                </div>
                <div className="w-[150px] h-[200px] rounded-lg border-2 border-slate-300 shadow-sm overflow-hidden bg-[#e0ecf8] relative group">
                  <img
                    src={analysisResult.documentPhotoUrl || analysisResult.documentImageUrl}
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

              {/* Extracted Info Fields */}
              <div className="flex-1 w-full space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Full Name</span>
                    <span className="font-semibold text-slate-800 mt-1 block truncate">{analysisResult.extractedInfo.fullName}</span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Date of Birth (DOB)</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="font-semibold text-slate-800">{analysisResult.extractedInfo.dob}</span>
                      {!analysisResult.extractedInfo.originalDobMatch && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-mono font-bold">
                          MODIFIED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Document Number</span>
                    <span className="font-mono font-bold text-blue-700 mt-1 block">
                      {analysisResult.extractedInfo.documentNumber}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Expiry Date</span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <span className="font-semibold text-slate-800">{analysisResult.extractedInfo.expiryDate}</span>
                      {analysisResult.extractedInfo.isExpired && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-red-700 font-mono font-bold">
                          EXPIRED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Issuing Country</span>
                    <span className="font-semibold text-slate-800 mt-1 block">
                      {analysisResult.extractedInfo.issuingCountry}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Gender / Nationality</span>
                    <span className="font-semibold text-slate-800 mt-1 block">
                      {analysisResult.extractedInfo.gender} / {analysisResult.extractedInfo.nationality}
                    </span>
                  </div>
                </div>

                {/* MRZ Optical Zone Display */}
                {analysisResult.extractedInfo.mrzLine1 && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
                    <div className="text-[9px] text-slate-400 mb-1 uppercase font-sans font-semibold">Optical MRZ Character String:</div>
                    <div className="tracking-wider">{analysisResult.extractedInfo.mrzLine1}</div>
                    <div className="tracking-wider">{analysisResult.extractedInfo.mrzLine2}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Forensic Checks Breakdown Bento Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Deepfake Defuse Forensic Vectors Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysisResult.forensicChecks.map((check) => (
                <div 
                  key={check.id}
                  className={`p-3.5 rounded-xl border text-xs transition-colors ${
                    check.passed 
                      ? 'bg-slate-50/70 border-slate-200 text-slate-700' 
                      : 'bg-red-50/60 border-red-200 text-red-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span className="font-bold text-slate-800">{check.name}</span>
                    </div>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                      check.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {check.score}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{check.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bar Bento Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenDossier(analysisResult)}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>View Full Forensic Dossier</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Print Certificate</span>
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {savedSuccess ? (
                <span className="text-xs font-mono text-emerald-700 font-semibold flex items-center space-x-1 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Scan Saved to History Log!</span>
                </span>
              ) : (
                <button
                  id="save-to-history-btn"
                  onClick={handleSaveToLog}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Save to History Log
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
