from db.hashing import Hash
from .models import DbUser
from utils.exceptions import user_not_found_exception
from router.schemas import UserBase, UserUpdate
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

def get_user_by_id(db: Session, id: int):
    user = db.query(DbUser).filter(DbUser.id == id).first()
    if not user:
        raise user_not_found_exception(id)
    return user

def get_user_by_username(db: Session, username: str):
    user = db.query(DbUser).filter(DbUser.username == username).first()
    if not user:
        raise user_not_found_exception(username)
    return user

def get_all_users(db: Session):
    return db.query(DbUser).all()

def update_user(id: int, db: Session, request: UserUpdate):
    user = db.query(DbUser).filter(DbUser.id == id).first()
    if not user:
        raise user_not_found_exception(id)
    # Create a dictionary of the request data, excluding any fields that were not set
    update_data = request.dict(exclude_unset=True)
    # Iterate over the provided data and update the user object
    for key, value in update_data.items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return user

def delete_user(id: int, db: Session):
    user = db.query(DbUser).filter(DbUser.id == id).first()
    if not user:
        raise user_not_found_exception(id)
    db.delete(user)
    db.commit()
    return 'User deleted successfully'