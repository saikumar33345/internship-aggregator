from fastapi import APIRouter,HTTPException,Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate,UserResponse
from app.services.auth import create_access_token,get_current_user
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

@router.post("/login")
def login(form_data:OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    user=db.query(User).filter(User.email==form_data.username).first()
    if not user :
        raise HTTPException(status_code=403,detail="Invalid credentials")
    if not verify_password(form_data.password,user.password):
        raise HTTPException(status_code=403,detail="Invalid Credentials")
    token=create_access_token(data={"user_id":user.id})
    return {"access_token":token,"token_type":"bearer"}

@router.get("/me",response_model=UserResponse)
def get_me(current_user:User=Depends(get_current_user)):
    return current_user