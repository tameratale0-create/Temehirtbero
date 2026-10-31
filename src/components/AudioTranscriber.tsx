import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles, Volume2, Copy, Check, MessageSquare } from 'lucide-react';
import { transcribeAudioWithGemini } from '../utils/transcribe';
import { Language } from '../types';

interface AudioTranscriberProps {
  currentLang: Language;
  onTranscriptionComplete?: (text: string) => void;
  title?: string;
  placeholder?: string;
}

export const AudioTranscriber: React.FC<AudioTranscriberProps> = ({
  currentLang,
  onTranscriptionComplete,
  title = 'የድምጽ ግብረ-መልስ እና ማስታወሻ (Voice Feedback & Transcription)',
  placeholder = 'በማይክሮፎን የተናገሩት ንግግር በGemini 3.5 Transcribe ተተርጉሞ እዚህ ይጻፋል...'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  const startRecording = async () => {
    setErrorMessage('');
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleTranscribeBlob(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(
        'ማይክሮፎን መክፈት አልተቻለም። እባክዎ የአሳሽዎን የማይክሮፎን ፈቃድ ያረጋግጡ (Please allow microphone access).'
      );
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTranscribeBlob = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        if (!base64Audio) {
          throw new Error('Failed to encode audio.');
        }

        const result = await transcribeAudioWithGemini(base64Audio, blob.type || 'audio/webm');
        setTranscribedText(result);
        if (onTranscriptionComplete) {
          onTranscriptionComplete(result);
        }
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMessage('የድምጽ ግልባጭ ማከናወን አልተቻለም፡ ' + (err.message || 'ስህተት ተከስቷል'));
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!transcribedText) return;
    navigator.clipboard.writeText(transcribedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSecs = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{title}</h4>
            <p className="text-[10px] text-slate-500">
              Powered by <code className="font-mono text-emerald-800 font-bold">gemini-3.5-transcribe</code>
            </p>
          </div>
        </div>

        {transcribedText && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">ተቀድቷል</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>ጽሑፉን ቅዳ</span>
              </>
            )}
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Recording controls */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            <Mic className="w-4 h-4 text-emerald-200" />
            <span>ድምጽ መቅረጽ ጀምር (Record Voice)</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs animate-pulse"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>ቀረጻ አቁም ({formatSecs(recordingSeconds)})</span>
          </button>
        )}

        {isRecording && (
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-600">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
            <span>ማይክሮፎኑ እየቀረጸ ነው... ({formatSecs(recordingSeconds)})</span>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            <span>Gemini 3.5 ድምጹን ወደ ጽሑፍ እየተረጎመ ነው...</span>
          </div>
        )}
      </div>

      {/* Output transcription text area */}
      <div>
        <textarea
          readOnly
          rows={3}
          value={transcribedText}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50/70 text-slate-800 focus:outline-hidden leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};
