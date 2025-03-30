from typing import Union

from fastapi import FastAPI, Depends
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session

app = FastAPI()

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}




@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# @app.post("/users/", response_model=User)
# def create_user(user: User, session: Session = Depends(get_session)):
#     session.add(user)
#     session.commit()
#     session.refresh(user)
#     return user

# @app.get("/users/", response_model=list[User])
# def read_users(session: Session = Depends(get_session)):
#     users = session.exec(select(User)).all()
#     return users
