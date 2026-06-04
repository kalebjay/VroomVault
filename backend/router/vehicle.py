import os
import uuid
from PIL import Image
from fastapi import APIRouter, Depends, status, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from db import db_vehicle
from router.schemas import VehicleBase, VehicleDisplay, UserAuth
from auth.oauth2 import get_current_user
from utils.exceptions import forbidden_exception
from pillow_heif import register_heif_opener

router = APIRouter(
    prefix='/vehicles',
    tags=['vehicles']
)

register_heif_opener()
IMAGE_DIR = "images"

@router.post('/{id}/upload-image', response_model=VehicleDisplay)
def upload_vehicle_image(id: int, 
                         file: UploadFile = File(...), 
                         db: Session = Depends(get_db), 
                         current_user: UserAuth = Depends(get_current_user)):
    
    # 1. Verify vehicle ownership
    vehicle = db_vehicle.get_vehicle_by_id(db, id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to alter this vehicle.")

    # 2. Validate input file format extensions
    extension = os.path.splitext(file.filename)[1].lower()
    if extension not in ['.jpg', '.jpeg', '.png', '.heic']:
        raise HTTPException(status_code=400, detail="Invalid image format. Please use JPG, PNG, or HEIC.")

    try:
        # 3. Open image using Pillow directly out of memory stream
        img = Image.open(file.file)

        # 4. Process and downscale massive smartphone camera prints (e.g. max 1200px width)
        max_size = (1200, 1200)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # Convert back to standard RGB matrix if it was a transparent PNG or alternative space
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")

        # 5. Build unique structural filename and save path inside container volume
        filename = f"vehicle_{id}_{uuid.uuid4().hex}.jpg"
        file_path = os.path.join(IMAGE_DIR, filename)
        
        img.save(file_path, "JPEG", quality=85) # Compress slightly to keep application speed snappy

        # 6. Delete the old photo if one exists to prevent storage clutter
        if vehicle.image_url:
            old_filename = vehicle.image_url.split('/')[-1]
            old_path = os.path.join(IMAGE_DIR, old_filename)
            if os.path.exists(old_path):
                os.remove(old_path)

        # 7. Persist static path reference directly into relational user row
        vehicle.image_url = f"http://localhost:8000/images/{filename}"
        db.commit()
        db.refresh(vehicle)
        
        return vehicle

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image manipulation error: {str(e)}")

# Get a single vehicle by ID
@router.get('/{id}', response_model=VehicleDisplay)
def get_vehicle(id: int, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    vehicle = db_vehicle.get_vehicle_by_id(db, id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to view this vehicle")
    return vehicle

# Get all vehicles for the current user
@router.get('', response_model=List[VehicleDisplay])
def get_all_vehicles(db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_vehicle.get_all_vehicles_per_user(db, current_user)
# Create a new vehicle
@router.post('', response_model=VehicleDisplay, status_code=status.HTTP_201_CREATED)
def create_vehicle(request: VehicleBase, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    return db_vehicle.create_vehicle(db, request, current_user)

# Delete a vehicle
@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(id: int, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    vehicle = db_vehicle.get_vehicle_by_id(db, id) # This function exists in db_vehicle.py
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to delete this vehicle")

    db_vehicle.delete_vehicle(db, vehicle)
    return

# Update a vehicle
@router.put('/{id}', response_model=VehicleDisplay)
def update_vehicle(id: int, request: VehicleBase, db: Session = Depends(get_db), current_user: UserAuth = Depends(get_current_user)):
    vehicle = db_vehicle.get_vehicle_by_id(db, id)
    if vehicle.owner_id != current_user.id:
        raise forbidden_exception(detail="Not authorized to update this vehicle")
    
    return db_vehicle.update_vehicle(id, request, db)