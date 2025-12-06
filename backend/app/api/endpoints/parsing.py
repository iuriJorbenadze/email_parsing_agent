"""Parsing endpoints for email processing."""
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any
from datetime import datetime
import json
import os
import logging

from app.core.database import get_db
from app.services.openai_parser import parse_email as openai_parse_email

router = APIRouter()
logger = logging.getLogger(__name__)

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
            "description": "Type of offer (e.g., partnership, advertising, guest_post, link_exchange, acquisition, sponsored)"
        },
        "price": {
            "type": "object",
            "properties": {
                "amount": {"type": "number", "description": "Price amount if mentioned"},
                "currency": {"type": "string", "description": "Currency code (USD, EUR, etc.)"}
            }
        },
        "description": {
            "type": "string",
            "description": "Brief summary of what is being offered"
        },
        "metrics": {
            "type": "object",
            "properties": {
                "monthly_traffic": {"type": "string", "description": "Monthly visitors/traffic if mentioned"},
                "domain_authority": {"type": "number", "description": "DA score if mentioned"},
                "page_authority": {"type": "number", "description": "PA score if mentioned"}
            },
            "description": "Website metrics if mentioned in the email"
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
        logger.error(f"Error loading schema: {e}")
    return DEFAULT_PARSING_SCHEMA


def save_schema(schema: Dict[str, Any]) -> None:
    """Save schema to file."""
    try:
        os.makedirs(os.path.dirname(SCHEMA_FILE), exist_ok=True)
        with open(SCHEMA_FILE, 'w') as f:
            json.dump(schema, f, indent=2)
        logger.info(f"Schema saved to {SCHEMA_FILE}")
    except Exception as e:
        logger.error(f"Error saving schema: {e}")
        raise


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
    
    if not isinstance(schema, dict):
        raise HTTPException(status_code=400, detail="Schema must be an object")
    
    try:
        save_schema(schema)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save schema: {str(e)}")
    
    return {"message": "Schema updated successfully", "schema": schema}


@router.post("/parse/{email_id}")
async def parse_email(email_id: int, db: Session = Depends(get_db)):
    """
    Parse a specific email using OpenAI and the current schema.
    
    This will:
    1. Load the email from database
    2. Load the current parsing schema
    3. Send to OpenAI for parsing
    4. Save the parsed data back to the email record
    """
    from app.models.email import Email, EmailStatus
    
    # Get the email
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Check if email has content
    if not email.body_text:
        raise HTTPException(status_code=400, detail="Email has no content to parse")
    
    # Update status to parsing
    email.status = EmailStatus.PARSING
    db.commit()
    
    try:
        # Load current schema
        schema = load_schema()
        
        # Call OpenAI parser with full metadata
        result = openai_parse_email(
            email_body=email.body_text,
            schema=schema,
            subject=email.subject or "",
            sender_email=email.sender or "",
            sender_name=email.sender_name or "",
            received_at=email.received_at,
            headers=email.headers,  # Additional headers like Reply-To, CC
        )
        
        if result["success"]:
            # Save parsed data and clear any previous corrections
            email.parsed_data = result["data"]
            email.parsing_model = result.get("model", "gpt-4-turbo-preview")
            email.parsed_at = datetime.utcnow()
            email.status = EmailStatus.PARSED
            email.error_message = None
            # Clear corrections when re-parsing - user wants fresh AI output
            email.corrected_data = None
            email.correction_diff = None
            email.corrected_at = None
            
            db.commit()
            
            return {
                "success": True,
                "email_id": email_id,
                "parsed_data": result["data"],
                "model": result.get("model"),
                "usage": result.get("usage"),
            }
        else:
            # Parsing failed
            email.status = EmailStatus.FAILED
            email.error_message = result.get("error", "Unknown parsing error")
            db.commit()
            
            raise HTTPException(
                status_code=500,
                detail=f"Parsing failed: {result.get('error', 'Unknown error')}"
            )
            
    except HTTPException:
        raise
    except Exception as e:
        # Unexpected error
        email.status = EmailStatus.FAILED
        email.error_message = str(e)
        db.commit()
        
        logger.error(f"Unexpected error parsing email {email_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Parsing error: {str(e)}")


@router.post("/parse-batch")
async def parse_batch(
    body: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
):
    """
    Queue a batch of pending emails for parsing.
    
    Body:
        - count: Number of emails to process (default 10, max 100)
    
    Returns:
        - queued: Number of emails queued
        - email_ids: List of email IDs that will be processed
    """
    from app.models.email import Email, EmailStatus
    
    count = min(body.get("count", 10), 100)  # Cap at 100
    
    # Get pending emails
    pending_emails = db.query(Email).filter(
        Email.status == EmailStatus.PENDING
    ).limit(count).all()
    
    if not pending_emails:
        return {
            "queued": 0,
            "email_ids": [],
            "message": "No pending emails to process"
        }
    
    email_ids = [e.id for e in pending_emails]
    
    # Process each email (sequential for now, will be async later)
    results = []
    for email_id in email_ids:
        try:
            result = await parse_email(email_id, db)
            results.append({"email_id": email_id, "success": True})
        except Exception as e:
            results.append({"email_id": email_id, "success": False, "error": str(e)})
    
    successful = sum(1 for r in results if r["success"])
    
    return {
        "processed": len(results),
        "successful": successful,
        "failed": len(results) - successful,
        "results": results,
    }


@router.post("/correct/{email_id}")
async def save_correction(
    email_id: int,
    body: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
):
    """Save human correction for a parsed email."""
    from app.models.email import Email, EmailStatus
    
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
