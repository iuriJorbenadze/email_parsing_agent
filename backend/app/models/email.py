from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from app.core.database import Base


class EmailStatus(enum.Enum):
    """Email processing status."""
    PENDING = "pending"
    PARSING = "parsing"
    PARSED = "parsed"
    REVIEWED = "reviewed"
    FAILED = "failed"


class Email(Base):
    """Model for stored emails."""
    
    __tablename__ = "emails"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Gmail identifiers
    gmail_account_id = Column(Integer, ForeignKey("gmail_accounts.id"), nullable=False)
    gmail_message_id = Column(String(100), nullable=False, index=True)
    thread_id = Column(String(100), nullable=True)
    
    # Email content
    subject = Column(String(500), nullable=True)
    sender = Column(String(255), nullable=False)
    sender_name = Column(String(255), nullable=True)
    body_text = Column(Text, nullable=False)
    body_html = Column(Text, nullable=True)
    headers = Column(JSON, nullable=True)
    received_at = Column(DateTime, nullable=False)
    
    # Processing status
    status = Column(Enum(EmailStatus), default=EmailStatus.PENDING, index=True)
    error_message = Column(Text, nullable=True)
    
    # Parsed data
    parsed_data = Column(JSON, nullable=True)
    parsing_model = Column(String(50), nullable=True)
    confidence_score = Column(Integer, nullable=True)  # 0-100
    parsed_at = Column(DateTime, nullable=True)
    
    # Human corrections
    corrected_data = Column(JSON, nullable=True)
    correction_diff = Column(JSON, nullable=True)
    corrected_by = Column(String(255), nullable=True)
    corrected_at = Column(DateTime, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    gmail_account = relationship("GmailAccount", back_populates="emails")
    
    def __repr__(self):
        return f"<Email {self.id}: {self.subject[:50] if self.subject else 'No Subject'}>"


