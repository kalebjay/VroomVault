from .database import Base
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func


class DbUser(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    is_admin = Column(Boolean, default=False)
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
    exp_registration = Column(DateTime(timezone=True), server_default=func.now())
    exp_safety = Column(DateTime(timezone=True), server_default=func.now())
    last_oil = Column(DateTime(timezone=True), server_default=func.now())
    image_url = Column(String, nullable=True)
 
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("DbUser", back_populates="vehicles")
    maint_records = relationship("MaintenanceRecord", back_populates="vehicle")

class MaintenanceRecord(Base):
    __tablename__ = "maintenance_records"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), server_default=func.now())
    mileage = Column(Integer)
    cost = Column(Float)
    description = Column(String)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    vehicle = relationship("DbVehicle", back_populates="maint_records")
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

class MiscRecord(MaintenanceRecord):
    __tablename__ = "misc_records"
    id = Column(Integer, ForeignKey("maintenance_records.id"), primary_key=True)
    __mapper_args__ = {"polymorphic_identity": "misc"}

class SearchPreference(Base):
    __tablename__ = "search_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True) # Optional: if linked to auth users
    
    # Core Filters
    make = Column(String, nullable=False)        # e.g., "Ford", "Chevrolet"
    model = Column(String, nullable=False)       # e.g., "Transit", "F-250"
    max_price = Column(Float, nullable=False)
    max_miles = Column(Integer, nullable=False)
    min_year = Column(Integer, nullable=True)
    target_zip = Column(String, nullable=True, default="22901") # Default to a Central VA zip
    max_distance_miles = Column(Integer, nullable=True, default=200)
    
    # Strict Utility Specifications
    required_roof_height = Column(String, nullable=True)       # "Low", "Medium", "High", or Null for any
    required_wheelbase_inches = Column(Float, nullable=True)   # e.g., 148.0
    required_bed_length_inches = Column(Float, nullable=True)  # e.g., 96.0 for 8ft beds
    required_passenger_capacity = Column(Integer, nullable=True)# e.g., 15
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    matched_deals = relationship("GoldenDeal", back_populates="search_preference", cascade="all, delete-orphan")

class GoldenDeal(Base):
    __tablename__ = "golden_deals"

    id = Column(Integer, primary_key=True, index=True)
    search_preference_id = Column(Integer, ForeignKey("search_preferences.id", ondelete="CASCADE"), nullable=False)
    
    # Listing Identity
    vin = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)       # e.g., "2018 Ford Transit 350 XLT"
    url = Column(String, nullable=False)         # Direct path back to source listing
    price = Column(Float, nullable=False)
    miles = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    trim = Column(String, nullable=True)
    
    # Decoded Specs (Saved directly for UI display)
    roof_height = Column(String, nullable=True)
    wheelbase_inches = Column(Float, nullable=True)
    bed_length_inches = Column(Float, nullable=True)
    passenger_capacity = Column(Integer, nullable=True)
    
    # Deal Valuation Metrics
    market_average_price = Column(Float, nullable=False)
    market_discount = Column(Float, nullable=False) # How much below average market value (e.g., 4500.00)
    
    listing_source = Column(String, nullable=True) # e.g., "Autotrader", "Craigslist"
    date_found = Column(DateTime, default=datetime.utcnow)

    # Relationships
    search_preference = relationship("SearchPreference", back_populates="matched_deals")