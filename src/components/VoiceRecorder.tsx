import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { requestSaarasStt } from '../utils/audio';

interface VoiceRecorderProps {
  onTranscribed: (text: string) => void;
  languageCode?: string;
  buttonLabel?: string;
  compact?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscribed,
  languageCode = 'hi-IN',
  buttonLabel,
  compact = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });

        setIsProcessing(true);
        try {
          const transcript = await requestSaarasStt(audioBlob, languageCode);
          if (transcript) {
            onTranscribed(transcript);
          }
        } catch (error) {
          console.error('Saaras transcription error:', error);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  if (compact) {
    return (
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        title={isRecording ? 'Stop recording' : 'Voice input with Saaras STT'}
        className={`p-2 rounded-lg transition-all flex items-center justify-center shrink-0 ${
          isRecording
            ? 'bg-rose-600 text-white animate-pulse'
            : isProcessing
            ? 'bg-slate-100 text-slate-400 cursor-wait'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        ) : isRecording ? (
          <Square className="w-4 h-4 fill-current" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
          isRecording
            ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
            : isProcessing
            ? 'bg-slate-100 text-slate-500 cursor-wait'
            : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-blue-700" />
            <span>Transcribing with Saaras...</span>
          </>
        ) : isRecording ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop ({recordingSeconds}s)</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4 text-blue-700" />
            <span>{buttonLabel || 'Speak (Saaras STT)'}</span>
          </>
        )}
      </button>
    </div>
  );
};
