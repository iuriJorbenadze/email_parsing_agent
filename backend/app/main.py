from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api import router as api_router

app = FastAPI(
    title="Email Parsing Agent API",
    description="API for parsing commercial offer emails into structured data",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint for container orchestration."""
    return {
        "status": "healthy",
        "version": "0.1.0",
    }


