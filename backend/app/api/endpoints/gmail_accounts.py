from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.schemas.gmail_account import (
    GmailAccountCreate,
    GmailAccountResponse,
    GmailAccountList,
)

router = APIRouter()


@router.get("/", response_model=List[GmailAccountResponse])
async def list_gmail_accounts(db: Session = Depends(get_db)):
    """List all connected Gmail accounts."""
    # TODO: Implement after models are set up
    return []


@router.post("/connect")
async def initiate_gmail_connection():
    """Initiate OAuth flow to connect a Gmail account."""
    # TODO: Implement Google OAuth flow
    return {"message": "OAuth flow not yet implemented"}


@router.post("/callback")
async def gmail_oauth_callback(code: str, db: Session = Depends(get_db)):
    """Handle OAuth callback from Google."""
    # TODO: Implement OAuth callback handling
    return {"message": "OAuth callback not yet implemented"}


@router.delete("/{account_id}")
async def disconnect_gmail_account(account_id: int, db: Session = Depends(get_db)):
    """Disconnect a Gmail account."""
    # TODO: Implement account disconnection
    raise HTTPException(status_code=404, detail="Account not found")


