from fastapi import APIRouter ,Depends,HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.job import Job
from app.schemas.job import JobCreate,JobResponse,JobUpdate

router=APIRouter(
    prefix="/jobs",tags=["Jobs"]
)

@router.get("/",response_model=List[JobResponse])
def get_jobs(db:Session=Depends(get_db)):
    jobs=db.query(Job).all()
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
    


