import httpx
from bs4 import BeautifulSoup
import logging
from sqlalchemy.orm import Session
from db.database import SessionLocal
from db import models
from scraper.vin_decoder import decode_vin, extract_utility_specs
import asyncio

logger = logging.getLogger(__name__)

async def run_vehicle_hunter():
    """
    Main orchestration loop. Fetches active user search footprints,
    scrapes target listings, and processes potential deals.
    """
    logger.info("🚀 Vehicle Hunter Drone deployed. Scanning listings...")
    db = SessionLocal()
    
    try:
        # 1. Fetch active footprints from the database
        active_hunts = db.query(models.SearchPreference).filter(models.SearchPreference.is_active == True).all()
        
        if not active_hunts:
            logger.info("No active hunting profiles found. Returning to base.")
            return

        for hunt in active_hunts:
            logger.info(f"Scanning the web for: {hunt.make} {hunt.model} (Max ${hunt.max_price})")
            
            # 2. Fire off network requests to listing sources
            raw_listings = await fetch_classified_listings(hunt.make, hunt.model)
            
            # 3. Sift through findings
            for listing in raw_listings:
                # Basic ceiling filters check before wasting compute decoding the VIN
                if listing['price'] > hunt.max_price or listing['miles'] > hunt.max_miles:
                    continue
                
                # Check if we've already logged this exact deal to avoid duplicates
                existing_deal = db.query(models.GoldenDeal).filter(models.GoldenDeal.vin == listing['vin']).first()
                if existing_deal:
                    continue

                # 4. Deep-scan physical properties via the VIN decoder engine
                raw_vin_data = await decode_vin(listing['vin'])
                specs = extract_utility_specs(raw_vin_data)
                
                # 5. Evaluate strict utility constraints
                if not evaluate_constraints(hunt, specs):
                    continue  # Dropped: Didn't match physical requirements (wrong roof, wrong wheelbase, etc.)
                
                # 6. Deal Valuation Algorithmic Check
                # For now, let's assume a static baseline market average to test the trigger
                market_avg = listing['price'] + 4000.00  # Mock math: pretend it's $4k under market
                discount = market_avg - listing['price']
                
                # If it passes the gauntlet, save it to the Golden Deals Dashboard!
                new_deal = models.GoldenDeal(
                    search_preference_id=hunt.id,
                    vin=listing['vin'],
                    title=f"{listing['year']} {specs['make']} {specs['model']}",
                    url=listing['url'],
                    price=listing['price'],
                    miles=listing['miles'],
                    year=int(listing['year']),
                    trim=specs['trim'],
                    roof_height=specs['roof_height'],
                    wheelbase_inches=specs['wheelbase_inches'],
                    bed_length_inches=specs['bed_length_inches'],
                    passenger_capacity=specs['passenger_capacity'],
                    market_average_price=market_avg,
                    market_discount=discount,
                    listing_source="Mock Classifieds"
                )
                
                db.add(new_deal)
                logger.info(f"🚨 GOLDEN DEAL CAUGHT! Saved {specs['roof_height']} Roof Transit VIN: {listing['vin']}")
                
        db.commit()
    except Exception as e:
        logger.error(f"Error during scraping loop execution: {e}")
    finally:
        db.close()

async def fetch_classified_listings(make: str, model: str) -> list:
    """
    Simulates making an HTTP request to an inventory site and parsing individual 
    car cards to extract structural data blocks.
    """
    # In production, you would form a real URL (e.g., craigslist, autotrader, cargurus search layouts)
    # mock_url = f"https://example-classifieds.com/search?make={make}&model={model}"
    
    # Let's mock a successful parse yield to see our backend process it perfectly
    await asyncio.sleep(1.5) # Simulate network lag
    
    return [
        {
            "vin": "1FBAX2CV0JKA32346", # Your 2018 Medium Roof Transit sample
            "price": 24500.00,
            "miles": 88000,
            "year": 2018,
            "url": "https://example-classifieds.com/listing/12345"
        }
    ]

def evaluate_constraints(hunt, specs: dict) -> bool:
    """Evaluates strict physical configuration boundaries."""
    if hunt.required_roof_height and specs['roof_height'] != hunt.required_roof_height:
        return False
    if hunt.required_wheelbase_inches and specs['wheelbase_inches'] != hunt.required_wheelbase_inches:
        return False
    if hunt.required_passenger_capacity and specs['passenger_capacity'] != hunt.required_passenger_capacity:
        return False
    if hunt.required_bed_length_inches and specs['bed_length_inches'] != hunt.required_bed_length_inches:
        return False
    return True

