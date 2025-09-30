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