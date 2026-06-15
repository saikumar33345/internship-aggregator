from sqlalchemy import Column,Integer,ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database import Base

class SavedJob(Base):
    __tablename__="saved_jobs"
    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id",ondelete="CASCADE"),nullable=False)
    job_id=Column(Integer,ForeignKey("jobs.id",ondelete="CASCADE"),nullable=False)
    created_at=Column(DateTime,server_default=func.now())