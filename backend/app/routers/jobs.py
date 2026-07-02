from fastapi import APIRouter ,Depends,HTTPException,BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate,JobResponse,JobUpdate
from app.services.fetch_jobs import fetch_and_save_jobs
from app.models.user import User
from app.services.auth import get_current_user
from app.services.ai_summary import generate_job_summary
import json

router=APIRouter(
    prefix="/jobs",tags=["Jobs"]
)

@router.get("/",response_model=List[JobResponse])
def get_jobs(db:Session=Depends(get_db),
             keyword:str=None,
             location:str=None,
             min_salary:str=None,
             skip:int=0,
             limit:int=10):
    
   
    query=db.query(Job)
    if keyword:
        query=query.filter(Job.title.icontains(keyword))
    if location:
        query=query.filter(Job.location.icontains(location))
    if min_salary:
        query=query.filter(Job.salary>=min_salary)
    
    jobs=query.order_by(Job.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@router.get("/{id}",response_model=JobResponse)
def get_job(id:int,db:Session=Depends(get_db)):
    job=db.query(Job).filter(Job.id==id).first()
    if not job:
        raise HTTPException(status_code=404,detail="Requested Job not Found")
    return job

@router.post("/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    new_job = Job(**job.model_dump())
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.delete("/{id}")
def delete_job(id:int,db:Session=Depends(get_db)):
    job=db.query(Job).filter(Job.id==id).first()
    if not job:
        raise HTTPException(status_code=404,detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message":"Requested Job Deleted Successfully"}

@router.put("/{id}",response_model=JobResponse)
def update_job(id:int,job:JobCreate,db:Session=Depends(get_db)):
    existing_job=db.query(Job).filter(Job.id==id).first()
    if not existing_job:
        raise HTTPException(status_code=404,detail="Requested job not found.please check")
    for key,value in job.model_dump().items():
        setattr(existing_job,key,value)
    db.commit()
    db.refresh(existing_job)
    return existing_job

@router.patch("/{id}",response_model=JobResponse)
def patch_job(id:int,job:JobUpdate,db:Session=Depends(get_db)):
    existing_job=db.query(Job).filter(Job.id==id).first()
    if not existing_job:
     raise HTTPException(status_code=404,detail="Job not found.Please check")
    for key,value in job.model_dump(exclude_unset=True).items():
        setattr(existing_job,key,value)
    db.commit()
    db.refresh(existing_job)
    return existing_job

@router.post("/fetch")
def trigger_fetch(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    print("FETCH STARTED")

    count = fetch_and_save_jobs(db)

    print(f"FETCH FINISHED - {count}")

    return {
        "message":
        f"✅ Fetch complete! {count} new jobs saved."
    }

@router.get("/{id}/summary")
def get_job_summary(
    id: int,
    db: Session = Depends(get_db)
):
    job = (
        db.query(Job)
        .filter(Job.id == id)
        .first()
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    if job.ai_summary:
        print(f"Using cached AI summary for job {id}")

        return json.loads(job.ai_summary)

    
    summary = generate_job_summary(
        job.description
    )
    error_messages={"AI summary temporarily unavailable",
                    "Unable to generate AI summary",}
    
    if(summary["what_youll_do"] and summary["what_youll_do"][0] in error_messages ):
     print(f"AI summary generation failed..")
     return summary

   
    job.ai_summary = json.dumps(summary)

    db.commit()

    print(f"Generated new AI summary for job {id}")

    return summary