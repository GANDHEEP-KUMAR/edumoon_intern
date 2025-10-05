from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class User(BaseModel):
    user_id:Optional[str] | None = None
    username: str
    email: str
    password: str
    bio:str | None = None

class User_Login(BaseModel):
    email: str
    password: str

class post(BaseModel):
    post_id: Optional[str]
    type: str
    title: str
    content: str
    file_url: Optional[str] | None = None
    tags: Optional[list[str]] | None = None
    created_by: Optional[str] | None = None
    created_at:Optional[datetime] |None = None

class comment(BaseModel):
    comment_id:Optional[str]| None = None
    post_id: str
    content: str
    created_by: str | None = None
    created_at:datetime |None = None
