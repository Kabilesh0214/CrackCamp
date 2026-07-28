# 🚀 CrackCamp - Role-Based Interview Preparation Platform

Welcome to **CrackCamp**, an advanced role-based interview preparation platform designed to help aspiring software engineers, data analysts, cloud engineers, and cybersecurity professionals bridge the gap between academic theory and real-world hiring standards. 

CrackCamp guides users through structured role-specific learning paths, provides recommended reading and course materials, hosts an **Interactive Mock Interview Studio** with webcam/video upload capabilities, offers automated **AI Resume Analysis**, generates custom **4-week study roadmaps**, and embeds a **NestJS + Redis-cached AI Recruiter Chatbot** powered by Gemini.

---

## 🏗️ Architecture Overview

CrackCamp is built with a modern decoupled architecture consisting of a **React SPA frontend**, a **NestJS backend**, a **PostgreSQL relational database** for persistent data, and a **Redis in-memory store** for fast OTP processing, roadmap caching, and chatbot message buffering.

```mermaid
graph TD
    Client[React SPA Frontend\nVite + CSS] <-->|HTTP / REST| API[NestJS Backend API]
    API <-->|Prisma Client| DB[(PostgreSQL Database)]
    API <-->|ioredis| Cache[(Redis Server)]
    API -->|Nodemailer| SMTP[Gmail SMTP Service]
    API -->|Google Gen AI SDK| Gemini[Google Gemini API\ngemini-2.5-flash]
    API -->|SDK| S3[AWS S3 Bucket\nVideo Uploads]
```

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18+ (Vite)
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios (configured with interceptors for token auto-refresh and cookie handling)
- **Styling:** Vanilla CSS (Modern dark mode dashboard, glassmorphism, responsive grid layouts)
- **Multimedia:** HTML5 MediaDevices API (`getUserMedia` for webcam capture and recording)

### Backend
- **Framework:** NestJS (v11)
- **ORM:** Prisma Client (v7) using the Pg driver adapter for PostgreSQL
- **Database:** PostgreSQL (v15)
- **Cache & Temp Store:** Redis (v7)
- **Authentication:** JWT, Cookie-based authorization, Bcrypt hashing
- **Communications:** Nodemailer (SMTP for OTP mailing)
- **AI Integration:** Google Generative AI SDK (`@google/generative-ai` v2.5-flash)

### Deployment & DevOps
- **Containerization:** Docker & Docker Compose
- **Media Storage:** AWS S3 (pre-configured for uploading self-introduction videos)

---

## 📂 Project Directory Structure

```text
CrackCamp/
├── docker-compose.yml       # Orchestrates PostgreSQL, Redis, Backend, & Frontend
├── back-end/
│   ├── src/
│   │   ├── auth/            # JWT auth, Redis OTP signup flow, Gmail service
│   │   ├── chatbot/         # AI mentor chatbot service powered by Gemini 2.5
│   │   ├── dashboard/       # User profile & progress status controller (DSA, MCQ, Resume)
│   │   ├── mcq/             # Multiple choice question generator & test grading
│   │   ├── question-bank/   # Role-based interview question bank provider
│   │   ├── resources/       # Skill metadata, OpenLibrary books & seeded tutorials
│   │   ├── resume/          # AI Resume Analyser using Gemini (PDF parsing)
│   │   ├── roadmap/         # AI Roadmap generator using Gemini
│   │   ├── self-intro/      # Video upload controllers & AWS S3 integration
│   │   ├── prisma/          # Prisma database service connection
│   │   ├── main.ts          # NestJS bootstrapper & global config
│   │   └── app.module.ts    # Main application module injection
│   ├── prisma/
│   │   ├── schema.prisma    # Prisma DB Schema definition (Postgres)
│   │   ├── seed.ts          # DB Seed script populating MCQ, Q&A, and Tutorials
│   │   └── migrations/      # DB Schema migrations history
│   ├── Dockerfile           # Backend containerization rules
│   └── package.json         # Node dependencies
└── front-end/
    ├── src/
    │   ├── api/             # Axios instance config
    │   ├── components/      # Common components (Chatbot widget, ChatWindow)
    │   ├── pages/           # Page routes (Login, Register, Verify OTP, SelectRole, Dashboard, SelfIntro, MCQ, DSA, Roadmap, Resume)
    │   ├── App.jsx          # Protected/Public routing rules
    │   ├── index.css        # Core styling sheet (Dark mode colors, grid structure)
    │   └── main.jsx         # React application entry point
    ├── Dockerfile           # Frontend static development build container
    └── package.json         # UI dependencies
```

---

## 🌟 Core Features & Flows

### 1. Secure Authentication & Redis OTP Registration
To prevent spam accounts and verify email addresses, CrackCamp utilizes a robust dual-stage signup process:

```mermaid
sequenceDiagram
    participant User as React Frontend
    participant API as NestJS Backend
    participant Redis as Redis Cache
    participant DB as PostgreSQL
    participant Email as Gmail SMTP

    User->>API: 1. Register Request (Email, Pass, User)
    API->>API: Generate 6-Digit OTP & Hash Password
    API->>Redis: Store Temporary User Data (5 min expiry)
    API->>Email: Send OTP email to User
    API->>User: Response: OTP Sent

    User->>API: 2. Verify Request (Email, OTP)
    API->>Redis: Fetch Temporary User Data
    API->>API: Compare OTP Hash
    API->>DB: Save User to DB (Postgres)
    API->>Redis: Delete Temp User Cache
    API->>User: Issue JWT & Login Confirmation
```

