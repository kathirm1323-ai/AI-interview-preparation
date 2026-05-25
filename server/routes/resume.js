import { Router } from 'express';
import { parseResume } from '../services/resumeParser.js';
import { reviewResume } from '../services/evaluator.js';

const router = Router();

// Parse resume text extracted from client-side PDF.js
router.post('/parse', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const resumeData = await parseResume(resumeText);
    res.json({ success: true, data: resumeData });
  } catch (error) {
    console.error('Resume parsing error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// ATS resume review
router.post('/ats-review', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'Resume text is required' });
    }

    const review = await reviewResume(resumeText, targetRole);
    res.json({ success: true, data: review });
  } catch (error) {
    console.error('ATS review error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
