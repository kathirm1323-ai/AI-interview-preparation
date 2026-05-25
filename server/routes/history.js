import { Router } from 'express';
import { getInterviews, getInterview, deleteInterview } from '../database/db.js';

const router = Router();

// Get all past interviews
router.get('/', (req, res) => {
  try {
    const interviews = getInterviews();
    res.json({ success: true, data: interviews });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get a specific interview
router.get('/:id', (req, res) => {
  try {
    const interview = getInterview(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('Interview fetch error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete an interview
router.delete('/:id', (req, res) => {
  try {
    deleteInterview(req.params.id);
    res.json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    console.error('Interview delete error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
