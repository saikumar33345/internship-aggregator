from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import jobs,auth,alerts
from app.database import engine
from app.models.job import Job
from app.models.user import User
from app.models.alert import AlertFilter


Job.metadata.create_all(bind=engine)
User.metadata.create_all(bind=engine)
AlertFilter.metadata.create_all(bind=engine)

app=FastAPI(title="Internship Aggregator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router)
app.include_router(auth.router)
app.include_router(alerts.router)

@app.get("/")
def home():
    return {"message":"Intership Aggregator API is running!"}