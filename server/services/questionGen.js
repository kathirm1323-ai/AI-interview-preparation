import { generateContent } from './gemini.js';
import { getQuestionGenerationPrompt, getFollowUpQuestionPrompt } from '../prompts/questionGeneration.js';

export async function generateQuestions(resumeData, domain) {
  const prompt = getQuestionGenerationPrompt(resumeData, domain);
  const questions = await generateContent(prompt, { jsonMode: true });
  
  if (!Array.isArray(questions)) {
    throw new Error('Failed to generate questions. Please try again.');
  }

  // Ensure IDs are sequential
  return questions.map((q, i) => ({
    ...q,
    id: i + 1,
    timeLimit: q.timeLimit || 120,
  }));
}

export async function generateFollowUp(question, answer, resumeData) {
  const prompt = getFollowUpQuestionPrompt(question, answer, resumeData);
  const followUp = await generateContent(prompt, { jsonMode: true });
  return followUp;
}
