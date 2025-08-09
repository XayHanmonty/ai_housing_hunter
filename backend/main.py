from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
from typing import Optional, Dict, Any
import uvicorn

app = FastAPI(title="Housing Search API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SearchQuery(BaseModel):
    query: str

class SearchFilters(BaseModel):
    bedrooms: Optional[int] = None
    maxPrice: Optional[int] = None
    minPrice: Optional[int] = None
    city: Optional[str] = None
    neighborhood: Optional[str] = None
    nearTransit: Optional[bool] = None
    petFriendly: Optional[bool] = None
    furnished: Optional[bool] = None
    propertyType: Optional[str] = None

class SearchResponse(BaseModel):
    query: str
    filters: SearchFilters
    parsedSuccessfully: bool

def parse_search_query(query: str) -> SearchFilters:
    """
    Parse natural language search query into structured filters.
    This is a mock implementation - in production, integrate with Claude API.
    """
    filters = SearchFilters()
    lower_query = query.lower()

    # Parse bedrooms
    bedroom_patterns = [
        r'(\d+)\s*(?:bed|bedroom|br)',
        r'(?:bed|bedroom|br)\s*(\d+)',
        r'(\d+)\s*(?:bed|bedroom|br)s?'
    ]
    for pattern in bedroom_patterns:
        match = re.search(pattern, lower_query)
        if match:
            filters.bedrooms = int(match.group(1))
            break

    # Parse price with various formats
    price_patterns = [
        r'under\s*\$?([\d,]+)k?',
        r'below\s*\$?([\d,]+)k?',
        r'less\s+than\s*\$?([\d,]+)k?',
        r'max\s*\$?([\d,]+)k?',
        r'up\s+to\s*\$?([\d,]+)k?'
    ]
    for pattern in price_patterns:
        match = re.search(pattern, lower_query)
        if match:
            price = int(match.group(1).replace(',', ''))
            if 'k' in match.group(0):
                price *= 1000
            filters.maxPrice = price
            break

    # Parse minimum price
    min_price_patterns = [
        r'over\s*\$?([\d,]+)k?',
        r'above\s*\$?([\d,]+)k?',
        r'more\s+than\s*\$?([\d,]+)k?',
        r'min\s*\$?([\d,]+)k?'
    ]
    for pattern in min_price_patterns:
        match = re.search(pattern, lower_query)
        if match:
            price = int(match.group(1).replace(',', ''))
            if 'k' in match.group(0):
                price *= 1000
            filters.minPrice = price
            break

    # Parse cities and areas
    city_mappings = {
        'sf': 'San Francisco',
        'san francisco': 'San Francisco',
        'oakland': 'Oakland',
        'berkeley': 'Berkeley',
        'palo alto': 'Palo Alto',
        'san jose': 'San Jose',
        'fremont': 'Fremont',
        'hayward': 'Hayward'
    }

    for key, city in city_mappings.items():
        if key in lower_query:
            filters.city = city
            break

    # Parse neighborhoods
    neighborhood_mappings = {
        'mission': 'Mission Bay',
        'mission bay': 'Mission Bay',
        'soma': 'SOMA',
        'richmond': 'Richmond',
        'sunset': 'Sunset',
        'marina': 'Marina',
        'castro': 'Castro',
        'haight': 'Haight',
        'tenderloin': 'Tenderloin',
        'financial': 'Financial District',
        'downtown': 'Downtown',
        'temescal': 'Temescal'
    }

    for key, neighborhood in neighborhood_mappings.items():
        if key in lower_query:
            filters.neighborhood = neighborhood
            break

    # Parse transit requirements
    transit_keywords = ['bart', 'transit', 'train', 'subway', 'metro', 'public transport']
    if any(keyword in lower_query for keyword in transit_keywords):
        filters.nearTransit = True

    # Parse pet requirements
    pet_keywords = ['cat', 'dog', 'pet', 'animal', 'cats ok', 'dogs ok', 'pet friendly', 'pets allowed']
    if any(keyword in lower_query for keyword in pet_keywords):
        filters.petFriendly = True

    # Parse furnished requirements
    furnished_keywords = ['furnished', 'furniture included', 'move-in ready']
    if any(keyword in lower_query for keyword in furnished_keywords):
        filters.furnished = True

    # Parse property type
    if 'studio' in lower_query:
        filters.propertyType = 'Studio'
    elif 'house' in lower_query:
        filters.propertyType = 'House'
    elif 'apartment' in lower_query or 'apt' in lower_query:
        filters.propertyType = 'Apartment'
    elif 'condo' in lower_query:
        filters.propertyType = 'Condo'

    return filters

@app.get("/")
async def root():
    return {"message": "Housing Search API is running"}

@app.post("/api/parse-search", response_model=SearchResponse)
async def parse_search(search_query: SearchQuery):
    """
    Parse natural language search query into structured filters.
    """
    try:
        if not search_query.query or not search_query.query.strip():
            raise HTTPException(status_code=400, detail="Query parameter is required and must be a non-empty string")

        # Parse the natural language query
        filters = parse_search_query(search_query.query)

        return SearchResponse(
            query=search_query.query,
            filters=filters,
            parsedSuccessfully=True
        )

    except Exception as e:
        print(f"Error parsing search query: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse search query")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "housing-search-api"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Example of how to integrate with Claude API (commented out for now):
"""
import anthropic

async def parse_search_query_with_claude(query: str) -> SearchFilters:
    client = anthropic.Anthropic(api_key="your-claude-api-key")

    prompt = f'''
    Parse the following housing search query into structured filters.
    Return a JSON object with the following possible fields:
    - bedrooms (number)
    - maxPrice (number in dollars)
    - minPrice (number in dollars)
    - city (string)
    - neighborhood (string)
    - nearTransit (boolean)
    - petFriendly (boolean)
    - furnished (boolean)
    - propertyType (string: "Studio", "Apartment", "House", "Condo")

    Query: "{query}"

    Return only the JSON object, no additional text.
    '''

    message = client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=1024,
        messages=[{
            "role": "user",
            "content": prompt
        }]
    )

    try:
        import json
        filters_dict = json.loads(message.content[0].text)
        return SearchFilters(**filters_dict)
    except Exception as e:
        print(f"Failed to parse Claude response: {e}")
        return SearchFilters()
"""
