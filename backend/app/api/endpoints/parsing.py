from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any
from pydantic import BaseModel
import json
import os

from app.core.database import get_db

router = APIRouter()

# File-based schema storage (simple approach for MVP)
SCHEMA_FILE = "/app/data/parsing_schema.json"

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


def load_schema() -> Dict[str, Any]:
    """Load schema from file or return default."""
    try:
        if os.path.exists(SCHEMA_FILE):
            with open(SCHEMA_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading schema: {e}")
    return DEFAULT_PARSING_SCHEMA


def save_schema(schema: Dict[str, Any]) -> None:
    """Save schema to file."""
    try:
        os.makedirs(os.path.dirname(SCHEMA_FILE), exist_ok=True)
        with open(SCHEMA_FILE, 'w') as f:
            json.dump(schema, f, indent=2)
        print(f"Schema saved to {SCHEMA_FILE}")
    except Exception as e:
        print(f"Error saving schema: {e}")
        raise


class SchemaUpdateRequest(BaseModel):
    schema_data: Dict[str, Any]

    class Config:
        # Allow 'schema' as field name despite Pydantic warning
        protected_namespaces = ()


@router.get("/schema")
async def get_parsing_schema():
    """Get the current JSON schema used for parsing."""
    schema = load_schema()
    return {"schema": schema}


@router.put("/schema")
async def update_parsing_schema(body: Dict[str, Any] = Body(...)):
    """Update the JSON schema used for parsing."""
    schema = body.get("schema")
    if not schema:
        raise HTTPException(status_code=400, detail="Schema is required in request body")
    
    # Basic validation - check it's a valid JSON schema structure
    if not isinstance(schema, dict):
        raise HTTPException(status_code=400, detail="Schema must be an object")
    
    try:
        save_schema(schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save schema: {str(e)}")
    
    return {"message": "Schema updated successfully", "schema": schema}


@router.post("/parse/{email_id}")
async def parse_email(email_id: int, db: Session = Depends(get_db)):
    """Parse a specific email using the current schema."""
    from app.models.email import Email
    
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # TODO: Implement OpenAI parsing
    return {
        "message": "OpenAI parsing not yet implemented",
        "email_id": email_id,
    }


@router.post("/correct/{email_id}")
async def save_correction(
    email_id: int,
    body: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
):
    """Save human correction for a parsed email."""
    from app.models.email import Email, EmailStatus
    from datetime import datetime
    
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    corrected_data = body.get("corrected_data")
    if corrected_data:
        email.corrected_data = corrected_data
        email.corrected_at = datetime.utcnow()
        email.status = EmailStatus.REVIEWED
        db.commit()
    
    return {"message": "Correction saved", "email_id": email_id}
