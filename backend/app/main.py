from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import jobs,auth,alerts,saved_jobs,analytics
from app.database import engine
from app.models.job import Job
from app.models.user import User
from app.models.alert import AlertFilter
from app.models.saved_job import SavedJob
from app.services.scheduler import start_scheduler


Job.metadata.create_all(bind=engine)
User.metadata.create_all(bind=engine)
AlertFilter.metadata.create_all(bind=engine)
SavedJob.metadata.create_all(bind=engine)


app=FastAPI(title="Internship Aggregator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://internship-aggregator-brown.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(saved_jobs.router)
app.include_router(analytics.router)

@app.on_event("startup")
def startup_event():
    start_scheduler()


@app.get("/")
def home():
    return {"message":"Intership Aggregator API is running!"}