from datetime import datetime
from pydantic import BaseModel
from typing import List


class UserBase(BaseModel):
    username: str
    email: str
    password: str

# For PostDisplay
class User(BaseModel):
    username: str
    class Config():
        orm_mode = True

class UserAuth(BaseModel):
    id: int
    username: str
    email: str

class UserDisplay(BaseModel):
    username: str
    email: str
    class Config():
        orm_mode = True