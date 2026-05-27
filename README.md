# 🚀 Internship Aggregator Platform

> A full-stack platform that automatically fetches, filters, and alerts you about internship opportunities — so you never miss a relevant opening.

## 📌 What is this?

Most job boards require you to check manually every day. This platform:

- **Auto-fetches** internships from Remotive and Adzuna every 6 hours in the background
- **Lets you filter** by keyword, location, and minimum salary
- **Emails you** automatically when new jobs match your saved filters
- **Shows analytics** — top hiring companies, job trends, and live stats
- **Works end-to-end** — from a FastAPI backend to a deployed React frontend

---

## 🏗 Architecture

```
User (Browser)
     │
     ▼
React + Tailwind (Vercel)
     │  Axios HTTP calls
     ▼
FastAPI Backend (Railway)
     ├── PostgreSQL  ← permanent storage (users, jobs, alerts)
     ├── Redis       ← caching (job results, analytics)
     ├── APScheduler ← background job fetching every 6 hrs
     └── FastAPI-Mail ← email alerts on job matches
          │
          ▼
   External APIs
   (Remotive · Adzuna)
```

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Auth | Secure register, login, protected routes with bcrypt |
| 🤖 Auto Fetch | APScheduler pulls live jobs every 6 hours automatically |
| 🔍 Search & Filter | Filter by keyword, location, salary — live results |
| 💾 Save Jobs | Bookmark jobs to your profile |
| 🔔 Email Alerts | Set filters once, get emailed when matches arrive |
| 📊 Analytics | Top companies, job trends chart, live stat cards |
| ⚡ Redis Cache | API responses cached — fast load times |
| 🐳 Docker | One command runs the entire backend stack |
| 🚀 Deployed | Backend on Railway, Frontend on Vercel |

---

## 🛠 Tech Stack

### Backend
| Tool | Purpose |
|---|---|
| **FastAPI** | Web framework — API routes, validation, Swagger docs |
| **PostgreSQL** | Primary database |
| **SQLAlchemy** | ORM — Python models mapped to DB tables |
| **Alembic** | Database migrations |
| **Pydantic** | Request/response schema validation |
| **bcrypt + JWT** | Password hashing and auth tokens |
| **APScheduler** | Background job scheduler |
| **httpx** | Async HTTP client for external API calls |
| **Redis** | Response caching |
| **FastAPI-Mail** | Email alert delivery |

### Frontend
| Tool | Purpose |
|---|---|
| **React 19** | UI framework |
| **Tailwind CSS** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP calls to backend |
| **Recharts** | Analytics charts |

### DevOps
| Tool | Purpose |
|---|---|
| **Docker + Compose** | Containerisation |
| **Railway** | Backend + PostgreSQL deployment |
| **Vercel** | Frontend deployment |

---

## 📁 Project Structure

```
internship-aggregator/
├── backend/
│   ├── app/
│   │   ├── main.py          ← FastAPI entry point
│   │   ├── database.py      ← SQLAlchemy engine setup
│   │   ├── models/          ← DB table definitions
│   │   │   ├── user.py
│   │   │   ├── job.py
│   │   │   └── alert.py
│   │   ├── schemas/         ← Pydantic request/response schemas
│   │   │   ├── user.py
│   │   │   ├── job.py
│   │   │   └── alert.py
│   │   ├── routers/         ← Route files
│   │   │   ├── auth.py
│   │   │   ├── jobs.py
│   │   │   ├── alerts.py
│   │   │   └── analytics.py
│   │   └── services/        ← Business logic
│   │       ├── fetch_jobs.py
│   │       ├── email.py
│   │       └── scheduler.py
│   ├── alembic/             ← DB migrations
│   ├── .env.example         ← Environment variable template
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/      ← Navbar, JobCard, FilterBar, etc.
    │   ├── pages/           ← Jobs, Login, Register, Profile, Alerts
    │   ├── api/             ← Axios instance + API call functions
    │   └── App.jsx
    ├── .env.example
    └── tailwind.config.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16
- Redis
- Docker (optional but recommended)

---

### Backend

```bash
# 1. Clone the repo
git clone https://github.com/saikumar33345/internship-aggregator.git
cd internship-aggregator/backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Set up environment variables
cp .env.example .env
# Fill in your values in .env

# 5. Run database migrations
alembic upgrade head

# 6. Start the server
uvicorn app.main:app --reload
```

API will be live at: `http://localhost:8000`
Swagger docs at: `http://localhost:8000/docs`

---

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

Frontend will be live at: `http://localhost:5173`

---

### Docker (Recommended)

```bash
cd backend
docker-compose up --build
```

This starts FastAPI + PostgreSQL + Redis together with one command.

---

## 🔑 Environment Variables

Create a `.env` file in `/backend` based on `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/internship_db
JWT_SECRET=your_secret_key_here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=60

REDIS_URL=redis://localhost:6379

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your@gmail.com
EMAIL_PASSWORD=your_app_password
```

> ⚠️ Never commit your `.env` file. It's in `.gitignore`.

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Create new user | ❌ |
| POST | `/login` | Login, get JWT token | ❌ |
| GET | `/me` | Current user profile | ✅ |
| GET | `/jobs` | List jobs with filters | ✅ |
| GET | `/jobs/{id}` | Single job detail | ✅ |
| POST | `/saved-jobs/{id}` | Save a job | ✅ |
| GET | `/saved-jobs` | Get saved jobs | ✅ |
| POST | `/alerts` | Create alert filter | ✅ |
| GET | `/alerts` | List your alerts | ✅ |
| DELETE | `/alerts/{id}` | Delete an alert | ✅ |
| GET | `/analytics/top-companies` | Top hiring companies | ✅ |
| GET | `/analytics/jobs-over-time` | Job posting trends | ✅ |
| POST | `/admin/fetch-jobs` | Manually trigger job fetch | ✅ |

Full interactive docs available at `/docs` when running locally.

---

## 🗺 Roadmap

- [x] Project setup and folder structure
- [ ] JWT Authentication (register, login, protected routes)
- [ ] PostgreSQL models and Alembic migrations
- [ ] Job CRUD endpoints with filters and pagination
- [ ] External API integration (Remotive, Adzuna)
- [ ] APScheduler background job fetching
- [ ] React frontend with Tailwind UI
- [ ] Search, filter, and pagination UI
- [ ] Save jobs and profile page
- [ ] Email alert system
- [ ] Analytics dashboard with Recharts
- [ ] Redis caching
- [ ] Docker containerisation
- [ ] Deploy backend on Railway
- [ ] Deploy frontend on Vercel

---

## 👨‍💻 Author

**P V D Surya Sai Kumar**
- GitHub: [@saikumar33345](https://github.com/saikumar33345)
- Email: saikumar504539@gmail.com
- IIIT Sri City — ECE '27

---

## 📄 License

This project is licensed under the MIT License.

---

> Built as a portfolio project to demonstrate full-stack backend engineering skills.
> Every line of code written and understood from scratch.
