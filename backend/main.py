from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import jd_generator, cv_screener, tech_quiz, live_interview

app = FastAPI(
    title="HR Helper API",
    description="AI-powered recruitment assistant using Google Gemini",
    version="1.0.0"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jd_generator.router, prefix="/api/jd", tags=["Job Description"])
app.include_router(cv_screener.router, prefix="/api/cv", tags=["CV Screening"])
app.include_router(tech_quiz.router, prefix="/api/quiz", tags=["Technical Quiz"])
app.include_router(live_interview.router, prefix="/api/interview", tags=["Live Interview"])

@app.get("/")
async def root():
    return {
        "message": "HR Helper API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
