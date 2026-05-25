import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', '..', 'interview_history.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

let db = null;

export function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    
    // Initialize schema
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
    db.exec(schema);
    console.log('✅ Database initialized');
  }
  return db;
}

export function saveInterview(interview) {
  const db = getDB();
  const stmt = db.prepare(`
    INSERT INTO interviews (id, candidate_name, domain, resume_data, total_questions, overall_score, overall_rating, report, duration)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    interview.id,
    interview.candidateName,
    interview.domain,
    JSON.stringify(interview.resumeData),
    interview.totalQuestions,
    interview.overallScore,
    interview.overallRating,
    JSON.stringify(interview.report),
    interview.duration
  );
}

export function saveAnswer(answer) {
  const db = getDB();
  const stmt = db.prepare(`
    INSERT INTO answers (interview_id, question_index, question_text, category, difficulty, answer_text, score, evaluation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    answer.interviewId,
    answer.questionIndex,
    answer.questionText,
    answer.category,
    answer.difficulty,
    answer.answerText,
    answer.score,
    JSON.stringify(answer.evaluation)
  );
}

export function getInterviews() {
  const db = getDB();
  const rows = db.prepare('SELECT * FROM interviews ORDER BY created_at DESC').all();
  return rows.map(row => ({
    ...row,
    resumeData: JSON.parse(row.resume_data || '{}'),
    report: JSON.parse(row.report || '{}'),
  }));
}

export function getInterview(id) {
  const db = getDB();
  const interview = db.prepare('SELECT * FROM interviews WHERE id = ?').get(id);
  if (!interview) return null;
  
  const answers = db.prepare('SELECT * FROM answers WHERE interview_id = ? ORDER BY question_index').all(id);
  
  return {
    ...interview,
    resumeData: JSON.parse(interview.resume_data || '{}'),
    report: JSON.parse(interview.report || '{}'),
    answers: answers.map(a => ({
      ...a,
      evaluation: JSON.parse(a.evaluation || '{}'),
    })),
  };
}

export function deleteInterview(id) {
  const db = getDB();
  db.prepare('DELETE FROM answers WHERE interview_id = ?').run(id);
  db.prepare('DELETE FROM interviews WHERE id = ?').run(id);
}