- **Temporary Store:** User password and credentials are not saved to the persistent database until the OTP is successfully validated. Redis stores this data (`register:${email}`) with a Time-To-Live (TTL) of 300 seconds.
- **Login:** Traditional login is verified via Bcrypt hashes against PostgreSQL, returning a standard JWT token.

### 2. Career Track Selection & Role-Specific Curriculum
Upon sign-up, users select one of the following career tracks:
- 💻 **Web Developer** (Skills: React, JavaScript, CSS, NodeJS, HTML)
- 📊 **Data Analyst** (Skills: Python, SQL, Tableau, Excel, Pandas)
- 📱 **Application Developer** (Skills: Flutter, React Native, Swift, Kotlin, Java)
- ☁️ **Cloud Engineer** (Skills: AWS, Docker, Kubernetes, Terraform, CI/CD)
- 🔒 **Cybersecurity Analyst** (Skills: Network Security, Linux, Penetration Testing, Cryptography, Wireshark)
- 🧠 **Machine Learning Engineer** (Skills: Python, TensorFlow, PyTorch, Scikit-Learn, Deep Learning)

### 3. Command Center (Dashboard)
The dashboard displays the core skills associated with the user's active career track. Clicking any skill fetches:
- 📖 **Recommended Reference Books:** Pulled dynamically on the frontend via the open-source **OpenLibrary Search API** (`https://openlibrary.org/search.json?q={skill}`).
- 📹 **Seeded Video Tutorials:** Served from the local PostgreSQL `ResourceTutorial` table containing pre-vetted video content (e.g., Free vs Paid courses).

### 4. AI Study Roadmap Generator
Located at `/roadmap`, this module allows candidates to generate or regenerate a customized 4-week study path:
- **AI Planning:** Invokes Gemini (`gemini-2.5-flash`) with role-specific system prompts.
- **Structured Plan:** Produces a detailed schedule containing weekly themes, daily goals/tasks, milestones, and links to recommended resources (such as specific LeetCode tags or books).
- **Caching:** Roadmaps are cached in Redis (`roadmap:${userId}`) for 30 minutes to reduce API latency.

### 5. AI Resume Analyser
Located at `/resume`, users can drop their CV/Resume to get feedback:
- **PDF Text Extraction:** Parses PDF raw data using `pdf-parse`.
- **Targeted Grading:** Sends the extracted text to Gemini, scoring the resume on a scale of 0-100 relative to the requirements of the user's chosen career track.
- **Detailed Feedback:** Highlights strengths, gaps/weaknesses, missing keywords, and actionable optimization tips.

### 6. MCQ & Interview Question Arena
Includes local interactive practice modules populated with curated, database-backed questions:
- **MCQ Test:** Shuffles and delivers 10 role-specific multiple-choice questions with a 45-second timer per question. Scores are graded and saved to database history.
- **Question Bank:** Displays curated, categorized behavioral, technical, and system design questions mapped with standard model answers.

### 7. Interactive Recruiter Chatbot
Embedded as a floating widget on the dashboard:
- **Gemini Engine:** Powered by `gemini-2.5-flash` with system guidelines instructing it to act as a calm, helpful career coach.
- **State Optimization:** Caches the last 10 messages of the conversation in Redis (`chat:${conversationId}`) to achieve instantaneous response latency.

---

## 🛠️ Getting Started & Running Locally

### Prerequisites
- [Docker & Docker Desktop](https://www.docker.com/) installed on your machine.
- Node.js (v18+) if you wish to run services manually outside containers.

### Configuration (`.env`)
The backend service expects environment variables. A pre-set list is provided in `docker-compose.yml` for local development. For production deployment, ensure these are configured securely:

| Environment Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection URL |
| `REDIS_HOST` | Hostname of the Redis server (`redis` in Docker, `localhost` locally) |
| `JWT_SECRET` | Secret token signing string for JWT authorization |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail email & App password for sending OTP verification |
| `GEMINI_API_KEY` | Google Generative AI Developer key |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | AWS credentials for S3 uploads |
| `AWS_BUCKET_NAME` | AWS S3 Bucket Name for self-intro videos |

---

### Run using Docker Compose (Recommended)

This fires up PostgreSQL, Redis, NestJS, and React concurrently.

1. Navigate to the project root directory:
   ```bash
   cd CrackCamp
   ```
2. Build and run the containers:
   ```bash
   docker compose up -d --build
   ```
3. Sync the database schema and populate seed data:
   ```bash
   # Push current schema to Docker PostgreSQL DB
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/crackcamp" npx prisma db push --schema=back-end/prisma/schema.prisma

   # Seed the database
   DATABASE_URL="postgresql://postgres:postgres@localhost:5433/crackcamp" npx ts-node back-end/prisma/seed.ts
   ```
4. Once running:
   - **React Frontend:** Available at [http://localhost:5173](http://localhost:5173)
   - **NestJS Backend:** Available at [http://localhost:4000](http://localhost:4000)
   - **PostgreSQL:** Listening on port `5433` (externally)
   - **Redis:** Listening on port `6379` (externally)
