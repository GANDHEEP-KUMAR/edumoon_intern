from fastapi import APIRouter,Header, HTTPException,Form,File, UploadFile
from utils import decode_token
from datetime import datetime
from data import comment
from cloudinary_utils import upload_image
from DBcreation import db
from uuid import uuid4
router = APIRouter()

@router.post("/create",response_model=dict)
async def create_user(comment:comment, Authorization: str = Header (None)):
    post_exists = await db["posts"].count_documents({"post_id": comment.post_id}) >0
    if not post_exists:
        raise HTTPException(status_code=404, detail="Post not found")

    user_data = decode_token(Authorization)
    comment_data = comment.dict()
    comment_data["comment_id"]= str(uuid4())  # Generate a unique comment_id
    comment_data["created_by"] = user_data.get("email")
    comment_data["created_at"] = datetime.utcnow()
    result = await db["comments"].insert_one(comment_data)
    if not result.acknowledged:
        raise HTTPException(status_code=500, detail="Failed to create comment")

    return{
        "status": "success",
        "message": "Comment created successfully",
        "data": {
            # "_id": str(result.inserted_id),
            "comment_id": comment_data["comment_id"],
            "post_id": comment_data["post_id"],
            "content": comment_data["content"],
            "created_by": comment_data["created_by"],
            "created_at": comment_data["created_at"]
        }
    }
