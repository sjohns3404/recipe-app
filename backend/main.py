# Blank database main.py file
# Currently learning everything about FastAPI on their site and will be using this to test.

# Python can use async/await in order to creat asynchronous functiosn on the backend
# A coroutine is what is returned from an async await function

# My app will send the email and password data as a request body and this
# will respond with a response body. Requests must not use the GET request
# it causes undefined behavior
from typing import Annotated
from fastapi import FastAPI, Query, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
from pydantic import BaseModel

mock_db: dict[str, str] = {}

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
            detail="Invalid email or password"
        )

    stored_hash = mock_db[user.email]

    if not verify_password(user.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    print(f"User logging in: {user.email}")
    return {"message": "Login successful", "email": user.email}

