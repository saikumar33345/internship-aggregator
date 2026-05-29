from fastapi import FastAPI
from app.routers import jobs,auth
from app.database import engine
from app.models.job import Job
from app.models.user import User
Job.metadata.create_all(bind=engine)
User.metadata.create_all(bind=engine)

app=FastAPI(title="Internship Aggregator API")

app.include_router(jobs.router)
app.include_router(auth.router)

@app.get("/")
def home():
    return {"message":"Intership Aggregator API is running!"}