import React, { useState, useEffect } from 'react';
import { Scheme } from '../data/schemes';
import { Language } from '../types';
import {
  Volume2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  Building,
  User,
  Shield,
  Printer,
  Sparkles,
  HelpCircle,
  Clock
} from 'lucide-react';

interface FormGuideProps {
  scheme: Scheme;
  initialData?: any;
  language: Language;
  onSpeakText: (text: string) => void;
  onSwitchToKyc: () => void;
}

export const FormGuide: React.FC<FormGuideProps> = ({
  scheme,
  initialData,
  language,
  onSpeakText,
  onSwitchToKyc
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationRef, setApplicationRef] = useState('');

  // Auto-populate from Sarvam Vision KYC data
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        applicantName: initialData.fullName || prev.applicantName || '',
        aadhaarNumber: initialData.documentNumber || prev.aadhaarNumber || '9182-3746-1928',
        gender: initialData.gender || prev.gender || 'Male',
        state: initialData.state || prev.state || 'Uttar Pradesh',
        district: initialData.district || prev.district || 'Varanasi',
        khasraNumber: initialData.khasraPlotNo || prev.khasraNumber || '142/3B',
        landAreaAcres: initialData.landHoldingAcres || prev.landAreaAcres || 1.8,
        accountNumber: initialData.bankAccountNo || prev.accountNumber || '918237461928',
        ifscCode: initialData.ifscCode || prev.ifscCode || 'SBIN0001234',
        npciSeeded: initialData.npciStatus === 'Seeded / Active' ? 'Yes - Verified' : 'Pending Verification',
        tradeName: initialData.occupation || prev.tradeName || 'Carpenter (सुथार)',
        annualIncome: initialData.annualIncome || prev.annualIncome || 95000,
        experienceYears: 12,
        loanAmountNeeded: 100000,
        toolkitChoice: 'Advanced Woodworking Toolkit',
        pensionTier: '₹3,000 / Month',
        nomineeName: initialData.fatherOrSpouseName || 'Family Member',
        houseType: 'Kutcha (कच्चा/मिट्टी)',
        landOwnershipStatus: 'Own Land (निजी भूमि)'
      }));
    }
  }, [initialData]);

  const currentStep = scheme.formSteps[currentStepIndex] || scheme.formSteps[0];
  const totalSteps = scheme.formSteps.length;

  const handleInputChange = (key: string, val: any) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // Bulbul TTS Spoken Confirmation for a specific field
  const speakFieldConfirmation = (fieldLabel: string, value: any) => {
    if (!value) {
      onSpeakText(
        language === 'hi'
          ? `कृपया ${fieldLabel} दर्ज करें।`
          : `Please fill in the ${fieldLabel} field.`
      );
      return;
    }

    const spokenText =
      language === 'hi'
        ? `पुष्टि: ${fieldLabel} का मान ${value} दर्ज किया गया है।`
        : `Confirmed: ${fieldLabel} is set to ${value}.`;

    onSpeakText(spokenText);
  };

  // Bulbul TTS readout for current step instructions
  const speakStepInstructions = () => {
    const stepTitle = language === 'hi' ? currentStep.titleHi : currentStep.titleEn;
    const text =
      language === 'hi'
        ? `चरण ${currentStep.stepId}: ${stepTitle}। कृपया संबंधित विवरण की जांच करें और पुष्टि करें।`
        : `Step ${currentStep.stepId}: ${stepTitle}. Please review each field and confirm.`;

    onSpeakText(text);
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Final submission
      const ref = `SS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setApplicationRef(ref);
      setIsSubmitted(true);

      const successSpeech =
        language === 'hi'
          ? `बधाई! आपका ${scheme.nameHi} का आवेदन सफलतापूर्वक दर्ज हो गया है। आपका संदर्भ नंबर है ${ref}। प्रत्यक्ष लाभ अंतरण राशि सीधे आपके बैंक खाते में भेजी जाएगी।`
          : `Congratulations! Your application for ${scheme.nameEn} has been successfully submitted with Reference ID ${ref}. Benefit funds will be disbursed via DBT.`;

      onSpeakText(successSpeech);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            {language === 'hi' ? 'आवेदन पावती (पात्रता सत्यापित)' : 'Official Application Acknowledgement'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            {language === 'hi' ? scheme.nameHi : scheme.nameEn}
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            {language === 'hi' ? 'संदर्भ संख्या:' : 'Application Ref:'}{' '}
            <span className="font-bold text-slate-900">{applicationRef}</span>
          </p>
        </div>

        {/* Summary Receipt Box */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">{language === 'hi' ? 'आवेदक का नाम' : 'Applicant Name'}</span>
            <span className="font-bold text-slate-900">{formData.applicantName || 'Ramesh Kumar'}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">{language === 'hi' ? 'वार्षिक लाभ राशि' : 'Sanctioned Benefit'}</span>
            <span className="font-bold text-emerald-700 font-mono text-sm">{scheme.benefitAmount}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-200/60">
            <span className="text-slate-500">{language === 'hi' ? 'डीबीटी बैंक खाता' : 'DBT Bank Account'}</span>
            <span className="font-bold text-slate-900 font-mono">
              •••• •••• {String(formData.accountNumber || '1928').slice(-4)} (NPCI Active)
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">{language === 'hi' ? 'सत्यापन स्थिति' : 'Verification Engine'}</span>
            <span className="font-semibold text-blue-900">Sarvam Vision + Bulbul Spoken Audit</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() =>
              onSpeakText(
                language === 'hi'
                  ? `आवेदन संदर्भ संख्या ${applicationRef}। आवेदक ${formData.applicantName || 'रमेश कुमार'}। लाभ राशि ${scheme.benefitAmount}। सत्यापन पूर्ण।`
                  : `Application reference ${applicationRef} for ${formData.applicantName || 'applicant'}. Approved benefit ${scheme.benefitAmount}.`
              )
            }
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <Volume2 className="w-4 h-4 text-blue-700" />
            <span>{language === 'hi' ? 'पावती बोलकर सुनें' : 'Listen Receipt'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStepIndex(0);
            }}
            className="w-full sm:w-auto px-5 py-2 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-lg shadow-xs transition-colors"
          >
            {language === 'hi' ? 'अन्य आवेदन भरें' : 'Start Another Application'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header with Scheme Info */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-900 font-semibold">
            <span>{scheme.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700 font-bold">{scheme.benefitAmount}</span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-0.5">
            {language === 'hi' ? scheme.nameHi : scheme.nameEn}
          </h2>
        </div>

        <button
          type="button"
          onClick={speakStepInstructions}
          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          title="Listen step instructions via Bulbul TTS"
        >
          <Volume2 className="w-3.5 h-3.5 text-blue-700" />
          <span>{language === 'hi' ? 'चरण निर्देश सुनें' : 'Listen Instructions'}</span>
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-2 text-xs font-semibold text-slate-600">
          <span>
            {language === 'hi' ? `चरण ${currentStepIndex + 1} / ${totalSteps}` : `Step ${currentStepIndex + 1} of ${totalSteps}`}
          </span>
          <span className="text-blue-900 font-bold">
            {language === 'hi' ? currentStep.titleHi : currentStep.titleEn}
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-900 h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Active Step Fields Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {language === 'hi' ? currentStep.titleHi : currentStep.titleEn}
          </h3>
          <span className="text-xs text-slate-400">
            {language === 'hi' ? 'फील्ड पुष्टि हेतु 🔊 आइकन दबाएं' : 'Click 🔊 to speak field confirmation'}
          </span>
        </div>

        <div className="space-y-4">
          {currentStep.fields.map((field) => {
            const fieldVal = formData[field.key] ?? '';
            const fieldLabel = language === 'hi' ? field.labelHi : field.labelEn;
            const fieldHelp = language === 'hi' ? field.helpTextHi : field.helpTextEn;

            return (
              <div key={field.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    {fieldLabel}
                  </label>
                  {/* Bulbul Spoken Field Confirmation Button */}
                  <button
                    type="button"
                    onClick={() => speakFieldConfirmation(fieldLabel, fieldVal)}
                    className="text-xs text-blue-800 hover:text-blue-950 flex items-center gap-1 font-medium transition-colors"
                    title={language === 'hi' ? 'इस फील्ड की आवाज़ पुष्टि सुनें' : 'Listen spoken field confirmation'}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                    <span>{language === 'hi' ? 'बोलें' : 'Speak'}</span>
                  </button>
                </div>

                {field.type === 'select' && field.options ? (
                  <select
                    value={fieldVal}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={fieldVal}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
                  />
                )}

                <p className="text-[11px] text-slate-500">{fieldHelp}</p>
              </div>
            );
          })}
        </div>

        {/* Step Navigation Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              currentStepIndex === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पिछला' : 'Previous'}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-950 hover:bg-blue-900 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <span>
              {currentStepIndex === totalSteps - 1
                ? (language === 'hi' ? 'आवेदन अंतिम सबमिट करें' : 'Submit Application')
                : (language === 'hi' ? 'अगला चरण' : 'Next Step')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
