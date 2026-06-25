from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base
from sqlalchemy.sql import func

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, unique=True, nullable=True)

    email = Column(String, nullable=False, unique=True)

    password = Column(String, nullable=True)

    google_id = Column(String, unique=True, nullable=True)

    
    created_at = Column(
        DateTime,
        server_default=func.now()
    )