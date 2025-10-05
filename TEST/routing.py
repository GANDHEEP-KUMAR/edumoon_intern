from fastapi import APIRouter, HTTPException
# import DBcreation
# from data import Item, User, Order,User_Login
# from utils import hash_password,check_password
 
router = APIRouter()

@router.get("/health")
async def health():
    print("Health check called", flush=True)
    return {"status": "ok"}

