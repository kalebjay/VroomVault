import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
 
# --- SQLite Configuration (Original) ---
# URL = 'sqlite:///./ig_api.db'
# engine = create_engine(URL, connect_args={"check_same_thread": False})
# ---------------------------------------

# --- PostgreSQL Configuration ---
# DB_USER = os.getenv("DB_USER")
# DB_PASS = os.getenv("DB_PASS")
# DB_HOST = os.getenv("DB_HOST")
# DB_NAME = os.getenv("DB_NAME")
# URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
URL = os.getenv("DATABASE_URL")

# SQLAlchemy requires 'postgresql://', but some providers (like Railway) return 'postgres://'
if URL and URL.startswith("postgres://"):
    URL = URL.replace("postgres://", "postgresql://", 1)
# --------------------------------

engine = create_engine(URL)
 
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
 
Base = declarative_base()
 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
