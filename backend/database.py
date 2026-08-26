import os
from sqlmodel import SQLModel, create_engine, Session

# Fetch database credentials from environment variables (AWS App Runner)
# Fallback to local SQLite if environment variables are not set
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "clubnoel_dmi")

if DB_HOST and DB_USER and DB_PASSWORD:
    # Production / Cloud: PostgreSQL connection on AWS RDS
    database_url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    engine = create_engine(database_url, echo=True)
else:
    # Local Development: SQLite fallback
    DATABASE_FILE = "clubnoel_dmi.db"
    database_url = f"sqlite:///{DATABASE_FILE}"
    engine = create_engine(database_url, connect_args={"check_same_thread": False})


def create_db_and_tables():
    """Initializes the database and creates all tables defined in SQLModel schemas."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency generator to yield database sessions per request."""
    with Session(engine) as session:
        yield session