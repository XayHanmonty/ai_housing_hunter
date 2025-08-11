from ast import ParamSpec
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import uvicorn
import httpx
import os
import re
from dotenv import load_dotenv
from claude_service import parse_search_query_with_claude, SearchFilters

# Load environment variables
load_dotenv()

app = FastAPI(title="Housing Search API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Zillow API configuration
ZILLOW_API_KEY = os.getenv("ZILLOW_API_KEY")
ZILLOW_API_HOST = os.getenv("ZILLOW_API_HOST")
ZILLOW_BASE_URL = os.getenv("ZILLOW_BASE_URL")

class SearchQuery(BaseModel):
    query: str

class PropertyDetails(BaseModel):
    id: str
    price: Optional[str] = None
    address: Optional[str] = None
    beds: Optional[int] = None
    baths: Optional[float] = None
    area: Optional[int] = None  # in square feet
    imageUrl: Optional[str] = None
    detailUrl: Optional[str] = None
    providerListingId: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    propertyType: Optional[str] = None
    yearBuilt: Optional[int] = None
    daysOnZillow: Optional[int] = None
    zestimate: Optional[int] = None
    rentZestimate: Optional[int] = None
    brokerName: Optional[str] = None
    brokerPhone: Optional[str] = None

class PropertyResponse(BaseModel):
    success: bool
    count: int
    properties: List[PropertyDetails]
    message: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Housing Search API is running"}

@app.post("/api/search", response_model=PropertyResponse)
async def search_properties(search_query: SearchQuery):
    try:
        # Parse the natural language query
        filters = await parse_search_query_with_claude(search_query.query)
        
        # Convert filters to Zillow API parameters
        params = {}
        params["status_type"] = "ForRent"
        
        if filters.bedrooms:
            params["bedsMin"] = filters.bedrooms
            # Don't set bedsMax to allow more flexibility
        if filters.maxPrice:
            params["rentMaxPrice"] = filters.maxPrice  # Use rentMaxPrice for rentals
        if filters.minPrice:
            params["rentMinPrice"] = filters.minPrice  # Use rentMinPrice for rentals
        
        # The API requires a "location" parameter instead of separate city/neighborhood
        location_parts = []
        if filters.city:
            location_parts.append(filters.city)
        if filters.neighborhood:
            location_parts.append(filters.neighborhood)
        if location_parts:
            params["location"] = ", ".join(location_parts)
        else:
            # Default to a general location if none provided
            params["location"] = "United States"
            
        if filters.propertyType:
            # Map property types to Zillow API values (based on official docs)
            property_type_map = {
                "studio": "Apartments_Condos_Co-ops",
                "apartment": "Apartments_Condos_Co-ops", 
                "house": "Houses",
                "condo": "Apartments_Condos_Co-ops",
                "townhome": "Townhomes"
            }
            params["home_type"] = property_type_map.get(filters.propertyType.lower(), "Apartments_Condos_Co-ops")
        
        # Pet-friendly parameters (simplified to be less restrictive)
        if filters.petFriendly:
            params["catsAllowed"] = True  # Start with just cats allowed
        
        if filters.furnished:
            params["furnished"] = True  # Use boolean instead of string
        if filters.nearTransit:
            params["keywords"] = "transit,metro,subway,train"
            
        # Add default parameters for rental search
        params.update({
            "sort": "Verified_Source",  # Use rental-specific sort option
            "page": 1,
            "isEntirePlace": True,  # Entire place (not just a room)
            "isRoom": False
        })
        
        # Make request to Zillow API
        headers = {
            "X-RapidAPI-Key": ZILLOW_API_KEY,
            "X-RapidAPI-Host": ZILLOW_API_HOST
        }
        
        # Debug: Print the parameters being sent
        print(f"API Parameters: {params}")
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{ZILLOW_BASE_URL}/propertyExtendedSearch",
                headers=headers,
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            # Debug: Print the raw API response
            print(f"Raw API Response: {data}")
            
            # Transform the response to match our PropertyDetails model
            properties = []
            for prop in data.get("props", []):
                try:
                    property_details = PropertyDetails(
                        id=str(prop.get("zpid", "")),
                        price=str(prop.get("price", "")),
                        address=prop.get("address", ""),
                        beds=prop.get("bedrooms"),
                        baths=prop.get("bathrooms"),
                        area=prop.get("livingArea"),
                        imageUrl=prop.get("imgSrc"),
                        detailUrl=prop.get("detailUrl"),
                        providerListingId=prop.get("providerListingId"),
                        latitude=prop.get("latitude"),
                        longitude=prop.get("longitude"),
                        description=prop.get("description"),
                        propertyType=prop.get("homeType"),
                        yearBuilt=prop.get("yearBuilt"),
                        daysOnZillow=prop.get("daysOnZillow"),
                        zestimate=prop.get("zestimate"),
                        rentZestimate=prop.get("rentZestimate"),
                        brokerName=prop.get("brokerName"),
                        brokerPhone=prop.get("brokerPhone")
                    )
                    properties.append(property_details)
                except Exception as e:
                    print(f"Error processing property: {e}")
                    continue
            
            return {
                "success": True,
                "count": len(properties),
                "properties": properties
            }
            
    except Exception as e:
        print(f"Error in search_properties: {e}")
        return {
            "success": False,
            "count": 0,
            "properties": [],
            "message": str(e)
        }
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# Vercel serverless handler
def handler(request):
    return app
