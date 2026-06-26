from sqlmodel import SQLModel, Field
from datetime import date
from typing import Optional

class ImplantCardBase(SQLModel):
    """
    Shared attributes across validation schemas and database models.
    Derived directly from the physical card fields in image_915595.png.
    """
    implant_name: str = Field(index=True)
    implant_code: str = Field(unique=True)
    implantation_date: date
    common_denomination: Optional[str] = Field(default=None)
    sanitary_registration: str
    surgeon_name: str
    provider: str
    nit: str
    phone: Optional[str] = Field(default=None)
    references: Optional[str] = Field(default=None)
    storage_unit_code: Optional[str] = Field(default=None)
    implantation_unit_code: Optional[str] = Field(default=None)

class ImplantCard(ImplantCardBase, table=True):
    """
    The actual Database Table definition mapping to SQL rows.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    risk_class: str = Field(description="AI evaluated risk classification level")

class ImplantCardCreate(ImplantCardBase):
    """Schema used strictly for API payload ingestion (POST requests)."""
    pass

class ImplantCardResponse(ImplantCardBase):
    """Schema used strictly for API structural response serialization."""
    id: int
    risk_class: str