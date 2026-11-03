/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { SchemeFinder } from './components/SchemeFinder';
import { KycScanner } from './components/KycScanner';
import { FormGuide } from './components/FormGuide';
import { ChatAgent } from './components/ChatAgent';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { OFFICIAL_SCHEMES, Scheme } from './data/schemes';
import { Language, VerificationResult } from './types';
import { requestBulbulTts, playBase64Audio, stopCurrentAudio } from './utils/audio';
import { ShieldCheck, Sparkles, Building2, Eye, Mic, Volume2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'schemes' | 'kyc' | 'form' | 'chat'>('schemes');
  const [language, setLanguage] = useState<Language>('hi');
  const [schemes, setSchemes] = useState<Scheme[]>(OFFICIAL_SCHEMES);
  const [selectedScheme, setSelectedScheme] = useState<Scheme>(OFFICIAL_SCHEMES[0]);
  const [verifiedKyc, setVerifiedKyc] = useState<any>(null);

  // Bulbul TTS global audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [currentTextSnippet, setCurrentTextSnippet] = useState<string>('');
  const [speaker, setSpeaker] = useState<string>('priya');

  // Load schemes from backend API
  useEffect(() => {
    fetch('/api/schemes')
      .then((res) => res.json())
      .then((data) => {
        if (data.schemes && data.schemes.length > 0) {
          setSchemes(data.schemes);
        }
      })
      .catch((err) => console.log('Using local schemes:', err));
  }, []);

  const handleSpeakText = async (text: string) => {
    if (!text.trim()) return;

    stopCurrentAudio();
    setIsPlayingAudio(false);
    setIsLoadingAudio(true);
    setCurrentTextSnippet(text);

    try {
      const langCode = language === 'hi' ? 'hi-IN' : 'en-IN';
      const audioBase64 = await requestBulbulTts(text, speaker, langCode);

      setIsLoadingAudio(false);
      setIsPlayingAudio(true);

      await playBase64Audio(
        audioBase64,
        () => {
          setIsPlayingAudio(false);
        },
        (err) => {
          console.error('Audio play error:', err);
          setIsPlayingAudio(false);
        }
      );
    } catch (error) {
      console.error('Bulbul TTS error:', error);
      setIsLoadingAudio(false);
      setIsPlayingAudio(false);
    }
  };

  const handleStopAudio = () => {
    stopCurrentAudio();
    setIsPlayingAudio(false);
    setIsLoadingAudio(false);
  };

  const handleSelectSchemeFromFinder = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setActiveTab('kyc');
  };

  const handleStartApplication = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setActiveTab('form');
  };

  const handleVerificationComplete = (result: VerificationResult) => {
    setVerifiedKyc(result.parsedKyc);
  };

  const handleProceedToForm = (scheme: Scheme, verifiedData: any) => {
    setSelectedScheme(scheme);
    setVerifiedKyc(verifiedData);
    setActiveTab('form');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isSpeaking={isPlayingAudio}
        onStopSpeaking={handleStopAudio}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {activeTab === 'schemes' && (
          <SchemeFinder
            schemes={schemes}
            language={language}
            onSelectScheme={handleSelectSchemeFromFinder}
            onStartApplication={handleStartApplication}
            onSpeakText={handleSpeakText}
          />
        )}

        {activeTab === 'kyc' && (
          <KycScanner
            schemes={schemes}
            selectedScheme={selectedScheme}
            onSelectScheme={setSelectedScheme}
            language={language}
            onVerificationComplete={handleVerificationComplete}
            onProceedToForm={handleProceedToForm}
            onSpeakText={handleSpeakText}
          />
        )}

        {activeTab === 'form' && (
          <FormGuide
            scheme={selectedScheme}
            initialData={verifiedKyc}
            language={language}
            onSpeakText={handleSpeakText}
            onSwitchToKyc={() => setActiveTab('kyc')}
          />
        )}

        {activeTab === 'chat' && (
          <ChatAgent
            schemes={schemes}
            selectedScheme={selectedScheme}
            userProfile={verifiedKyc}
            language={language}
            onSpeakText={handleSpeakText}
          />
        )}
      </main>

      {/* Sarvam AI Integrated Architecture Footer Pill-Free */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Sarkari Sahayak</span>
            <span aria-hidden="true">·</span>
            <span>Government Welfare Scheme Journey Agent</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              Sarvam-105B Reasoning
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Sarvam Vision KYC OCR
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Bulbul v3 TTS
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              Saaras v3 STT
            </span>
          </div>
        </div>
      </footer>

      {/* Persistent Audio Player Bar for Bulbul TTS */}
      <AudioPlayerBar
        isPlaying={isPlayingAudio}
        isLoading={isLoadingAudio}
        currentTextSnippet={currentTextSnippet}
        onStop={handleStopAudio}
        onReplay={() => handleSpeakText(currentTextSnippet)}
        speaker={speaker}
        onSpeakerChange={setSpeaker}
        language={language}
      />
    </div>
  );
}
