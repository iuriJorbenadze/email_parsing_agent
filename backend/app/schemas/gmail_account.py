from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class GmailAccountBase(BaseModel):
    """Base schema for Gmail account."""
    email: EmailStr
    display_name: Optional[str] = None


class GmailAccountCreate(GmailAccountBase):
    """Schema for creating a Gmail account connection."""
    access_token: str
    refresh_token: str
    token_expiry: datetime


class GmailAccountResponse(GmailAccountBase):
    """Schema for Gmail account response."""
    id: int
    is_active: bool
    last_sync: Optional[datetime] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class GmailAccountList(BaseModel):
    """Schema for list of Gmail accounts."""
    accounts: list[GmailAccountResponse]
    total: int


