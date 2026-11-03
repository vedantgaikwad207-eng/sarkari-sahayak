import React from 'react';
import { Volume2, VolumeX, Play, Square, Loader2, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface AudioPlayerBarProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentTextSnippet?: string;
  onStop: () => void;
  onReplay?: () => void;
  speaker: string;
  onSpeakerChange: (spk: string) => void;
  language: Language;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  isLoading,
  currentTextSnippet,
  onStop,
  onReplay,
  speaker,
  onSpeakerChange,
  language
}) => {
  if (!isPlaying && !isLoading && !currentTextSnippet) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-2xl bg-slate-900 text-white rounded-xl shadow-xl px-4 py-3 border border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 flex items-center justify-center shrink-0">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          ) : isPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-full" />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s] h-2/3" />
              <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4/5" />
            </div>
          ) : (
            <Volume2 className="w-4 h-4 text-slate-300" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-400">Bulbul v3 TTS</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-300 capitalize">{speaker} voice</span>
          </div>
          <p className="text-xs text-slate-200 truncate max-w-md">
            {isLoading
              ? (language === 'hi' ? 'ऑडियो तैयार हो रहा है...' : 'Generating speech audio...')
              : currentTextSnippet || (language === 'hi' ? 'बोला जा रहा है...' : 'Playing spoken confirmation...')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {/* Voice Selector */}
        <select
          value={speaker}
          onChange={(e) => onSpeakerChange(e.target.value)}
          className="bg-slate-800 text-xs text-slate-300 border border-slate-700 rounded-md px-2 py-1 outline-hidden"
          title="Change Bulbul voice persona"
        >
          <option value="priya">Priya (Female - Soft)</option>
          <option value="ritu">Ritu (Female - Utility)</option>
          <option value="aditya">Aditya (Male - Clear)</option>
          <option value="rohan">Rohan (Male - Gentle)</option>
          <option value="amit">Amit (Male - Conversational)</option>
        </select>

        {isPlaying ? (
          <button
            onClick={onStop}
            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            title="Stop audio"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        ) : (
          onReplay && (
            <button
              onClick={onReplay}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              title="Play again"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )
        )}
      </div>
    </div>
  );
};
