const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface JDRequest {
    role: string;
    skills: string[];
    experience_level: string;
    company_type?: string;
}

export interface JDResponse {
    job_description: string;
    title: string;
}

export interface CVScreenResponse {
    match_score: number;
    strengths: string[];
    gaps: string[];
    confidence_level: string;
    confidence_analysis: string;
    recommendation: string;
}

export interface QuizRequest {
    role: string;
    skill_level: string;
    num_questions: number;
}

export interface Question {
    question: string;
    answer: string;
    difficulty: string;
    topic: string;
}

export interface QuizResponse {
    questions: Question[];
}

// JD Generator API
export async function generateJD(data: JDRequest): Promise<JDResponse> {
    const response = await fetch(`${API_BASE_URL}/api/jd/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to generate JD');
    }

    return response.json();
}

// CV Screener API
export async function screenCV(cvFile: File, jdText: string): Promise<CVScreenResponse> {
    const formData = new FormData();
    formData.append('cv_file', cvFile);
    formData.append('jd_text', jdText);

    const response = await fetch(`${API_BASE_URL}/api/cv/screen`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to screen CV');
    }

    return response.json();
}

// Tech Quiz API
export async function generateQuiz(data: QuizRequest): Promise<QuizResponse> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to generate quiz');
    }

    return response.json();
}

export interface UserAnswer {
    question: string;
    answer: string;
}

export interface QuizEvaluationRequest {
    answers: UserAnswer[];
}

export interface QuizEvaluationResponse {
    score: number;
    confidence_level: string;
    feedback: string;
}

export async function evaluateQuiz(data: QuizEvaluationRequest): Promise<QuizEvaluationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/quiz/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to evaluate quiz');
    }

    return response.json();
}

export interface AudioAnalysisResponse {
    confidence_score: number;
    confidence_level: string;
    tone: string;
    summary: string;
    transcription: string;
}

export async function analyzeAudio(audioBlob: Blob): Promise<AudioAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');

    const response = await fetch(`${API_BASE_URL}/api/interview/analyze-audio`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to analyze audio');
    }

    return response.json();
}
