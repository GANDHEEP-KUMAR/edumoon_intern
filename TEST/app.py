import uvicorn
from fastapi import FastAPI
from routing import router as api_router
# from DBcreation import connect_to_mongo

app = FastAPI(
    title="Student Collaboration App",
    description="A single app for students to collaborate",
    version="1.0.0"
    )


app.include_router(api_router, prefix="/api/v1/user", tags=["users"])

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)