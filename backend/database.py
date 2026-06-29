from sqlmodel import SQLModel, create_engine, Session

DATABASE_FILE = "clubnoel_dmi.db"
sqlite_url = f"sqlite:///{DATABASE_FILE}"

# connect_args={"check_same_thread": False} is needed only for SQLite
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})


def create_db_and_tables():
    """Initializes the database and creates all tables defined in SQLModel schemas."""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency generator to yield database sessions per request."""
    with Session(engine) as session:
        yield session
