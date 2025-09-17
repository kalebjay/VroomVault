from db.database import get_db
from db.db_user import create_user
from fastapi import APIRouter, Depends
from router.schemas import UserBase, UserDisplay
from sqlalchemy.orm.session import Session

router = APIRouter(
    prefix='/user',
    tags=['user']
)

@router.post('', response_model=UserDisplay)
def createUser(request: UserBase, db: Session = Depends(get_db)):
    return create_user(db, request)