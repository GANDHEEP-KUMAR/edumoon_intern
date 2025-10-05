from utils import validate_token
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse


class Auth_middleware(BaseHTTPMiddleware):

    def __init__(self, app, exclude_paths : list=None):
        super().__init__(app)
        self.exclude_paths = exclude_paths or [
             "/docs",
            "/redoc", 
            "/openapi.json",
            "/api/v1/user/sign-up",
            "/api/v1/user/login"    
        ]
    async def dispatch(self, request: Request, call_next):
        
        if request.url.path in self.exclude_paths:
            return await call_next(request)
        
        authorization = request.headers.get("Authorization")

        if not authorization:
            return JSONResponse(
                status_code=401,
                content={"message": "Authorization header is recquired"}
            )
        
        if not validate_token(authorization):
            return JSONResponse(
                status_code=401,
                content={"message": "Invalid or expired token"}
            )
        response = await call_next(request)
        return response









