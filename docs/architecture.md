# AutiSahara Nepal - Development Architecture

> **48-Hour Hackathon Build Guide**
> Step-by-step development tasks for the team.

---

## Quick Reference

| Component | Technology | Database |
|-----------|------------|----------|
| Mobile App | React Native | - |
| Web Dashboard | React | - |
| Backend API | Django REST Framework | SQLite (dev) |
| Video Storage | Cloudflare Stream | - |
| Auth | Email + Password (No verification) | JWT |

---

## Project Structure

```
AutiSahara-nepal/
├── backend/                    # Django REST Framework
│   ├── autisahara/            # Project settings
│   ├── accounts/              # User auth (parents, doctors)
│   ├── children/              # Child profiles & medical history
│   ├── assessments/           # M-CHAT & video submissions
│   └── therapy/               # Curriculum, progress, reviews
│
├── dashboard/                  # React (Doctor Portal)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/          # API calls
│   │   └── context/           # Auth state
│   └── package.json
│
├── mobile/                     # React Native (Parent App)
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/          # API calls
│   │   └── context/           # Auth state
│   └── package.json
│
└── docs/                       # Documentation
```

---

## Database Schema (SQLite)

### Core Models

```
┌─────────────────────────────────────────────────────────────────┐
│                           USERS                                 │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  email           VARCHAR UNIQUE                                 │
│  password        VARCHAR (hashed)                               │
│  role            ENUM ('parent', 'doctor', 'admin')             │
│  full_name       VARCHAR                                        │
│  phone           VARCHAR                                        │
│  created_at      DATETIME                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          DOCTORS                                │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  user_id         FK → Users                                     │
│  license_number  VARCHAR                                        │
│  certificate_url VARCHAR (Cloudflare URL)                       │
│  specialization  VARCHAR                                        │
│  is_approved     BOOLEAN (default: true for hackathon)          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                          CHILDREN                               │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  parent_id       FK → Users                                     │
│                                                                 │
│  # Section 1: Child's Basic Information                         │
│  full_name       VARCHAR                                        │
│  date_of_birth   DATE                                           │
│  age_years       INTEGER                                        │
│  age_months      INTEGER                                        │
│  gender          ENUM ('male', 'female', 'other')               │
│                                                                 │
│  created_at      DATETIME                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PARENT_DETAILS                              │
├─────────────────────────────────────────────────────────────────┤
│  id                    INTEGER PRIMARY KEY                      │
│  user_id               FK → Users                               │
│                                                                 │
│  # Section 2: Parent/Guardian Information                       │
│  mother_name           VARCHAR                                  │
│  mother_age            INTEGER                                  │
│  mother_occupation     VARCHAR                                  │
│  father_name           VARCHAR                                  │
│  father_age            INTEGER                                  │
│  father_occupation     VARCHAR                                  │
│  primary_caregiver     ENUM ('mother', 'father',                │
│                              'grandparent', 'other')            │
│  primary_caregiver_other VARCHAR (nullable)                     │
│                                                                 │
│  # Section 3: Contact Information                               │
│  home_address          VARCHAR                                  │
│  municipality          VARCHAR                                  │
│  district              VARCHAR                                  │
│  province              ENUM ('1', '2', 'bagmati', 'gandaki',    │
│                              'lumbini', 'karnali', 'sudurpaschim')│
│  primary_phone         VARCHAR                                  │
│  has_whatsapp          BOOLEAN                                  │
│  secondary_phone       VARCHAR (nullable)                       │
│  email                 VARCHAR (nullable)                       │
│                                                                 │
│  # Section 7: Technology Access                                 │
│  smartphone_comfort    ENUM ('very_comfortable',                │
│                              'somewhat_comfortable',            │
│                              'need_help', 'not_comfortable')    │
│  consent_followup      BOOLEAN                                  │
│  consent_research      BOOLEAN                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      HOUSEHOLD                                  │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  parent_id       FK → Users                                     │
│                                                                 │
│  # Section 4: Household & Family                                │
│  has_mother              BOOLEAN                                │
│  has_father              BOOLEAN                                │
│  siblings_count          INTEGER (default: 0)                   │
│  has_maternal_grandparents BOOLEAN                              │
│  has_paternal_grandparents BOOLEAN                              │
│  has_uncle_aunt          BOOLEAN                                │
│  has_other_relatives     BOOLEAN                                │
│  has_helper              BOOLEAN                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CHILD_EDUCATION                              │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  child_id        FK → Children                                  │
│                                                                 │
│  # Section 5: Education & Daily Routine                         │
│  is_in_school        BOOLEAN                                    │
│  school_name         VARCHAR (nullable)                         │
│  grade_class         VARCHAR (nullable)                         │
│  school_type         ENUM ('government', 'private',             │
│                            'special_school') (nullable)         │
│  transport_to_school ENUM ('walk', 'bus',                       │
│                            'private_vehicle', 'other') (nullable)│
│                                                                 │
│  # Daily Routine (store as TIME)                                │
│  wake_up_time        TIME                                       │
│  breakfast_time      TIME                                       │
│  school_start_time   TIME (nullable)                            │
│  school_end_time     TIME (nullable)                            │
│  lunch_time          TIME                                       │
│  nap_start_time      TIME (nullable)                            │
│  nap_end_time        TIME (nullable)                            │
│  evening_activities  VARCHAR                                    │
│  dinner_time         TIME                                       │
│  sleep_time          TIME                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CHILD_HEALTH                                │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  child_id        FK → Children                                  │
│                                                                 │
│  # Section 6: Health Information                                │
│  height           VARCHAR (can be cm or ft)                     │
│  weight           VARCHAR (can be kg or lbs)                    │
│  has_vaccinations ENUM ('yes', 'no', 'not_sure')                │
│  medical_conditions TEXT (nullable)                             │
│  taking_medication BOOLEAN                                      │
│  medication_list  TEXT (nullable)                               │
│                                                                 │
│  # Professionals seen (store as JSON array or separate flags)   │
│  seen_pediatrician        BOOLEAN                               │
│  seen_child_psychiatrist  BOOLEAN                               │
│  seen_speech_therapist    BOOLEAN                               │
│  seen_occupational_therapist BOOLEAN                            │
│  seen_psychologist        BOOLEAN                               │
│  seen_special_educator    BOOLEAN                               │
│  seen_neurologist         BOOLEAN                               │
│  seen_traditional_healer  BOOLEAN                               │
│  seen_none               BOOLEAN                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   MEDICAL_HISTORY                               │
├─────────────────────────────────────────────────────────────────┤
│  id                        INTEGER PRIMARY KEY                  │
│  child_id                  FK → Children                        │
│                                                                 │
│  # Medical History Background (A1-A4)                           │
│  pregnancy_infection       BOOLEAN  # A1                        │
│  pregnancy_infection_desc  TEXT (nullable)                      │
│  birth_complications       BOOLEAN  # A2                        │
│  birth_complications_desc  TEXT (nullable)                      │
│  brain_injury_first_year   BOOLEAN  # A3                        │
│  brain_injury_desc         TEXT (nullable)                      │
│  family_autism_history     BOOLEAN  # A4                        │
│                                                                 │
│  # Auto-flag                                                    │
│  requires_specialist       BOOLEAN (auto-set if any YES)        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       MCHAT_RESPONSE                            │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  child_id        FK → Children                                  │
│                                                                 │
│  # 20 M-CHAT Questions (YES=true, NO=false)                     │
│  q1              BOOLEAN                                        │
│  q2              BOOLEAN                                        │
│  q3              BOOLEAN                                        │
│  q4              BOOLEAN                                        │
│  q5              BOOLEAN                                        │
│  q6              BOOLEAN                                        │
│  q7              BOOLEAN                                        │
│  q8              BOOLEAN                                        │
│  q9              BOOLEAN                                        │
│  q10             BOOLEAN                                        │
│  q11             BOOLEAN                                        │
│  q12             BOOLEAN                                        │
│  q13             BOOLEAN                                        │
│  q14             BOOLEAN                                        │
│  q15             BOOLEAN                                        │
│  q16             BOOLEAN                                        │
│  q17             BOOLEAN                                        │
│  q18             BOOLEAN                                        │
│  q19             BOOLEAN                                        │
│  q20             BOOLEAN                                        │
│                                                                 │
│  total_score     INTEGER (0-20, calculated)                     │
│  risk_level      ENUM ('low', 'medium', 'high')                 │
│  created_at      DATETIME                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ASSESSMENT_VIDEOS                            │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  child_id        FK → Children                                  │
│  video_type      ENUM ('walking', 'eating', 'speaking',         │
│                        'behavior', 'other')                     │
│  video_url       VARCHAR (Cloudflare Stream URL)                │
│  description     TEXT                                           │
│  uploaded_at     DATETIME                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    CHILD_ASSESSMENT                             │
├─────────────────────────────────────────────────────────────────┤
│  id                  INTEGER PRIMARY KEY                        │
│  child_id            FK → Children                              │
│  assigned_doctor_id  FK → Doctors (nullable)                    │
│  status              ENUM ('pending', 'in_review',              │
│                            'accepted', 'completed')             │
│  parent_confirmed    BOOLEAN (confirmation checkbox)            │
│  submitted_at        DATETIME                                   │
│  reviewed_at         DATETIME (nullable)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       CURRICULUM                                │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  title           VARCHAR                                        │
│  description     TEXT                                           │
│  duration_days   INTEGER (15, 30, or 45)                        │
│  type            ENUM ('general', 'specialized')                │
│  spectrum_type   VARCHAR (nullable, for specialized)            │
│  created_by      FK → Doctors                                   │
│  created_at      DATETIME                                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CURRICULUM_TASK                             │
├─────────────────────────────────────────────────────────────────┤
│  id                INTEGER PRIMARY KEY                          │
│  curriculum_id     FK → Curriculum                              │
│  day_number        INTEGER (1-45)                               │
│  title             VARCHAR                                      │
│  why_description   TEXT (why this task matters)                 │
│  instructions      TEXT (step-by-step)                          │
│  demo_video_url    VARCHAR (Cloudflare URL)                     │
│  order_index       INTEGER                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   CHILD_CURRICULUM                              │
├─────────────────────────────────────────────────────────────────┤
│  id              INTEGER PRIMARY KEY                            │
│  child_id        FK → Children                                  │
│  curriculum_id   FK → Curriculum                                │
│  assigned_by     FK → Doctors                                   │
│  start_date      DATE                                           │
│  end_date        DATE                                           │
│  status          ENUM ('active', 'completed', 'paused')         │
│  current_day     INTEGER                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   DAILY_PROGRESS                                │
├─────────────────────────────────────────────────────────────────┤
│  id                  INTEGER PRIMARY KEY                        │
│  child_curriculum_id FK → ChildCurriculum                       │
│  task_id             FK → CurriculumTask                        │
│  day_number          INTEGER                                    │
│  date                DATE                                       │
│  status              ENUM ('not_done', 'done_with_help',        │
│                            'done_without_help')                 │
│  video_url           VARCHAR (Cloudflare URL, nullable)         │
│  parent_notes        TEXT (nullable)                            │
│  submitted_at        DATETIME                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DOCTOR_REVIEW                                │
├─────────────────────────────────────────────────────────────────┤
│  id                  INTEGER PRIMARY KEY                        │
│  child_curriculum_id FK → ChildCurriculum                       │
│  doctor_id           FK → Doctors                               │
│  review_period       INTEGER (day 15, 30, or 45)                │
│  observations        TEXT                                       │
│  spectrum_identified VARCHAR (nullable)                         │
│  recommendations     TEXT                                       │
│  reviewed_at         DATETIME                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    DIAGNOSIS_REPORT                             │
├─────────────────────────────────────────────────────────────────┤
│  id                  INTEGER PRIMARY KEY                        │
│  child_id            FK → Children                              │
│  doctor_id           FK → Doctors                               │
│  has_autism          BOOLEAN                                    │
│  spectrum_type       VARCHAR (nullable)                         │
│  detailed_report     TEXT                                       │
│  next_steps          TEXT                                       │
│  created_at          DATETIME                                   │
│  shared_with_parent  BOOLEAN                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Complete Form Sections (For Mobile App)

### SECTION 1: Child's Basic Information

```
┌─────────────────────────────────────────────────────────────────┐
│  Note: All information will be kept strictly confidential       │
│  and used only to better support your child.                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Child's Full Name (बच्चाको पुरा नाम)                          │
│     [_______________________________________________]           │
│                                                                 │
│  2. Date of Birth (जन्म मिति)                                     │
│     [DD] / [MM] / [YYYY]                                        │
│                                                                 │
│  3. Age (उमेर)                                                   │
│     [____] Years  [____] Months                                 │
│                                                                 │
│  4. Gender (लिङ्ग)                                                │
│     ○ Male   ○ Female   ○ Other                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SECTION 2: Parent/Guardian Information

