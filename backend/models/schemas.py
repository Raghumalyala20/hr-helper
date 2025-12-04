from pydantic import BaseModel
from typing import List, Optional

# JD Generator Models
class JDRequest(BaseModel):
    role: str
    skills: List[str]
    experience_level: str  # "entry", "mid", "senior"
    company_type: Optional[str] = None

class JDResponse(BaseModel):
    job_description: str
    title: str

# CV Screener Models
class CVScreenRequest(BaseModel):
    cv_text: str
    jd_text: str

class CVScreenResponse(BaseModel):
    match_score: int  # 0-100
    strengths: List[str]
    gaps: List[str]
    confidence_level: str  # "High", "Medium", "Low"
    confidence_analysis: str
    recommendation: str

# Tech Quiz Models
class QuizRequest(BaseModel):
    role: str
    skill_level: str  # "beginner", "intermediate", "advanced"
    num_questions: int = 5

class Question(BaseModel):
    question: str
    answer: str
    difficulty: str
    topic: str

class QuizResponse(BaseModel):
    questions: List[Question]

class UserAnswer(BaseModel):
    question: str
    answer: str

class QuizEvaluationRequest(BaseModel):
    answers: List[UserAnswer]

class QuizEvaluationResponse(BaseModel):
    score: int  # 0-100
    confidence_level: str  # "High", "Medium", "Low"
    feedback: str

class AudioAnalysisResponse(BaseModel):
    confidence_score: int  # 0-100
    confidence_level: str  # "High", "Medium", "Low"
    tone: str  # e.g., "Calm", "Nervous"
    summary: str
    transcription: str
