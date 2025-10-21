from fastapi import HTTPException, status
from .models import DbUser, DbVehicle
from router.schemas import VehicleBase, UserAuth
from utils.exceptions import not_found_exception
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
    if not vehicle:
        raise not_found_exception("Vehicle", id)
    return vehicle

# get all vehicles per user
def get_all_vehicles_per_user(db: Session, current_user: UserAuth):
    vehicles = db.query(DbVehicle).filter(DbVehicle.owner_id == current_user.id).all()
    return vehicles

# update vehicle
def update_vehicle(id: int, request: VehicleBase, db: Session):
    vehicle = db.query(DbVehicle).filter(DbVehicle.id == id).first()
    if not vehicle:
        raise not_found_exception("Vehicle", id)

    vehicle.make = request.make
    vehicle.model = request.model
    vehicle.year = request.year
    vehicle.vin = request.vin
    vehicle.license_plate = request.license_plate
    db.commit()
    db.refresh(vehicle)
    return vehicle

# delete Vehicle
def delete_vehicle():
    pass
