from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class EmailStatus(str, Enum):
    """Email processing status."""
    PENDING = "pending"
    PARSING = "parsing"
    PARSED = "parsed"
    REVIEWED = "reviewed"
    FAILED = "failed"


class EmailBase(BaseModel):
    """Base schema for email."""
    subject: str
    sender: EmailStr
    sender_name: Optional[str] = None
    received_at: datetime
    body_text: str
    body_html: Optional[str] = None


class EmailCreate(EmailBase):
    """Schema for creating an email record."""
    gmail_account_id: int
    gmail_message_id: str
    thread_id: Optional[str] = None
    headers: Optional[Dict[str, str]] = None


class ParsedData(BaseModel):
    """Schema for parsed email data."""
    data: Dict[str, Any]
    confidence_score: Optional[float] = None
    parsing_model: Optional[str] = None
    parsed_at: datetime


class CorrectedData(BaseModel):
    """Schema for human-corrected data."""
    data: Dict[str, Any]
    corrected_by: Optional[str] = None
    corrected_at: datetime
    diff: Optional[Dict[str, Any]] = None


class EmailResponse(EmailBase):
    """Schema for email response."""
    id: int
    gmail_account_id: int
    status: EmailStatus
    parsed_data: Optional[ParsedData] = None
    corrected_data: Optional[CorrectedData] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class EmailListResponse(BaseModel):
    """Schema for paginated email list."""
    emails: List[EmailResponse]
    total: int
    page: int
    page_size: int


