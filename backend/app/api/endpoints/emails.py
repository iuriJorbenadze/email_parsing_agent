from fastapi import APIRouter, Depends, HTTPException, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import Optional, Dict, Any
from datetime import datetime

from app.core.database import get_db
from app.models.email import Email, EmailStatus

router = APIRouter()


@router.get("/")
async def list_emails(
    status: Optional[str] = Query(None, description="Filter by status: pending, parsed, reviewed, failed"),
    account_id: Optional[int] = Query(None, description="Filter by Gmail account"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List emails with optional filtering."""
    query = db.query(Email)
    
    # Apply filters
    if status:
        try:
            status_enum = EmailStatus(status)
            query = query.filter(Email.status == status_enum)
        except ValueError:
            pass  # Invalid status, ignore filter
    
    if account_id:
        query = query.filter(Email.gmail_account_id == account_id)
    
    # Get total count
    total = query.count()
    
    # Apply pagination and ordering
    emails = query.order_by(desc(Email.received_at)).offset((page - 1) * page_size).limit(page_size).all()
    
    # Format response
    return {
        "emails": [
            {
                "id": e.id,
                "subject": e.subject,
                "sender": e.sender,
                "sender_name": e.sender_name,
                "received_at": e.received_at.isoformat() if e.received_at else None,
                "status": e.status.value if e.status else "pending",
                "gmail_account_id": e.gmail_account_id,
                "has_parsed_data": e.parsed_data is not None,
                "has_corrections": e.corrected_data is not None,
            }
            for e in emails
        ],
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{email_id}")
async def get_email(email_id: int, db: Session = Depends(get_db)):
    """Get a specific email with its parsed data."""
    email = db.query(Email).filter(Email.id == email_id).first()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    return {
        "id": email.id,
        "gmail_account_id": email.gmail_account_id,
        "gmail_message_id": email.gmail_message_id,
        "subject": email.subject,
        "sender": email.sender,
        "sender_name": email.sender_name,
        "body_text": email.body_text,
        "body_html": email.body_html,
        "received_at": email.received_at.isoformat() if email.received_at else None,
        "status": email.status.value if email.status else "pending",
        "parsed_data": email.parsed_data,
        "corrected_data": email.corrected_data,
        "correction_diff": email.correction_diff,
        "parsed_at": email.parsed_at.isoformat() if email.parsed_at else None,
        "corrected_at": email.corrected_at.isoformat() if email.corrected_at else None,
        "created_at": email.created_at.isoformat() if email.created_at else None,
    }


@router.patch("/{email_id}")
async def update_email(
    email_id: int,
    body: Dict[str, Any] = Body(...),
    db: Session = Depends(get_db),
):
    """Update email with corrections or status change."""
    email = db.query(Email).filter(Email.id == email_id).first()
    
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    
    corrected_data = body.get("corrected_data")
    status = body.get("status")
    
    if corrected_data is not None:
        # Calculate diff between parsed and corrected
        diff = calculate_diff(email.parsed_data or {}, corrected_data)
        email.corrected_data = corrected_data
        email.correction_diff = diff
        email.corrected_at = datetime.utcnow()
    
    if status:
        try:
            email.status = EmailStatus(status)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")
    
    db.commit()
    db.refresh(email)
    
    return {
        "message": "Email updated successfully",
        "id": email.id,
        "status": email.status.value,
        "corrected_data": email.corrected_data,
    }


def calculate_diff(original: dict, corrected: dict) -> list:
    """Calculate differences between original and corrected data."""
    diff = []
    
    all_keys = set(original.keys()) | set(corrected.keys())
    
    for key in all_keys:
        old_val = original.get(key)
        new_val = corrected.get(key)
        
        if key not in original:
            diff.append({"field": key, "old_value": None, "new_value": new_val, "change_type": "added"})
        elif key not in corrected:
            diff.append({"field": key, "old_value": old_val, "new_value": None, "change_type": "removed"})
        elif old_val != new_val:
            diff.append({"field": key, "old_value": old_val, "new_value": new_val, "change_type": "modified"})
    
    return diff
