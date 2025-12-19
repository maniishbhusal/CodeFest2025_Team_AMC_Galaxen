# AutiSahara Nepal - Platform Architecture

> **Therapy that fits your child's world**
> Where every Nepali parent can give their autistic child the daily therapy they need - with expert guidance right on their phone.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [User Roles](#user-roles)
4. [Platform Flow](#platform-flow)
5. [Module Breakdown](#module-breakdown)
6. [Data Flow Diagram](#data-flow-diagram)

---

## Overview

AutiSahara Nepal bridges the gap between professional autism therapy and Nepali families by:

- **Mobile-First Design**: Therapy plans accessible anywhere, anytime
- **Parent-Led Therapy**: Training parents to become the primary catalyst for change
- **Smart Progress Tracking**: Visual data showing child's improvement over time

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Mobile App (Parents) | React Native |
| Web Dashboard (Doctors) | React |
| Backend API | Django REST Framework |
| Database | PostgreSQL |

---

## User Roles

### 1. Parents
- Register themselves and their child
- Complete assessments (M-CHAT, video submissions)
- Follow daily therapy curriculum
- Submit daily progress videos

### 2. Doctors (Therapists)
- Verify identity via license/certificate
- Review child assessments
- Diagnose autism spectrum type
- Create personalized curriculum
- Review progress every 15 days

### 3. Platform Admin (Developers)
- Manage doctor verifications
- Deploy curriculum tasks to parents
- System maintenance

---

## Platform Flow

### Phase 1: Registration & Verification

```
┌─────────────────────────────────────────────────────────────────┐
│                     DOCTOR REGISTRATION                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Doctor submits registration form                            │
│     - Full name                                                 │
│     - Medical license / Certificate                             │
│     - Specialization details                                    │
│                                                                 │
│  2. Admin verifies credentials                                  │
│                                                                 │
│  3. Doctor gains access to dashboard                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PARENT REGISTRATION                         │
├─────────────────────────────────────────────────────────────────┤
│  1. Parent creates account                                      │
│     - Parent information                                        │
│     - Child information (name, age, etc.)                       │
│                                                                 │
│  2. Medical history submission                                  │
│     - Past accidents                                            │
│     - Brain-related issues                                      │
│     - Other relevant medical history                            │
│     → If flagged: Recommend official doctor consultation        │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: Assessment & Screening

```
┌─────────────────────────────────────────────────────────────────┐
│                      M-CHAT SCREENING                           │
├─────────────────────────────────────────────────────────────────┤
│  Target: Toddlers aged 16-30 months                             │
│  Purpose: Assess risk of Autism Spectrum Disorders (ASDs)       │
│                                                                 │
│  1. Parent completes M-CHAT questionnaire                       │
│  2. System calculates initial risk score                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    VIDEO SUBMISSION                             │
├─────────────────────────────────────────────────────────────────┤
│  Parent uploads videos showing:                                 │
│  - How the child walks                                          │
│  - How the child eats                                           │
│  - Speech/communication abilities                               │
│  - General behavior patterns                                    │
│                                                                 │
│  Purpose: Helps doctors identify autism spectrum type           │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   CONFIRMATION PAGE                             │
├─────────────────────────────────────────────────────────────────┤
│  1. Display all submitted information for review                │
│  2. Parent confirms accuracy (checkbox)                         │
│  3. Parent consents to share child info with platform           │
│  4. Submission sent to doctor for review                        │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: Doctor Review & Diagnosis

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCTOR REVIEW                                │
├─────────────────────────────────────────────────────────────────┤
│  1. Doctor receives child's complete profile                    │
│     - M-CHAT results                                            │
│     - Submitted videos                                          │
│     - Medical history                                           │
│                                                                 │
│  2. Doctor manually reviews all information                     │
│                                                                 │
│  3. Doctor determines:                                          │
│     - Whether child has autism                                  │
│     - Type of autism spectrum (if applicable)                   │
│                                                                 │
│  4. Doctor accepts treatment agreement                          │
│     → Popup confirmation: "Ready to treat this child"           │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART A: General Curriculum (Spectrum Detection)

> **Purpose**: Identify whether the child has autism and determine the specific spectrum type.
> This is the same curriculum for ALL children to help doctors diagnose the spectrum.

### Phase 4: General Curriculum Assignment

```
┌─────────────────────────────────────────────────────────────────┐
│              GENERAL CURRICULUM (Same for All)                  │
├─────────────────────────────────────────────────────────────────┤
│  Purpose: Help doctors identify the autism spectrum type        │
│                                                                 │
│  Duration Options:                                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                         │
│  │ 15 Days │  │ 30 Days │  │ 45 Days │                         │
│  └─────────┘  └─────────┘  └─────────┘                         │
│                                                                 │
│  Content: Expert-designed curriculum for autism detection       │
│  (Developed in collaboration with medical professionals)        │
│                                                                 │
│  → Doctor assigns curriculum to parent                          │
│  → Parent views curriculum details in the app                   │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 5: Daily Progress Submission (General Curriculum)

```
┌─────────────────────────────────────────────────────────────────┐
│         PARENT SUBMITS DAILY PROGRESS (General)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  For each curriculum activity, parent selects ONE option:       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ○ NOT DONE                                             │    │
│  │    Activity was not attempted today                     │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ○ DONE WITH HELP                                       │    │
│  │    Child completed activity with parent assistance      │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ○ DONE WITHOUT HELP                                    │    │
│  │    Child completed activity independently               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  + Upload video evidence for the selected option                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 6: Doctor Reviews & Identifies Spectrum

```
┌─────────────────────────────────────────────────────────────────┐
│         DOCTOR REVIEWS GENERAL CURRICULUM PROGRESS              │
├─────────────────────────────────────────────────────────────────┤
│  Review Frequency: Every 15 days                                │
│                                                                 │
│  Dashboard View (Row-by-Row for each activity):                 │
│  ┌──────────────┬────────┬────────┬────────┬──────────────────┐ │
│  │ Activity     │ Day 1  │ Day 2  │ Day 3  │ ...              │ │
│  ├──────────────┼────────┼────────┼────────┼──────────────────┤ │
│  │ Activity A   │ ✓ Help │ ✗ None │ ✓ Solo │                  │ │
│  │ Video Link   │ [Link] │ -      │ [Link] │                  │ │
│  │ Progress     │ 60%    │ -      │ 100%   │                  │ │
│  ├──────────────┼────────┼────────┼────────┼──────────────────┤ │
│  │ Activity B   │ ...    │ ...    │ ...    │                  │ │
│  └──────────────┴────────┴────────┴────────┴──────────────────┘ │
│                                                                 │
│  After reviewing all videos (15/30/45 days):                    │
│  → Doctor identifies the specific autism spectrum type          │
│  → Doctor generates detailed diagnosis report                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 7: Diagnosis Report & Transition

```
┌─────────────────────────────────────────────────────────────────┐
│               DIAGNOSIS REPORT                                  │
├─────────────────────────────────────────────────────────────────┤
│  After general curriculum completion:                           │
│                                                                 │
│  1. Doctor generates detailed report including:                 │
│     - Confirmed autism diagnosis (Yes/No)                       │
│     - Specific spectrum type identified                         │
│     - Observations from video reviews                           │
│     - Recommendations for treatment                             │
│                                                                 │
│  2. Report sent to:                                             │
│     - Platform (developers)                                     │
│     - Parents                                                   │
│                                                                 │
│  3. If spectrum identified → Move to PART B (Specialized)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## PART B: Specialized Curriculum (Post-Diagnosis Treatment)

> **Purpose**: Provide targeted therapy tasks specific to the identified autism spectrum.
> Doctor creates custom tasks based on the diagnosed spectrum type.

### Phase 8: Doctor Creates Specialized Tasks

```
┌─────────────────────────────────────────────────────────────────┐
│            SPECIALIZED CURRICULUM CREATION                      │
├─────────────────────────────────────────────────────────────────┤
│  Based on diagnosed spectrum type:                              │
│                                                                 │
│  1. Doctor creates detailed task list for the child             │
│  2. Doctor sends task curriculum to platform (developers)       │
│  3. Developers deploy tasks to parent's app                     │
│  4. Tasks are delivered to parents on a daily basis             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 9: Daily Task Execution (Specialized)

```
┌─────────────────────────────────────────────────────────────────┐
│              DAILY TASK STRUCTURE (Specialized)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ WHY THIS TASK?                                            │  │
│  │ "This helps your child learn to share attention,          │  │
│  │  which is the foundation for..."                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ VIDEO DEMONSTRATION                                       │  │
│  │ Real person showing how to perform the task               │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ TEXT INSTRUCTIONS                                         │  │
│  │ Clear step-by-step description                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 10: Daily Progress Submission (Specialized)

```
┌─────────────────────────────────────────────────────────────────┐
│        PARENT SUBMITS DAILY PROGRESS (Specialized)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  For each task, parent selects ONE option:                      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  ○ NOT DONE                                             │    │
│  │    Task was not attempted today                         │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ○ DONE WITH HELP                                       │    │
│  │    Child completed task with parent assistance          │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │  ○ DONE WITHOUT HELP                                    │    │
│  │    Child completed task independently                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  + Upload video evidence for the selected option                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 11: Doctor Reviews Specialized Progress

```
┌─────────────────────────────────────────────────────────────────┐
│       DOCTOR DASHBOARD - SPECIALIZED PROGRESS REVIEW            │
├─────────────────────────────────────────────────────────────────┤
│  Review Frequency: Every 15 days                                │
│                                                                 │
│  Dashboard View (Row-by-Row for each task):                     │
│  ┌──────────────┬────────┬────────┬────────┬──────────────────┐ │
│  │ Task Name    │ Day 1  │ Day 2  │ Day 3  │ ...              │ │
│  ├──────────────┼────────┼────────┼────────┼──────────────────┤ │
│  │ Task A       │ ✓ Help │ ✗ None │ ✓ Solo │                  │ │
│  │ Video Link   │ [Link] │ -      │ [Link] │                  │ │
│  │ Progress     │ 60%    │ -      │ 100%   │                  │ │
│  ├──────────────┼────────┼────────┼────────┼──────────────────┤ │
│  │ Task B       │ ...    │ ...    │ ...    │                  │ │
│  └──────────────┴────────┴────────┴────────┴──────────────────┘ │
│                                                                 │
│  Doctor can:                                                    │
│  → Adjust tasks based on progress                               │
│  → Add new tasks as needed                                      │
│  → Generate progress reports for parents                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Module Breakdown

### Mobile App (React Native) - Parent Portal

| Module | Features |
|--------|----------|
| Authentication | Register, Login, Profile Management |
| Child Profile | Add child info, Medical history |
| Assessment | M-CHAT questionnaire, Video upload |
| Curriculum | View daily tasks, Instructions, Demo videos |
| Progress | Submit daily progress, Upload videos |
| Reports | View doctor feedback, Progress charts |

### Web Dashboard (React) - Doctor Portal

| Module | Features |
|--------|----------|
| Authentication | Register with license, Login |
| Patient Queue | View new assessments, Accept patients |
| Patient Profiles | View child details, Videos, M-CHAT results |
| Progress Tracking | Row-by-row task view, Video reviews |
| Reporting | Generate reports, Send to parents |
| Curriculum Management | Create/assign specialized tasks |

### Backend API (Django REST Framework)

| Module | Endpoints |
|--------|-----------|
| Auth | User registration, Login, Token management |
| Doctors | Registration, Verification, Profile |
| Parents | Registration, Child profiles, Medical history |
| Assessment | M-CHAT submission, Video uploads |
| Curriculum | Task management, Daily assignments |
| Progress | Daily submissions, Status tracking |
| Reports | Report generation, Delivery |

---

## Data Flow Diagram

```
                                    ┌─────────────────┐
                                    │   PostgreSQL    │
                                    │    Database     │
                                    └────────┬────────┘
                                             │
                                             │
                                    ┌────────▼────────┐
                                    │  Django REST    │
                                    │   Framework     │
                                    │    (Backend)    │
                                    └────────┬────────┘
                                             │
                         ┌───────────────────┼───────────────────┐
                         │                   │                   │
                         ▼                   │                   ▼
              ┌─────────────────┐            │        ┌─────────────────┐
              │  React Native   │            │        │     React       │
              │   Mobile App    │            │        │   Dashboard     │
              │   (Parents)     │            │        │   (Doctors)     │
              └─────────────────┘            │        └─────────────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │  File Storage   │
                                    │ (Videos/Images) │
                                    └─────────────────┘
```

---

## Summary

This platform creates a complete ecosystem for autism therapy in Nepal:

### Onboarding (Phases 1-3)
1. **Doctor & Parent Registration** → Identity verification
2. **M-CHAT Screening** → Initial autism risk assessment
3. **Video Submission** → Child behavior documentation
4. **Doctor Review** → Manual review and acceptance

### PART A: General Curriculum - Spectrum Detection (Phases 4-7)
5. **General Curriculum Assigned** → Same 15/30/45 day plan for all
6. **Daily Progress** → Parents submit videos (Not Done / With Help / Without Help)
7. **Doctor Reviews** → Every 15 days, analyzes videos
8. **Diagnosis Report** → Identifies specific autism spectrum type

### PART B: Specialized Curriculum - Treatment (Phases 8-11)
9. **Doctor Creates Tasks** → Custom curriculum for identified spectrum
10. **Daily Task Execution** → Why + Video Demo + Instructions
11. **Daily Progress** → Same submission format (Not Done / With Help / Without Help)
12. **Ongoing Review** → Doctor monitors and adjusts treatment

---

```
┌────────────────────────────────────────────────────────────────────────┐
│                         PLATFORM FLOW OVERVIEW                         │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  Registration → Assessment → Doctor Review                             │
│                                   ↓                                    │
│                    ┌──────────────────────────────┐                    │
│                    │   PART A: GENERAL CURRICULUM │                    │
│                    │   (Same for all - Detection) │                    │
│                    │                              │                    │
│                    │   Daily Progress Submission  │                    │
│                    │   → Not Done                 │                    │
│                    │   → Done with Help           │                    │
│                    │   → Done without Help        │                    │
│                    │                              │                    │
│                    │   Doctor Review (15 days)    │                    │
│                    │   → Identifies Spectrum      │                    │
│                    └──────────────┬───────────────┘                    │
│                                   ↓                                    │
│                    ┌──────────────────────────────┐                    │
│                    │  PART B: SPECIALIZED TASKS   │                    │
│                    │  (Custom for each spectrum)  │                    │
│                    │                              │                    │
│                    │   Daily Task Structure:      │                    │
│                    │   → Why this task?           │                    │
│                    │   → Video demonstration      │                    │
│                    │   → Text instructions        │                    │
│                    │                              │                    │
│                    │   Daily Progress Submission  │                    │
│                    │   → Not Done                 │                    │
│                    │   → Done with Help           │                    │
│                    │   → Done without Help        │                    │
│                    │                              │                    │
│                    │   Doctor Review (15 days)    │                    │
│                    │   → Adjust treatment         │                    │
│                    └──────────────────────────────┘                    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

*Note: For hackathon, the platform will have one therapist handling all cases.*
