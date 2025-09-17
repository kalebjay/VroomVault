from db.hashing import Hash
from fastapi import HTTPException, status
from .models import DbUser
from router.schemas import UserBase
from sqlalchemy.orm.session import Session


def create_user(db: Session, request: UserBase):
    new_user = DbUser(
        username = request.username,
        email = request.email,
        password = Hash.bcrypt(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

def get_user_by_username(db: Session, username: str):
    user = db.query(DbUser).filter(DbUser.username == username).first()
    c404 = status.HTTP_404_NOT_FOUND
    detail_str = f'User with username {username} not found'
    
    if not user:
        raise HTTPException(status_code=c404, detail=detail_str)
    
    return user

