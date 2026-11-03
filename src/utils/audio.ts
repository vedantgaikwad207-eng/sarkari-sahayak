let globalAudioInstance: HTMLAudioElement | null = null;

export async function playBase64Audio(
  base64Data: string,
  onEnded?: () => void,
  onError?: (err: any) => void
): Promise<HTMLAudioElement> {
  if (globalAudioInstance) {
    globalAudioInstance.pause();
    globalAudioInstance = null;
  }

  try {
    const audioSrc = base64Data.startsWith('data:')
      ? base64Data
      : `data:audio/wav;base64,${base64Data}`;

    const audio = new Audio(audioSrc);
    globalAudioInstance = audio;

    audio.onended = () => {
      if (globalAudioInstance === audio) {
        globalAudioInstance = null;
      }
      onEnded?.();
    };

    audio.onerror = (e) => {
      console.error('Audio playback error:', e);
      onError?.(e);
    };

    await audio.play();
    return audio;
  } catch (error) {
    console.error('Failed to play audio:', error);
    onError?.(error);
    throw error;
  }
}

export function stopCurrentAudio() {
  if (globalAudioInstance) {
    globalAudioInstance.pause();
    globalAudioInstance = null;
  }
}

export async function requestBulbulTts(
  text: string,
  speaker: string = 'priya',
  languageCode: string = 'hi-IN'
): Promise<string> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, speaker, languageCode })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `TTS request failed: ${res.status}`);
  }

  const data = await res.json();
  if (!data.audioBase64) {
    throw new Error('No audio returned from Bulbul TTS');
  }

  return data.audioBase64;
}

export async function requestSaarasStt(
  audioBlob: Blob,
  languageCode: string = 'hi-IN'
): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('languageCode', languageCode);

  const res = await fetch('/api/stt', {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `STT request failed: ${res.status}`);
  }

  const data = await res.json();
  return data.transcript || '';
}
