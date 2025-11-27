# HR Helper - AI-Powered Recruitment Assistant

An intelligent HR application that leverages Google's Gemini AI to streamline the recruitment process.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    HR Helper Application                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐              ┌──────────────────┐      │
│  │   Frontend      │   HTTP/REST  │    Backend       │      │
│  │   (Next.js)     │◄────────────►│  (FastAPI)       │      │
│  │   Port: 3000    │              │  Port: 8000      │      │
│  └─────────────────┘              └──────────────────┘      │
│         │                                   │                │
│         │                                   │                │
│         ▼                                   ▼                │
│  ┌─────────────────┐              ┌──────────────────┐      │
│  │  UI Components  │              │  Gemini API      │      │
│  │  - JD Generator │              │  - Text Gen      │      │
│  │  - CV Screener  │              │  - Analysis      │      │
│  │  - Tech Quiz    │              │  - Scoring       │      │
│  └─────────────────┘              └──────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 Features

### 1. **Job Description Generator**
- Input: Keywords (role, skills, experience level)
- Output: Professional, unbiased JD
- AI-powered content generation

### 2. **CV Screener**
- Input: Upload CV (PDF/DOCX) + JD
- Output: Match score (0-100), strengths, gaps
- Automated candidate evaluation

### 3. **Technical Assessment**
- Input: Role, skill level
- Output: 5-10 technical questions
- Difficulty-based question generation

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
GEMINI_API_KEY=your_api_key_here
```

5. Run the server:
```bash
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Environment is already configured in `.env.local`

4. Run the development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📂 Project Structure

```
hr-helper-app/
├── frontend/                 # Next.js Application
│   ├── app/
│   │   ├── page.tsx         # Home page
│   │   ├── jd-generator/    # JD Generator feature
│   │   ├── cv-screener/     # CV Screening feature
│   │   └── tech-quiz/       # Technical Assessment
│   ├── lib/
│   │   └── api.ts           # API client for backend
│   └── package.json
│
├── backend/                  # Python FastAPI Application
│   ├── main.py              # FastAPI entry point
│   ├── routers/
│   │   ├── jd_generator.py  # JD generation endpoints
│   │   ├── cv_screener.py   # CV screening endpoints
│   │   └── tech_quiz.py     # Quiz generation endpoints
│   ├── services/
│   │   ├── gemini_client.py # Gemini API wrapper
│   │   ├── pdf_parser.py    # PDF text extraction
│   │   └── docx_parser.py   # DOCX text extraction
│   ├── models/
│   │   └── schemas.py       # Pydantic models
│   └── requirements.txt
│
└── README.md                # This file
```

## 🔄 Control Flow

### JD Generation Flow
```
User Input (Keywords)
    ↓
Frontend (JDForm)
    ↓ POST /api/jd/generate
Backend (jd_generator.py)
    ↓
Gemini API (gemini_client.py)
    ↓ Generated JD
Backend Response
    ↓
Frontend Display
```

### CV Screening Flow
```
User Upload (CV + JD)
    ↓
Frontend (CVUploader)
    ↓ POST /api/cv/screen (multipart/form-data)
Backend (cv_screener.py)
    ↓
PDF/DOCX Parser (extract text)
    ↓
Gemini API (analyze match)
    ↓ Score + Analysis
Backend Response
    ↓
Frontend Display (Score, Strengths, Gaps)
```

### Tech Quiz Flow
```
User Input (Role, Level)
    ↓
Frontend (QuizForm)
    ↓ POST /api/quiz/generate
Backend (tech_quiz.py)
    ↓
Gemini API (generate questions)
    ↓ Questions Array
Backend Response
    ↓
Frontend Display
```

## 🔑 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/jd/generate` | POST | Generate job description |
| `/api/cv/screen` | POST | Screen CV against JD |
| `/api/quiz/generate` | POST | Generate technical questions |
| `/health` | GET | Health check |

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

### Backend
- **FastAPI** - Python web framework
- **Pydantic** - Data validation
- **google-generativeai** - Gemini SDK
- **PyPDF2** - PDF parsing
- **python-docx** - DOCX parsing

## 📊 Gemini API Usage (Free Tier)

- **Requests per day**: 1,500
- **Requests per minute**: 15
- **Sufficient for**: ~100 JDs, ~500 CV screens, ~50 quizzes per day

## 🔐 Security

- API keys stored in `.env` files (not committed to git)
- Backend validates all inputs
- File uploads limited to PDF/DOCX only
- CORS configured for frontend-backend communication

---

**Built with ❤️ using Next.js, FastAPI, and Google Gemini AI**
