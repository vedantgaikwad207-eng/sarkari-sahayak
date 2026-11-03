import { Scheme } from '../data/schemes';
import { ParsedKycData, SampleKycDoc } from '../data/kycSamples';

export type Language = 'hi' | 'en';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  audioBase64?: string;
  highlightedScheme?: string;
}

export interface VerificationResult {
  parsedKyc: ParsedKycData;
  targetScheme: {
    id: string;
    nameEn: string;
    nameHi: string;
    benefitAmount: string;
  };
  verifiedFields: string[];
  missingDocuments: {
    code: string;
    nameEn: string;
    nameHi: string;
    howToObtain: string;
  }[];
  isEligible: boolean;
  eligibilityNotes: string[];
  spokenSummaryHi: string;
}
