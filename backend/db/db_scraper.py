from sqlalchemy.orm import Session
from db import models
from router import schemas

# =================== Search Preference CRUD ===================

def create_search_preference(db: Session, request: schemas.SearchPreferenceCreate):
    """Saves a new custom hunting footprint to the database."""
    db_pref = models.SearchPreference(
        make=request.make,
        model=request.model,
        max_price=request.max_price,
        max_miles=request.max_miles,
        min_year=request.min_year,
        required_roof_height=request.required_roof_height,
        required_wheelbase_inches=request.required_wheelbase_inches,
        required_bed_length_inches=request.required_bed_length_inches,
        required_passenger_capacity=request.required_passenger_capacity,
        is_active=request.is_active
    )
    db.add(db_pref)
    db.commit()
    db.refresh(db_pref)
    return db_pref

def get_search_preferences(db: Session, active_only: bool = True):
    """Retrieves all hunting configurations so the UI or the scraper can read them."""
    query = db.query(models.SearchPreference)
    if active_only:
        query = query.filter(models.SearchPreference.is_active == True)
    return query.all()

def delete_search_preference(db: Session, pref_id: int):
    """Deletes a hunting profile (and cascades to delete its matched golden deals)."""
    db_pref = db.query(models.SearchPreference).filter(models.SearchPreference.id == pref_id).first()
    if db_pref:
        db.delete(db_pref)
        db.commit()
        return True
    return False

# =================== Golden Deals Queries ===================

def get_all_golden_deals(db: Session):
    """
    Returns all intercepted high-value vehicle matches, 
    sorted with the biggest discounts showing up first.
    """
    return db.query(models.GoldenDeal).order_by(models.GoldenDeal.market_discount.desc()).all()