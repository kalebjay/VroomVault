from db.hashing import Hash
from .models import DbUser
from utils.exceptions import user_not_found_exception, bad_request_exception
from router.schemas import UserBase, UserUpdate
from sqlalchemy.orm.session import Session


def create_user(db: Session, request: UserBase):
    # Check for existing username
    if db.query(DbUser).filter(DbUser.username == request.username).first():
        raise bad_request_exception(detail=f"Username '{request.username}' is already taken.")

    # Check for existing email
    if db.query(DbUser).filter(DbUser.email == request.email).first():
        raise bad_request_exception(detail=f"Email '{request.email}' is already registered.")

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
    update_data = request.model_dump(exclude_unset=True)

    # Check for username/email conflicts if they are being updated
    if "username" in update_data and update_data["username"] != user.username:
        if db.query(DbUser).filter(DbUser.username == update_data["username"]).first():
            raise bad_request_exception(detail=f"Username '{update_data['username']}' is already taken.")

    if "email" in update_data and update_data["email"] != user.email:
        if db.query(DbUser).filter(DbUser.email == update_data["email"]).first():
            raise bad_request_exception(detail=f"Email '{update_data['email']}' is already registered.")

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
    return