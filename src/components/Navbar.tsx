import React from 'react';
import { Language } from '../types';
import { Volume2, Mic, Eye, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'schemes' | 'kyc' | 'form' | 'chat';
  setActiveTab: (tab: 'schemes' | 'kyc' | 'form' | 'chat') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isSpeaking: boolean;
  onStopSpeaking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  isSpeaking,
  onStopSpeaking
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 via-blue-900 to-emerald-700 flex items-center justify-center shadow-xs">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                {language === 'hi' ? 'सरकारी सहायक' : 'Sarkari Sahayak'}
              </span>
              <span className="text-xs text-slate-700 font-medium whitespace-nowrap">
                {language === 'hi' ? 'योजना सारथी · सर्वम AI' : 'Scheme Journey Agent · Sarvam AI'}
              </span>
            </div>
          </div>

          {/* Zone 2: 4 Clean Single-line Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => setActiveTab('schemes')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'schemes' ? 'text-blue-950 border-blue-800 font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'योजना खोज' : 'Scheme Finder'}
            </button>
            <button
              onClick={() => setActiveTab('kyc')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'kyc' ? 'text-blue-950 border-blue-800 font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'दस्तावेज़ स्कैनर (Vision)' : 'KYC Scanner (Vision)'}
            </button>
            <button
              onClick={() => setActiveTab('form')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'form' ? 'text-blue-950 border-blue-800 font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'फॉर्म सहायक (Bulbul)' : 'Form Guide (Bulbul)'}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`hover:text-blue-900 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'chat' ? 'text-blue-950 border-blue-800 font-semibold' : 'border-transparent'
              }`}
            >
              {language === 'hi' ? 'सार्वम 105B सहायक' : 'Sarvam 105B Assistant'}
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action (Language & Audio controller) */}
          <div className="flex items-center gap-3 shrink-0">
            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
                title="Stop speaking"
              >
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-amber-700" />
                <span className="whitespace-nowrap">{language === 'hi' ? 'रोकें' : 'Mute'}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'hi'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-2 bg-slate-50 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`py-1 px-2 rounded-sm ${activeTab === 'schemes' ? 'text-blue-900 font-bold bg-white' : ''}`}
        >
          {language === 'hi' ? 'योजनाएं' : 'Schemes'}
        </button>
        <button
          onClick={() => setActiveTab('kyc')}
          className={`py-1 px-2 rounded-sm ${activeTab === 'kyc' ? 'text-blue-900 font-bold bg-white' : ''}`}
        >
          {language === 'hi' ? 'दस्तावेज़' : 'KYC'}
        </button>
        <button
          onClick={() => setActiveTab('form')}
          className={`py-1 px-2 rounded-sm ${activeTab === 'form' ? 'text-blue-900 font-bold bg-white' : ''}`}
        >
          {language === 'hi' ? 'फॉर्म' : 'Form'}
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`py-1 px-2 rounded-sm ${activeTab === 'chat' ? 'text-blue-900 font-bold bg-white' : ''}`}
        >
          {language === 'hi' ? 'सहायक' : 'Agent'}
        </button>
      </div>
    </header>
  );
};
