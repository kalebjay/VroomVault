from fastapi import HTTPException, status
from .models import DbUser, DbVehicle
from router.schemas import VehicleBase
from sqlalchemy.orm import Session


def create_vehicle(db: Session, request: VehicleBase, user: DbUser):
    new_vehicle = DbVehicle(
        make = request.make,
        model = request.model,
        year = request.year,
        vin = request.vin,
        license_plate = request.license_plate,
        owner_id = user.id
    )
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
 
    return new_vehicle

def get_vehicle_by_id(db: Session, id: int):
    vehicle = db.query(DbVehicle).filter(DbVehicle.id == id).first()
    c404 = status.HTTP_404_NOT_FOUND
    detail_str = f'Vehicle with id {id} not found'
    if not vehicle:
        raise HTTPException(status_code=c404, detail=detail_str)
    
    return vehicle

# get all vehicles per user
def get_all_vehicles_per_user(db: Session):
    vehicles = db.query(DbVehicle).filter(DbVehicle.owner_id == current_user.id).all()
    c404 = status.HTTP_404_NOT_FOUND
    detail_str = f'No vehicles found for user with id {current_user.id}'
    if not vehicles:
        raise HTTPException(status_code=c404, detail=detail_str)

    return vehicles