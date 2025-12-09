from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db.db_vehicle import create_vehicle, get_vehicle_by_id, get_all_vehicles_per_user, update_vehicle
from router.schemas import VehicleBase, VehicleDisplay
from auth.oauth2 import get_current_user 
from utils.exceptions import credentials_exception, forbidden_exception, not_found_exception
from router.schemas import UserAuth


router = APIRouter(
    prefix='/vehicle',
    tags=['vehicle']
)

@router.post('', response_model=VehicleDisplay)
def createVehicle(request: VehicleBase,
                  db: Session = Depends(get_db),
                  current_user: UserAuth = Depends(get_current_user)
    ):
    if not current_user:
        raise credentials_exception(detail='Authentication Failed')
    return create_vehicle(db, request, current_user)

# get a vehicle based on id
@router.get('/{id}')
def getVehicle(id: int, db: Session = Depends(get_db)):
    return get_vehicle_by_id(db, id)

# get all vehicles per user
@router.get('', response_model=list[VehicleDisplay])
def getUserVehicles(db: Session = Depends(get_db),
                   current_user: UserAuth = Depends(get_current_user)
    ):
    return get_all_vehicles_per_user(db, current_user)
   
# update vehicle  
@router.put('/{id}')
def updateVehicle(id: int,
                  request: VehicleBase,
                  db: Session = Depends(get_db),
                  current_user: UserAuth = Depends(get_current_user)
    ):
    vehicle = get_vehicle_by_id(db, id)
    if not vehicle:
        raise not_found_exception("Vehicle", id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to update this vehicle")
    return update_vehicle(id, request, db)
    
# delete a vehicle
def deleteVehicle():
    pass
