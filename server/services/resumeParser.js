import { generateContent } from './gemini.js';
import { getSkillExtractionPrompt } from '../prompts/skillExtraction.js';

export async function parseResume(resumeText) {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text is too short or empty. Please upload a valid resume.');
  }

  const prompt = getSkillExtractionPrompt(resumeText);
  const result = await generateContent(prompt, { jsonMode: true });
  
  // Validate required fields
  if (!result.skills || !Array.isArray(result.skills)) {
    result.skills = [];
  }
  if (!result.projects || !Array.isArray(result.projects)) {
    result.projects = [];
  }
  
  return result;
}
