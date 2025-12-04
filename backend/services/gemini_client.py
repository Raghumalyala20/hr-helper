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
4. Confidence Level (High/Medium/Low) based on writing style/tone
5. Brief confidence analysis (why you assigned that level)
6. A brief recommendation (hire/interview/reject with reasoning)

Job Description:
{jd_text}

Candidate CV:
{cv_text}

Provide your analysis in the following JSON format:
{{
    "match_score": <number 0-100>,
    "strengths": ["strength1", "strength2", ...],
    "gaps": ["gap1", "gap2", ...],
    "confidence_level": "High/Medium/Low",
    "confidence_analysis": "analysis text",
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
                "confidence_level": "Medium",
                "confidence_analysis": "Unable to analyze confidence due to parsing error.",
                "recommendation": response
            }
    
        
    async def generate_tech_questions(self, role: str, skill_level: str, num_questions: int = 5) -> list:
        """Generate technical assessment questions"""
        prompt = f"""Generate {num_questions} technical interview questions for a {role} position at {skill_level} level.

For each question, provide:
1. The question itself
2. The correct answer (concise explanation)
3. Difficulty level (easy/medium/hard)
4. Topic/skill being tested

Format as JSON array:
[
    {{
        "question": "question text",
        "answer": "answer text",
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
                    "answer": "N/A",
                    "difficulty": "medium",
                    "topic": "General"
                }
            ]

    async def evaluate_quiz(self, answers: list) -> dict:
        """Evaluate quiz answers"""
        answers_text = "\n\n".join([f"Q: {a['question']}\nA: {a['answer']}" for a in answers])
        
        prompt = f"""You are a technical interviewer. Evaluate the following candidate answers:

{answers_text}

Provide:
1. An overall score (0-100)
2. Confidence Level (High/Medium/Low) based on the answers
3. Brief feedback on performance

Format as JSON:
{{
    "score": <number>,
    "confidence_level": "High/Medium/Low",
    "feedback": "feedback text"
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
            return {
                "score": 0,
                "confidence_level": "Low",
                "feedback": "Unable to evaluate answers."
            }

    async def analyze_audio(self, audio_path: str) -> dict:
        """Analyze audio for confidence and tone"""
        try:
            # Upload file to Gemini
            audio_file = genai.upload_file(audio_path)
            
            prompt = """Listen to this interview answer carefully. Analyze the speaker's voice tone, pitch, fluency, and hesitations to assess their confidence.

Provide:
1. Confidence Score (0-100)
2. Confidence Level (High/Medium/Low)
3. Tone Analysis (e.g., "Calm", "Nervous", "Assertive", "Monotone")
4. A brief summary of what was said
5. A near-verbatim transcription

Format as JSON:
{
    "confidence_score": <number>,
    "confidence_level": "High/Medium/Low",
    "tone": "tone description",
    "summary": "summary text",
    "transcription": "transcription text"
}"""

            response = self.model.generate_content([prompt, audio_file])
            
            # Clean up - delete the file from Gemini storage (optional but good practice)
            # genai.delete_file(audio_file.name) 
            
            # Parse JSON
            import json
            import re
            
            text_response = response.text
            json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text_response, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                json_match = re.search(r'\{.*\}', text_response, re.DOTALL)
                json_str = json_match.group(0) if json_match else text_response
            
            return json.loads(json_str)
            
        except Exception as e:
            print(f"Error analyzing audio: {e}")
            return {
                "confidence_score": 0,
                "confidence_level": "Low",
                "tone": "Error analyzing audio",
                "summary": "N/A",
                "transcription": "N/A"
            }

# Singleton instance
gemini_client = GeminiClient()
