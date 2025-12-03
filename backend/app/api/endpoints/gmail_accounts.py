from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.database import get_db
from app.models.gmail_account import GmailAccount
from app.models.email import Email

router = APIRouter()


@router.get("/")
async def list_gmail_accounts(db: Session = Depends(get_db)):
    """List all connected Gmail accounts."""
    accounts = db.query(GmailAccount).all()
    
    result = []
    for account in accounts:
        # Get email count for this account
        email_count = db.query(func.count(Email.id)).filter(
            Email.gmail_account_id == account.id
        ).scalar()
        
        result.append({
            "id": account.id,
            "email": account.email,
            "display_name": account.display_name,
            "is_active": account.is_active,
            "last_sync": account.last_sync.isoformat() if account.last_sync else None,
            "created_at": account.created_at.isoformat() if account.created_at else None,
            "email_count": email_count,
        })
    
    return result


@router.post("/connect")
async def initiate_gmail_connection():
    """Initiate OAuth flow to connect a Gmail account."""
    # TODO: Implement Google OAuth flow
    return {"message": "OAuth flow not yet implemented", "oauth_url": None}


@router.post("/callback")
async def gmail_oauth_callback(code: str, db: Session = Depends(get_db)):
    """Handle OAuth callback from Google."""
    # TODO: Implement OAuth callback handling
    return {"message": "OAuth callback not yet implemented"}


@router.delete("/{account_id}")
async def disconnect_gmail_account(account_id: int, db: Session = Depends(get_db)):
    """Disconnect a Gmail account."""
    account = db.query(GmailAccount).filter(GmailAccount.id == account_id).first()
    
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    
    # Delete associated emails first
    db.query(Email).filter(Email.gmail_account_id == account_id).delete()
    db.delete(account)
    db.commit()
    
    return {"message": "Account disconnected", "id": account_id}
