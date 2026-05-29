from fastapi import APIRouter,HTTPException,Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate,UserResponse
from passlib.context import CryptContext

router=APIRouter(prefix="/auth",tags=["Authentication"])

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str):
    return pwd_context.verify(plain_password,hashed_password)

@router.post("/register",response_model=UserResponse)
def register(user:UserCreate,db:Session=Depends(get_db)):
    existing_user=db.query(User).filter(User.email==user.email).first()
    if existing_user:
        raise HTTPException(status_code=400,detail="email is already registered")
    hashed=hash_password(user.password)
    new_user=User(email=user.email,password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
