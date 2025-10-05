from fastapi import APIRouter,Header, HTTPException,Form,File, UploadFile
from utils import decode_token
from datetime import datetime
import json
from cloudinary_utils import upload_image
from DBcreation import db
from uuid import uuid4

router = APIRouter()

@router.post("/create",response_model=dict)
async def create_user(type: str = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    file: UploadFile = File(None),  # Or use UploadFile = File(None) for file uploads
    tags: str = Form(None),      # Expecting JSON string
    Authorization: str = Header (None)
    ):
    
    user_data = decode_token(Authorization)
    tags_list = []
    
    if tags:
        try:
            tags_list = json.loads(tags)
            if not isinstance(tags_list, list):
                raise ValueError
        except Exception:
            raise HTTPException(status_code=422, detail="tags must be a JSON array")

    file_url = upload_image(file.file)
    if not file_url:
        raise HTTPException(status_code=422, detail="File upload failed or file not provided")

    post_data = {
        "post_id": str(uuid4()),  # Generate a unique post_id
        "type": type,
        "title": title,
        "content": content,
        "file_url": file_url,  # If using UploadFile, you might need to save the file first
        "tags": tags_list,
        "created_by": user_data.get("email"),
        "created_at": datetime.utcnow()
    }

    result = await db["posts"].insert_one(post_data)
    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to create post")

    # Add the inserted_id as a string to the response data
    post_data["_id"] = str(result.inserted_id)

    return{
        "status": "success",
        "message": "Post created successfully",
        "data": post_data
    }

@router.get("/by-user", response_model=dict)
async def get_posts_by_user(Authorization: str = Header(None)):
    user_data = decode_token(Authorization)
    posts = await db["posts"].find({"created_by": user_data.get("email")},{"_id": 0}).to_list(length=None)
    return{
        "status": "success",
        "data": posts
    }

@router.get("/all", response_model=dict)
async def get_all_posts():
    return{
        "status": "success",
        "data": await db["posts"].find({},{"_id": 0}).to_list(length=None)
    }


@router.get("/by-post/{post_id}", response_model=dict)
async def get_comments_by_post(post_id: str):
    post_exists = await db["posts"].count_documents({"post_id": post_id}) > 0
    if not post_exists:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = await db["comments"].find({"post_id": post_id},{"_id":0}).sort("created_at", -1).to_list(length=None)
    return{
        "status": "success",
        "message": "Comments retrieved successfully",
        "data": comments
    }
        