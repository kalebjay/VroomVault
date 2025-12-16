from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from db import db_vehicle
from router.schemas import VehicleBase, VehicleDisplay, UserAuth
from auth.oauth2 import get_current_user
from utils.exceptions import forbidden_exception

router = APIRouter(
    prefix='/vehicles',
    tags=['vehicles']
)

# Get a single vehicle by ID
@router.get('/{id}', response_model=VehicleDisplay)
def get_vehicle(id: int, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    vehicle = db_vehicle.get_vehicle_by_id(db, id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to view this vehicle")
    return vehicle

# Get all vehicles for the current user
@router.get('', response_model=List[VehicleDisplay])
def get_all_vehicles(db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_vehicle.get_all_vehicles_per_user(db, current_user)
# Create a new vehicle
@router.post('', response_model=VehicleDisplay, status_code=status.HTTP_201_CREATED)
def create_vehicle(request: VehicleBase, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_vehicle.create_vehicle(db, request, current_user)

# Delete a vehicle
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(id: int, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    vehicle = db_vehicle.get_vehicle_by_id(db, id) # This function exists in db_vehicle.py
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to delete this vehicle")

    db_vehicle.delete_vehicle(db, vehicle)
    return

# Update a vehicle
@router.put('/{id}', response_model=VehicleDisplay)
def update_vehicle(id: int, request: VehicleBase, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    vehicle = db_vehicle.get_vehicle_by_id(db, id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to update this vehicle")
    
    return db_vehicle.update_vehicle(id, request, db)