import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

let ai = null;

export function initGemini(apiKey) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key || key === 'your_gemini_api_key_here') {
    console.warn('⚠️  No Gemini API key set. Add your key to .env or pass it via the API.');
    return null;
  }
  ai = new GoogleGenAI({ apiKey: key });
  console.log('✅ Gemini API initialized');
  return ai;
}

export async function generateContent(prompt, options = {}) {
  if (!ai) {
    throw new Error('Gemini API not initialized. Please set your API key.');
  }

  try {
    const config = {
      model: options.model || 'gemini-2.5-flash',
      contents: prompt,
    };

    if (options.jsonMode) {
      config.generationConfig = {
        responseMimeType: 'application/json',
      };
    }

    if (options.systemInstruction) {
      config.config = {
        ...config.config,
        systemInstruction: options.systemInstruction,
      };
    }

    const response = await ai.models.generateContent(config);
    const text = response.text;

    if (options.jsonMode) {
      try {
        return JSON.parse(text);
      } catch {
        // Try to extract JSON from markdown code blocks
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1].trim());
        }
        throw new Error('Failed to parse JSON response from Gemini');
      }
    }

    return text;
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw error;
  }
}

export function isInitialized() {
  return ai !== null;
}

// Try to initialize on import
initGemini();
