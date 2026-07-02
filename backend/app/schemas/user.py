from pydantic import BaseModel, EmailStr
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str | None = None
    email: EmailStr
    google_id: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True


class GoogleLoginRequest(BaseModel):
    credential: str


class UsernameUpdate(BaseModel):
    username: str


class GoogleLinkRequest(BaseModel):
    credential: str

class ForgotPasswordRequest(BaseModel):
    email: str


class ResetPasswordRequest(BaseModel):
    email: str
    otp: str
    new_password: str