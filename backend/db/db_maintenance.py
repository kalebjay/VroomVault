from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from . import models
from router.schemas import AnyMaintenanceRecordCreate
from utils.exceptions import not_found_exception, bad_request_exception


def create_maintenance_record(db: Session, request: AnyMaintenanceRecordCreate, vehicle_id: int):
    record_data = request.dict()
    record_type = record_data.pop("type")

    if record_type == "oil_change":
        new_record = models.OilChangeRecord(**record_data, vehicle_id=vehicle_id)
    elif record_type == "tire_rotation":
        new_record = models.TireRotationRecord(**record_data, vehicle_id=vehicle_id)
    elif record_type == "tire_change":
        new_record = models.TireChangeRecord(**record_data, vehicle_id=vehicle_id)
    elif record_type == "brake_change":
        new_record = models.BrakeChangeRecord(**record_data, vehicle_id=vehicle_id)
    else:
        raise bad_request_exception(detail=f"Invalid maintenance type: {record_type}")

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record

def get_all_records_for_vehicle(db: Session, vehicle_id: int):
    records = db.query(models.MaintenanceRecord).filter(models.MaintenanceRecord.vehicle_id == vehicle_id).all()
    return records

def get_record_by_id(db: Session, record_id: int):
    record = db.query(models.MaintenanceRecord).filter(models.MaintenanceRecord.id == record_id).first()
    if not record:
        raise not_found_exception("Maintenance Record", record_id)
    return record

def update_maintenance_record(db: Session, record: models.MaintenanceRecord, request: AnyMaintenanceRecordCreate):
    for key, value in request.dict(exclude_unset=True).items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record

def delete_maintenance_record(db: Session, record_id: int):
    record = get_record_by_id(db, record_id)
    db.delete(record)
    db.commit()
    return