import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import resumeRoutes from './routes/resume.js';
import interviewRoutes from './routes/interview.js';
import historyRoutes from './routes/history.js';
import { initGemini, isInitialized } from './services/gemini.js';
import { getDB } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize database
getDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiInitialized: isInitialized(),
    timestamp: new Date().toISOString(),
  });
});

// Set API key dynamically
app.post('/api/set-key', (req, res) => {
  const { apiKey } = req.body;
  if (!apiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }
  try {
    initGemini(apiKey);
    res.json({ success: true, message: 'API key set successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize Gemini with provided key' });
  }
});

// Routes
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/history', historyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║  🎤 AI Interview Assistant - Backend Server  ║
  ║  Running on http://localhost:${PORT}            ║
  ║  Gemini: ${isInitialized() ? '✅ Connected' : '⚠️  No API key'}                     ║
  ╚══════════════════════════════════════════════╝
  `);
});
