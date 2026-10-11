from typing import Annotated
import psycopg
from fastapi import FastAPI, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
from pydantic import BaseModel

mock_db: dict[str, str] = {}

DATABASE_URL = "postgresql://sjohns@localhost:5432/recipe_db"

def get_db():
    # Open connection for the request and automatically close when done
    with psycopg.connect(DATABASE_URL) as conn:
        yield conn

class UserAccount(BaseModel):
    email: str
    password: str


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    hashed_bytes = bcrypt.hashpw(password_bytes, bcrypt.gensalt())

    return hashed_bytes.decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool: 
    password_bytes = password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(password_bytes, hashed_bytes)

app = FastAPI()

origins = [
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup/")
async def sign_in_user(user: UserAccount):
    # Check if user exists in db
    if user.email in mock_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Hash the password and store data in db
    hashed_pwd = hash_password(user.password)
    mock_db[user.email] = hashed_pwd

    print(f"User registered: {user.email}")
    print(f"Current users in memory: {list(mock_db.keys())}")

    return {"message": "User registered successfully", "email": user.email}


@app.post("/login/")
async def login_user(user: UserAccount):
    if user.email not in mock_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Your email is not registered"
        )

    stored_hash = mock_db[user.email]

    if not verify_password(user.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your password is incorrect"
        )

    print(f"User logged in: {user.email}")
    return {"message": "Login successful", "email": user.email}

