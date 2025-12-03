from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.core.database import get_db
from app.schemas.parsing import (
    ParseRequest,
    ParseResponse,
    SchemaConfig,
    CorrectionRequest,
)

router = APIRouter()


# Default JSON schema for parsing commercial offers
DEFAULT_PARSING_SCHEMA = {
    "type": "object",
    "properties": {
        "company_name": {
            "type": "string",
            "description": "Name of the company making the offer"
        },
        "contact_email": {
            "type": "string",
            "description": "Contact email address"
        },
        "contact_name": {
            "type": "string",
            "description": "Name of the contact person"
        },
        "website_url": {
            "type": "string",
            "description": "Website URL being offered"
        },
        "offer_type": {
            "type": "string",
            "description": "Type of offer (e.g., partnership, advertising, sale)"
        },
        "price": {
            "type": "object",
            "properties": {
                "amount": {"type": "number"},
                "currency": {"type": "string"}
            }
        },
        "description": {
            "type": "string",
            "description": "Brief description of the offer"
        },
        "metrics": {
            "type": "object",
            "properties": {
                "monthly_traffic": {"type": "string"},
                "domain_authority": {"type": "number"},
                "page_authority": {"type": "number"}
            },
            "description": "Website metrics if mentioned"
        }
    },
    "required": ["company_name", "offer_type"]
}


@router.get("/schema")
async def get_parsing_schema():
    """Get the current JSON schema used for parsing."""
    # TODO: Load from database per user/organization
    return {"schema": DEFAULT_PARSING_SCHEMA}


@router.put("/schema")
async def update_parsing_schema(schema: SchemaConfig, db: Session = Depends(get_db)):
    """Update the JSON schema used for parsing."""
    # TODO: Save to database per user/organization
    return {"message": "Schema updated", "schema": schema.schema}


@router.post("/parse/{email_id}", response_model=ParseResponse)
async def parse_email(email_id: int, db: Session = Depends(get_db)):
    """Parse a specific email using the current schema."""
    # TODO: Implement OpenAI parsing
    raise HTTPException(status_code=404, detail="Email not found")


@router.post("/correct/{email_id}")
async def save_correction(
    email_id: int,
    correction: CorrectionRequest,
    db: Session = Depends(get_db),
):
    """Save human correction for a parsed email."""
    # TODO: Implement correction saving with diff tracking
    raise HTTPException(status_code=404, detail="Email not found")


