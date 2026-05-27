from fastapi import FastAPI
from app.routers import jobs
from app.database import engine
from app.models.job import Job

Job.metadata.create_all(bind=engine)

app=FastAPI(title="Internship Aggregator API")

app.include_router(jobs.router)

@app.get("/")
def home():
    return {"message":"Intership Aggregator API is running!"}