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
    recommendation: string;
}

export interface QuizRequest {
    role: string;
    skill_level: string;
    num_questions: number;
}

export interface Question {
    question: string;
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
