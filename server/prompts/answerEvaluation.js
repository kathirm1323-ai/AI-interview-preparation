export function getAnswerEvaluationPrompt(question, answer, resumeData) {
  return `You are an expert technical interviewer evaluating a candidate's answer.

QUESTION: "${question.question}"
CATEGORY: ${question.category}
DIFFICULTY: ${question.difficulty}
EXPECTED TOPICS: ${question.expectedTopics?.join(', ')}
RELATED SKILL: ${question.relatedSkill}

CANDIDATE'S ANSWER: "${answer}"

CANDIDATE'S BACKGROUND:
- Skills: ${resumeData.skills?.join(', ')}
- Experience Level: ${resumeData.experience?.length > 0 ? 'Experienced' : 'Fresher'}

Evaluate the answer and return a JSON object:
{
  "score": <number 1-10>,
  "maxScore": 10,
  "rating": "excellent" | "good" | "average" | "needs_improvement" | "poor",
  "feedback": "Detailed 2-3 sentence feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "missedTopics": ["topic the candidate should have mentioned"],
  "sampleAnswer": "A brief ideal answer for reference (2-3 sentences)"
}

SCORING GUIDE:
- 9-10: Exceptional answer covering all expected topics with depth
- 7-8: Good answer covering most topics with adequate depth
- 5-6: Average answer with some relevant points but missing key topics
- 3-4: Below average, shows basic understanding but lacks depth
- 1-2: Poor answer, incorrect or irrelevant

RULES:
1. Be fair but honest — this is a learning tool.
2. Score relative to the question difficulty.
3. Give actionable improvement suggestions.
4. The sampleAnswer should be concise but complete.
5. Return ONLY the JSON object.`;
}
