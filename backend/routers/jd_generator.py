from fastapi import APIRouter, HTTPException
from models.schemas import JDRequest, JDResponse
from services.gemini_client import gemini_client

router = APIRouter()

@router.post("/generate", response_model=JDResponse)
async def generate_jd(request: JDRequest):
    """Generate a job description based on role and requirements"""
    try:
        result = await gemini_client.generate_jd(
            role=request.role,
            skills=request.skills,
            experience_level=request.experience_level,
            company_type=request.company_type
        )
        return JDResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
