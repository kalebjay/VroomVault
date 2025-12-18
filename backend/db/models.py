from .database import Base
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship


class DbUser(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String)
    password = Column(String)
    notification_days_advance = Column(Integer, default=30, nullable=False)
    notification_frequency = Column(String, default='weekly', nullable=False)
    vehicles = relationship("DbVehicle", back_populates="owner")


class DbVehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    color = Column(String)
    vin = Column(String)
    license_plate = Column(String)
    exp_registration = Column(DateTime(timezone=True), default=datetime.now)
    exp_safety = Column(DateTime(timezone=True), default=datetime.now)
    last_oil = Column(DateTime(timezone=True), default=datetime.now)
 
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("DbUser", back_populates="vehicles")
    # Relationship to completed maintenance records
    maint_records = relationship("MaintenanceRecord", back_populates="vehicle")

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), default=datetime.now)
    mileage = Column(Integer)
    cost = Column(Float)
    description = Column(String)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    vehicle = relationship("DbVehicle", back_populates="maint_records")
    # --- Inheritance settings ---
    type = Column(String(50))
    __mapper_args__ = {
        "polymorphic_identity": "maintenance_record",
        "polymorphic_on": type,
    }

class OilChangeRecord(MaintenanceRecord):
    __tablename__ = "oil_change_records"
    id = Column(Integer, ForeignKey("maintenance_records.id"), primary_key=True)
    oil_type = Column(String)
    filter_part_number = Column(String)
    __mapper_args__ = {"polymorphic_identity": "oil_change",}

class TireRotationRecord(MaintenanceRecord):
    __tablename__ = "tire_rotation_records"
    id = Column(Integer, ForeignKey("maintenance_records.id"), primary_key=True)
    tire_type = Column(String)
    tire_part_number = Column(String)
    __mapper_args__ = {"polymorphic_identity": "tire_rotation",}

class TireChangeRecord(MaintenanceRecord):
    __tablename__ = "tire_change_records"
    id = Column(Integer, ForeignKey("maintenance_records.id"), primary_key=True)
    tire_type = Column(String)
    tire_part_number = Column(String)
    __mapper_args__ = {"polymorphic_identity": "tire_change",}

class BrakeChangeRecord(MaintenanceRecord):
    __tablename__ = "brake_change_records"
    id = Column(Integer, ForeignKey("maintenance_records.id"), primary_key=True)
    brake_type = Column(String)
    brake_part_number = Column(String)
    __mapper_args__ = {"polymorphic_identity": "brake_change",}