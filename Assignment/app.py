import uvicorn
from fastapi import FastAPI
from DBcreation import db
from data import Item, User, Order
app = FastAPI(
    title = "testing python api",
    description = "This is a simple FastAPI application.",
    version = "1.0.0",
    openapi_tags=[
        {
            "name": "ITEMS",
            "description": "Item details",
        },
        {
            "name": "USERS",
            "description": "User details",
        },
        {
            "name": "ORDERS",
            "description": "Order details",
        }
    ],

)

@app.post("/items/",tags=["ITEMS"])
async def create_item(item: Item):
    result = await db["items"].insert_one(item.dict())
    item_dict = item.dict()
    item_dict["_id"] = str(result.inserted_id)
    return item_dict

@app.post("/many_items/",tags=["ITEMS"])
async def create_items(item : list[Item] ):
    items_dict = [items.dict() for items in item]
    result = await db["items"].insert_many(items_dict)
    for d, _id in zip(items_dict, result.inserted_ids):
        d["_id"] = str(_id)
    return items_dict

@app.get("/items/",tags = ["ITEMS"])
async def get_items():
    items = []
    async for item in db["items"].find():
        item["_id"] = str(item["_id"])
        items.append(item)

    return items


@app.post("/users/",tags=["USERS"])
async def create_user(user: User):
    result = await db["users"].insert_one(user.dict())
    user_dict = user.dict()
    user_dict["_id"]= str(result.inserted_id)
    return user_dict

@app.get("/users/",tags=["USERS"])
async def get_Users():
    users = []
    async for user in db["users"].find():
        user["_id"] = str(user["_id"])
        users.append(user)  
    
    return users

@app.post("/orders/",tags=["ORDERS"])
async def create_order(order: Order):
    result = await db["orders"].insert_one(order.dict())
    order_dict= order.dict()
    order_dict["_id"] = str(result.inserted_id)
    return order_dict

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8080, reload=True)