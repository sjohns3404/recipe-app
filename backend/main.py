# Blank database main.py file
# Currently learning everything about FastAPI on their site and will be using this to test.

# Python can use async/await in order to creat asynchronous functiosn on the backend
# A coroutine is what is returned from an async await function
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None, short: bool = False):
    item = {"item_id": item_id}
    if q:
        item.update({"q": q})
    if not short:
        item.update(
            {"description": "This is an amazing item that has a long description"}
        )
    return item
