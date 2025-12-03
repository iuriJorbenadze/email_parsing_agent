from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.core.database import Base


class GmailAccount(Base):
    """Model for connected Gmail accounts."""
    
    __tablename__ = "gmail_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(255), nullable=True)
    
    # OAuth tokens (encrypted in production)
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=False)
    token_expiry = Column(DateTime, nullable=False)
    
    # Status
    is_active = Column(Boolean, default=True)
    last_sync = Column(DateTime, nullable=True)
    last_history_id = Column(String(50), nullable=True)  # For incremental sync
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    emails = relationship("Email", back_populates="gmail_account", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<GmailAccount {self.email}>"


