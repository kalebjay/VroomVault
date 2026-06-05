from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from db import db_scraper
from router import schemas
from scraper.vin_decoder import decode_vin, extract_utility_specs

# Test curl command
# curl http://localhost:8000/api/scraper/decode/1FBAX2CV0JKA32346

router = APIRouter(
    prefix='/scraper',
    tags=['Scraper/Hunting']
)

@router.get("/decode/{vin}")
async def vin_decode(vin: str):
    raw_data = await decode_vin(vin)
    if not raw_data:
        raise HTTPException(status_code=400, detail="Could not connect to decoding service or invalid VIN.")
        
    parsed_specs = extract_utility_specs(raw_data)
    return {
        "status": "success",
        "parsed_specs": parsed_specs
    }

# Add a new Hunting footprints rule profile
@router.post("/preferences", response_model=schemas.SearchPreferenceDisplay, status_code=status.HTTP_201_CREATED)
def create_hunt_preference(request: schemas.SearchPreferenceCreate, db: Session = Depends(get_db)):
    return db_scraper.create_search_preference(db, request)

# Fetch all active targets
@router.get("/preferences", response_model=List[schemas.SearchPreferenceDisplay])
def get_all_hunts(db: Session = Depends(get_db)):
    return db_scraper.get_search_preferences(db, active_only=False)

# Remove a target profile
@router.delete("/preferences/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_hunt_preference(id: int, db: Session = Depends(get_db)):
    deleted = db_scraper.delete_search_preference(db, id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Search preference with ID {id} not found.")
    return

# Fetch the Curated "Golden Deals" Dashboard Feed
@router.get("/deals", response_model=List[schemas.GoldenDealDisplay])
def get_curated_deals(db: Session = Depends(get_db)):
    return db_scraper.get_all_golden_deals(db)