from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func 
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=True)
    salary = Column(String, nullable=True)
    job_type = Column(String, nullable=True)
    source_url = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())