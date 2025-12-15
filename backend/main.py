from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import models
from db.database import engine
from router import user, authentication, maintenance, vehicle

# Usage
# alias uvi  ='uvicorn main:app --reload' (displays on port 8000)
# open in browser at http://127.0.0.1:8000/docs#/
# open DB browser for SQLite with 
# alias slb ='sqlitebrowser &' (must open DB with ig_api.db file)

app = FastAPI()

# Create a master router for the /api prefix
api_router = APIRouter(prefix="/api")

api_router.include_router(authentication.router)
api_router.include_router(user.router)
api_router.include_router(vehicle.router)
api_router.include_router(maintenance.router)


#@app.get("/")
#def root():
#    return "Yo sup foo"


app.include_router(api_router)

origins = ['http://localhost:5173']
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


models.Base.metadata.create_all(engine)

app.mount('/images', StaticFiles(directory='images'), name='images')
