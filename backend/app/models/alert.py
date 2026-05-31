from sqlalchemy import Column,Integer,String,ForeignKey
from sqlalchemy.sql import func
from sqlalchemy import DateTime
from app.database import Base

class AlertFilter(Base):
    __tablename__="alert_filters"

    id=Column(Integer,primary_key=True,index=True)
    user_id=Column(Integer,ForeignKey("users.id"),nullable=False)
    keywords=Column(String,nullable=True)
    location=Column(String,nullable=True)
    min_salary=Column(String,nullable=True)
    created_at=Column(DateTime,server_default=func.now())