```
┌─────────────────────────────────────────────────────────────────┐
│  PARENT/GUARDIAN INFORMATION                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Mother's Name (आमाको नाम)                                    │
│     [_______________________________________________]           │
│                                                                 │
│  2. Mother's Age (आमाको उमेर)                                    │
│     [____] Years                                                │
│                                                                 │
│  3. Mother's Occupation (आमाको पेशा)                             │
│     [_______________________________________________]           │
│                                                                 │
│  4. Father's Name (बाबुको नाम)                                   │
│     [_______________________________________________]           │
│                                                                 │
│  5. Father's Age (बाबुको उमेर)                                   │
│     [____] Years                                                │
│                                                                 │
│  6. Father's Occupation (बाबुको पेशा)                            │
│     [_______________________________________________]           │
│                                                                 │
│  7. Primary Caregiver (बच्चाको हेरचाह गर्ने मुख्य व्यक्ति)            │
│     ○ Mother  ○ Father  ○ Grandparent  ○ Other: [______]        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SECTION 3: Contact Information

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTACT INFORMATION                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Home Address (ठेगाना)                                        │
│     [_______________________________________________]           │
│                                                                 │
│  2. Municipality/Village (नगरपालिका/गाउँ)                         │
│     [_______________________________________________]           │
│                                                                 │
│  3. District (जिल्ला)                                            │
│     [_______________________________________________]           │
│                                                                 │
│  4. Province (प्रदेश)                                            │
│     ○ 1  ○ 2  ○ Bagmati  ○ Gandaki                              │
│     ○ Lumbini  ○ Karnali  ○ Sudurpaschim                        │
│                                                                 │
│  5. Primary Phone Number (मुख्य फोन नम्बर) *                      │
│     [_______________________________________________]           │
│                                                                 │
│  6. WhatsApp Available? (व्हाट्सएप छ?) *                          │
│     ○ Yes  ○ No                                                 │
│                                                                 │
│  7. Secondary Phone Number (अर्को फोन नम्बर)                      │
│     [_______________________________________________]           │
│                                                                 │
│  8. Email Address (इमेल ठेगाना)                                   │
│     [_______________________________________________]           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SECTION 4: Household & Family

```
┌─────────────────────────────────────────────────────────────────┐
│  HOUSEHOLD & FAMILY                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Who lives in your home? (Check all that apply)                 │
│                                                                 │
│  □ Mother                                                       │
│  □ Father                                                       │
│  □ Child's siblings → How many? [____]                          │
│  □ Maternal grandparents                                        │
│  □ Paternal grandparents                                        │
│  □ Uncle/Aunt                                                   │
│  □ Other relatives                                              │
│  □ Help/maid                                                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SECTION 5: Education & Daily Routine

```
┌─────────────────────────────────────────────────────────────────┐
│  EDUCATION & DAILY ROUTINE                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Is your child currently going to school? (बच्चा स्कूल जान्छ?) │
│     ○ Yes  ○ No                                                 │
│                                                                 │
│  If YES:                                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  School Name: [_________________________________]       │    │
│  │  Grade/Class: [_________________________________]       │    │
│  │  Type of School:                                        │    │
│  │    ○ Government  ○ Private  ○ Special School            │    │
│  │  How does child get to school?                          │    │
│  │    ○ Walk  ○ Bus  ○ Private vehicle  ○ Other            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  2. Child's Daily Routine (Approximate times)                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Wakes up:        [____] AM                             │    │
│  │  Breakfast:       [____] AM                             │    │
│  │  School/Play:     [____] AM to [____] PM                │    │
│  │  Lunch:           [____] PM                             │    │
│  │  Nap:             [____] PM to [____] PM                │    │
│  │  Evening activities: [_________________________]        │    │
│  │  Dinner:          [____] PM                             │    │
│  │  Sleep time:      [____] PM                             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SECTION 6: Health Information

```
┌─────────────────────────────────────────────────────────────────┐
│  HEALTH INFORMATION                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Child's current height (उचाइ)                               │
│     [______] cm/ft                                              │
│                                                                 │
│  2. Child's current weight (तौल)                                │
│     [______] kg/lbs                                             │
│                                                                 │
│  3. Has your child had routine vaccinations? (नियमित खोप?)       │
│     ○ Yes  ○ No  ○ Not sure                                     │
│                                                                 │
│  4. Any current medical conditions?                             │
│     (e.g., asthma, epilepsy, allergies)                         │
│     [_______________________________________________]           │
│                                                                 │
│  5. Is your child currently taking any medication?              │
│     ○ Yes  ○ No                                                 │
│     If YES, please list:                                        │
│     [_______________________________________________]           │
│                                                                 │
│  6. Has your child seen any of these professionals?             │
│     (Check all that apply)                                      │
│                                                                 │
│     □ Pediatrician                                              │
│     □ Child psychiatrist                                        │
│     □ Speech therapist                                          │
│     □ Occupational therapist                                    │
│     □ Psychologist                                              │
│     □ Special educator                                          │
│     □ Neurologist                                               │
│     □ Traditional healer                                        │
│     □ None of the above                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### SECTION 7: Technology Access & Consent

