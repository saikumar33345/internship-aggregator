from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertCreate(BaseModel):
    keywords:Optional[str]=None
    location:Optional[str]=None
    min_salary:Optional[str]=None

class AlertResponse(BaseModel):
    id:int
    user_id:int
    keywords:Optional[str]=None
    location:Optional[str]=None
    min_salary:Optional[str]=None
    created_at:datetime

    class Config:
        from_attributes=True
    