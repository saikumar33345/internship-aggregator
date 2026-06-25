from jose import JWTError,jwt
from datetime import datetime,timedelta
from fastapi import Depends,HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import get_db
import os
from dotenv import load_dotenv
from app.models.user import User
from sqlalchemy import or_
from google.oauth2 import id_token
from google.auth.transport import requests
from app.schemas.user import GoogleLoginRequest

load_dotenv()

SECRET_KEY=os.getenv("SECRET_KEY")
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(data:dict):
    to_encode=data.copy()
    expire=datetime.now()+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exptime":expire.timestamp()})
    token=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return token

def verify_access_token(token:str):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
        user_id=payload.get("user_id")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None
    
def get_current_user(token:str=Depends(oauth2_scheme),db:Session=Depends(get_db)):
    user_id=verify_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=401,detail="Invalid or expired Token")
    user=db.query(User).filter(User.id==user_id).first()
    if user is None:
        raise HTTPException(status_code=401,detail="User Not Found")
    return user

