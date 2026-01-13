import os
from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import models
from db.database import engine
from router import user, authentication, maintenance, vehicle
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from utils.scheduler import check_upcoming_expirations

# Usage
# alias uvi  ='uvicorn main:app --reload' (displays on port 8000)
# open in browser at http://127.0.0.1:8000/docs#/
# open DB browser for SQLite with 
# alias slb ='sqlitebrowser &' (must open DB with ig_api.db file)

app = FastAPI()

origins = ['http://localhost:5173', 'http://127.0.0.1:5173']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex='https?://.*',
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def startup_event():
    # Schedule job to run every day at a specific time (9:00 AM UTC, 4 AM ET)
    scheduler.add_job(check_upcoming_expirations, CronTrigger(hour=9, minute=0, second=0))
    # For testing, '*/5' = every 5th second
    # scheduler.add_job(check_upcoming_expirations, CronTrigger(second='*/5'))
    scheduler.start()

@app.on_event("shutdown")
async def shutdown_event():
    scheduler.shutdown()

# Create a master router for the /api prefix
api_router = APIRouter(prefix="/api")

api_router.include_router(authentication.router)
api_router.include_router(user.router)
api_router.include_router(vehicle.router)
api_router.include_router(maintenance.router)


app.include_router(api_router)


models.Base.metadata.create_all(engine)

if not os.path.exists('images'):
    os.makedirs('images')

app.mount('/images', StaticFiles(directory='images'), name='images')
