from sqlalchemy import Column,Integer,String,DateTime
from app.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__="users"

    id=Column(Integer,primary_key=True,index=True)
    email=Column(String,nullable=False,unique=True)
    password=Column(String,nullable=False)
    created_at = Column(DateTime, server_default=func.now())