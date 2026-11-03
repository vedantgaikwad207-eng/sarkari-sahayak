import React, { useState } from 'react';
import { Scheme } from '../data/schemes';
import { SAMPLE_KYC_DOCS, SampleKycDoc } from '../data/kycSamples';
import { VerificationResult, Language } from '../types';
import {
  Upload,
  FileCheck2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Volume2,
  ArrowRight,
  Loader2,
  FileText,
  User,
  ShieldCheck,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';

interface KycScannerProps {
  schemes: Scheme[];
  selectedScheme: Scheme;
  onSelectScheme: (scheme: Scheme) => void;
  language: Language;
  onVerificationComplete: (result: VerificationResult) => void;
  onProceedToForm: (scheme: Scheme, verifiedData: any) => void;
  onSpeakText: (text: string) => void;
}

export const KycScanner: React.FC<KycScannerProps> = ({
  schemes,
  selectedScheme,
  onSelectScheme,
  language,
  onVerificationComplete,
  onProceedToForm,
  onSpeakText
}) => {
  const [activeSample, setActiveSample] = useState<string>(SAMPLE_KYC_DOCS[0].id);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleScan = async (sampleId?: string, fileToScan?: File) => {
    setIsScanning(true);
    setVerificationResult(null);

    try {
      const formData = new FormData();
      if (fileToScan) {
        formData.append('document', fileToScan);
      } else if (sampleId) {
        formData.append('sampleId', sampleId);
      } else {
        formData.append('sampleId', activeSample);
      }
      formData.append('targetSchemeId', selectedScheme.id);

      const res = await fetch('/api/vision-extract', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Failed to parse document with Sarvam Vision');
      }

      const data: VerificationResult = await res.json();
      setVerificationResult(data);
      onVerificationComplete(data);

      // Auto-trigger Bulbul TTS readout if successful
      if (data.spokenSummaryHi) {
        onSpeakText(
          language === 'hi'
            ? data.spokenSummaryHi
            : `KYC parsing completed. Applicant ${data.parsedKyc.fullName} has been evaluated for ${selectedScheme.nameEn}. ${
                data.missingDocuments.length > 0
                  ? `Missing documents: ${data.missingDocuments.map((m) => m.nameEn).join(', ')}.`
                  : 'All required documents verified.'
              }`
        );
      }
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      handleScan(undefined, file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Target Scheme Selector Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            {language === 'hi' ? 'सत्यापन हेतु लक्षित योजना' : 'Target Scheme for Eligibility & KYC'}
          </span>
          <h2 className="text-base font-bold text-slate-900 mt-0.5">
            {language === 'hi' ? selectedScheme.nameHi : selectedScheme.nameEn}
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedScheme.id}
            onChange={(e) => {
              const s = schemes.find((sc) => sc.id === e.target.value);
              if (s) {
                onSelectScheme(s);
                if (verificationResult) {
                  // Re-evaluate on scheme switch
                  handleScan(uploadedFile ? undefined : activeSample, uploadedFile || undefined);
                }
              }
            }}
            className="w-full sm:w-auto bg-slate-50 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-3 py-2 outline-hidden focus:ring-2 focus:ring-blue-800"
          >
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {language === 'hi' ? s.nameHi : s.nameEn} ({s.benefitAmount})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Document Ingestion Zone: Two Options (Sample Persona or Custom Upload) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Sample Citizen KYC Persona Cards */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi'
                  ? 'नागरिक दस्तावेज़ चयन (सार्वम विज़न OCR)'
                  : 'Select Verified Citizen KYC (Sarvam Vision)'}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {language === 'hi' ? 'त्वरित परीक्षण हेतु' : 'One-Click Fast Test'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_KYC_DOCS.map((doc) => {
              const isSelected = activeSample === doc.id && !uploadedFile;
              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => {
                    setUploadedFile(null);
                    setActiveSample(doc.id);
                    handleScan(doc.id);
                  }}
                  className={`text-left p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-900 bg-blue-50/70 shadow-xs ring-1 ring-blue-900'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {language === 'hi' ? doc.titleHi : doc.titleEn}
                    </span>
                    <span className="text-xs font-medium text-emerald-700 block">
                      {doc.category}
                    </span>
                    <p className="text-xs text-slate-500 leading-snug line-clamp-2">
                      {language === 'hi' ? doc.descriptionHi : doc.descriptionEn}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-medium text-blue-900">
                    <span>{isSelected ? (language === 'hi' ? 'सत्यापित' : 'Active') : (language === 'hi' ? 'चुनें' : 'Select')}</span>
                    <span className="font-mono text-slate-400">96% Conf.</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* OCR Trigger button */}
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {language === 'hi'
                ? 'सार्वम विज़न आधार, खसरा, आय व राशन कार्ड से डेटा निकालता है'
                : 'Sarvam Vision extracts structured fields & checks against official scheme rules'}
            </span>
            <button
              type="button"
              onClick={() => handleScan(uploadedFile ? undefined : activeSample, uploadedFile || undefined)}
              disabled={isScanning}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-950 rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === 'hi' ? 'विज़न स्कैनिंग...' : 'Scanning with Vision...'}</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'दस्तावेज़ स्कैन करें' : 'Scan Document'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Custom Upload Dropzone */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-900" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hi' ? 'स्वयं का दस्तावेज़ अपलोड करें' : 'Upload Your Document'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'hi'
                ? 'आधार कार्ड, खसरा/खतौनी, आय प्रमाण पत्र या राशन कार्ड की फोटो अपलोड करें (JPG, PNG, PDF)।'
                : 'Upload photo of Aadhaar, Land Record, Income, or Ration Card for Sarvam Vision analysis.'}
            </p>

            <label className="border-2 border-dashed border-slate-200 hover:border-blue-900 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/20">
              <Upload className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-medium text-slate-700 text-center">
                {uploadedFile ? uploadedFile.name : (language === 'hi' ? 'फाइल चुनें या यहाँ खींचें' : 'Choose File or Drag & Drop')}
              </span>
              <span className="text-xs text-slate-400">Max 25MB · JPG, PNG, PDF</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {uploadedFile && (
            <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
              <span className="truncate max-w-[180px]">{uploadedFile.name}</span>
              <span className="font-semibold text-emerald-700">Uploaded</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Result Showcase */}
      {verificationResult && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Status Verdict Header */}
          <div
            className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              verificationResult.isEligible
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {verificationResult.isEligible ? (
                <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">
                    {verificationResult.isEligible
                      ? (language === 'hi' ? 'पात्रता सत्यापित: आप इस योजना हेतु पात्र हैं' : 'Eligibility Verified: Citizen is Eligible')
                      : (language === 'hi' ? 'पात्रता समीक्षा: कुछ आवश्यक दस्तावेज़ शेष हैं' : 'Action Required: Missing Documents Detected')}
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200">
                    {selectedScheme.benefitAmount}
                  </span>
                </div>
                <p className="text-xs text-slate-700 max-w-2xl leading-relaxed">
                  {verificationResult.spokenSummaryHi}
                </p>
              </div>
            </div>

            {/* Bulbul Spoken Readout Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onSpeakText(verificationResult.spokenSummaryHi)}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-800 hover:text-blue-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                title="Listen with Bulbul TTS"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                <span>{language === 'hi' ? 'आवाज़ में सुनें' : 'Listen Verdict'}</span>
              </button>

              <button
                type="button"
                onClick={() => onProceedToForm(selectedScheme, verificationResult.parsedKyc)}
                className="px-4 py-1.5 rounded-lg bg-blue-950 text-white text-xs font-bold hover:bg-blue-900 flex items-center gap-1 shadow-xs transition-colors"
              >
                <span>{language === 'hi' ? 'फॉर्म भरें' : 'Fill Form'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Missing Items & Verified Fields Two-Column Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Column 1: Missing Documents & Actionable Resolution (CRITICAL) */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'hi'
                      ? 'अपूर्ण आवश्यकताएं / शेष दस्तावेज़'
                      : 'Missing Requirements & Gap Analysis'}
                  </h4>
                </div>
                <span className="text-xs font-mono font-bold text-rose-600">
                  {verificationResult.missingDocuments.length} {language === 'hi' ? 'शेष' : 'Pending'}
                </span>
              </div>

              {verificationResult.missingDocuments.length === 0 ? (
                <div className="p-4 bg-emerald-50 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{language === 'hi' ? 'बधाई! इस योजना हेतु सभी आवश्यक दस्तावेज़ पूर्ण हैं।' : 'All mandatory scheme documents verified successfully!'}</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {verificationResult.missingDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-lg space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-rose-950">
                          {language === 'hi' ? doc.nameHi : doc.nameEn}
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                          {language === 'hi' ? 'अनिवार्य' : 'Required'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {language === 'hi' ? 'कहाँ से प्राप्त करें: ' : 'How to obtain: '}
                        </span>
                        <span>{doc.howToObtain}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Sarvam Vision Verified KYC Attributes */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-slate-900">
                    {language === 'hi' ? 'सत्यापित विवरण (विज़न द्वारा निष्कर्षित)' : 'Verified KYC Attributes (Sarvam Vision)'}
                  </h4>
                </div>
                <span className="text-xs font-mono text-emerald-700 font-semibold">
                  {(verificationResult.parsedKyc.confidenceScore * 100).toFixed(0)}% Confidence
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">{language === 'hi' ? 'आवेदक का नाम' : 'Full Name'}</span>
                  <span className="font-semibold text-slate-900">{verificationResult.parsedKyc.fullName}</span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">{language === 'hi' ? 'आयु / जन्म तिथि' : 'Age / DOB'}</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    {verificationResult.parsedKyc.age} Yrs ({verificationResult.parsedKyc.dateOfBirth})
                  </span>
                </div>
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">{language === 'hi' ? 'स्थान' : 'Location'}</span>
                  <span className="font-semibold text-slate-900">
                    {verificationResult.parsedKyc.district}, {verificationResult.parsedKyc.state}
                  </span>
                </div>
                {verificationResult.parsedKyc.landHoldingAcres !== undefined && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500">{language === 'hi' ? 'कृषि भूमि' : 'Land Holding'}</span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {verificationResult.parsedKyc.landHoldingAcres} Acres (Plot: {verificationResult.parsedKyc.khasraPlotNo || 'N/A'})
                    </span>
                  </div>
                )}
                {verificationResult.parsedKyc.annualIncome !== undefined && (
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500">{language === 'hi' ? 'पारिवारिक वार्षिक आय' : 'Annual Income'}</span>
                    <span className="font-semibold text-emerald-800 font-mono">
                      ₹{verificationResult.parsedKyc.annualIncome.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500">{language === 'hi' ? 'बैंक डीबीटी सीडिंग (NPCI)' : 'NPCI Aadhaar Status'}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{verificationResult.parsedKyc.npciStatus || 'Seeded'}</span>
                  </span>
                </div>
              </div>

              {verificationResult.parsedKyc.rawOcrSnippet && (
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200/60 text-xs font-mono text-slate-600 truncate">
                  <span className="font-sans font-semibold text-slate-700 block mb-0.5">OCR Raw Stream:</span>
                  {verificationResult.parsedKyc.rawOcrSnippet}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
