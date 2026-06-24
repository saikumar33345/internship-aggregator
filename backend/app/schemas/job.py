from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class JobCreate(BaseModel):
    title:str
    company:str
    location:Optional[str]=None
    salary:Optional[str]=None
    job_type:Optional[str]=None
    source_url:Optional[str]=None
    description:Optional[str]=None
    ai_summary:Optional[str]=None

class JobUpdate(BaseModel):
    title:Optional[str]=None
    company:Optional[str]=None
    loction:Optional[str]=None
    salary:Optional[str]=None
    job_type:Optional[str]=None
    source_url:Optional[str]=None
    description:Optional[str]=None
    ai_summary:Optional[str]=None
class JobResponse(BaseModel):
    id:int
    title:str
    company:str
    location:Optional[str]=None
    salary:Optional[str]=None
    job_type:Optional[str]=None
    source_url:Optional[str]=None
    description:Optional[str]=None
    ai_summary:Optional[str]=None
    created_at:datetime


    class Config:
        from_attributes=True