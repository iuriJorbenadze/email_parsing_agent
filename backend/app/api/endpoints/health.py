from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.database import get_db

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check."""
    return {"status": "ok"}


@router.get("/db")
async def database_health_check(db: Session = Depends(get_db)):
    """Check database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}


