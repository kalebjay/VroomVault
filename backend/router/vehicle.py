from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from db import models
from router.schemas import VehicleBase, VehicleDisplay
from auth.oauth2 import get_current_user
from router.schemas import UserAuth


router = APIRouter(
    prefix='/vehicle',
    tags=['vehicle']
)



@router.post('', response_model=VehicleDisplay)
def create_vehicle(
        request: VehicleBase,
        db: Session = Depends(get_db),
        current_user: UserAuth = Depends(get_current_user)
    )