```
┌─────────────────────────────────────────────────────────────────┐
│  TECHNOLOGY ACCESS                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. How comfortable are you with using smartphone apps?         │
│     ○ Very comfortable                                          │
│     ○ Somewhat comfortable                                      │
│     ○ Need help to use apps                                     │
│     ○ Not comfortable                                           │
│                                                                 │
│  2. May we contact you for follow-up?                           │
│     (हामी तपाईंलाई सम्पर्क गर्न सक्छौं?)                             │
│     ○ Yes  ○ No                                                 │
│                                                                 │
│  3. May we use anonymous information for research               │
│     to help other children?                                     │
│     (अन्य बच्चाहरूलाई मद्दत गर्न अनामी जानकारी प्रयोग गर्न सक्छौं?)     │
│     ○ Yes  ○ No                                                 │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  DECLARATION                                                    │
│                                                                 │
│  □ I confirm that the information provided above is accurate    │
│    to the best of my knowledge.                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Medical History Background (A1-A4)

> **Note**: This section appears AFTER basic info, BEFORE M-CHAT.
> If ANY answer is YES → Auto-flag for specialist attention.

```
┌─────────────────────────────────────────────────────────────────┐
│  MEDICAL HISTORY BACKGROUND                                     │
│  Please answer these questions about your child's health        │
│  history. Please choose Yes or No for every question.           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  A1. During your pregnancy with this child, did you have a      │
│      serious infection that required hospital treatment?        │
│      (For example, high fever with illness, German              │
│      measles/rubella, or other infection that worried           │
│      your doctor)                                               │
│                                                                 │
│      ○ YES  ○ NO                                                │
│                                                                 │
│      If YES, please describe:                                   │
│      [_______________________________________________]          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  A2. Was your child's birth complicated by an emergency or      │
│      did your baby need special care right after birth?         │
│      (For example, emergency cesarean section, baby needed      │
│      oxygen, baby stayed in NICU for more than a week, or       │
│      baby weighed less than 1.5 kg at birth)                    │
│                                                                 │
│      ○ YES  ○ NO                                                │
│                                                                 │
│      If YES, please describe:                                   │
│      [_______________________________________________]          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  A3. During your child's first year, did they have a serious    │
│      brain infection or significant head injury?                │
│      (For example, meningitis, encephalitis, or a serious       │
│      fall/accident that caused a head injury and required       │
│      hospital visit)                                            │
│                                                                 │
│      ○ YES  ○ NO                                                │
│                                                                 │
│      If YES, please describe:                                   │
│      [_______________________________________________]          │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  A4. Does your child have an older brother, sister, or cousin   │
│      who has been diagnosed with autism or serious              │
│      developmental delay?                                       │
│                                                                 │
│      ○ YES  ○ NO                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ⚠️  AUTO-FLAG LOGIC                                            │
├─────────────────────────────────────────────────────────────────┤
│  If ANY of A1, A2, A3, A4 = YES:                                │
│    → Set requires_specialist = true                             │
│    → Show warning banner to doctor                              │
│    → Recommend official doctor consultation                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## M-CHAT-R/F Questions (1-20)

> **Instructions for Parents**:
> Please answer these questions about your child. Keep in mind how your child
> **usually** behaves. If you have seen your child do the behavior a few times,
> but he or she does not usually do it, then please answer **NO**.

### M-CHAT Scoring System

```
┌─────────────────────────────────────────────────────────────────┐
│                    M-CHAT SCORING RULES                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SCORING:                                                       │
│  • Most questions: NO = 1 point, YES = 0 points                 │
│  • Reverse questions (Q2, Q5, Q12): YES = 1 point, NO = 0 points│
│                                                                 │
│  RISK LEVELS:                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Total Score    │  Risk Level  │  Action                │    │
│  ├─────────────────┼──────────────┼────────────────────────┤    │
│  │  0-2 points     │  LOW         │  No immediate concern  │    │
│  │  3-7 points     │  MEDIUM      │  Recommend follow-up   │    │
│  │  8-20 points    │  HIGH        │  Priority for doctor   │    │
│  └─────────────────┴──────────────┴────────────────────────┘    │
│                                                                 │
│  → Risk level is sent to doctors to save their time             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Complete M-CHAT Questions with Scoring

```
┌─────────────────────────────────────────────────────────────────┐
│  M-CHAT-R/F SCREENING QUESTIONNAIRE                             │
│  Target: Children aged 16-30 months                             │
├─────────────────────────────────────────────────────────────────┤

Q1. If you point at something across the room, does your child
    look at it?
    (For example, if you point at a toy or an animal, does your
    child look at the toy or animal?)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q2. Have you ever wondered if your child might be deaf?
    ⚠️ REVERSE SCORED

    ○ YES → 1 point  (concerning)
    ○ NO  → 0 points

────────────────────────────────────────────────────────────────

Q3. Does your child play pretend or make-believe?
    (For example, pretend to drink from an empty cup, pretend
    to talk on a phone, or pretend to feed a doll or stuffed
    animal?)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q4. Does your child like climbing on things?
    (For example, furniture, playground equipment, or stairs)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q5. Does your child make unusual finger movements near his or
    her eyes?
    (For example, does your child wiggle his or her fingers
    close to his or her eyes?)
    ⚠️ REVERSE SCORED

    ○ YES → 1 point  (concerning)
    ○ NO  → 0 points

────────────────────────────────────────────────────────────────

Q6. Does your child point with one finger to ask for something
    or to get help?
    (For example, pointing to a snack or toy that is out of reach)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q7. Does your child point with one finger to show you something
    interesting?
    (For example, pointing to an airplane in the sky or a big
    truck in the road)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q8. Is your child interested in other children?
    (For example, does your child watch other children, smile
    at them, or go to them?)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q9. Does your child show you things by bringing them to you or
    holding them up for you to see – not to get help, but just
    to share?
    (For example, showing you a flower, a stuffed animal, or
    a toy truck)

    ○ YES → 0 points
    ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q10. Does your child respond when you call his or her name?
     (For example, does he or she look up, talk or babble, or
     stop what he or she is doing when you call his or her name?)

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q11. When you smile at your child, does he or she smile back
     at you?

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q12. Does your child get upset by everyday noises?
     (For example, does your child scream or cry to noise such
     as a vacuum cleaner or loud music?)
     ⚠️ REVERSE SCORED

     ○ YES → 1 point  (concerning)
     ○ NO  → 0 points

────────────────────────────────────────────────────────────────

Q13. Does your child walk?

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q14. Does your child look you in the eye when you are talking
     to him or her, playing with him or her, or dressing him
     or her?

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q15. Does your child try to copy what you do?
     (For example, wave bye-bye, clap, or make a funny noise
     when you do)

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q16. If you turn your head to look at something, does your child
     look around to see what you are looking at?

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q17. Does your child try to get you to watch him or her?
     (For example, does your child look at you for praise, or
     say "look" or "watch me"?)

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q18. Does your child understand when you tell him or her to do
     something?
     (For example, if you don't point, can your child understand
     "put the book on the chair" or "bring me the blanket"?)

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q19. If something new happens, does your child look at your face
     to see how you feel about it?
     (For example, if he or she hears a strange or funny noise,
     or sees a new toy, will he or she look at your face?)

     ○ YES → 0 points
     ○ NO  → 1 point

────────────────────────────────────────────────────────────────

Q20. Does your child like movement activities?
     (For example, being swung or bounced on your knee)

     ○ YES → 0 points
     ○ NO  → 1 point

