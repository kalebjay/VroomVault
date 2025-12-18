from db.database import get_db
from db.db_user import create_user, get_all_users, get_user_by_username, get_user_by_id, update_user, delete_user
from fastapi import APIRouter, Depends, status
from router.schemas import UserBase, UserDisplay, UserUpdate, UserAuth
from sqlalchemy.orm.session import Session
from auth.oauth2 import get_current_user
from utils.exceptions import forbidden_exception

router = APIRouter(
    prefix='/users',
    tags=['user']
)

# create user
@router.post('', response_model=UserDisplay)
def createUser(request: UserBase, db: Session = Depends(get_db)):
    return create_user(db, request)

# get all users
@router.get('', response_model=list[UserDisplay])
def getAllUsers(db: Session = Depends(get_db)):
    return get_all_users(db)

# get user with ID
@router.get('/{id}', response_model=UserDisplay)
def getUserById(id: int, db: Session = Depends(get_db)):
    return get_user_by_id(db, id)

# get user with username    
@router.get('/username/{username}')
def getUserByUsername(username: str, db: Session = Depends(get_db)):
    return get_user_by_username(db, username)

# update user
@router.put('/{id}', response_model=UserDisplay)
def updateUser(id: int, request: UserUpdate, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    # Ensure the logged-in user is only updating their own profile
    if current_user.id != id:
        raise forbidden_exception(detail="Not authorized to update this user")
    return update_user(id, db, request)

# delete user
@router.delete('/{id}')
def deleteUser(id: int, db: Session = Depends(get_db)):
    # TODO only admin user can perform this
    return delete_user(id, db)