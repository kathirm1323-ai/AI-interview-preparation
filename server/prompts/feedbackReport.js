export function getFeedbackReportPrompt(interviewData) {
  const questionsAndAnswers = interviewData.answers.map((a, i) => {
    return `Q${i + 1} [${a.category}/${a.difficulty}]: ${a.question}
Answer: ${a.answer}
Score: ${a.score}/10`;
  }).join('\n\n');

  return `You are a senior career mentor and interview coach. Generate a comprehensive interview performance report.

CANDIDATE: ${interviewData.candidateName || 'Candidate'}
DOMAIN: ${interviewData.domain || 'General'}
TOTAL QUESTIONS: ${interviewData.answers.length}
INTERVIEW DURATION: ${interviewData.duration || 'N/A'}

QUESTIONS & ANSWERS:
${questionsAndAnswers}

Generate a comprehensive report as JSON:
{
  "overallScore": <number 1-100>,
  "overallRating": "excellent" | "good" | "average" | "needs_improvement",
  "summary": "A 3-4 sentence overall assessment of the candidate",
  "categoryScores": {
    "communication": {
      "score": <1-10>,
      "feedback": "Specific feedback on communication skills"
    },
    "technicalKnowledge": {
      "score": <1-10>,
      "feedback": "Specific feedback on technical depth"
    },
    "problemSolving": {
      "score": <1-10>,
      "feedback": "Specific feedback on analytical thinking"
    },
    "confidence": {
      "score": <1-10>,
      "feedback": "Specific feedback on confidence and delivery"
    },
    "projectUnderstanding": {
      "score": <1-10>,
      "feedback": "Specific feedback on project knowledge"
    }
  },
  "strengths": [
    "Top strength 1",
    "Top strength 2",
    "Top strength 3"
  ],
  "weaknesses": [
    "Area needing improvement 1",
    "Area needing improvement 2",
    "Area needing improvement 3"
  ],
  "recommendedTopics": [
    {
      "topic": "Topic to study",
      "reason": "Why this topic needs attention",
      "resources": "Suggested resource or approach"
    }
  ],
  "interviewTips": [
    "Actionable tip 1",
    "Actionable tip 2",
    "Actionable tip 3"
  ],
  "readinessLevel": "not_ready" | "needs_practice" | "almost_ready" | "interview_ready",
  "nextSteps": "Personalized 2-3 sentence recommendation for what to do next"
}

RULES:
1. overallScore should be calculated from individual question scores.
2. Be encouraging but honest — highlight growth areas clearly.
3. recommendedTopics should be specific to weak areas found in answers.
4. interviewTips should be actionable and specific to this candidate.
5. Return ONLY the JSON object.`;
}

export function getATSReviewPrompt(resumeText, targetRole) {
  return `You are an ATS (Applicant Tracking System) expert and resume reviewer. Score this resume for the target role.

RESUME TEXT:
---
${resumeText}
---

TARGET ROLE: ${targetRole || 'Software Engineer'}

Analyze and return JSON:
{
  "atsScore": <1-100>,
  "formatting": {
    "score": <1-10>,
    "issues": ["issue1", "issue2"]
  },
  "keywords": {
    "found": ["keyword1", "keyword2"],
    "missing": ["missing keyword1", "missing keyword2"],
    "score": <1-10>
  },
  "content": {
    "score": <1-10>,
    "strengths": ["strength1"],
    "improvements": ["improvement1"]
  },
  "suggestions": [
    "Specific actionable suggestion 1",
    "Specific actionable suggestion 2"
  ],
  "overallFeedback": "2-3 sentence summary of the resume quality"
}

Return ONLY the JSON object.`;
}
