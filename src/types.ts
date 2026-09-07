export type DocumentType = 'Indian Passport' | 'Aadhaar Card' | 'Indian Visa' | 'PAN Card';

export type RiskLevel = 'Low' | 'Medium' | 'High';

export type BlacklistStatus = 'Clear' | 'Warning' | 'Flagged';

export interface ForensicCheck {
  id: string;
  name: string;
  category: 'Photo/Biometrics' | 'Typography/DOB' | 'Security Foil' | 'Stamp/Inks' | 'MRZ/Database';
  passed: boolean;
  score: number; // 0-100 (100 = optimal authenticity)
  details: string;
  flaggedArea?: { x: number; y: number; width: number; height: number; label: string };
}

export interface ExtractedInfo {
  fullName: string;
  dob: string;
  originalDobMatch: boolean;
  documentNumber: string;
  expiryDate: string;
  isExpired: boolean;
  issuingCountry: string;
  countryCode: string;
  gender: 'M' | 'F' | 'X';
  nationality: string;
  mrzLine1?: string;
  mrzLine2?: string;
  mrzValid: boolean;
}

export interface ScanRecord {
  id: string;
  timestamp: string;
  documentType: DocumentType;
  documentImageUrl: string;
  documentPhotoUrl?: string; // Formal 150x200 passport headshot
  liveFaceImageUrl?: string; // Live webcam capture
  extractedInfo: ExtractedInfo;
  tamperScore: number; // 0-100 (high = tampered)
  faceMatchScore: number; // 0-100 (high = match)
  overallRisk: RiskLevel;
  blacklistStatus: BlacklistStatus;
  blacklistReason?: string;
  officerId: string;
  inspectionNotes?: string;
  forensicChecks: ForensicCheck[];
  status: 'Approved' | 'Flagged' | 'Under Secondary Review' | 'Detained';
}
