from fastapi import APIRouter, HTTPException
import DBcreation
from data import  User,User_Login
from utils import hash_password,check_password,create_token
from uuid import uuid4
 
router = APIRouter()

@router.post("/sign-up",response_model=dict)
async def create_user(user: User):
    user_exists = await DBcreation.db["Users"].find_one( {"email" : user.email} )
    if user_exists:
        raise HTTPException(status_code=400, detail="User already exists")
    user.user_id = str(uuid4())  # Generate a unique user_id
    user.password = hash_password(user.password) 
    result = await DBcreation.db["Users"].insert_one(user.dict())
    user_dict = user.dict()
    # return str(result.inserted_id)
    return user_dict

@router.post("/login",response_model=dict)
async def get_User(user: User_Login):
    user_exists = await DBcreation.db["Users"].find_one( {"email" : user.email} )
    if not user_exists:
        raise HTTPException(status_code=400, detail="User does not exist! sign up first")
    
    if not check_password(user.password, user_exists["password"]):
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "status": "success",
        "message": "Login successful",
        "data" :{
            "user_id": str(user_exists["_id"]),
            "username": user_exists["username"],
            "session_token": create_token({"email":user_exists["email"]})
        }
        
    }



 