from db.database import get_db
from db.db_user import create_user, get_all_users, get_user_by_username, get_user_by_id
from fastapi import APIRouter, Depends
from router.schemas import UserBase, UserDisplay
from sqlalchemy.orm.session import Session

router = APIRouter(
    prefix='/user',
    tags=['user']
)

# create user
@router.post('', response_model=UserDisplay)
def createUser(request: UserBase, db: Session = Depends(get_db)):
    return create_user(db, request)

# get user with ID
@router.get('/{id}')
def getUser(id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, id)

# get user with username    
@router.get('/{username}')
def getUser(username: str, db: Session = Depends(get_db)):
    return get_user_by_username(db, username)

# get all users
@router.get('', response_model=list[UserDisplay])
def getAllUsers(db: Session = Depends(get_db)):
    return get_all_users(db)
    