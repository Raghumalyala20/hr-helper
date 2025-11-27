from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from models.schemas import CVScreenResponse
from services.gemini_client import gemini_client
from services.pdf_parser import extract_text_from_pdf
from services.docx_parser import extract_text_from_docx

router = APIRouter()

@router.post("/screen", response_model=CVScreenResponse)
async def screen_cv(
    cv_file: UploadFile = File(...),
    jd_text: str = Form(...)
):
    """Screen a CV against a job description"""
    try:
        # Read file bytes
        file_bytes = await cv_file.read()
        
        # Extract text based on file type
        if cv_file.filename.endswith('.pdf'):
            cv_text = extract_text_from_pdf(file_bytes)
        elif cv_file.filename.endswith('.docx'):
            cv_text = extract_text_from_docx(file_bytes)
        else:
            raise HTTPException(status_code=400, detail="Only PDF and DOCX files are supported")
        
        # Screen CV using Gemini
        result = await gemini_client.screen_cv(cv_text, jd_text)
        
        return CVScreenResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
