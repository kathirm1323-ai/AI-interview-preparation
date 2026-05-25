export function getQuestionGenerationPrompt(resumeData, domain, difficulty = 'mixed') {
  const skillsList = resumeData.skills?.join(', ') || 'General programming';
  const projectsList = resumeData.projects?.map(p => `${p.name}: ${p.description} (Tech: ${p.techStack?.join(', ')})`).join('\n    ') || 'No projects listed';
  const experienceList = resumeData.experience?.map(e => `${e.title} at ${e.company}`).join(', ') || 'Fresher';

  return `You are an expert technical interviewer conducting a mock interview. Generate interview questions based on the candidate's resume.

CANDIDATE PROFILE:
- Name: ${resumeData.name || 'Candidate'}
- Skills: ${skillsList}
- Projects:
    ${projectsList}
- Experience: ${experienceList}

Generate exactly 20 interview questions in the following categories:

1. HR QUESTIONS (5 questions):
   - Questions about personality, motivation, teamwork, career goals
   - Include "Tell me about yourself" as the first question
   - Mix behavioral and situational questions

2. TECHNICAL QUESTIONS (10 questions):
   - Based on the candidate's listed skills
   - Progressive difficulty: 3 Easy → 4 Medium → 3 Hard
   - Cover different skills from the resume
   - Ask about concepts, comparisons, and real-world applications

3. PROJECT-BASED QUESTIONS (5 questions):
   - Deep-dive into the candidate's listed projects
   - Ask about architecture decisions, challenges, improvements
   - Include follow-up style questions about tech choices

Return as a JSON array with this structure:
[
  {
    "id": 1,
    "question": "The question text",
    "category": "hr" | "technical" | "project",
    "difficulty": "easy" | "medium" | "hard",
    "relatedSkill": "The skill or project this question targets",
    "expectedTopics": ["topic1", "topic2", "topic3"],
    "timeLimit": 120
  }
]

RULES:
1. Questions should feel natural and conversational, like a real interviewer would ask.
2. Technical questions MUST be specific to the candidate's skills, not generic.
3. Project questions should reference specific projects from the resume.
4. expectedTopics should list 3-5 key points an ideal answer would cover.
5. timeLimit is in seconds (60-180 based on complexity).
6. Order: HR first, then Technical (easy→hard), then Project-based.
7. Return ONLY the JSON array.`;
}

export function getFollowUpQuestionPrompt(originalQuestion, candidateAnswer, resumeData) {
  return `You are conducting a technical interview. Based on the candidate's answer, generate ONE follow-up question.

ORIGINAL QUESTION: "${originalQuestion}"

CANDIDATE'S ANSWER: "${candidateAnswer}"

CANDIDATE'S SKILLS: ${resumeData.skills?.join(', ')}

Generate a follow-up question that:
1. Digs deeper into what the candidate said
2. Tests understanding vs memorization
3. Is conversational and natural

Return as JSON:
{
  "question": "The follow-up question",
  "category": "follow-up",
  "difficulty": "medium",
  "relatedSkill": "relevant skill",
  "expectedTopics": ["topic1", "topic2"],
  "timeLimit": 90
}

Return ONLY the JSON object.`;
}
