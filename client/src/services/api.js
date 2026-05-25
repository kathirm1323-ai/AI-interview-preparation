const API_BASE = 'http://localhost:3001/api';

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  health: () => request('/health'),
  setKey: (apiKey) => request('/set-key', { method: 'POST', body: JSON.stringify({ apiKey }) }),
  parseResume: (resumeText) => request('/resume/parse', { method: 'POST', body: JSON.stringify({ resumeText }) }),
  atsReview: (resumeText, targetRole) => request('/resume/ats-review', { method: 'POST', body: JSON.stringify({ resumeText, targetRole }) }),
  generateQuestions: (resumeData, domain) => request('/interview/generate-questions', { method: 'POST', body: JSON.stringify({ resumeData, domain }) }),
  evaluateAnswer: (question, answer, resumeData) => request('/interview/evaluate-answer', { method: 'POST', body: JSON.stringify({ question, answer, resumeData }) }),
  getFollowUp: (question, answer, resumeData) => request('/interview/follow-up', { method: 'POST', body: JSON.stringify({ question, answer, resumeData }) }),
  finalReport: (interviewId, interviewData) => request('/interview/final-report', { method: 'POST', body: JSON.stringify({ interviewId, interviewData }) }),
  getHistory: () => request('/history'),
  getInterview: (id) => request(`/history/${id}`),
  deleteInterview: (id) => request(`/history/${id}`, { method: 'DELETE' }),
};