└─────────────────────────────────────────────────────────────────┘
```

### M-CHAT Scoring Algorithm (Backend)

```python
def calculate_mchat_score(responses: dict) -> tuple[int, str]:
    """
    Calculate M-CHAT score from responses.

    Args:
        responses: dict with keys 'q1' to 'q20', values are boolean
                   True = YES, False = NO

    Returns:
        (total_score, risk_level)
    """
    # Questions where YES = concerning (1 point)
    # These are REVERSE scored
    REVERSE_QUESTIONS = [2, 5, 12]

    total_score = 0

    for q_num in range(1, 21):
        answer = responses.get(f'q{q_num}')

        if q_num in REVERSE_QUESTIONS:
            # YES = 1 point (concerning), NO = 0 points
            if answer == True:
                total_score += 1
        else:
            # NO = 1 point (concerning), YES = 0 points
            if answer == False:
                total_score += 1

    # Determine risk level
    if total_score <= 2:
        risk_level = 'low'
    elif total_score <= 7:
        risk_level = 'medium'
    else:  # 8-20
        risk_level = 'high'

    return total_score, risk_level


# Example usage:
responses = {
    'q1': True,   # YES - looks at what you point to
    'q2': False,  # NO - never wondered if deaf
    'q3': True,   # YES - plays pretend
    'q4': True,   # YES - likes climbing
    'q5': False,  # NO - no unusual finger movements
    'q6': True,   # YES - points to ask
    'q7': True,   # YES - points to show
    'q8': True,   # YES - interested in children
    'q9': True,   # YES - shows things
    'q10': True,  # YES - responds to name
    'q11': True,  # YES - smiles back
    'q12': False, # NO - not upset by noises
    'q13': True,  # YES - walks
    'q14': True,  # YES - eye contact
    'q15': True,  # YES - copies actions
    'q16': True,  # YES - follows gaze
    'q17': True,  # YES - seeks attention
    'q18': True,  # YES - understands commands
    'q19': True,  # YES - checks reactions
    'q20': True,  # YES - likes movement
}

score, risk = calculate_mchat_score(responses)
# Result: score=0, risk='low'
```

### M-CHAT Quick Reference Table

| Q# | Question Summary | Concerning Answer | Score If Concerning |
|----|-----------------|-------------------|---------------------|
| 1 | Points & looks | NO | +1 |
| 2 | Wondered if deaf | **YES** | +1 |
| 3 | Pretend play | NO | +1 |
| 4 | Likes climbing | NO | +1 |
| 5 | Unusual finger movements | **YES** | +1 |
| 6 | Points to ask | NO | +1 |
| 7 | Points to show | NO | +1 |
| 8 | Interested in children | NO | +1 |
| 9 | Shows things | NO | +1 |
| 10 | Responds to name | NO | +1 |
| 11 | Smiles back | NO | +1 |
| 12 | Upset by noises | **YES** | +1 |
| 13 | Walks | NO | +1 |
| 14 | Eye contact | NO | +1 |
| 15 | Copies actions | NO | +1 |
| 16 | Follows gaze | NO | +1 |
| 17 | Seeks attention | NO | +1 |
| 18 | Understands commands | NO | +1 |
| 19 | Checks reactions | NO | +1 |
| 20 | Likes movement | NO | +1 |

**Bold = Reverse scored questions (2, 5, 12)**

---

## API Endpoints

### Authentication (Simple - No Email Verification)

```
POST   /api/auth/register/parent/
       Body: { email, password, full_name, phone }
       → Creates user with role='parent'
       → Returns JWT tokens immediately

POST   /api/auth/register/doctor/
       Body: { email, password, full_name, phone, license_number, specialization }
       → Creates user with role='doctor'
       → Auto-approves for hackathon (is_approved=true)
       → Returns JWT tokens immediately

POST   /api/auth/login/
       Body: { email, password }
       → Returns { access_token, refresh_token, user }

POST   /api/auth/refresh/
       Body: { refresh_token }
       → Returns new access_token

GET    /api/auth/me/
       → Returns current user profile
```

### Parent Profile & Details
```
GET    /api/parent/profile/                   # Get parent details
POST   /api/parent/profile/                   # Create/update parent details
PUT    /api/parent/profile/                   # Update parent details
POST   /api/parent/household/                 # Submit household info
```

### Child Management
```
POST   /api/children/register/       # RECOMMENDED - All sections at once
POST   /api/children/                # Basic info only
GET    /api/children/                # List my children
GET    /api/children/{id}/           # Child details
PUT    /api/children/{id}/           # Update child
```

#### POST /api/children/register/ - FULL EXAMPLE
```json
{
  "full_name": "Aarav Sharma",
  "date_of_birth": "2022-03-15",
  "age_years": 2,
  "age_months": 8,
  "gender": "male",

  "education": {
    "goes_to_school": true,
    "school_name": "Little Stars School",
    "grade_class": "Nursery",
    "school_type": "private",
    "transport_mode": "private_vehicle",
    "wake_up_time": "07:00",
    "breakfast_time": "08:00",
    "school_start_time": "09:30",
    "school_end_time": "14:00",
    "lunch_time": "12:30",
    "nap_start_time": "15:00",
    "nap_end_time": "16:30",
    "evening_activities": "Playing with toys",
    "dinner_time": "19:00",
    "sleep_time": "21:00"
  },

  "health": {
    "height_cm": 85.5,
    "weight_kg": 12.0,
    "has_vaccinations": "yes",
    "medical_conditions": "",
    "takes_medication": false,
    "medication_list": "",
    "seen_pediatrician": true,
    "seen_psychiatrist": false,
    "seen_speech_therapist": false,
    "seen_occupational_therapist": false,
    "seen_psychologist": false,
    "seen_special_educator": false,
    "seen_neurologist": false,
    "seen_traditional_healer": false,
    "seen_none": false
  },

  "medical_history": {
    "pregnancy_infection": false,
    "pregnancy_infection_desc": "",
    "birth_complications": false,
    "birth_complications_desc": "",
    "brain_injury_first_year": false,
    "brain_injury_desc": "",
    "family_autism_history": false
  }
}
```

**Field Options:**
| Field | Values |
|-------|--------|
| gender | `"male"` `"female"` `"other"` |
| school_type | `"government"` `"private"` `"special"` |
| transport_mode | `"walk"` `"bus"` `"private_vehicle"` `"other"` |
| has_vaccinations | `"yes"` `"no"` `"not_sure"` |
| Time fields | `"HH:MM"` format (24-hour) |

---

### Child Additional Info (for updating individual sections)
```
POST   /api/children/{id}/education/          # Create/Update Section 5
POST   /api/children/{id}/health/             # Create/Update Section 6
POST   /api/children/{id}/medical-history/    # Create/Update A1-A4
```

---

### M-CHAT Assessment
```
POST   /api/children/{id}/mchat/     # Submit screening
GET    /api/children/{id}/mchat/     # Get results
```

#### POST /api/children/{id}/mchat/ - FULL EXAMPLE
```json
{
  "q1": true,
  "q2": false,
  "q3": true,
  "q4": true,
  "q5": false,
  "q6": true,
  "q7": true,
  "q8": true,
  "q9": true,
  "q10": true,
  "q11": true,
  "q12": false,
  "q13": true,
  "q14": true,
  "q15": true,
  "q16": true,
  "q17": true,
  "q18": true,
  "q19": true,
  "q20": true
}
```

**Scoring:** `true` = YES, `false` = NO
- **Reverse questions (q2, q5, q12):** YES = concerning
- **All others:** NO = concerning
- **Risk:** 0-2 = Low, 3-7 = Medium, 8-20 = High

---

### Video Upload
```
POST   /api/children/{id}/videos/    # Upload video
GET    /api/children/{id}/videos/    # List videos
DELETE /api/children/{id}/videos/{vid_id}/
```

#### POST /api/children/{id}/videos/ - EXAMPLE
```json
{
  "video_type": "walking",
  "video_url": "https://cloudflare-stream-url.com/video123",
  "description": "Child walking in living room"
}
```

**video_type options:** `"walking"` `"eating"` `"speaking"` `"behavior"` `"playing"` `"other"`

---

### Assessment Submission
```
POST   /api/children/{id}/assessment/submit/   # Final submit
GET    /api/children/{id}/assessment/status/   # Check status
```

#### POST /api/children/{id}/assessment/submit/ - EXAMPLE
```json
{
  "parent_confirmed": true
}
```

**Status values:** `"pending"` → `"in_review"` → `"accepted"` → `"completed"`

---

### Doctor Dashboard
```
GET    /api/doctor/patients/pending/          # Pending assessments
       → Returns list with M-CHAT risk_level for prioritization
