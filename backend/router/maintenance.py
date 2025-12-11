from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import get_db
from db import models
from db.db_maintenance import (
    create_maintenance_record as db_create_maintenance_record,
    get_all_records_for_vehicle,
    get_record_by_id,
    update_maintenance_record,
    delete_maintenance_record
)
from router.schemas import AnyMaintenanceRecordCreate, AnyMaintenanceRecordDisplay
from auth.oauth2 import get_current_user
from utils.exceptions import bad_request_exception, forbidden_exception, not_found_exception
from router.schemas import UserAuth

router = APIRouter(
    prefix='/vehicles/{vehicle_id}/maintenance',
    tags=['maintenance']
)

@router.post('', response_model=AnyMaintenanceRecordDisplay, status_code=status.HTTP_201_CREATED)
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

    return db_create_maintenance_record(db, request, vehicle_id)

@router.get('', response_model=List[AnyMaintenanceRecordDisplay])
def get_all_maintenance_for_vehicle(vehicle_id: int,
                                    db: Session = Depends(get_db),
                                    current_user: UserAuth = Depends(get_current_user)
    ):
    # Find the vehicle and ensure it belongs to the current user
    vehicle = db.query(models.DbVehicle).filter(models.DbVehicle.id == vehicle_id).first()
    if not vehicle:
        raise not_found_exception("Vehicle", vehicle_id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to view records for this vehicle")

    return get_all_records_for_vehicle(db, vehicle_id)

@router.put('/{record_id}', response_model=AnyMaintenanceRecordDisplay)
def update_record(vehicle_id: int, # Included for path consistency, but not directly used in logic
                  record_id: int,
                  request: AnyMaintenanceRecordCreate,
                  db: Session = Depends(get_db),
                  current_user: UserAuth = Depends(get_current_user)
    ):
    record = get_record_by_id(db, record_id)
    if record.vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to update this record")
    
    if record.type != request.type:
        raise bad_request_exception(detail=f"Cannot change record type from '{record.type}' to '{request.type}'. Please delete and create a new record.")

    return update_maintenance_record(db, record_id, request)

@router.delete('/{record_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_record(vehicle_id: int, # Included for path consistency
                  record_id: int,
                  db: Session = Depends(get_db),
                  current_user: UserAuth = Depends(get_current_user)
    ):
    record = get_record_by_id(db, record_id)
    if record.vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to delete this record")

    delete_maintenance_record(db, record_id)
    return {"detail": "Maintenance record deleted successfully"}
