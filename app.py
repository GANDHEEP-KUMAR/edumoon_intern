import uvicorn
from fastapi import FastAPI,Path,Request,Form
from pydantic import BaseModel, Field
from typing import List
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
app = FastAPI(
    title = "testing python api",
    description = "This is a simple FastAPI application.",
    version = "1.0.0",
    openapi_tags=[
        {
            "name": "TESTING",
            "description": "FIRST TIME TESTING FAST API",
        },
        {
            "name": "TESTING2",
            "description": "SECOND TIME TESTING FAST API",
        }
    ],

)

@app.get("/test/{name}/{age}", tags = ["TESTING"])
async def read_root(name:str,age:int):
    return {"message": f"Welcome to my place i am {name} and i am {age} years old"}

@app.get("/test2", tags = ["TESTING"])
async def read_root(name:str="kumar",age:int="20"):
    return {"messageWelcome to my place i am ": name, "and i am" :age}

@app.get("/test3/{apiname}/{apiage}", tags = ["TESTING"])
async def root(
    apiname:str = Path(description="testing api parameters",example="  TEST FASTAPI", min_length=3, max_length=50)
    , apiage:int= Path(description="testing api parameters", example=20, ge=10, le=100)
    ):

    return {"message": f"Welcome to my api i am {apiname} and api is {apiage} years old"}

class testing(BaseModel):
    id: int
    name: str = Field(..., min_length=2, max_length=100)
    subjects: List[str] = []

@app.post("/testing", tags=["TESTING2"])
async def create_testing(testingobj: testing):
    """
    Create a new testing item.
    """
    return {
        "id": testingobj.id,
        "name": testingobj.name,
        "subjects": testingobj.subjects
    }

@app.get("/hey", tags=["greetings"])
async def hey(name: str, age: int):
    """
    A simple endpoint that greets the user by name.
    If no age is provided, it defaults to 30.
    """
    return {
        "name": name,
        "age": age,
    }

@app.get("/htmltest")
async def get_html():
    """
    Returns a simple HTML response.
    """
    html = """
    <html>
        <head>
            <title>My FastAPI Application</title>
        </head>
        <body>
            <h1>Welcome to My FastAPI Application!</h1>
            <p>This is a simple HTML response.</p>
        </body>
    </html>
    """
    return HTMLResponse(content=html, status_code=201)

templates = Jinja2Templates(directory="templates")

@app.get("/hello/{headtestP}/{num}") 
async def hello(request: Request, name1: str = "World",headtestP: str ="T", num: str = "Para"):
    return templates.TemplateResponse("hello.html", {"request": request, "name": name1,"headtest": headtestP, "num": num})

@app.get("/html/{name}", response_class=HTMLResponse)
async def get_html(name:str, request:Request):
    return templates.TemplateResponse("index.html", {"request": request, "name": name})


@app.get("/login", response_class=HTMLResponse)
async def login(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/submit")
async def submit(username: str = Form(...), password: str = Form(...)):
    """
    Handle the form submission.
    """
    # Here you would typically handle the login logic
    return {"message": f"Username: {username}, Password: {password}"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)