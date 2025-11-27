from fastapi import APIRouter, HTTPException
from models.schemas import QuizRequest, QuizResponse, Question
from services.gemini_client import gemini_client

router = APIRouter()

@router.post("/generate", response_model=QuizResponse)
async def generate_quiz(request: QuizRequest):
    """Generate technical assessment questions"""
    try:
        questions_data = await gemini_client.generate_tech_questions(
            role=request.role,
            skill_level=request.skill_level,
            num_questions=request.num_questions
        )
        
        questions = [Question(**q) for q in questions_data]
        return QuizResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
