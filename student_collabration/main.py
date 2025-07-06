import uvicorn
from fastapi import FastAPI
from ROUTES.routing import router as api_router
from ROUTES.post_router import router as post_router
from ROUTES.comment_router import router as comment_router
from middlieware import Auth_middleware
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Student Collaboration App",
    description="A single app for students to collaborate",
    version="1.0.0"
    )

app.add_middleware(Auth_middleware)
app.include_router(api_router, prefix="/api/v1/user", tags=["users"])
app.include_router(post_router, prefix="/api/v1/post", tags=["posts"])
app.include_router(comment_router, prefix="/api/v1/comment", tags=["comments"]) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, adjust as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)