# Housing Search Python Backend

A FastAPI backend service for parsing natural language housing search queries.

## Setup

1. **Install Python 3.8+**
   Make sure you have Python 3.8 or higher installed.

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Server

### Development
```bash
python main.py
```

The server will start on `http://localhost:8000`

### Production with Uvicorn
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST /api/parse-search
Parse natural language search query into structured filters.

**Request Body:**
```json
{
  "query": "2 bedrooms in SF under $3k, near BART, cats ok"
}
```

**Response:**
```json
{
  "query": "2 bedrooms in SF under $3k, near BART, cats ok",
  "filters": {
    "bedrooms": 2,
    "maxPrice": 3000,
    "city": "San Francisco",
    "nearTransit": true,
    "petFriendly": true
  },
  "parsedSuccessfully": true
}
```

### GET /health
Health check endpoint.

## Features

- Natural language parsing for housing searches
- Supports bedroom count, price ranges, cities, neighborhoods
- Transit and pet-friendly requirements
- Property type detection (studio, apartment, house)
- CORS enabled for frontend integration
- Ready for Claude API integration

## Claude API Integration

To integrate with Claude API:

1. Install the anthropic package (already in requirements.txt)
2. Set your Claude API key as an environment variable:
   ```bash
   export CLAUDE_API_KEY="your-api-key-here"
   ```
3. Uncomment and modify the Claude integration code in `main.py`

## Environment Variables

- `CLAUDE_API_KEY`: Your Claude API key for enhanced natural language processing
- `PORT`: Server port (default: 8000)
- `HOST`: Server host (default: 0.0.0.0)
