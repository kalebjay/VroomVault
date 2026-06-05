import os
from contextlib import asynccontextmanager
# third party imports
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
# local imports
from db import models
from db.database import engine
from router import authentication, maintenance, scraper, user, vehicle
from scraper.engine import run_vehicle_hunter
from utils.scheduler import check_upcoming_expirations

# Usage (if not using Docker Compose)
# alias uvi  ='uvicorn main:app --reload' (displays on port 8000)
# open in browser at http://127.0.0.1:8000/docs#/
# open DB browser for SQLite with (if not using postgres)
# alias slb ='sqlitebrowser &' (must open DB with ig_api.db file)

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure images directory exists inside the container
    if not os.path.exists('images'):
        os.makedirs('images')

    # Create DB tables on startup
    try:
        models.Base.metadata.create_all(engine)
        print("INFO: Database tables created successfully.")
    except Exception as e:
        print(f"ERROR: Failed to create database tables: {e}")
    
    # Job 1: Schedule to run every day at 9:00 AM UTC - for checking expirations and sending notifications
    scheduler.add_job(check_upcoming_expirations, CronTrigger(hour=9, minute=0, second=0))
    # Job 2: Deploy Vehicle Hunter automated background pipeline every 4 hours
    scheduler.add_job(run_vehicle_hunter, IntervalTrigger(hours=4))

    scheduler.start()
    print("INFO: All background daemons fully initialized.")
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)
app.mount("/images", StaticFiles(directory="images"), name="images")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://0.0.0.0:5173",
]

if os.getenv("ALLOWED_ORIGINS"):
    origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get("/")
def health_check():
    return {"status": "running", "service": "VroomVault Backend"}

# Create a master router for the /api prefix
api_router = APIRouter(prefix="/api")

api_router.include_router(authentication.router)
api_router.include_router(user.router)
api_router.include_router(vehicle.router)
api_router.include_router(maintenance.router)
api_router.include_router(scraper.router)


app.include_router(api_router)

app.mount('/images', StaticFiles(directory='images'), name='images')
