import { GoogleGenAI } from '@google/genai';

/**
 * Transcribe recorded audio with microphone using model `gemini-3.5-transcribe`
 */
export async function transcribeAudioWithGemini(
  base64AudioData: string,
  mimeType: string = 'audio/webm'
): Promise<string> {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    '';

  const ai = new GoogleGenAI(apiKey ? { apiKey } : {});

  const audioPart = {
    inlineData: {
      mimeType,
      data: base64AudioData,
    },
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-transcribe',
    contents: {
      parts: [
        audioPart,
        {
          text: 'Transcribe this educational audio recording accurately. Maintain exact speech in Amharic (አማርኛ), Afaan Oromoo, or English.'
        }
      ]
    }
  });

  return response.text?.trim() || '';
}
