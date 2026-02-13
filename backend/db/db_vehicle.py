from .models import DbVehicle
from router.schemas import VehicleBase, UserAuth
from utils.exceptions import not_found_exception
from sqlalchemy.orm import Session, selectinload


def create_vehicle(db: Session, request: VehicleBase, user: UserAuth):
    new_vehicle = DbVehicle(**request.model_dump(), owner_id=user.id)
    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)
 
    return new_vehicle

def get_vehicle_by_id(db: Session, id: int):
    vehicle = (
        db.query(DbVehicle)
        .options(selectinload(DbVehicle.maint_records))
        .filter(DbVehicle.id == id)
        .first()
    )
    if not vehicle:
        raise not_found_exception("Vehicle", id)
    return vehicle

# get all vehicles per user
def get_all_vehicles_per_user(db: Session, current_user: UserAuth):
    vehicles = (
        db.query(DbVehicle)
        .options(selectinload(DbVehicle.maint_records))
        .filter(DbVehicle.owner_id == current_user.id).all()
    )
    return vehicles

# update vehicle
def update_vehicle(id: int, request: VehicleBase, db: Session):
    vehicle = db.query(DbVehicle).filter(DbVehicle.id == id).first()
    if not vehicle:
        raise not_found_exception("Vehicle", id)

    for key, value in request.model_dump(exclude_unset=True).items():
        setattr(vehicle, key, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle

# delete Vehicle
def delete_vehicle(db: Session, vehicle: DbVehicle):
    db.delete(vehicle)
    db.commit()
    return
