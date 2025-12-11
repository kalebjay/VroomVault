from datetime import datetime
from pydantic import BaseModel
from typing import List, Literal, Union


class UserBase(BaseModel):
    username: str
    email: str
    password: str

# For PostDisplay
class User(BaseModel):
    username: str
    class Config():
        orm_mode = True

class UserAuth(BaseModel):
    id: int
    username: str
    email: str

class UserDisplay(BaseModel):
    username: str
    email: str
    class Config():
        orm_mode = True

# =================== Vehicle Schemas ===================

class VehicleBase(BaseModel):
    make: str
    model: str
    year: int
    vin: str
    license_plate: str

class VehicleDisplay(VehicleBase):
    id: int
    owner_id: int
    class Config():
        orm_mode = True

# =================== Maintenance Record Schemas ===================

class MaintenanceRecordBase(BaseModel):
    date: datetime = datetime.now()
    mileage: int
    cost: float
    description: str

class MaintenanceRecordDisplay(MaintenanceRecordBase):
    id: int
    type: str
    class Config():
        orm_mode = True

class OilChangeRecordCreate(MaintenanceRecordBase):
    type: Literal["oil_change"] = "oil_change"
    oil_type: str
    filter_part_number: str

class OilChangeRecordDisplay(MaintenanceRecordDisplay):
    oil_type: str
    filter_part_number: str
    class Config():
        orm_mode = True

class TireChangeRecordCreate(MaintenanceRecordBase):
    type: Literal["tire_change"] = "tire_change"
    tire_type: str
    tire_part_number: str

class TireChangeRecordDisplay(MaintenanceRecordDisplay):
    tire_type: str
    tire_part_number: str
    class Config():
        orm_mode = True

# A Union to handle different maintenance types in request bodies and responses
AnyMaintenanceRecordCreate = Union[OilChangeRecordCreate, TireChangeRecordCreate]
AnyMaintenanceRecordDisplay = Union[OilChangeRecordDisplay, TireChangeRecordDisplay]