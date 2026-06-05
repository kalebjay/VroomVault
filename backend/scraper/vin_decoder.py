import httpx
import logging

logger = logging.getLogger(__name__)

async def decode_vin(vin: str) -> dict:
    """
    Fetches raw vehicle manufacturing data from the NHTSA API 
    and flattens it into a usable key-value dictionary.
    """
    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            flattened_data = {}
            for item in data.get("Results", []):
                variable = item.get("Variable")
                value = item.get("Value")
                if variable and value is not None and value != "":
                    flattened_data[variable] = value
                    
            return flattened_data
            
        except httpx.HTTPError as e:
            logger.error(f"NHTSA API error for VIN {vin}: {e}")
            return {}

def extract_utility_specs(vin_data: dict) -> dict:
    """
    Parses the raw VIN dictionary using precise NHTSA keys 
    and deep text-scanning for vehicle dimensions.
    """
    # 1. Extract Bed Length (Key is exactly "Bed Length (inches)")
    raw_bed_length = vin_data.get("Bed Length (inches)")
    bed_length_inches = float(raw_bed_length) if raw_bed_length and str(raw_bed_length).replace('.', '', 1).isdigit() else None
    
    # 2. Extract Wheelbase Length (Key is exactly "Wheel Base (inches) From")
    raw_wheelbase = vin_data.get("Wheel Base (inches) From")
    wheelbase_inches = float(raw_wheelbase) if raw_wheelbase and str(raw_wheelbase).replace('.', '', 1).isdigit() else None
    
    # 3. Build a comprehensive text payload to hunt for structural patterns safely
    search_payload = " ".join([
        str(vin_data.get("Series", "")),
        str(vin_data.get("Series2", "")),
        str(vin_data.get("Body Class", "")),
        str(vin_data.get("Vehicle Type", "")),
        str(vin_data.get("Note", ""))
    ]).lower()
    
    # 4. Precise Roof Height Matching
    roof_height = "Unknown"
    if "high roof" in search_payload:
        roof_height = "High"
    elif "medium roof" in search_payload or "med roof" in search_payload:
        roof_height = "Medium"
    elif "low roof" in search_payload:
        roof_height = "Low"
        
    # 5. Smart Passenger Capacity Extraction
    passenger_count = vin_data.get("Number of Seats")
    passengers = int(passenger_count) if passenger_count and str(passenger_count).isdigit() else None
    
    # Fallback context mapping for seat count if column is null
    if passengers is None:
        if "15-passenger" in search_payload or "15 pax" in search_payload or "15 passenger" in search_payload:
            passengers = 15
        elif "12-passenger" in search_payload or "12 pax" in search_payload or "12 passenger" in search_payload:
            passengers = 12
        elif "passenger van" in search_payload or "wagon" in search_payload:
            passengers = 12 
        elif "cargo van" in search_payload:
            passengers = 2

    # 6. Smart Trim Extraction
    trim = vin_data.get("Trim")
    if not trim or trim == "":
        series_val = vin_data.get("Series")
        if series_val:
            trim = f"{series_val}"  # Yields series markers like "350", "F-250", etc.

    return {
        "make": vin_data.get("Make"),
        "model": vin_data.get("Model"),
        "year": vin_data.get("Model Year"), 
        "trim": trim,
        "wheelbase_inches": wheelbase_inches,  # <-- Brand new verified spec field!
        "bed_length_inches": bed_length_inches,
        "is_eight_foot_bed": bed_length_inches >= 96.0 if bed_length_inches else False,
        "roof_height": roof_height,
        "passenger_capacity": passengers,
        "raw_body_class": vin_data.get("Body Class") 
    }