GET    /api/doctor/patients/{child_id}/       # Full child profile
POST   /api/doctor/patients/{child_id}/accept/ # Accept patient
GET    /api/doctor/patients/active/           # My active patients
```

### Curriculum Management (Therapy App)
```
GET    /api/therapy/curricula/                # List all curricula
GET    /api/therapy/curricula/{id}/           # Details + tasks
```

### Doctor Dashboard (Therapy App)
```
GET    /api/therapy/doctor/pending/           # Pending patients for review
GET    /api/therapy/doctor/patients/          # Accepted patients
GET    /api/therapy/doctor/patient/{id}/      # Full patient details
POST   /api/therapy/doctor/patient/{id}/accept/     # Accept patient
POST   /api/therapy/doctor/patient/{id}/assign/     # Assign curriculum
GET    /api/therapy/doctor/patient/{id}/progress/   # View progress
POST   /api/therapy/doctor/patient/{id}/review/     # Create review
```

#### POST /api/therapy/doctor/patient/{id}/assign/ - EXAMPLE
```json
{
  "curriculum_id": 1,
  "start_date": "2024-01-20"
}
```

#### POST /api/therapy/doctor/patient/{id}/review/ - EXAMPLE
```json
{
  "review_period": 15,
  "observations": "Child shows good progress with eye contact tasks...",
  "spectrum_identified": "mild",
  "recommendations": "Continue with current curriculum, increase social tasks"
}
```

---

### Parent Progress (Therapy App)
```
GET    /api/therapy/child/{id}/today/         # Today's tasks
POST   /api/therapy/child/{id}/submit/        # Submit progress
POST   /api/therapy/child/{id}/advance/       # Advance to next day
GET    /api/therapy/child/{id}/history/       # Progress history
GET    /api/therapy/child/{id}/curriculum/    # Curriculum status
```

#### POST /api/therapy/child/{id}/submit/ - EXAMPLE
```json
{
  "task_id": 1,
  "status": "done_with_help",
  "video_url": "https://cloudflare-stream-url.com/progress123",
  "notes": "Child completed task with assistance"
}
```

**status options:** `"not_done"` `"done_with_help"` `"done_without_help"`

---

### Diagnosis Reports (Therapy App)
```
POST   /api/therapy/doctor/patient/{child_id}/diagnosis/   # Create diagnosis report
GET    /api/therapy/child/{id}/reports/                    # View diagnosis reports
POST   /api/therapy/doctor/report/{id}/toggle-share/       # Toggle sharing with parent
```

#### POST /api/therapy/doctor/patient/{id}/diagnosis/ - EXAMPLE
```json
{
  "has_autism": true,
  "spectrum_type": "mild",
  "detailed_report": "Based on M-CHAT screening and behavioral observations, the child shows signs consistent with mild autism spectrum disorder...",
  "next_steps": "1. Enroll in speech therapy program\n2. Start 15-day introductory curriculum\n3. Schedule follow-up in 2 weeks",
  "shared_with_parent": true
}
```

**spectrum_type options:** `"none"` `"mild"` `"moderate"` `"severe"`

---

## Development Phases (48 Hours)

### PHASE 1: Foundation (Hours 0-8)

**Goal**: Project setup + Auth + Basic models

#### Backend Tasks

```
✅ 1.1 Django Project Setup
   cd backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
   django-admin startproject AutiSahara .
   python manage.py startapp accounts
   python manage.py startapp children
   python manage.py startapp assessments

✅ 1.2 Configure Settings
   - Add apps to INSTALLED_APPS
   - Configure REST_FRAMEWORK with JWT
   - Configure CORS for localhost:3000 and mobile
   - Set AUTH_USER_MODEL

✅ 1.3 User Model (accounts/models.py)
   - Custom User with email login (no username)
   - Add role field (parent/doctor/admin)
   - Add full_name, phone fields

✅ 1.4 Doctor Model
   - OneToOne to User
   - license_number, certificate_url, specialization
   - is_approved (default True for hackathon)

✅ 1.5 Auth Endpoints (accounts/views.py)
   - POST /api/auth/register/parent/
   - POST /api/auth/register/doctor/
   - POST /api/auth/login/
   - GET /api/auth/me/
   - No email verification needed

✅ 1.6 Parent Details Model
   - All fields from Section 2, 3, 7
   - ForeignKey to User

✅ 1.7 Household Model
   - All checkbox fields from Section 4
   - ForeignKey to User

✅ 1.8 Run Migrations
   python manage.py makemigrations
   python manage.py migrate
```

#### Dashboard Tasks

```
□ 1.9 React Project Setup
   cd dashboard
   npm create vite@latest . -- --template react
   npm install react-router-dom axios tailwindcss postcss autoprefixer
   npx tailwindcss init -p

□ 1.10 Configure Tailwind
   - Update tailwind.config.js
   - Add Tailwind to index.css

□ 1.11 Setup Routing
   - Create pages folder
   - Setup React Router
   - Create: Login, Register, Dashboard pages

□ 1.12 Auth Context
   - Create AuthContext
   - Store JWT in localStorage
   - Create useAuth hook

□ 1.13 API Service
   - Create axios instance with baseURL
   - Add JWT interceptor
   - Create auth service functions

□ 1.14 Login Page
   - Email + Password form
   - Call login API
   - Redirect to dashboard on success

□ 1.15 Doctor Register Page
   - Email, Password, Name, Phone
   - License Number, Specialization
   - Submit and auto-login
```

#### Mobile Tasks

```
✅ 1.16 React Native Setup
   - Using Expo 54.0.30 with Expo Router
   - Installed: axios, AsyncStorage, i18next, react-native-reanimated
   - File-based routing configured

✅ 1.17 Setup Navigation
   - Stack navigation (Expo Router)
   - Auth stack: /auth/login, /auth/register
   - Form stack: /form/section-1 through section-7
   - Tab navigation: Home, Resources, Journal, Chat, Profile

✅ 1.18 Auth Context
   - LanguageContext for multilingual support (EN/NE)
   - JWT token stored in AsyncStorage
   - User data persistence

✅ 1.19 API Service
   - Axios with EXPO_PUBLIC_BASE_URL from .env
   - Bearer token authorization in headers
   - 30s timeout configured

✅ 1.20 Login Screen
   - Email + Password inputs with validation
   - API call to /api/auth/login/
   - Token extraction and AsyncStorage save
   - Redirect to /form/section-1 on success

✅ 1.21 Parent Register Screen
   - Full Name, Email, Phone, Password, Confirm Password
   - Validation (email format, password length, matching)
   - API call to /api/auth/register/parent/
   - Error handling with field-specific messages
```

---

### PHASE 2: Child Registration & Forms (Hours 8-18)

**Goal**: Complete registration flow (Sections 1-7)

#### Backend Tasks

```
✅ 2.1 Child Model (children/models.py)
   - Section 1 fields: full_name, dob, age_years, age_months, gender
   - ForeignKey to Parent

✅ 2.2 ChildEducation Model
   - All Section 5 fields
   - ForeignKey to Child

✅ 2.3 ChildHealth Model
   - All Section 6 fields
   - ForeignKey to Child

✅ 2.4 Child Endpoints
   - POST /api/children/
   - GET /api/children/
   - GET /api/children/{id}/
   - PUT /api/children/{id}/

✅ 2.5 Parent Profile Endpoints (Done in Phase 1)
   - POST /api/parent/profile/
   - GET /api/parent/profile/
   - POST /api/parent/household/

✅ 2.6 Child Education & Health Endpoints
   - POST /api/children/{id}/education/
   - POST /api/children/{id}/health/
   - POST /api/children/{id}/medical-history/

✅ 2.7 Combined Child Registration Endpoint (RECOMMENDED)
   - POST /api/children/register/
   - Accepts child info + education + health + medical_history in ONE call
   - Frontend collects all form data, submits at the end
   - Returns complete child profile with all sections
```

#### Mobile Tasks

```
✅ 2.7 Create Form Navigation
   - StepIndicator component showing 1/7 progress
   - Back/Next navigation buttons
   - Bilingual labels (Nepali/English)

✅ 2.8 Section 1 Screen: Child Basic Info (app/form/section-1.tsx)
   - Full name input
   - Date of birth with DateTimePicker
   - Age auto-calculated (years/months)
   - Gender selection (Male/Female/Other)
   - Nepali labels included

✅ 2.9 Section 2 Screen: Parent Info (app/form/section-2.tsx)
   - Mother: name, age, occupation
   - Father: name, age, occupation
   - Primary caregiver selector (Mother/Father/Both/Other)

✅ 2.10 Section 3 Screen: Contact Info (app/form/section-3.tsx)
   - Address, Municipality, District
   - Province dropdown (7 provinces)
   - Primary & Alternate phone
   - WhatsApp checkbox
   - Email (optional)

✅ 2.11 Section 4 Screen: Household (app/form/section-4.tsx)
   - Multi-select: Grandparents, Siblings, Uncles/Aunts, etc.
   - Siblings count input
   - Info box explaining purpose

