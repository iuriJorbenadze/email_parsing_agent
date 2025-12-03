"""Seed endpoint for development - adds sample data to database."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random

from app.core.database import get_db
from app.models.gmail_account import GmailAccount
from app.models.email import Email, EmailStatus

router = APIRouter()

SAMPLE_EMAILS = [
    {
        "subject": "Partnership Opportunity - Tech Blog Network",
        "sender": "john@techblog.com",
        "sender_name": "John Smith",
        "body_text": """Hi there,

I'm reaching out from TechBlog Network, a collection of 15 technology-focused websites with a combined monthly readership of 2.5 million visitors.

We're interested in exploring a partnership opportunity with your website. Here's what we're proposing:

- Guest post exchange (2 posts per month each way)
- Link placement in relevant existing articles
- Sponsored content opportunities ($200 per article)

Our flagship site, techblog.com, has:
- Domain Authority: 58
- Monthly organic traffic: 850,000 visitors
- Primary audience: Tech professionals, developers

Let me know if you'd be interested in discussing this further.

Best regards,
John Smith
Partnerships Manager
TechBlog Network""",
        "parsed_data": {
            "company_name": "TechBlog Network",
            "contact_email": "john@techblog.com",
            "contact_name": "John Smith",
            "website_url": "techblog.com",
            "offer_type": "partnership",
            "price": {"amount": 200, "currency": "USD"},
            "description": "Guest post exchange and sponsored content partnership",
            "metrics": {"monthly_traffic": "850,000", "domain_authority": 58}
        },
        "status": EmailStatus.PARSED,
    },
    {
        "subject": "Guest Post Offer - $150 per article",
        "sender": "marketing@seoagency.io",
        "sender_name": "SEO Agency Team",
        "body_text": """Hello,

We represent several clients looking for guest post placements on quality websites in your niche.

Offer details:
- $150 per published guest post
- High-quality, original content provided by us
- 1-2 contextual backlinks per article
- Quick turnaround (content ready within 48 hours)

We're looking for long-term partnerships and can guarantee 5-10 posts per month.

Website requirements:
- DA 30+
- Real traffic
- No spam history

Interested? Reply with your rates and guidelines.

Best,
Marketing Team
SEO Agency""",
        "parsed_data": {
            "company_name": "SEO Agency",
            "contact_email": "marketing@seoagency.io",
            "contact_name": "Marketing Team",
            "offer_type": "guest_post",
            "price": {"amount": 150, "currency": "USD"},
            "description": "Guest post placement service offering $150 per article"
        },
        "status": EmailStatus.REVIEWED,
    },
    {
        "subject": "Link Exchange Proposal - DA 45 Finance Site",
        "sender": "outreach@financesite.com",
        "sender_name": "Sarah Wilson",
        "body_text": """Hi,

I'm Sarah from FinanceSite.com. We're a personal finance blog with strong metrics:

- Domain Authority: 45
- Monthly visitors: 120,000
- Niche: Personal finance, investing, budgeting

I noticed your site covers similar topics and thought we could benefit from a link exchange.

Proposal:
- We add a contextual link to your site in one of our articles
- You add a link to us in a relevant post
- No money exchanged, pure value trade

Let me know if this interests you!

Sarah Wilson
Outreach Manager
FinanceSite.com""",
        "parsed_data": {
            "company_name": "FinanceSite.com",
            "contact_email": "outreach@financesite.com",
            "contact_name": "Sarah Wilson",
            "website_url": "financesite.com",
            "offer_type": "link_exchange",
            "description": "Reciprocal link exchange proposal",
            "metrics": {"monthly_traffic": "120,000", "domain_authority": 45}
        },
        "status": EmailStatus.PENDING,
    },
    {
        "subject": "Website Acquisition Interest",
        "sender": "buyer@webflippers.com",
        "sender_name": "Mike Chen",
        "body_text": """Hello,

I'm a website investor and I'm interested in potentially acquiring your website.

Could you please share:
- Monthly revenue (last 6 months average)
- Traffic sources breakdown
- Monetization methods
- Your asking price or if you're open to offers

I've successfully acquired and grown 20+ websites in the past 3 years. Happy to provide references.

Looking forward to hearing from you.

Mike Chen
WebFlippers Investments""",
        "parsed_data": {
            "company_name": "WebFlippers Investments",
            "contact_email": "buyer@webflippers.com",
            "contact_name": "Mike Chen",
            "offer_type": "acquisition",
            "description": "Website acquisition inquiry"
        },
        "status": EmailStatus.PENDING,
    },
    {
        "subject": "Sponsored Content Opportunity - $500",
        "sender": "ads@brandpromo.net",
        "sender_name": "Brand Promo",
        "body_text": """Dear Website Owner,

We have a client in the SaaS space looking for sponsored content placements.

Budget: $500 for a single sponsored article
Requirements:
- 1000+ words
- 2 dofollow links
- Permanent placement
- Marked as sponsored/partner content

The article will be professionally written by our team and aligned with your site's tone.

Interested in proceeding?

Brand Promo Team""",
        "parsed_data": None,
        "status": EmailStatus.PENDING,
    },
]


@router.post("/")
async def seed_database(db: Session = Depends(get_db)):
    """Seed the database with sample data for development."""
    
    # Check if data already exists
    existing = db.query(GmailAccount).first()
    if existing:
        return {"message": "Database already seeded", "seeded": False}
    
    # Create sample Gmail account
    gmail_account = GmailAccount(
        email="demo@example.com",
        display_name="Demo Inbox",
        access_token="demo_token",
        refresh_token="demo_refresh",
        token_expiry=datetime.utcnow() + timedelta(days=7),
        is_active=True,
        last_sync=datetime.utcnow(),
    )
    db.add(gmail_account)
    db.flush()  # Get the ID
    
    # Create sample emails
    for i, email_data in enumerate(SAMPLE_EMAILS):
        email = Email(
            gmail_account_id=gmail_account.id,
            gmail_message_id=f"msg_{i}_{random.randint(1000, 9999)}",
            subject=email_data["subject"],
            sender=email_data["sender"],
            sender_name=email_data["sender_name"],
            body_text=email_data["body_text"],
            received_at=datetime.utcnow() - timedelta(hours=i * 3),
            status=email_data["status"],
            parsed_data=email_data["parsed_data"],
            parsed_at=datetime.utcnow() if email_data["parsed_data"] else None,
        )
        db.add(email)
    
    db.commit()
    
    return {
        "message": "Database seeded successfully",
        "seeded": True,
        "accounts_created": 1,
        "emails_created": len(SAMPLE_EMAILS),
    }


@router.delete("/")
async def clear_seed_data(db: Session = Depends(get_db)):
    """Clear all seeded data (for development only)."""
    db.query(Email).delete()
    db.query(GmailAccount).delete()
    db.commit()
    return {"message": "All data cleared"}

