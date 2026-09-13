# AI Career Intelligence Platform

A production-grade, developer-focused SaaS platform designed to prepare software engineers for technical interviews through multi-stage career intelligence: automated ATS resume evaluation, candidate skill verification, structured job description parsing, deterministic skill matching, adaptive technical interviewing, AI answer evaluation, composite career readiness scoring, and longitudinal candidate progress tracking.

---

## Architecture Overview

The platform uses a decoupled client-server architecture with a React single-page frontend, a FastAPI REST API service, PostgreSQL relational persistence, and Google Gemini LLM integration for unstructured document parsing and answer evaluation.

```mermaid
graph TD
    Client[React 19 + Vite SPA] -->|JWT Bearer Auth| API[FastAPI REST Service]
    API -->|Async ORM / Session| DB[(PostgreSQL Database)]
    API -->|Prompt & Evaluation Pipeline| Gemini[Google GenAI SDK - Gemini 2.5 Flash]
    
    subgraph Frontend Subsystem
        Client --> Layout[DashboardLayout + Topbar + Sidebar]
        Layout --> Modules[Resume / Job / Match / Interview / Readiness / Progress]
    end

    subgraph Backend Core Services
        API --> ResumeService[Resume & Candidate Profile Service]
        API --> JobService[Job Description & Requirement Service]
        API --> MatchingService[Deterministic Matching Engine]
        API --> AdaptiveService[Adaptive Interview Engine]
        API --> EvalService[Gemini Evaluation Pipeline]
        API --> ReadinessService[Career Readiness Engine]
        API --> ProgressService[Candidate Progress Intelligence]
    end
```

---

## Core Modules & Workflows

### 1. Resume Intelligence & Candidate Skill Verification
- **PDF Extraction**: Ingests candidate PDF resumes using PyMuPDF and extracts clean raw text.
- **ATS Analysis**: Evaluates resume strength with compatibility scores, strengths, weaknesses, missing keywords, and recommendations.
- **Skill Verification Gate**: Extracts structured technical skills, allows candidate confirmation and manual skill adjustments, and persists verified skills in `candidate_profiles`.

### 2. Job Description Intelligence
- **Requirements Extraction**: Parses arbitrary job postings using structured GenAI extraction into standardized schemas: job title, company name, required technical skills, responsibilities, minimum qualifications, and experience requirements.
- **Persistence**: Persists structured job records in `jobs` and `job_requirements`.

### 3. Deterministic Skills Matching Engine
- **Weighted Alignment**: Computes deterministic match percentage:
  $$\text{Match Score} = \frac{\sum \text{Matched Weight}}{\sum \text{Required Weight}} \times 100$$
- **Evidence Categorization**: Maps each target job skill into *Strong Match* ($1.0$), *Partial Match* ($0.5$), or *Missing Gap* ($0.0$) against verified candidate skills.

### 4. Adaptive Technical Interview Engine
- **Intelligent Question Selection**: Dynamically selects 5 interview questions from a curated 30-question bank based on:
  1. Priority 1: Target job skill requirements and verified candidate skills.
  2. Priority 2: Remediation for topics previously scored $< 7.0/10$.
  3. Priority 3: Difficulty progression (e.g. Easy $\to$ Medium $\to$ Hard).
  4. Priority 4: Recency deduplication against previous sessions.
- **Session Lifecycle**: Manages active interviews, question progression, and timing state.

### 5. Multi-Dimensional AI Answer Evaluation
- **Evaluation Pipeline**: Each candidate answer is evaluated using Gemini across 4 weighted dimensions:
  - Technical Correctness ($40\%$)
  - Completeness ($25\%$)
  - Relevance ($20\%$)
  - Communication ($15\%$)
- **Persisted Feedback**: Stores overall score, summary takeaway, strengths, missing technical concepts, and actionable feedback in `interview_evaluations`.

### 6. Career Readiness Intelligence
- **Deterministic Composite Score**:
  $$\text{Readiness Score} = (0.40 \times \text{Resume Match Score}) + (0.60 \times \text{Interview Score} \times 10)$$
- **Holistic Assessment**: Highlights demonstrated strengths, prioritized skill gaps, and strategic preparation recommendations without triggering redundant LLM calls.

### 7. Candidate Progress Intelligence
- **Longitudinal Trend Tracking**: Tracks score trajectories across multiple completed interview sessions.
- **Consistency Rating**: Evaluates standard deviation ($\sigma$) across sessions:
  - $\sigma < 0.6$: *Highly Consistent*
  - $\sigma < 1.5$: *Moderately Consistent*
  - $\sigma \ge 1.5$: *Needs Consistency*
- **Topic Mastery Trajectories**: Partitions earlier vs. later session halves to track topic delta ($\Delta \ge +0.5$: *Improving*, $\Delta \le -0.5$: *Declining*, otherwise *Stable*).
- **Rule-Based Insights**: Deterministically synthesizes insights on trajectory momentum and preparation focus areas.

---

## Technology Stack

### Frontend
- **Framework**: React 19, Vite
- **UI Library**: Material UI (MUI v6)
- **Styling**: Emotion, Vanilla CSS tokens (Dark SaaS theme inspired by Linear and Raycast)
- **Routing**: React Router v7
- **HTTP Client**: Axios with JWT Bearer request interceptors
- **Icons**: Material UI Rounded Icons

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ORM & Database**: SQLAlchemy v2, PostgreSQL
- **Schema Validation**: Pydantic v2
- **Document Processing**: PyMuPDF (`fitz`)
- **Authentication**: JWT (JSON Web Tokens) with Argon2 password hashing (`pwdlib`)
- **AI / LLM Integration**: Google GenAI SDK (`google-genai`), Gemini 2.5 Flash

