from pydantic import BaseModel

class Item(BaseModel):
    name: str
    description: str
    is_available: bool 
    price: float
    quantity: int

class User(BaseModel):
    username: str
    email: str
    password: str

class Order(BaseModel):
    user_id: str
    item_id: str
    quantity: int
    total_price: float

    