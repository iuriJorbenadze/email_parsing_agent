from fastapi import APIRouter

from app.api.endpoints import health, gmail_accounts, emails, parsing, seed

router = APIRouter()

# Include all endpoint routers
router.include_router(health.router, prefix="/health", tags=["Health"])
router.include_router(gmail_accounts.router, prefix="/gmail-accounts", tags=["Gmail Accounts"])
router.include_router(emails.router, prefix="/emails", tags=["Emails"])
router.include_router(parsing.router, prefix="/parsing", tags=["Parsing"])
router.include_router(seed.router, prefix="/seed", tags=["Seed Data"])


