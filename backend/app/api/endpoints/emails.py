from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.schemas.email import EmailResponse, EmailListResponse

router = APIRouter()


@router.get("/", response_model=EmailListResponse)
async def list_emails(
    status: Optional[str] = Query(None, description="Filter by status: pending, parsed, reviewed"),
    account_id: Optional[int] = Query(None, description="Filter by Gmail account"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List emails with optional filtering."""
    # TODO: Implement after models are set up
    return {
        "emails": [],
        "total": 0,
        "page": page,
        "page_size": page_size,
    }


@router.get("/{email_id}", response_model=EmailResponse)
async def get_email(email_id: int, db: Session = Depends(get_db)):
    """Get a specific email with its parsed data."""
    # TODO: Implement after models are set up
    raise HTTPException(status_code=404, detail="Email not found")


@router.post("/{email_id}/fetch")
async def fetch_emails_for_account(account_id: int, db: Session = Depends(get_db)):
    """Manually trigger email fetch for an account."""
    # TODO: Implement email fetching
    return {"message": "Email fetch not yet implemented"}


