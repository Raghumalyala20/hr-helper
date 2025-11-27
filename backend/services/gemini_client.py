import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

class GeminiClient:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    async def generate_content(self, prompt: str) -> str:
        """Generate content using Gemini API"""
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")
    
    async def generate_jd(self, role: str, skills: list, experience_level: str, company_type: str = None) -> dict:
        """Generate a job description"""
        skills_str = ", ".join(skills)
        company_info = f" for a {company_type} company" if company_type else ""
        
        prompt = f"""Generate a professional job description{company_info} for the following role:

Role: {role}
Required Skills: {skills_str}
Experience Level: {experience_level}

Please provide:
1. A clear job title
2. Job summary (2-3 sentences)
3. Key responsibilities (5-7 bullet points)
4. Required qualifications
5. Preferred qualifications
6. Benefits (if applicable)

Make it professional, unbiased, and attractive to candidates. Format it in a clean, readable way."""

        content = await self.generate_content(prompt)
        
        # Extract title (first line usually)
        lines = content.strip().split('\n')
        title = lines[0].replace('**', '').replace('#', '').strip()
        
        return {
            "title": title,
            "job_description": content
        }
    
    async def screen_cv(self, cv_text: str, jd_text: str) -> dict:
        """Screen a CV against a job description"""
        prompt = f"""You are an expert HR recruiter. Analyze the following CV against the job description and provide:

1. A match score (0-100) based on skills, experience, and qualifications
2. Top 3-5 strengths (what makes this candidate a good fit)
3. Top 3-5 gaps (what's missing or weak)
4. A brief recommendation (hire/interview/reject with reasoning)

Job Description:
{jd_text}

Candidate CV:
{cv_text}

Provide your analysis in the following JSON format:
{{
    "match_score": <number 0-100>,
    "strengths": ["strength1", "strength2", ...],
    "gaps": ["gap1", "gap2", ...],
    "recommendation": "your recommendation here"
}}"""

        response = await self.generate_content(prompt)
        
        # Parse JSON from response
        import json
        import re
        
        # Extract JSON from markdown code blocks if present
        json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find JSON object in the response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            json_str = json_match.group(0) if json_match else response
        
        try:
            result = json.loads(json_str)
            return result
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "match_score": 50,
                "strengths": ["Unable to parse detailed analysis"],
                "gaps": ["Please review manually"],
                "recommendation": response
            }
    
    async def generate_tech_questions(self, role: str, skill_level: str, num_questions: int = 5) -> list:
        """Generate technical assessment questions"""
        prompt = f"""Generate {num_questions} technical interview questions for a {role} position at {skill_level} level.

For each question, provide:
1. The question itself
2. Difficulty level (easy/medium/hard)
3. Topic/skill being tested

Format as JSON array:
[
    {{
        "question": "question text",
        "difficulty": "easy/medium/hard",
        "topic": "topic name"
    }},
    ...
]

Make questions practical, relevant, and appropriate for the skill level."""

        response = await self.generate_content(prompt)
        
        # Parse JSON from response
        import json
        import re
        
        # Extract JSON array from markdown code blocks if present
        json_match = re.search(r'```(?:json)?\s*(\[.*?\])\s*```', response, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
        else:
            # Try to find JSON array in the response
            json_match = re.search(r'\[.*\]', response, re.DOTALL)
            json_str = json_match.group(0) if json_match else "[]"
        
        try:
            questions = json.loads(json_str)
            return questions
        except json.JSONDecodeError:
            # Fallback questions
            return [
                {
                    "question": "Unable to generate questions. Please try again.",
                    "difficulty": "medium",
                    "topic": "General"
                }
            ]

# Singleton instance
gemini_client = GeminiClient()
