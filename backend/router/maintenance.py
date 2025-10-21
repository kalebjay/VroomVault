from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from db import models
from router.schemas import AnyMaintenanceRecordCreate, AnyMaintenanceRecordDisplay
from auth.oauth2 import get_current_user
from utils.exceptions import bad_request_exception, forbidden_exception, not_found_exception
from router.schemas import UserAuth

router = APIRouter(
    prefix='/maintenance',
    tags=['maintenance']
)

# get all maintenance records for one vehicle (using vehicle id)

@router.post('/{vehicle_id}', response_model=AnyMaintenanceRecordDisplay)
def create_maintenance_record(vehicle_id: int,
                              request: AnyMaintenanceRecordCreate,
                              db: Session = Depends(get_db),
                              current_user: UserAuth = Depends(get_current_user)
    ):
    # Find the vehicle and ensure it belongs to the current user
    vehicle = db.query(models.DbVehicle).filter(models.DbVehicle.id == vehicle_id).first()
    if not vehicle:
        raise not_found_exception("Vehicle", vehicle_id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to add records to this vehicle")

    # Create the appropriate record based on the 'type' field
    record_data = request.dict()
    record_type = record_data.pop("type") # Remove type to avoid passing it to the model constructor

    if record_type == "oil_change":
        new_record = models.OilChangeRecord(**record_data, vehicle_id=vehicle_id)
    else:
        # In the future, you can add more types here
        raise bad_request_exception(detail=f"Invalid maintenance type: {record_type}")

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record