✅ 2.12 Section 5 Screen: Education & Routine (app/form/section-5.tsx)
   - School yes/no toggle
   - Conditional: School name, Grade, Type (Public/Private/Special)
   - Time pickers: Wake up, Sleep time

✅ 2.13 Section 6 Screen: Health (app/form/section-6.tsx)
   - Height (cm) & Weight (kg)
   - Vaccination status (Complete/Incomplete/Unknown)
   - Medical conditions textarea
   - Medication yes/no with details
   - Professionals consulted (8 options multi-select)

✅ 2.14 Section 7 Screen: Technology & Consent (app/form/section-7.tsx)
   - Smartphone comfort (1-5 scale)
   - Data collection consent (required)
   - Video recording consent (optional)
   - Declaration checkbox (required)

✅ 2.15 Submit Child Registration
   - Collects all form data from AsyncStorage
   - Validates required fields
   - POST /api/children/register/ with Bearer token
   - Clears form data on success
   - Redirects to /(tabs) dashboard
```

---

### PHASE 3: Medical History & M-CHAT (Hours 18-28)

**Goal**: A1-A4 questions + M-CHAT with scoring

#### Backend Tasks

```
✅ 3.1 MedicalHistory Model (Done in Phase 2 - children/models.py)
   - A1-A4 boolean fields
   - Description fields for each
   - requires_specialist auto-flag

✅ 3.2 MChatResponse Model (assessments/models.py)
   - q1-q20 boolean fields
   - total_score integer
   - risk_level enum

✅ 3.3 M-CHAT Scoring Logic
   - Implement calculate_mchat_score()
   - Handle reverse questions (2, 5, 12)
   - Calculate risk level

✅ 3.4 Medical History Endpoints (Done in Phase 2)
   - POST /api/children/{id}/medical-history/
   - GET /api/children/{id}/medical-history/

✅ 3.5 M-CHAT Endpoints
   - POST /api/children/{id}/mchat/
     → Auto-calculate and save score
   - GET /api/children/{id}/mchat/

✅ 3.6 Assessment Video Endpoints (Phase 4 - done early)
   - POST /api/children/{id}/videos/
   - GET /api/children/{id}/videos/
   - DELETE /api/children/{id}/videos/{vid_id}/

✅ 3.7 Assessment Submit Endpoints (Phase 4 - done early)
   - POST /api/children/{id}/assessment/submit/
   - GET /api/children/{id}/assessment/status/
```

**Note for Frontend:** Video & Assessment endpoints are ready. See Phase 4 Mobile Tasks for UI implementation.

#### Mobile Tasks

```
✅ 3.6 Medical History Screen (A1-A4) (app/mchat/medical-history.tsx)
   - 4 questions (A1-A4) with Yes/No buttons
   - Description field appears when Yes selected
   - Warning banner if any risk factors detected
   - Nepali/English bilingual labels

✅ 3.7 M-CHAT Instructions Screen (app/mchat/instructions.tsx)
   - Explains the questionnaire purpose
   - Age requirement note (16-30 months)
   - "Keep in mind usual behavior" instruction
   - Scoring breakdown (Low/Medium/High risk)
   - Privacy note about confidentiality

✅ 3.8 M-CHAT Questions Screen (app/mchat/questions.tsx)
   - All 20 M-CHAT questions with pagination
   - Yes/No selection with visual feedback
   - Progress bar and question number indicator
   - Examples shown under each question
   - Navigation dots to jump between questions
   - Handles reverse-scored questions (Q2, Q5, Q12)

✅ 3.9 M-CHAT Submit & Results
   - Submits all 20 answers to API
   - Falls back to local scoring if offline
   - Calculates total score and risk level
   - API endpoint: POST /api/children/{id}/mchat/

✅ 3.10 Risk Level Result Screen (app/mchat/results.tsx)
   - Display score (X/20) with circular indicator
   - Color-coded risk level badge
   - Detailed result explanation (Nepali/English)
   - Recommendations based on risk level
   - Next steps guide for parents
   - Navigate to dashboard button
```

#### Dashboard Tasks

```
□ 3.11 Pending Patients List
   - Show all pending assessments
   - Display child name, age, M-CHAT risk level
   - Color code by risk (high priority = red)
   - Click to view details

□ 3.12 Patient Detail View
   - All Section 1-7 info
   - Medical history (A1-A4) with flags
   - M-CHAT results and score
```

---

### PHASE 4: Video Upload & Submission (Hours 28-36)

**Goal**: Video recording/upload + Final submission

#### Backend Tasks

```
⏭️ 4.1 Cloudflare Stream Integration (SKIPPED - Frontend handles upload)
   - Frontend uploads video directly to Cloudflare Stream
   - Frontend sends video_url to backend
   - No backend upload service needed for hackathon

✅ 4.2 AssessmentVideo Model (Done in Phase 3)
   - video_type enum
   - video_url, description
   - ForeignKey to Child

✅ 4.3 ChildAssessment Model (Done in Phase 3)
   - status enum (pending, in_review, accepted, completed)
   - parent_confirmed boolean
   - assigned_doctor ForeignKey

✅ 4.4 Video Endpoints (Done in Phase 3)
   - POST /api/children/{id}/videos/
   - GET /api/children/{id}/videos/
   - DELETE /api/children/{id}/videos/{vid_id}/

✅ 4.5 Assessment Submit Endpoint (Done in Phase 3)
   - POST /api/children/{id}/assessment/submit/
   - GET /api/children/{id}/assessment/status/
```

#### Mobile Tasks

```
□ 4.6 Video Upload Screen
   - Select video type: Walking, Eating, Speaking, Behavior, Playing, Other
   - "Choose from Gallery" button (pick existing video from device)
   - Preview selected video
   - Add description text field
   - Upload to Cloudflare Stream
   - Show upload progress bar
   - Submit button → POST /api/children/{id}/videos/

□ 4.7 Video List Screen
   - Show all uploaded videos
   - Video thumbnail, type label, date
   - Play video option
   - Delete option → DELETE /api/children/{id}/videos/{vid_id}/
   - "Add Another Video" button

□ 4.8 Confirmation Screen
   - Summary of all submitted info (child, M-CHAT score, videos count)
   - Declaration checkbox: "I confirm this information is accurate"
   - Final submit button → POST /api/children/{id}/assessment/submit/

□ 4.9 Success Screen
   - "Assessment submitted!"
   - "A doctor will review soon"
   - Show assessment status
   - "View Status" button → GET /api/children/{id}/assessment/status/
```

#### Dashboard Tasks

```
□ 4.12 Patient Videos View
   - List all videos for patient
   - Video player
   - Video type labels

□ 4.13 Accept Patient Flow
   - "Accept this patient" button
   - Confirmation popup
   - Update status to 'accepted'
```

---

### PHASE 5: Curriculum & Progress (Hours 36-44)

**Goal**: Daily tasks + Progress submission + Doctor review

#### Backend Tasks

```
✅ 5.1 Curriculum Model (therapy/models.py)
   - title, description, duration_days
   - type (general/specialized)
   - spectrum_type (for specialized)
   - created_by (FK to Doctor)

✅ 5.2 CurriculumTask Model
   - day_number, title
   - why_description, instructions
   - demo_video_url, order_index

✅ 5.3 ChildCurriculum Model
   - Assigns curriculum to child
   - start_date, end_date, current_day
   - status (active/paused/completed)

✅ 5.4 DailyProgress Model
   - task_id, day_number, date
   - status enum (not_done, done_with_help, done_without_help)
   - video_url, parent_notes

✅ 5.5 DoctorReview Model
   - review_period (15, 30, 45)
   - observations, spectrum_identified, recommendations

□ 5.6 Seed Sample Curriculum
   - Create 15-day general curriculum
   - Add 5-10 sample tasks

✅ 5.7 Curriculum Endpoints (GET /api/therapy/curricula/)
   - GET /api/therapy/curricula/
   - GET /api/therapy/curricula/{id}/

✅ 5.8 Doctor Dashboard Endpoints
   - GET /api/therapy/doctor/pending/
   - GET /api/therapy/doctor/patients/
   - GET /api/therapy/doctor/patient/{child_id}/
   - POST /api/therapy/doctor/patient/{child_id}/accept/
   - POST /api/therapy/doctor/patient/{child_id}/assign/
   - GET /api/therapy/doctor/patient/{child_id}/progress/
   - POST /api/therapy/doctor/patient/{child_id}/review/

✅ 5.9 Parent Progress Endpoints
   - GET /api/therapy/child/{id}/today/
   - POST /api/therapy/child/{id}/submit/
   - POST /api/therapy/child/{id}/advance/
   - GET /api/therapy/child/{id}/history/
   - GET /api/therapy/child/{id}/curriculum/
