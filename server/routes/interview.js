import { Router } from 'express';
import { generateQuestions, generateFollowUp } from '../services/questionGen.js';
import { evaluateAnswer, generateFinalReport } from '../services/evaluator.js';
import { saveInterview, saveAnswer } from '../database/db.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// Generate interview questions from resume data
router.post('/generate-questions', async (req, res) => {
  try {
    const { resumeData, domain } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: 'Resume data is required' });
    }

    const questions = await generateQuestions(resumeData, domain);
    const interviewId = uuidv4();

    res.json({
      success: true,
      data: {
        interviewId,
        questions,
        totalQuestions: questions.length,
      },
    });
  } catch (error) {
    console.error('Question generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Evaluate a single answer
router.post('/evaluate-answer', async (req, res) => {
  try {
    const { question, answer, resumeData } = req.body;
    if (!question || answer === undefined) {
      return res.status(400).json({ error: 'Question and answer are required' });
    }

    const evaluation = await evaluateAnswer(question, answer, resumeData);
    res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error('Answer evaluation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generate a follow-up question
router.post('/follow-up', async (req, res) => {
  try {
    const { question, answer, resumeData } = req.body;
    const followUp = await generateFollowUp(question, answer, resumeData);
    res.json({ success: true, data: followUp });
  } catch (error) {
    console.error('Follow-up error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generate final interview report and save to database
router.post('/final-report', async (req, res) => {
  try {
    const { interviewId, interviewData } = req.body;
    if (!interviewData || !interviewData.answers) {
      return res.status(400).json({ error: 'Interview data with answers is required' });
    }

    const report = await generateFinalReport(interviewData);

    // Save to database
    try {
      saveInterview({
        id: interviewId,
        candidateName: interviewData.candidateName,
        domain: interviewData.domain,
        resumeData: interviewData.resumeData || {},
        totalQuestions: interviewData.answers.length,
        overallScore: report.overallScore,
        overallRating: report.overallRating,
        report,
        duration: interviewData.duration || 0,
      });

      interviewData.answers.forEach((a, i) => {
        saveAnswer({
          interviewId,
          questionIndex: i,
          questionText: a.question,
          category: a.category,
          difficulty: a.difficulty,
          answerText: a.answer,
          score: a.score,
          evaluation: a.evaluation || {},
        });
      });
    } catch (dbError) {
      console.error('Database save error (non-fatal):', dbError.message);
    }

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('Final report error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
