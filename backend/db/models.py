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
    #items = relationship('DbPost', back_populates='user')
    vehicles = relationship("DbVehicle", back_populates="owner")


class DbVehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    make = Column(String)
    model = Column(String)
    year = Column(Integer)
    vin = Column(String)
    license_plate = Column(String)
    exp_registration = Column(DateTime, default=datetime.now(timezone.utc))
    exp_safety = Column(DateTime, default=datetime.now(timezone.utc))
    last_oil = Column(DateTime, default=datetime.now(timezone.utc))

    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("DbUser", back_populates="vehicles")
    maint_records = relationship("MaintenanceRecord", back_populates="vehicle")

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.now(timezone.utc))
    mileage = Column(Integer)
    description = Column(String)
    cost = Column(Float)
    
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    vehicle = relationship("DbVehicle", back_populates="maint_records")



















