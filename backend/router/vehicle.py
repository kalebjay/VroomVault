from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from db.database import get_db
from db.db_vehicle import create_vehicle
from router.schemas import VehicleBase, VehicleDisplay
from auth.oauth2 import get_current_user
from router.schemas import UserAuth


router = APIRouter(
    prefix='/vehicle',
    tags=['vehicle']
)

# get a vehicle based on id

# get all vehicles per user

@router.post('', response_model=VehicleDisplay)
def createVehicle(request: VehicleBase,
                  db: Session = Depends(get_db),
                  current_user: UserAuth = Depends(get_current_user)
    ):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication Failed')

    return create_vehicle(db, request, current_user)

# delete a vehicle










