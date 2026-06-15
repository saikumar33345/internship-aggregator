from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.saved_job import SavedJob
from app.models.job import Job
from app.schemas.job import JobResponse
from app.services.auth import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/saved-jobs",
    tags=["Saved Jobs"]
)

@router.post("/{job_id}")
def save_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    existing = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Job already saved")

    saved = SavedJob(user_id=current_user.id, job_id=job_id)
    db.add(saved)
    db.commit()
    return {"message": "Job saved successfully"}

@router.delete("/{job_id}")
def unsave_job(job_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id
    ).first()
    if not saved:
        raise HTTPException(status_code=404, detail="Saved job not found")

    db.delete(saved)
    db.commit()
    return {"message": "Job removed from saved"}

@router.get("/", response_model=list[JobResponse])
def get_saved_jobs(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    saved = db.query(SavedJob).filter(SavedJob.user_id == current_user.id).all()
    job_ids = [s.job_id for s in saved]
    jobs = db.query(Job).filter(Job.id.in_(job_ids)).all()
    return jobs