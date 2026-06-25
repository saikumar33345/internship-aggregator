from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import or_
from google.oauth2 import id_token
from google.auth.transport import requests
import os

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse,GoogleLoginRequest,UsernameUpdate,GoogleLinkRequest
from app.services.auth import create_access_token, get_current_user

from passlib.context import CryptContext

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_email = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_username = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    hashed = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    
    user = (
        db.query(User)
        .filter(
            or_(
                User.email == form_data.username,
                User.username == form_data.username
            )
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=403,
            detail="Invalid credentials"
        )

    if user.password is None:
        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In."
        )

    if not verify_password(
        form_data.password,
        user.password
    ):
        raise HTTPException(
            status_code=403,
            detail="Invalid credentials"
        )

    token = create_access_token(
        data={"user_id": user.id}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.post("/google")
def google_login(
    data: GoogleLoginRequest,
    db: Session = Depends(get_db),
):
    try:
        id_info = id_token.verify_oauth2_token(
            data.credential,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID"),
        )

        email = id_info["email"]
        google_id = id_info["sub"]

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token."
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:

        username = email.split("@")[0]
        base_username = username
        counter = 1

        while (
            db.query(User)
            .filter(User.username == username)
            .first()
        ):
            username = f"{base_username}{counter}"
            counter += 1

        user = User(
            username=username,
            email=email,
            password=None,
            google_id=google_id,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

    elif user.google_id is None:

        raise HTTPException(
            status_code=400,
            detail=(
                "This email is already registered. "
                "Please login using your password first "
                "and then link Google from your profile."
            ),
        )

    else:

        if user.google_id != google_id:
            raise HTTPException(
                status_code=401,
                detail="Google account mismatch."
            )

    token = create_access_token(
        data={"user_id": user.id}
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }

@router.post("/link-google")
def link_google_account(
    data: GoogleLinkRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        id_info = id_token.verify_oauth2_token(
            data.credential,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID"),
        )

        email = id_info["email"]
        google_id = id_info["sub"]

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid Google token."
        )

    # User already linked Google
    if current_user.google_id is not None:
        raise HTTPException(
            status_code=400,
            detail="Google account already linked."
        )

    # Google email must match account email
    if current_user.email != email:
        raise HTTPException(
            status_code=400,
            detail="Please choose the Google account associated with your registered email."
        )

    # Google account already linked elsewhere
    existing_google = (
        db.query(User)
        .filter(
            User.google_id == google_id,
            User.id != current_user.id,
        )
        .first()
    )

    if existing_google:
        raise HTTPException(
            status_code=400,
            detail="This Google account is already linked to another account."
        )

    current_user.google_id = google_id

    db.commit()
    db.refresh(current_user)

    return {
        "message": "Google account linked successfully."
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user
@router.patch("/username", response_model=UserResponse)
def update_username(
    data: UsernameUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    username = data.username.strip()

    if len(username) < 3:
        raise HTTPException(
            status_code=400,
            detail="Username must be at least 3 characters."
        )

    existing = (
        db.query(User)
        .filter(
            User.username == username,
            User.id != current_user.id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Username already taken."
        )

    current_user.username = username

    db.commit()
    db.refresh(current_user)

    return current_user