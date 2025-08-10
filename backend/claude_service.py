from typing import Dict, Any, Optional
import json
import os
from dotenv import load_dotenv
from pydantic import BaseModel

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

async def parse_search_query_with_claude(query: str) -> SearchFilters:
    """
    Parse a natural language housing search query into structured filters using Claude.
    
    Args:
        query: Natural language search query (e.g., "2 bedroom apartment in San Francisco under $3000")
        
    Returns:
        SearchFilters: A Pydantic model containing the parsed search parameters
    """
    try:
        import anthropic

        # Initialize Claude client
        load_dotenv()
        api_key = os.getenv("CLAUDE_API_KEY")
        
        client = anthropic.Anthropic(api_key=api_key)

        # Create a detailed prompt for Claude
        prompt = f"""
        Parse the following housing search query into structured filters.
        
        Query: "{query}"
        
        Extract the following information if mentioned:
        - Number of bedrooms (as an integer)
        - Maximum price (as an integer, no currency symbols)
        - Minimum price (as an integer, no currency symbols)
        - City name
        - Neighborhood name
        - Whether near transit (true/false)
        - Whether pet friendly (true/false)
        - Whether furnished (true/false)
        - Property type (one of: Studio, Apartment, House, Condo)
        
        Return a JSON object with only these fields. If a field is not mentioned, set it to null.
        Example response for "2 bedroom apartment in San Francisco under $3000":
        {{
            "bedrooms": 2,
            "maxPrice": 3000,
            "minPrice": null,
            "city": "San Francisco",
            "neighborhood": null,
            "nearTransit": null,
            "petFriendly": null,
            "furnished": null,
            "propertyType": "Apartment"
        }}
        """

        # Call Claude API
        message = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1024,
            messages=[{
                "role": "user",
                "content": prompt
            }]
        )
        
        # Parse the response
        response_text = message.content[0].text.strip()

        # Extract JSON from the response - handle multiple formats
        if response_text.startswith('```json'):
            # Extract JSON from code block if present
            response_text = response_text[response_text.find('{') : response_text.rfind('}') + 1]
        elif '{' in response_text and '}' in response_text:
            # Extract JSON from response that contains explanatory text
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            response_text = response_text[start_idx:end_idx]

        print(f"DEBUG: Extracted JSON: {response_text}")
        filters_dict = json.loads(response_text)
        
        # Create and validate the SearchFilters object
        return SearchFilters(**filters_dict)
        
    except json.JSONDecodeError as e:
        print(f"Failed to parse Claude response as JSON: {e}")
        print(f"Response was: {response_text if 'response_text' in locals() else 'N/A'}")
    except Exception as e:
        print(f"Error in parse_search_query_with_claude: {e}")
        import traceback
        traceback.print_exc()
    
    # Return empty filters if anything goes wrong
    return SearchFilters()
