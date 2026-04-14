import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load .env from project root. In Docker, this is redundant but harmless.
load_dotenv(os.path.join(os.path.dirname(__file__), '../../.env'))

# --- PostgreSQL Remote Configuration ---
URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not set (local dev), construct it from components
if not URL:
    DB_USER = os.getenv("DB_USER")
    DB_PASS = os.getenv("DB_PASS")
    DB_HOST = os.getenv("DB_HOST", "db")
    DB_NAME = os.getenv("DB_NAME")
    if all([DB_USER, DB_PASS, DB_NAME]):
        URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"
# ---------------------------------------

if not URL:
    print("WARNING: DATABASE_URL environment variable not found. Using SQLite fallback.")
    URL = "sqlite:///./vroomvault_fallback.db"

# SQLAlchemy requires 'postgresql://', but some providers (like Railway) return 'postgres://'
if URL and URL.startswith("postgres://"):
    URL = URL.replace("postgres://", "postgresql://", 1)
# --------------------------------

connect_args = {}
if URL and URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(URL, connect_args=connect_args)
 
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
 
Base = declarative_base()
 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
