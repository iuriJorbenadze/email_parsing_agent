# Email Parsing Agent

A full-stack application for parsing commercial offer emails into structured data using AI, with human validation workflow.

## Features

- 📧 **Gmail Integration** - Connect multiple Gmail accounts via OAuth
- 🤖 **AI-Powered Parsing** - Extract structured data using OpenAI GPT models
- ✏️ **Human Validation** - Side-by-side view for reviewing and correcting parsed data
- 📊 **Customizable Schema** - Define your own JSON schema for extraction
- 📈 **Pipeline Tracking** - Monitor processing status and track improvements
- 🔄 **Async Processing** - Reliable job queue for handling large volumes

## Tech Stack

### Backend
- **FastAPI** (Python 3.12)
- **PostgreSQL** - Data persistence
- **Redis** - Job queue / caching
- **Celery** - Async task processing
- **OpenAI API** - Email parsing
- **Google Gmail API** - Email ingestion

### Frontend
- **Next.js 14** (React)
- **TypeScript**
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching
- **Monaco Editor** - JSON editing
- **Zustand** - State management

## Project Structure

```
email_parsing_agent/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Config, database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── alembic/            # DB migrations
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages (App Router)
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Google Cloud Project with Gmail API enabled
- OpenAI API key

### Setup

1. **Clone and configure environment:**

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials:
# - OPENAI_API_KEY
# - GOOGLE_CLIENT_ID
# - GOOGLE_CLIENT_SECRET
# - SECRET_KEY (generate a random string)
```

2. **Start the application:**

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

3. **Access the application:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Development

**Backend only:**
```bash
docker-compose up postgres redis backend
```

**Frontend only:**
```bash
docker-compose up frontend
```

**Run database migrations:**
```bash
docker-compose exec backend alembic upgrade head
```

**Create a new migration:**
```bash
docker-compose exec backend alembic revision --autogenerate -m "description"
```

## API Endpoints

### Gmail Accounts
- `GET /api/gmail-accounts` - List connected accounts
- `POST /api/gmail-accounts/connect` - Initiate OAuth flow
- `POST /api/gmail-accounts/callback` - OAuth callback
- `DELETE /api/gmail-accounts/{id}` - Disconnect account

### Emails
- `GET /api/emails` - List emails (with pagination & filters)
- `GET /api/emails/{id}` - Get email details
- `POST /api/emails/{account_id}/fetch` - Trigger email sync

### Parsing
- `GET /api/parsing/schema` - Get current parsing schema
- `PUT /api/parsing/schema` - Update parsing schema
- `POST /api/parsing/parse/{email_id}` - Parse an email
- `POST /api/parsing/correct/{email_id}` - Save human correction

## Configuration

### Parsing Schema

The default parsing schema extracts:
- Company name
- Contact information
- Website URL
- Offer type
- Pricing details
- Website metrics (traffic, DA, etc.)

You can customize the schema in the Schema Editor page to extract any fields relevant to your use case.

## License

MIT

