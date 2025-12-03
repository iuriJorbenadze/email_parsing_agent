from pydantic import BaseModel
from typing import Dict, Any, Optional
from datetime import datetime


class ParseRequest(BaseModel):
    """Schema for parse request."""
    email_id: int
    schema_override: Optional[Dict[str, Any]] = None


class ParseResponse(BaseModel):
    """Schema for parse response."""
    email_id: int
    parsed_data: Dict[str, Any]
    confidence_score: Optional[float] = None
    raw_response: Optional[str] = None


class SchemaConfig(BaseModel):
    """Schema for JSON schema configuration."""
    schema: Dict[str, Any]
    name: Optional[str] = None
    description: Optional[str] = None


class CorrectionRequest(BaseModel):
    """Schema for submitting human corrections."""
    corrected_data: Dict[str, Any]
    notes: Optional[str] = None


class DiffEntry(BaseModel):
    """Schema for a single diff entry."""
    field: str
    old_value: Any
    new_value: Any
    change_type: str  # added, removed, modified


class CorrectionResponse(BaseModel):
    """Schema for correction response."""
    email_id: int
    original_parsed: Dict[str, Any]
    corrected_data: Dict[str, Any]
    diff: list[DiffEntry]
    saved_at: datetime


