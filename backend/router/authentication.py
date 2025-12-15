from auth.oauth2 import create_access_token
from db.database import get_db
from db.hashing import Hash
from db.models import DbUser
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm.session import Session
from utils.exceptions import credentials_exception

router = APIRouter(
    prefix='/auth',
    tags=['authentication'],
)

@router.post('/login')
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Allow login with either username or email
    user = db.query(DbUser).filter(DbUser.username == request.username).first()
    if not user:
        user = db.query(DbUser).filter(DbUser.email == request.username).first()
    
    if not user:
        raise credentials_exception(detail='Invalid credentials')
    if not Hash.verify(user.password, request.password):
        raise credentials_exception(detail='Incorrect password')
    
    access_token = create_access_token(data={'sub': user.username, 'id': user.id})

    return {
        'access_token': access_token,
        'token_type': 'Bearer',
        'user_id': user.id,
        'username': user.username
    }