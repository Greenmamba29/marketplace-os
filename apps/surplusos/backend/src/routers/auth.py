from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.user import User, UserCreate, UserLogin, Token
from models.common import APIResponse
from services.auth import AuthService
from services.baserow import BaserowService

router = APIRouter()
security = HTTPBearer()

@router.post("/register", response_model=APIResponse[User])
async def register(user_data: UserCreate):
    return APIResponse.success_response(User(id="1", **user_data.model_dump()))

@router.post("/login", response_model=APIResponse[Token])
async def login(credentials: UserLogin):
    return APIResponse.success_response(Token(access_token="at", refresh_token="rt", expires_in=3600))
