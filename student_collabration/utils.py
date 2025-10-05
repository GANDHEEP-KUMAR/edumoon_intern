from bcrypt import hashpw, gensalt, checkpw
import jwt
from datetime import datetime, timedelta

def create_token(user_dict: dict) -> str:
    payload = {
        "email": user_dict.get("email"),
        "exp": datetime.utcnow() + timedelta(hours=10)
    }
    token = jwt.encode(payload, "your_secret_key", algorithm="HS256")
    return token

def decode_token(token: str) -> dict:
    try:
        decoded = jwt.decode(token, "your_secret_key", algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError:
        raise ValueError("Token has expired")
    except jwt.InvalidTokenError:
        raise ValueError("Invalid token")

def validate_token(token: str) -> bool:
    try:
        decoded = jwt.decode(token, "your_secret_key", algorithms=["HS256"])
        return True
    except jwt.ExpiredSignatureError:
        return False
    except jwt.InvalidTokenError:
        return False

def hash_password(password: str) -> str:
    bytes = password.encode('utf-8')
    hashed = hashpw(bytes, gensalt())
    return hashed.decode('utf-8')

def check_password (password:str , hashed_password: str) -> bool:
    return checkpw(password.encode("utf-8"),hashed_password.encode("utf-8"))