```

#### Mobile Tasks

```
□ 5.8 Curriculum Overview Screen
   - Show assigned curriculum
   - Duration, start date, current day
   - Progress indicator

□ 5.9 Today's Tasks Screen
   - List today's tasks
   - Task card with title

□ 5.10 Task Detail Screen
   - WHY section (highlighted)
   - Video player for demo
   - Text instructions

□ 5.11 Progress Submit Screen
   - Three options:
     ○ Not Done
     ○ Done with Help
     ○ Done without Help
   - Video recording option
   - Notes field
   - Submit button

□ 5.12 Progress History Screen
   - Calendar or list view
   - Show status for each day
   - Color coded
```

#### Dashboard Tasks

```
□ 5.13 Assign Curriculum Page
   - Select patient
   - Select curriculum
   - Set start date
   - Assign button

□ 5.14 Progress Review Table
   - Rows: Tasks
   - Columns: Days (1-15)
   - Cells: Status + Video link
   - Color coded status

□ 5.15 Review Form
   - Select review period (15/30/45)
   - Observations text
   - Spectrum identified (optional)
   - Recommendations
   - Submit review
```

---

### PHASE 6: Reports & Polish (Hours 44-48)

**Goal**: Diagnosis reports + Final testing + Demo prep

#### Backend Tasks

```
✅ 6.1 DiagnosisReport Model
   - has_autism boolean
   - spectrum_type (none/mild/moderate/severe)
   - detailed_report, next_steps
   - shared_with_parent boolean

✅ 6.2 DoctorReview Model (Done in Phase 5)
   - review_period, observations
   - spectrum_identified, recommendations

✅ 6.3 Report Endpoints
   - POST /api/therapy/doctor/patient/{child_id}/diagnosis/
   - GET /api/therapy/child/{id}/reports/
   - POST /api/therapy/doctor/report/{id}/toggle-share/

✅ 6.4 Review Endpoints (Done in Phase 5)
   - POST /api/therapy/doctor/patient/{child_id}/review/
```

#### Mobile Tasks

```
□ 6.5 Reports List Screen
   - Show all reports for child
   - Date, doctor name

□ 6.6 Report Detail Screen
   - Autism status
   - Spectrum type
   - Detailed report
   - Next steps

□ 6.7 UI Polish
   - Loading spinners
   - Error messages
   - Empty states
   - Pull to refresh
```

#### Dashboard Tasks

```
□ 6.8 Diagnosis Report Form
   - Has autism: Yes/No
   - Spectrum type dropdown
   - Detailed report textarea
   - Next steps textarea
   - Share with parent checkbox
   - Submit

□ 6.9 UI Polish
   - Loading states
   - Error handling
   - Responsive design
```

#### Final Tasks

```
□ 6.10 End-to-End Testing
   - Complete parent registration flow
   - Submit M-CHAT
   - Upload videos
   - Doctor review flow

□ 6.11 Demo Data Setup
   - Create test doctor account
   - Create test parent with child
   - Fill sample M-CHAT (medium risk)
   - Upload sample video
   - Create sample progress

□ 6.12 Demo Preparation
   - Write demo script
   - Practice flow
   - Backup screenshots
```

---

## Quick Start Commands

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers pillow
django-admin startproject AutiSahara .
python manage.py startapp accounts
python manage.py startapp children
python manage.py startapp assessments
python manage.py startapp curriculum
python manage.py startapp progress
python manage.py startapp reports
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Dashboard
```bash
cd dashboard
npm create vite@latest . -- --template react
npm install react-router-dom axios tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```

### Mobile
```bash
cd mobile
npx create-expo-app . --template blank
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install axios @react-native-async-storage/async-storage
npm install expo-camera expo-av expo-image-picker
npx expo start
```

---

## Environment Variables

### Backend (.env)
```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Cloudflare Stream
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_API_TOKEN=your-api-token

# JWT (in minutes)
ACCESS_TOKEN_LIFETIME=60
REFRESH_TOKEN_LIFETIME=1440
```

### Dashboard (.env)
```env
VITE_API_URL=http://localhost:8000/api
```

### Mobile (.env or constants.js)
```javascript
export const API_URL = 'http://YOUR_IP:8000/api';
// Use your computer's IP, not localhost, for mobile
```

---

## Team Assignment

| Role | Tasks | Priority |
|------|-------|----------|
| **Backend Dev** | Auth, Models, APIs, Cloudflare | Phase 1-4 |
| **Mobile Dev** | RN Setup, Forms, M-CHAT, Videos | Phase 1-4 |
| **Dashboard Dev** | React Setup, Patient Queue, Reviews | Phase 1, 3-5 |
| **All** | Testing, Demo Prep | Phase 6 |

---

## Hackathon Tips

1. **SQLite is fine** - No need for PostgreSQL setup
2. **Skip email verification** - Login immediately after register
3. **Auto-approve doctors** - `is_approved=True` by default
4. **Pre-seed curriculum** - Don't build curriculum creator UI
5. **Short videos** - Test with 5-10 second clips
6. **Focus on happy path** - Minimal error handling
7. **Mobile-first demo** - Dashboard is secondary
8. **M-CHAT risk level** - Show prominently to doctors

---

## API Testing Guide (Swagger)

### Step 0: Start the Server

```bash
cd backend
python manage.py runserver
```

Open: `http://localhost:8000/swagger/`

---

### Step 1: Register a Parent

**Endpoint**: `POST /api/auth/register/parent/`

1. Find "Authentication" section in Swagger
2. Click on `POST /api/auth/register/parent/`
3. Click "Try it out"
4. Enter this JSON body:

```json
{
  "email": "parent@test.com",
  "password": "test123",
  "full_name": "Ram Sharma",
  "phone": "9841234567"
}
```

5. Click "Execute"
6. **Copy the `access` token** from the response:

```json
{
  "user": {
    "id": 1,
    "email": "parent@test.com",
    "full_name": "Ram Sharma",
    "phone": "9841234567",
    "role": "parent"
  },
  "tokens": {
    "refresh": "eyJ...",
    "access": "eyJhbGciOiJIUzI1NiIs..."  ← COPY THIS
  }
}
```

---

### Step 2: Authorize Swagger with Token

1. Click the **"Authorize"** button (top right, lock icon)
2. In the popup, enter:
   ```
   Bearer eyJhbGciOiJIUzI1NiIs...your_access_token
   ```
   ⚠️ **Important**: Include the word `Bearer` followed by a space, then the token
3. Click "Authorize"
4. Click "Close"

Now all authenticated endpoints will work!

---

### Step 3: Test Get Current User

**Endpoint**: `GET /api/auth/me/`

1. Find "User Profile" section
2. Click on `GET /api/auth/me/`
3. Click "Try it out"
4. Click "Execute"
5. You should see your user data:

