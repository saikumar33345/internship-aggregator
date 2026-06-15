from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.services.auth import get_current_user

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)

@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_jobs = db.query(func.count(Job.id)).scalar()
    total_users = db.query(func.count(User.id)).scalar()
    return {
        "total_jobs": total_jobs,
        "total_users": total_users,
    }

@router.get("/top-companies")
def get_top_companies(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(Job.company, func.count(Job.id).label("count"))
        .group_by(Job.company)
        .order_by(func.count(Job.id).desc())
        .limit(5)
        .all()
    )
    return [{"company": r.company, "count": r.count} for r in results]

@router.get("/jobs-by-type")
def get_jobs_by_type(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(Job.job_type, func.count(Job.id).label("count"))
        .group_by(Job.job_type)
        .order_by(func.count(Job.id).desc())
        .all()
    )
    return [{"job_type": r.job_type or "Unknown", "count": r.count} for r in results]
@router.get("/jobs-by-location")
def get_jobs_by_location(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = (
        db.query(Job.location, func.count(Job.id).label("count"))
        .group_by(Job.location)
        .order_by(func.count(Job.id).desc())
        .limit(5)
        .all()
    )
    return [{"location": r.location or "Unknown", "count": r.count} for r in results]