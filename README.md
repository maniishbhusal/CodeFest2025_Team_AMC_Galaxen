# NeuroCare

Early autism screening and therapy management platform for children aged 16-30 months.

Built at **Code For Change Hackathon 2025** by Team AMC Galaxen.

## Clone the Repository

```bash
git clone git@github.com:maniishbhusal/CodeFest2025_Team_AMC_Galaxen.git
cd CodeFest2025_Team_AMC_Galaxen
```

## Overview

NeuroCare helps parents screen their children for autism spectrum disorder using the M-CHAT-R/F questionnaire, upload behavioral videos, and follow structured therapy curricula assigned by doctors.

## Features

- **M-CHAT Screening**: Standardized autism screening questionnaire
- **Video Upload**: Parents upload behavioral videos for doctor review
- **15-Day Assessment Program**: Structured daily tasks across 5 categories
- **Doctor Dashboard**: Review patients, track progress, create diagnosis reports
- **Therapy Curriculum**: Doctors assign specialized curricula based on assessment

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend API | Django REST Framework |
| Doctor Dashboard | React + Vite + TailwindCSS |
| Mobile App | React Native + Expo |
| Database | SQLite (dev) / PostgreSQL (prod) |

## Project Structure

```
├── backend/          # Django REST API
├── web/              # React doctor dashboard
├── app/              # React Native mobile app
└── docs/             # Documentation
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Doctor Dashboard

```bash
cd web
npm install
npm run dev
```

### Mobile App

```bash
cd app
npm install
npx expo start
```

## Environment Variables

### Backend
Create `.env` in `/backend`:
```
SECRET_KEY=your-secret-key
DEBUG=True
```

### Mobile App
Create `.env` in `/app`:
```
EXPO_PUBLIC_BASE_URL=http://your-backend-url:8000
```

### Web Dashboard
Create `.env` in `/web`:
```
VITE_API_URL=http://your-backend-url:8000
```

## Team AMC Galaxen

Built with care for early autism intervention.

## License

MIT