```json
{
  "id": 1,
  "email": "parent@test.com",
  "full_name": "Ram Sharma",
  "phone": "9841234567",
  "role": "parent",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Step 4: Create Parent Profile (Sections 2, 3, 7)

**Endpoint**: `POST /api/parent/profile/`

1. Find "Parent Profile" section
2. Click on `POST /api/parent/profile/`
3. Click "Try it out"
4. Enter this JSON body:

```json
{
  "mother_name": "Sita Sharma",
  "mother_age": 32,
  "mother_occupation": "Teacher",
  "father_name": "Ram Sharma",
  "father_age": 35,
  "father_occupation": "Engineer",
  "primary_caregiver": "mother",
  "home_address": "Kathmandu-10, Baneshwor",
  "municipality": "Kathmandu",
  "district": "Kathmandu",
  "province": "bagmati",
  "primary_phone": "9841234567",
  "has_whatsapp": true,
  "smartphone_comfort": "very_comfortable",
  "consent_followup": true,
  "consent_research": true
}
```

5. Click "Execute"
6. Response: 201 Created with parent details

---

### Step 5: Get Parent Profile

**Endpoint**: `GET /api/parent/profile/`

1. Click on `GET /api/parent/profile/`
2. Click "Try it out"
3. Click "Execute"
4. See saved parent details

---

### Step 6: Create Household Info (Section 4)

**Endpoint**: `POST /api/parent/household/`

1. Click on `POST /api/parent/household/`
2. Click "Try it out"
3. Enter this JSON body:

```json
{
  "has_mother": true,
  "has_father": true,
  "siblings_count": 1,
  "has_maternal_grandparents": true,
  "has_paternal_grandparents": false,
  "has_uncle_aunt": false,
  "has_other_relatives": false,
  "has_helper": false
}
```

4. Click "Execute"
5. Response: 201 Created with household info

---

### Step 7: Register a Doctor

**Endpoint**: `POST /api/auth/register/doctor/`

1. First, **Logout** (click Authorize → Logout)
2. Click on `POST /api/auth/register/doctor/`
3. Click "Try it out"
4. Enter this JSON body:

```json
{
  "email": "doctor@test.com",
  "password": "test123",
  "full_name": "Dr. Sita Thapa",
  "phone": "9851234567",
  "license_number": "NMC-12345",
  "specialization": "Child Psychiatry"
}
```

5. Click "Execute"
6. Copy the new access token and Authorize again

---

### Step 8: Test Login

**Endpoint**: `POST /api/auth/login/`

1. Click on `POST /api/auth/login/`
2. Click "Try it out"
3. Enter:

```json
{
  "email": "parent@test.com",
  "password": "test123"
}
```

4. Click "Execute"
5. Get new tokens (useful when token expires)

---

### Step 9: Refresh Token

**Endpoint**: `POST /api/auth/refresh/`

When access token expires (after 60 min), use refresh token:

1. Click on `POST /api/auth/refresh/`
2. Click "Try it out"
3. Enter:

```json
{
  "refresh": "eyJ...your_refresh_token..."
}
```

4. Click "Execute"
5. Get new access token

---

### Quick Reference: All Current Endpoints

| # | Method | Endpoint | Auth Required | Purpose |
|---|--------|----------|---------------|---------|
| 1 | POST | `/api/auth/register/parent/` | ❌ No | Register parent |
| 2 | POST | `/api/auth/register/doctor/` | ❌ No | Register doctor |
| 3 | POST | `/api/auth/login/` | ❌ No | Login |
| 4 | POST | `/api/auth/refresh/` | ❌ No | Refresh token |
| 5 | GET | `/api/auth/me/` | ✅ Yes | Get current user |
| 6 | GET | `/api/parent/profile/` | ✅ Yes | Get parent details |
| 7 | POST | `/api/parent/profile/` | ✅ Yes | Create/update parent |
| 8 | PUT | `/api/parent/profile/` | ✅ Yes | Update parent |
| 9 | GET | `/api/parent/household/` | ✅ Yes | Get household |
| 10 | POST | `/api/parent/household/` | ✅ Yes | Create/update household |
| 11 | POST | `/api/children/register/` | ✅ Yes | **Register child (all sections at once)** |
| 12 | POST | `/api/children/` | ✅ Yes | Add child (basic info only) |
| 13 | GET | `/api/children/` | ✅ Yes | List my children |
| 14 | GET | `/api/children/{id}/` | ✅ Yes | Get child details |
| 15 | PUT | `/api/children/{id}/` | ✅ Yes | Update child info |
| 16 | POST | `/api/children/{id}/education/` | ✅ Yes | Create/update education |
| 17 | POST | `/api/children/{id}/health/` | ✅ Yes | Create/update health |
| 18 | POST | `/api/children/{id}/medical-history/` | ✅ Yes | Create/update medical history |
| 19 | POST | `/api/children/{id}/mchat/` | ✅ Yes | Submit M-CHAT screening |
| 20 | GET | `/api/children/{id}/mchat/` | ✅ Yes | Get M-CHAT results |
| 21 | POST | `/api/children/{id}/videos/` | ✅ Yes | Upload assessment video |
| 22 | GET | `/api/children/{id}/videos/` | ✅ Yes | List videos |
| 23 | DELETE | `/api/children/{id}/videos/{vid}/` | ✅ Yes | Delete video |
| 24 | POST | `/api/children/{id}/assessment/submit/` | ✅ Yes | Submit final assessment |
| 25 | GET | `/api/children/{id}/assessment/status/` | ✅ Yes | Get assessment status |
| **Therapy - Curriculum** |
| 26 | GET | `/api/therapy/curricula/` | ✅ Yes | List all curricula |
| 27 | GET | `/api/therapy/curricula/{id}/` | ✅ Yes | Get curriculum details |
| **Therapy - Doctor Dashboard** |
| 28 | GET | `/api/therapy/doctor/pending/` | ✅ Doctor | Pending patients |
| 29 | GET | `/api/therapy/doctor/patients/` | ✅ Doctor | Accepted patients |
| 30 | GET | `/api/therapy/doctor/patient/{id}/` | ✅ Doctor | Patient details |
| 31 | POST | `/api/therapy/doctor/patient/{id}/accept/` | ✅ Doctor | Accept patient |
| 32 | POST | `/api/therapy/doctor/patient/{id}/assign/` | ✅ Doctor | Assign curriculum |
| 33 | GET | `/api/therapy/doctor/patient/{id}/progress/` | ✅ Doctor | View progress |
| 34 | POST | `/api/therapy/doctor/patient/{id}/review/` | ✅ Doctor | Create review |
| 35 | POST | `/api/therapy/doctor/patient/{id}/diagnosis/` | ✅ Doctor | Create diagnosis report |
| 36 | POST | `/api/therapy/doctor/report/{id}/toggle-share/` | ✅ Doctor | Toggle report sharing |
| **Therapy - Parent Progress** |
| 37 | GET | `/api/therapy/child/{id}/today/` | ✅ Parent | Today's tasks |
| 38 | POST | `/api/therapy/child/{id}/submit/` | ✅ Parent | Submit progress |
| 39 | POST | `/api/therapy/child/{id}/advance/` | ✅ Parent | Advance day |
| 40 | GET | `/api/therapy/child/{id}/history/` | ✅ Yes | Progress history |
| 41 | GET | `/api/therapy/child/{id}/curriculum/` | ✅ Yes | Curriculum status |
| 42 | GET | `/api/therapy/child/{id}/reports/` | ✅ Yes | View diagnosis reports |

---

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | No token or expired | Login again, copy new token |
| 403 Forbidden | Wrong role | Use correct user (parent vs doctor) |
| 400 Bad Request | Invalid data | Check JSON format and required fields |
| 404 Not Found | Resource missing | Create the resource first |

---

### Test Data for Copy-Paste

**Parent Registration:**
```json
{"email":"parent@test.com","password":"test123","full_name":"Ram Sharma","phone":"9841234567"}
```

**Doctor Registration:**
```json
{"email":"doctor@test.com","password":"test123","full_name":"Dr. Sita Thapa","phone":"9851234567","license_number":"NMC-12345","specialization":"Child Psychiatry"}
```

**Login:**
```json
{"email":"parent@test.com","password":"test123"}
```

**Parent Profile:**
```json
{"mother_name":"Sita Sharma","mother_age":32,"mother_occupation":"Teacher","father_name":"Ram Sharma","father_age":35,"father_occupation":"Engineer","primary_caregiver":"mother","home_address":"Kathmandu-10","municipality":"Kathmandu","district":"Kathmandu","province":"bagmati","primary_phone":"9841234567","has_whatsapp":true,"smartphone_comfort":"very_comfortable","consent_followup":true,"consent_research":true}
```

**Household:**
```json
{"has_mother":true,"has_father":true,"siblings_count":1,"has_maternal_grandparents":true,"has_paternal_grandparents":false,"has_uncle_aunt":false,"has_other_relatives":false,"has_helper":false}
```

**Child Full Registration (RECOMMENDED - all sections at once):**
```json
{
  "full_name": "Aarav Sharma",
  "date_of_birth": "2022-03-15",
  "age_years": 2,
  "age_months": 8,
  "gender": "male",
  "education": {
    "goes_to_school": true,
    "school_name": "Little Stars School",
    "grade_class": "Nursery",
    "school_type": "private",
    "transport_mode": "private_vehicle"
  },
  "health": {
    "height_cm": 85,
    "weight_kg": 12,
    "has_vaccinations": "yes",
    "takes_medication": false,
    "seen_pediatrician": true,
    "seen_none": false
  },
  "medical_history": {
    "pregnancy_infection": false,
    "birth_complications": false,
    "brain_injury_first_year": false,
    "family_autism_history": false
  }
}
```

**Child Basic Only (minimal):**
```json
{"full_name":"Aarav Sharma","date_of_birth":"2022-03-15","age_years":2,"age_months":8,"gender":"male"}
```

**M-CHAT Screening (all 20 questions):**
```json
{"q1":true,"q2":false,"q3":true,"q4":true,"q5":false,"q6":true,"q7":true,"q8":true,"q9":true,"q10":true,"q11":true,"q12":false,"q13":true,"q14":true,"q15":true,"q16":true,"q17":true,"q18":true,"q19":true,"q20":true}
```

---

*Last updated: Hackathon Day 1*
