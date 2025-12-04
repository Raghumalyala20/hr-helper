from fastapi import APIRouter, UploadFile, File, HTTPException
from models.schemas import AudioAnalysisResponse
from services.gemini_client import gemini_client
import shutil
import os
import tempfile

router = APIRouter()

@router.post("/analyze-audio", response_model=AudioAnalysisResponse)
async def analyze_audio(file: UploadFile = File(...)):
    """Analyze uploaded audio file"""
    try:
        # Create a temporary file to save the upload
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name

        try:
            # Analyze using Gemini
            result = await gemini_client.analyze_audio(temp_path)
            return AudioAnalysisResponse(**result)
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
