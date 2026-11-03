import React, { useState } from 'react';
import { Scheme } from '../data/schemes';
import { Language } from '../types';
import { VoiceRecorder } from './VoiceRecorder';
import { Search, Volume2, ArrowRight, CheckCircle2, FileText, Building2, Sparkles, Filter } from 'lucide-react';

interface SchemeFinderProps {
  schemes: Scheme[];
  language: Language;
  onSelectScheme: (scheme: Scheme) => void;
  onStartApplication: (scheme: Scheme) => void;
  onSpeakText: (text: string) => void;
}

export const SchemeFinder: React.FC<SchemeFinderProps> = ({
  schemes,
  language,
  onSelectScheme,
  onStartApplication,
  onSpeakText
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Agriculture',
    'Healthcare',
    'Skill & Artisan',
    'Housing',
    'Women & Child',
    'Pension'
  ];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.nameEn.toLowerCase().includes(q) ||
      s.nameHi.toLowerCase().includes(q) ||
      s.descriptionEn.toLowerCase().includes(q) ||
      s.descriptionHi.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const handleVoiceSearch = (transcript: string) => {
    setSearchQuery(transcript);
  };

  return (
    <div className="space-y-6">
      {/* Hero Civic Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <span>{language === 'hi' ? 'आधिकारिक सरकारी कल्याणकारी योजनाएं' : 'Official Government Welfare Schemes'}</span>
            <span aria-hidden="true">·</span>
            <span>{language === 'hi' ? 'सार्वम 105B आरएजी आधारित' : 'Powered by Sarvam-105B RAG'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white text-balance">
            {language === 'hi'
              ? 'अपनी पात्रता जानें, दस्तावेज़ जांचें व योजना लाभ प्राप्त करें'
              : 'Discover Eligible Central Welfare Schemes & Verified Benefits'}
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            {language === 'hi'
              ? 'किसान, कारीगर, महिला, श्रमिक और वरिष्ठ नागरिकों हेतु प्रत्यक्ष लाभ अंतरण (DBT) योजनाओं की आधिकारिक जानकारी। दस्तावेज़ स्कैन करें और बोलकर फ़ॉर्म भरें।'
              : 'Verified directory of Indian Direct Benefit Transfer (DBT) and welfare schemes for farmers, artisans, women, and families with automated KYC parsing.'}
          </p>

          {/* Search Bar with Saaras Voice Input */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'hi'
                    ? 'योजना का नाम या आवश्यकता खोजें (उदा. किसान, मकान, कारीगर)...'
                    : 'Search scheme or criteria (e.g. farmer, artisan, housing, pension)...'
                }
                className="w-full pl-10 pr-4 py-2.5 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:bg-white/15 transition-all"
              />
            </div>
            <VoiceRecorder
              onTranscribed={handleVoiceSearch}
              languageCode={language === 'hi' ? 'hi-IN' : 'en-IN'}
              buttonLabel={language === 'hi' ? 'बोलकर खोजें' : 'Voice Search'}
            />
          </div>
        </div>
      </div>

      {/* Category Segmented Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-blue-950 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
          >
            <div className="p-5 space-y-3.5">
              {/* Category & Ministry */}
              <div className="flex items-start justify-between gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-900">{scheme.category}</span>
                <span className="truncate max-w-[180px] text-right">
                  {language === 'hi' ? scheme.ministryHi : scheme.ministryEn}
                </span>
              </div>

              {/* Title */}
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {language === 'hi' ? scheme.nameHi : scheme.nameEn}
                </h3>
                {language === 'hi' && (
                  <p className="text-xs text-slate-500 mt-0.5">{scheme.nameEn}</p>
                )}
              </div>

              {/* Benefit Amount Pill-free Header */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  {language === 'hi' ? 'योजना लाभ राशि' : 'Direct Benefit'}
                </span>
                <span className="text-base font-bold text-emerald-700 font-mono tabular-nums">
                  {scheme.benefitAmount}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {language === 'hi' ? scheme.descriptionHi : scheme.descriptionEn}
              </p>

              {/* Key Eligibility Criteria */}
              <div className="space-y-1.5 pt-1 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'प्रमुख पात्रता शर्तें:' : 'Eligibility Criteria:'}
                </span>
                <ul className="text-xs text-slate-600 space-y-1">
                  {(language === 'hi'
                    ? scheme.eligibilityCriteria.specialRequirementsHi
                    : scheme.eligibilityCriteria.specialRequirementsEn
                  ).slice(0, 2).map((req, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mandatory Documents Checklist */}
              <div className="space-y-1 pt-1">
                <span className="text-xs font-semibold text-slate-700 block">
                  {language === 'hi' ? 'अनिवार्य दस्तावेज़:' : 'Mandatory Documents:'}
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs text-slate-500">
                  {scheme.requiredDocuments
                    .filter((d) => d.mandatory)
                    .map((doc, idx) => (
                      <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {language === 'hi' ? doc.nameHi : doc.nameEn}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  onSpeakText(
                    language === 'hi'
                      ? `${scheme.nameHi}। लाभ: ${scheme.benefitAmount}। विवरण: ${scheme.descriptionHi}`
                      : `${scheme.nameEn}. Benefit: ${scheme.benefitAmount}. ${scheme.descriptionEn}`
                  )
                }
                className="p-2 text-slate-600 hover:text-blue-900 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                title={language === 'hi' ? 'बुलबुल आवाज़ में सुनें' : 'Listen with Bulbul TTS'}
              >
                <Volume2 className="w-4 h-4 text-blue-700" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onSelectScheme(scheme)}
                  className="px-3 py-1.5 text-xs font-medium text-blue-950 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
                >
                  {language === 'hi' ? 'केवाईसी जांचें' : 'Scan KYC'}
                </button>
                <button
                  type="button"
                  onClick={() => onStartApplication(scheme)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-950 rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  <span>{language === 'hi' ? 'आवेदन शुरू करें' : 'Apply Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