---

## Database Schema & Entity-Relationship Architecture

```mermaid
erDiagram
    users ||--o{ resumes : owns
    users ||--o{ jobs : owns
    users ||--o{ interviews : completes
    users ||--o{ interview_datasets : logs

    resumes ||--o| resume_analyses : generates
    resumes ||--o| candidate_profiles : produces

    jobs ||--o| job_requirements : contains
    jobs ||--o{ interviews : informs

    interviews ||--o{ interview_questions : contains
    interview_questions ||--o| interview_evaluations : evaluates

    users {
        int id PK
        string name
        string email UK
        string hashed_password
        datetime created_at
    }

    candidate_profiles {
        int id PK
        int resume_id FK
        json skills
        json verified_skills
        boolean skills_verified
        datetime created_at
    }

    interviews {
        int id PK
        int user_id FK
        int job_id FK
        string interview_type
        string status
        int total_questions
        int current_question
        datetime started_at
        datetime completed_at
    }

    interview_questions {
        int id PK
        int interview_id FK
        string question_id
        text question_text
        string topic
        string difficulty
        int display_order
        text candidate_answer
        datetime answered_at
    }

    interview_evaluations {
        int id PK
        int interview_question_id FK
        float technical_correctness
        float completeness
        float relevance
        float communication
        float overall_score
        text summary
        json strengths
        json missing_concepts
        text feedback
    }
```

---

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm
- PostgreSQL 14+
- Google Gemini API Key

---

### Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_interview_prep

# Authentication
SECRET_KEY=your-secure-random-jwt-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Configuration
GEMINI_API_KEY=your-google-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Application Settings
UPLOAD_DIR=uploads/resumes
DEBUG=false
DB_ECHO=false
```

---

### Local Installation & Execution

#### 1. Backend Setup
```bash
# Clone the repository
git clone https://github.com/lakshya-makwana/ai-interview-prep.git
cd ai-interview-prep/backend

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Backend API documentation is available at `http://localhost:8000/docs` (Swagger UI) and `http://localhost:8000/redoc`.

#### 2. Frontend Setup
```bash
# In a new terminal window
cd ai-interview-prep/frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend application will be running at `http://localhost:5173` (or `http://localhost:5174`).

---

## Automated Testing & Quality Verification

### Backend Automated Test Suite
Run the full unit and integration test suite:
```bash
cd backend
source .venv/bin/activate
python -m unittest discover -s tests
```
*Expected: 39 unit/integration tests passing (`OK`).*

### Frontend Quality Verification
Check code formatting, ESLint rules, and production bundle generation:
```bash
cd frontend

# Verify linting (0 errors, 0 warnings)
npm run lint

# Verify production build
npm run build
```

---

## API Reference Overview

| Module | Method | Endpoint | Description | Auth Required |
|---|---|---|---|:---:|
| **Auth** | `POST` | `/auth/register` | Register new user account | No |
| **Auth** | `POST` | `/auth/login` | Authenticate and obtain JWT token | No |
| **User** | `GET` | `/users/me` | Fetch authenticated user profile | Yes |
| **Resume** | `POST` | `/resume/upload` | Upload PDF resume | Yes |
| **Resume** | `GET` | `/resume/my-resume` | Get latest uploaded resume metadata | Yes |
| **Analysis** | `POST` | `/analysis/analyze` | Trigger ATS resume evaluation | Yes |
| **Analysis** | `GET` | `/analysis/latest` | Fetch latest ATS evaluation report | Yes |
| **Candidate** | `GET` | `/candidate-profile` | Fetch verified candidate skills profile | Yes |
| **Candidate** | `PUT` | `/candidate-profile/skills` | Update verified technical skills list | Yes |
| **Candidate** | `POST` | `/candidate-profile/confirm` | Confirm candidate skills verification gate | Yes |
| **Job** | `POST` | `/jobs/analyze` | Parse and persist target job description | Yes |
| **Job** | `GET` | `/jobs/latest` | Retrieve active job requirement profile | Yes |
| **Job** | `DELETE`| `/jobs/latest` | Clear active job description | Yes |
| **Matching** | `GET` | `/match` | Generate deterministic skill match report | Yes |
| **Interview**| `POST` | `/interviews/start` | Start or resume adaptive interview session | Yes |
| **Interview**| `GET` | `/interviews/current` | Get active interview and current question | Yes |
| **Interview**| `POST` | `/interviews/answer` | Submit candidate answer and advance session | Yes |
| **Interview**| `GET` | `/interviews/{id}/evaluation`| Evaluate and return comprehensive report | Yes |
| **Readiness**| `GET` | `/career-readiness` | Generate composite career readiness report | Yes |
| **History** | `GET` | `/dataset` | Retrieve structured interview dataset records | Yes |
| **History** | `GET` | `/dataset/statistics` | Aggregated dataset and topic metrics | Yes |
| **Progress** | `GET` | `/progress` | Longitudinal candidate progress intelligence | Yes |

---

## Production Deployment Guidelines

### Containerization (Docker)
The backend can be packaged as a standalone Docker image:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Static Hosting (Frontend)
The frontend builds into a static directory (`frontend/dist`) deployable to Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront with standard single-page app rewrite rules:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## License
MIT License. Created by [Lakshya Makwana](https://github.com/lakshya-makwana).