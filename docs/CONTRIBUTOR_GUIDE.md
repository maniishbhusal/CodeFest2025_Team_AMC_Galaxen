# NeuroCare - Contributor Guide

A comprehensive guide for new contributors to understand the NeuroCare autism screening platform.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Overview](#2-architecture-overview)
3. [Core User Flows](#3-core-user-flows)
4. [Key Data Models](#4-key-data-models)
5. [API Endpoints](#5-api-endpoints)
6. [M-CHAT Scoring System](#6-m-chat-scoring-system)
7. [Mobile App Structure](#7-mobile-app-structure)
8. [Web Dashboard Structure](#8-web-dashboard-structure)
9. [Development Notes](#9-development-notes)
10. [Getting Started](#10-getting-started)

---

## 1. Project Overview

**NeuroCare** is a mobile-first autism screening and therapy platform designed for Nepali families with children aged 16-30 months. It connects parents with therapists to provide early intervention through structured daily therapy.

### The Problem We Solve

In Nepal, many families lack access to professional autism screening and therapy services. NeuroCare bridges this gap by:

- Enabling parents to screen their children using the standardized M-CHAT-R/F questionnaire
- Allowing doctors to review assessments remotely
- Providing structured therapy curricula that parents can follow daily
- Tracking progress through video submissions and daily task completion

### Key Features

| Feature | Description |
|---------|-------------|
| **M-CHAT Screening** | 20-question standardized autism screening with automatic scoring |
| **Video Assessment** | Parents upload behavioral videos (walking, eating, speaking, behavior) |
| **15/30/45 Day Programs** | Structured therapy curricula assigned by doctors |
| **Daily Task Tracking** | Parents report task completion with optional video evidence |
| **Doctor Dashboard** | Web portal for patient review, curriculum assignment, and diagnosis |
| **Progress Monitoring** | Visual progress tracking with completion statistics |

---

## 2. Architecture Overview

### Tech Stack

| Component | Technology |
|-----------|------------|
| Backend API | Django REST Framework + SQLite |
| Doctor Dashboard | React + Vite + Tailwind CSS |
| Mobile App | React Native (Expo) |
| Video Storage | Cloudflare Stream |
| Authentication | JWT (email + password) |

### Directory Structure

```
CodeFest2025_Team_AMC_Galaxen/
├── backend/                 # Django REST API
│   ├── accounts/           # User authentication (parents/doctors)
│   ├── children/           # Child profiles and medical history
│   ├── assessments/        # M-CHAT and video submissions
│   ├── therapy/            # Curriculum, progress, reviews
│   └── autisahara/         # Django settings and main URLs
│
├── app/                     # React Native mobile app (Expo)
│   ├── app/(tabs)/         # Tab navigation screens
│   ├── app/auth/           # Login/register screens
│   ├── app/form/           # 7-section registration forms
│   ├── app/mchat/          # M-CHAT screening flow
│   ├── app/videos/         # Video upload flow
│   └── app/therapy/        # Daily tasks and progress
│
├── web/                     # React doctor dashboard
│   ├── src/pages/doctor/   # Dashboard pages
│   ├── src/components/     # Reusable components
│   └── src/contexts/       # State management
│
└── docs/                    # Documentation
```

### How Components Connect

```
┌─────────────────┐         ┌─────────────────┐
│   Mobile App    │         │  Web Dashboard  │
│  (Parent App)   │         │ (Doctor Portal) │
└────────┬────────┘         └────────┬────────┘
         │                           │
         │      HTTP/REST API        │
         └───────────┬───────────────┘
                     │
              ┌──────▼──────┐
              │   Backend   │
              │   (Django)  │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │   SQLite    │
              │  Database   │
              └─────────────┘
```

---

## 3. Core User Flows

### Flow 1: Parent Registration & Onboarding

```
Parent Creates Account
        │
        ▼
Complete 7-Form Sections
├── Section 1: Child's basic info (name, DOB, gender)
├── Section 2: Parent/guardian info
├── Section 3: Contact information
├── Section 4: Household composition
├── Section 5: Education & daily routine
├── Section 6: Health information
└── Section 7: Technology access & consent
        │
        ▼
Medical History (A1-A4)
├── A1: Pregnancy infection?
├── A2: Birth complications?
├── A3: Brain injury?
└── A4: Family autism history?
   (If ANY = YES → requires_specialist flag)
        │
        ▼
M-CHAT Screening (20 questions)
├── Score: 0-20
├── Risk: Low (0-2) / Medium (3-7) / High (8-20)
        │
        ▼
Video Uploads (4 types)
├── Walking
├── Eating
├── Speaking
└── Behavior
        │
        ▼
Final Submission
└── Assessment status → "pending"
```

### Flow 2: Doctor Review & Acceptance

```
Doctor Login
        │
        ▼
View Pending Patients
├── Color-coded by M-CHAT risk
├── Sorted by submission date
        │
        ▼
Review Patient Details
├── All child information
├── Medical history flags
├── M-CHAT results
└── Watch uploaded videos
        │
        ▼
Accept Patient
├── Status → "accepted"
└── Doctor assigned to case
        │
        ▼
Assign Curriculum
├── Select 15/30/45 day program
├── Set start date
└── Creates ChildCurriculum record
```

### Flow 3: Daily Therapy Progress

```
Parent Views Today's Tasks
        │
        ▼
For Each Task:
├── Read "WHY" explanation
├── Watch demo video
├── Follow instructions
        │
        ▼
Submit Progress
├── Status: Not Done / Done with Help / Done without Help
├── Optional: Upload video evidence
└── Optional: Add notes
        │
        ▼
Advance to Next Day
└── Repeat for 15/30/45 days
```

### Flow 4: Doctor Review & Diagnosis

```
Review Progress Grid
├── Rows = Tasks
├── Columns = Days
├── Each cell = Status + Video
        │
        ▼
Create Checkpoint Review (every 15 days)
├── Observations
├── Spectrum identification
└── Recommendations
        │
        ▼
Final Diagnosis Report
├── Has Autism: Yes/No
├── Spectrum Type: None/Mild/Moderate/Severe
├── Detailed findings
└── Next steps for treatment
        │
        ▼
Share with Parent (optional)
```

---

## 4. Key Data Models

### User & Authentication

| Model | Description | Key Fields |
|-------|-------------|------------|
| `User` | Custom user model | email, full_name, phone, role (parent/doctor) |
| `Doctor` | Doctor profile | license_number, specialization, is_approved |
| `ParentDetails` | Parent info | mother/father info, contact, technology comfort |
| `Household` | Who lives at home | boolean flags for each family member |

### Child & Assessment

| Model | Description | Key Fields |
|-------|-------------|------------|
| `Child` | Child profile | full_name, date_of_birth, age, gender |
| `ChildEducation` | Education info | school, daily routine times |
| `ChildHealth` | Health info | height, weight, vaccinations, conditions |
| `MedicalHistory` | A1-A4 questions | pregnancy, birth, brain, family flags |
| `MChatResponse` | M-CHAT answers | q1-q20, total_score, risk_level |
| `AssessmentVideo` | Uploaded videos | video_type, video_url |
| `ChildAssessment` | Assessment status | assigned_doctor, status, submitted_at |

### Therapy & Progress

| Model | Description | Key Fields |
|-------|-------------|------------|
| `Curriculum` | Therapy template | title, duration_days, type, spectrum_type |
| `CurriculumTask` | Individual task | day_number, title, why_description, instructions |
| `ChildCurriculum` | Assigned curriculum | child, curriculum, start_date, current_day, status |
| `DailyProgress` | Task completion | task, date, status, video_url, notes |
| `DoctorReview` | Checkpoint review | review_period, observations, spectrum_identified |
| `DiagnosisReport` | Final diagnosis | has_autism, spectrum_type, detailed_report |

### Model Relationships

```
User (parent)
  └── Child (one-to-many)
        ├── ChildEducation (one-to-one)
        ├── ChildHealth (one-to-one)
        ├── MedicalHistory (one-to-one)
        ├── MChatResponse (one-to-one)
        ├── AssessmentVideo (one-to-many)
        ├── ChildAssessment (one-to-one)
        └── ChildCurriculum (one-to-many)
              └── DailyProgress (one-to-many)

User (doctor)
  └── Doctor (one-to-one)
        ├── ChildAssessment.assigned_doctor
        ├── DoctorReview (one-to-many)
        └── DiagnosisReport (one-to-many)
```

---

## 5. API Endpoints

### Authentication (Public)

```
POST   /api/auth/register/parent/    → Register parent account
POST   /api/auth/register/doctor/    → Register doctor account
POST   /api/auth/login/              → Login (returns JWT tokens)
POST   /api/auth/refresh/            → Refresh expired token
GET    /api/auth/me/                 → Get current user profile
```

### Parent Profile (Auth Required)

```
GET    /api/parent/profile/          → Get parent details
POST   /api/parent/profile/          → Create/update parent details
GET    /api/parent/household/        → Get household info
POST   /api/parent/household/        → Create/update household
```

### Child Management (Auth Required)

```
GET    /api/children/                → List parent's children
POST   /api/children/                → Create child (basic info)
GET    /api/children/{id}/           → Get child with all sections
POST   /api/children/register/       → Register with ALL sections (recommended)
POST   /api/children/{id}/education/ → Update education info
POST   /api/children/{id}/health/    → Update health info
POST   /api/children/{id}/medical-history/ → Update medical history
```

### Assessments (Auth Required)

```
POST   /api/children/{id}/mchat/     → Submit M-CHAT screening
GET    /api/children/{id}/mchat/     → Get M-CHAT results
POST   /api/children/{id}/videos/    → Upload assessment video
GET    /api/children/{id}/videos/    → List videos
POST   /api/children/{id}/assessment/submit/ → Submit final assessment
GET    /api/children/{id}/assessment/status/ → Check status
```

### Doctor Dashboard (Doctor Role Required)

```
GET    /api/therapy/doctor/pending/           → List pending patients
GET    /api/therapy/doctor/patients/          → List accepted patients
GET    /api/therapy/doctor/patient/{id}/      → Get full patient details
POST   /api/therapy/doctor/patient/{id}/accept/ → Accept patient
POST   /api/therapy/doctor/patient/{id}/assign/ → Assign curriculum
GET    /api/therapy/doctor/patient/{id}/progress/ → View progress grid
POST   /api/therapy/doctor/patient/{id}/review/   → Create review
POST   /api/therapy/doctor/patient/{id}/diagnosis/ → Create diagnosis
```

### Parent Therapy (Parent Role Required)

```
GET    /api/therapy/child/{id}/today/      → Get today's tasks
POST   /api/therapy/child/{id}/submit/     → Submit daily progress
POST   /api/therapy/child/{id}/advance/    → Advance to next day
GET    /api/therapy/child/{id}/history/    → Get progress history
GET    /api/therapy/child/{id}/curriculum/ → Get curriculum status
GET    /api/therapy/child/{id}/reports/    → Get diagnosis reports
```

---

## 6. M-CHAT Scoring System

### Overview

The M-CHAT-R/F (Modified Checklist for Autism in Toddlers) is a standardized screening tool for children aged 16-30 months.

### Scoring Rules

**Standard Questions** (most questions):
- YES = 0 points (healthy behavior)
- NO = 1 point (concerning behavior)

**Reverse-Scored Questions** (Q2, Q5, Q12):
- YES = 1 point (concerning behavior)
- NO = 0 points (healthy behavior)

### Question Summary

| Q# | Question Topic | Reverse? |
|----|----------------|----------|
| 1 | Points & looks where you point | No |
| 2 | Wondered if deaf | **Yes** |
| 3 | Pretend/make-believe play | No |
| 4 | Likes climbing | No |
| 5 | Unusual finger movements near eyes | **Yes** |
| 6 | Points to ask for something | No |
| 7 | Points to show something interesting | No |
| 8 | Interested in other children | No |
| 9 | Shows things to share | No |
| 10 | Responds when you call their name | No |
| 11 | Smiles back when you smile | No |
| 12 | Upset by everyday noises | **Yes** |
| 13 | Walks | No |
| 14 | Eye contact | No |
| 15 | Tries to copy actions | No |
| 16 | Follows your gaze | No |
| 17 | Tries to get you to watch them | No |
| 18 | Understands simple commands | No |
| 19 | Checks your reaction to new things | No |
| 20 | Likes movement activities | No |

### Risk Levels

| Score | Risk Level | Action |
|-------|------------|--------|
| 0-2 | Low | No immediate concern |
| 3-7 | Medium | Recommend follow-up |
| 8-20 | High | Priority for doctor review |

### Backend Implementation

```python
def calculate_score(self):
    REVERSE_QUESTIONS = [2, 5, 12]
    score = 0

    for q_num in range(1, 21):
        answer = getattr(self, f'q{q_num}')

        if q_num in REVERSE_QUESTIONS:
            if answer:  # YES = 1 point
                score += 1
        else:
            if not answer:  # NO = 1 point
                score += 1

    return score
```

---

## 7. Mobile App Structure

### Navigation Stacks

**Auth Stack** (before login):
- `/auth/login` → Email/password login
- `/auth/register` → Parent registration

**Form Stack** (registration flow):
- `/form/section-1` through `/form/section-7`

**M-CHAT Flow**:
- `/mchat/medical-history` → A1-A4 questions
- `/mchat/instructions` → Screening instructions
- `/mchat/questions` → 20 questions (paginated)
- `/mchat/results` → Score display

**Video Flow**:
- `/videos/upload` → Upload interface
- `/videos/list` → View uploaded videos
- `/videos/confirmation` → Review before submission

**Therapy Flow**:
- `/therapy/today` → Today's tasks
- `/therapy/task-detail` → Task instructions
- `/therapy/submit-progress` → Submit completion

**Tab Navigation** (main app):
- **Home** → Dashboard with tasks and feedback
- **Explore** → Resources
- **Journal** → Progress notes
- **Chat** → Doctor messages
- **Profile** → Settings

### Key Features

- **Bilingual Support**: Nepali/English via LanguageContext
- **Offline Capability**: AsyncStorage for local data
- **Pull-to-Refresh**: Real-time data sync
- **Video Upload**: Progress tracking during upload

---

## 8. Web Dashboard Structure

### Doctor Dashboard Pages

| Page | Purpose |
|------|---------|
| `Dashboard.tsx` | Patient queue with pending/accepted lists |
| `PatientDetail.tsx` | Full assessment view with videos |
| `PatientProgress.tsx` | Progress grid (tasks × days) |
| `AssignCurriculum.tsx` | Curriculum selection interface |
| `DiagnosisReport.tsx` | Final diagnosis form |

### Progress Grid View

```
         Day 1   Day 2   Day 3   ...   Day 15
Task 1   [ ✓ ]   [ ✓ ]   [ - ]   ...   [ ? ]
Task 2   [ ✓ ]   [ ~ ]   [ ✓ ]   ...   [ ? ]
Task 3   [ - ]   [ ✓ ]   [ ✓ ]   ...   [ ? ]
...

Legend:
✓ = Done without help
~ = Done with help
- = Not done
? = Not yet submitted
```

---

## 9. Development Notes

### Important Patterns

1. **Token Management**: All authenticated requests need `Authorization: Bearer <token>` header

2. **Parent-Child Verification**: Always verify `request.user` matches the child's parent

3. **Doctor Role Check**: Doctor endpoints verify `request.user.role == 'doctor'`

4. **M-CHAT Scoring**: Always calculated on backend—never trust frontend scores

5. **Medical History Flags**: If ANY A1-A4 answer is YES, `requires_specialist=true` is auto-set

### Status Transitions

**Assessment Status**:
```
pending → in_review → accepted → completed
```

**Curriculum Status**:
```
active → paused → completed
```

**Progress Status**:
```
not_done / done_with_help / done_without_help
```

### Common Gotchas

- Token expires after 60 minutes—use refresh token
- Videos are stored as URLs (Cloudflare or local paths)
- Each task per day gets ONE DailyProgress record (unique constraint)
- Doctor profile auto-created with `get_or_create_doctor_profile()`

---

## 10. Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Web Dashboard Setup

```bash
cd web
npm install
npm run dev
```

### Mobile App Setup

```bash
cd app
npm install
npx expo start
```

### Environment Variables

**Backend** (`.env` in `/backend`):
```
SECRET_KEY=your-secret-key
DEBUG=True
```

**Mobile** (`.env` in `/app`):
```
EXPO_PUBLIC_BASE_URL=http://your-ip:8000
```

**Web** (`.env` in `/web`):
```
VITE_API_URL=http://localhost:8000
```

### Test the API

1. Open Swagger UI at `http://localhost:8000/swagger/`
2. Register a parent account
3. Complete child registration
4. Submit M-CHAT responses
5. Check the assessment status

### Your First Contribution

1. **Understand the Flow**: Trace a complete parent → assessment → doctor flow
2. **Run Locally**: Set up all three components
3. **Test an Endpoint**: Use Swagger to test API calls
4. **Read the Models**: Understand relationships in `backend/*/models.py`
5. **Pick a Task**: Find a small bug or feature to work on
6. **Make a PR**: Follow the commit conventions in CONTRIBUTING.md

---

## Questions?

- Check existing documentation in `/docs`
- Review API docs at `/swagger/`
- Look at test data in `CLAUDE.md`

Welcome to the NeuroCare team! 🧠💙
