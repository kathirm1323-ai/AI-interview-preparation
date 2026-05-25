import { useState, useCallback, useRef } from 'react';
import { api } from '../services/api';

export function useInterview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [interviewStartTime] = useState(Date.now());
  const answersRef = useRef([]);

  const evaluateCurrentAnswer = useCallback(async (question, answerText, resumeData) => {
    setIsEvaluating(true);
    setCurrentEvaluation(null);
    try {
      const result = await api.evaluateAnswer(question, answerText, resumeData);
      const evaluation = result.data;
      setCurrentEvaluation(evaluation);

      const answerRecord = {
        question: question.question,
        answer: answerText,
        category: question.category,
        difficulty: question.difficulty,
        score: evaluation.score,
        evaluation,
      };
      answersRef.current = [...answersRef.current, answerRecord];

      return { evaluation, answerRecord };
    } catch (error) {
      console.error('Evaluation error:', error);
      const fallback = {
        score: 5, maxScore: 10, rating: 'average',
        feedback: 'Could not evaluate. Moving to next question.',
        strengths: [], improvements: [], missedTopics: [],
      };
      setCurrentEvaluation(fallback);
      const answerRecord = {
        question: question.question, answer: answerText,
        category: question.category, difficulty: question.difficulty,
        score: 5, evaluation: fallback,
      };
      answersRef.current = [...answersRef.current, answerRecord];
      return { evaluation: fallback, answerRecord };
    } finally {
      setIsEvaluating(false);
    }
  }, []);

  const moveToNext = useCallback(() => {
    setCurrentIndex(prev => prev + 1);
    setCurrentEvaluation(null);
  }, []);

  const generateReport = useCallback(async (interviewId, resumeData, candidateName, domain) => {
    setIsGeneratingReport(true);
    try {
      const duration = Math.round((Date.now() - interviewStartTime) / 1000);
      const result = await api.finalReport(interviewId, {
        candidateName,
        domain,
        resumeData,
        answers: answersRef.current,
        duration,
      });
      return result.data;
    } catch (error) {
      console.error('Report generation error:', error);
      throw error;
    } finally {
      setIsGeneratingReport(false);
    }
  }, [interviewStartTime]);

  return {
    currentIndex, setCurrentIndex,
    isEvaluating, currentEvaluation, setCurrentEvaluation,
    isGeneratingReport,
    evaluateCurrentAnswer, moveToNext, generateReport,
    getAllAnswers: () => answersRef.current,
  };
}
