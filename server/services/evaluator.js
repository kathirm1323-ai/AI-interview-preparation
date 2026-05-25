import { generateContent } from './gemini.js';
import { getAnswerEvaluationPrompt } from '../prompts/answerEvaluation.js';
import { getFeedbackReportPrompt, getATSReviewPrompt } from '../prompts/feedbackReport.js';

export async function evaluateAnswer(question, answer, resumeData) {
  if (!answer || answer.trim().length < 5) {
    return {
      score: 0,
      maxScore: 10,
      rating: 'poor',
      feedback: 'No answer provided or answer was too short.',
      strengths: [],
      improvements: ['Provide a more detailed answer'],
      missedTopics: question.expectedTopics || [],
      sampleAnswer: 'Please attempt to answer the question.',
    };
  }

  const prompt = getAnswerEvaluationPrompt(question, answer, resumeData);
  const evaluation = await generateContent(prompt, { jsonMode: true });
  return evaluation;
}

export async function generateFinalReport(interviewData) {
  const prompt = getFeedbackReportPrompt(interviewData);
  const report = await generateContent(prompt, { jsonMode: true });
  return report;
}

export async function reviewResume(resumeText, targetRole) {
  const prompt = getATSReviewPrompt(resumeText, targetRole);
  const review = await generateContent(prompt, { jsonMode: true });
  return review;
}
