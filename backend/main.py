from fastapi import FastAPI, status, Depends
from sqlmodel import Session, select
from typing import List

from models import ImplantCard, ImplantCardCreate, ImplantCardResponse
from classifier import predict_risk_class
from database import create_db_and_tables, get_session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Club Noel - IMD Tracking & AI Classification System",
    description="Backend API designed for secure SQL storage and AI-powered risk tiering of Implantable Medical Devices.",
    version="1.0.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    """Triggers database and tables generation on service deployment launch."""
    create_db_and_tables()


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "healthy", "service": "clubnoel-dmi-backend"}


@app.post(
    "/api/v1/implant-cards",
    response_model=ImplantCardResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_implant_card(
    payload: ImplantCardCreate, db: Session = Depends(get_session)
):
    """
    Ingests implant card records, assesses risk class through the AI engine,
    and persists execution to the relational SQL Database.
    """
    # 1. Execute AI classification pipeline
    predicted_tier = predict_risk_class(
        implant_name=payload.implant_name,
        common_denomination=payload.common_denomination or "",
    )

    # 2. Map payload schema attributes to Database model instance
    db_record = ImplantCard.model_validate(
        payload, update={"risk_class": predicted_tier}
    )

    # 3. Handle SQL transactional sequence block
    db.add(db_record)
    db.commit()
    db.refresh(db_record)

    return db_record


@app.get(
    "/api/v1/implant-cards",
    response_model=List[ImplantCardResponse],
    status_code=status.HTTP_200_OK,
)
async def list_implant_cards(db: Session = Depends(get_session)):
    """Fetches all tracked implant cards stored in the SQL Database."""
    records = db.exec(select(ImplantCard)).all()
    return records
