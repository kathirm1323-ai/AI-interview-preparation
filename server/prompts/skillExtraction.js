export function getSkillExtractionPrompt(resumeText) {
  return `You are an expert resume parser and HR analyst. Analyze the following resume text and extract structured information.

RESUME TEXT:
---
${resumeText}
---

Extract the following information and return it as a JSON object with this EXACT structure:
{
  "name": "Full name of the candidate",
  "email": "Email address if found, otherwise null",
  "phone": "Phone number if found, otherwise null",
  "summary": "A brief 2-3 sentence professional summary based on the resume",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description of what the project does",
      "techStack": ["tech1", "tech2"],
      "highlights": ["key achievement or feature"]
    }
  ],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "duration": "Duration or dates",
      "highlights": ["key responsibility or achievement"]
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "University/College name",
      "year": "Year or duration"
    }
  ],
  "certifications": ["certification1", "certification2"],
  "primaryDomain": "The candidate's primary domain (e.g., 'AI/ML', 'Full Stack', 'Data Science', 'Backend', 'Frontend', 'DevOps', 'Cybersecurity')"
}

RULES:
1. Extract ALL skills mentioned, including programming languages, frameworks, tools, databases, and soft skills.
2. For projects, infer the tech stack from the description if not explicitly listed.
3. If a field has no data, use an empty array [] or null as appropriate.
4. Be thorough — don't miss any skills or projects.
5. Return ONLY the JSON object, no other text.`;
}
