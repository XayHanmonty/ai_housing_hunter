"use client";

import { useState } from "react";
import { SearchInterface } from "@/components/SearchInterface";
import { SearchResults } from "@/components/SearchResults";
import { UserDashboard } from "@/components/UserDashboard";
import { Navigation } from "@/components/Navigation";
import { FeatureRequestDialog } from "@/components/FeatureRequestDialog";

type AppState = 'search' | 'results' | 'dashboard';

// Configuration for backend URL
const BACKEND_URL = 'https://ai-housing-hunter-backend.vercel.app';

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  location: {
    city: string;
    neighborhood: string;
    address: string;
    coordinates: {
      lat?: number;
      lng?: number;
    };
  };
  amenities: string[];
  nearTransit: boolean;
  petFriendly: boolean;
  furnished: boolean;
  rating: number;
  reviewCount: number;
  propertyType?: string;
  squareFeet?: number;
  availableDate: string;
  detailUrl?: string;
}

interface BackendProperty {
  id: string;
  price?: string;
  address?: string;
  beds?: number;
  baths?: number;
  area?: number;
  imageUrl?: string;
  detailUrl?: string;
  providerListingId?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  propertyType?: string;
  yearBuilt?: number;
  daysOnZillow?: number;
  zestimate?: number;
  rentZestimate?: number;
  brokerName?: string;
  brokerPhone?: string;
}

const transformBackendProperty = (backendProperty: BackendProperty): Property => {
  return {
    id: backendProperty.id,
    title: backendProperty.address || 'N/A',
    description: backendProperty.description || 'No description available.',
    price: parseFloat((backendProperty.price || '0').replace(/[^0-9.-]+/g,"")) || 0,
    bedrooms: backendProperty.beds,
    bathrooms: backendProperty.baths,
    images: backendProperty.imageUrl ? [backendProperty.imageUrl] : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
    location: {
      city: backendProperty.address?.split(',')[1]?.trim() || 'N/A',
      neighborhood: backendProperty.address?.split(',')[0]?.trim() || 'N/A',
      address: backendProperty.address || 'N/A',
      coordinates: {
        lat: backendProperty.latitude,
        lng: backendProperty.longitude,
      },
    },
    amenities: [], // Not available from backend
    nearTransit: false, // Not available from backend
    petFriendly: false, // Not available from backend
    furnished: false, // Not available from backend
    rating: 4.0, // Default value
    reviewCount: 0, // Default value
    propertyType: backendProperty.propertyType,
    squareFeet: backendProperty.area,
    availableDate: new Date().toISOString(), // Default value
    detailUrl: backendProperty.detailUrl,
  };
};

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('search');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);

  // Property tracking state
  const [appliedProperties, setAppliedProperties] = useState<Property[]>([]);
  const [inContactProperties, setInContactProperties] = useState<Property[]>([]);
  const [scheduledProperties, setScheduledProperties] = useState<Property[]>([]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);

    try {
      const response = await fetch(`${BACKEND_URL}/api/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const transformedProperties = data.properties.map(transformBackendProperty);
        setSearchResults(transformedProperties);
      } else {
        // Handle backend error message
        console.error('Backend error:', data.message);
        setSearchResults([]);
      }

      setAppState('results');
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setAppState('results');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = () => {
    setAppState('search');
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleRequestFeature = () => {
    setIsFeatureDialogOpen(true);
  };

  const handleViewChange = (view: 'search' | 'dashboard') => {
    if (view === 'dashboard') {
      setAppState('dashboard');
    } else {
      setAppState('search');
    }
  };

  // Property action handlers
  const handleAddToDashboard = (property: Property) => {
    // Add to in-contact list if not already there
    if (!inContactProperties.find(p => p.id === property.id)) {
      setInContactProperties(prev => [...prev, property]);
    }

    // Switch to dashboard to show the update
    setAppState('dashboard');

    // Show a brief notification (you could enhance this with a toast)
    console.log(`${property.title} added to dashboard`);
  };

  const handleApplyToProperty = (property: Property) => {
    // Move from in-contact to applied
    setInContactProperties(prev => prev.filter(p => p.id !== property.id));
    if (!appliedProperties.find(p => p.id === property.id)) {
      setAppliedProperties(prev => [...prev, property]);
    }
  };

  const handleScheduleTour = (property: Property) => {
    // Move to scheduled tours
    setInContactProperties(prev => prev.filter(p => p.id !== property.id));
    if (!scheduledProperties.find(p => p.id === property.id)) {
      setScheduledProperties(prev => [...prev, property]);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    setSearchResults(prev => prev.filter(p => p.id !== propertyId));
    setAppliedProperties(prev => prev.filter(p => p.id !== propertyId));
    setInContactProperties(prev => prev.filter(p => p.id !== propertyId));
    setScheduledProperties(prev => prev.filter(p => p.id !== propertyId));
  };

  const renderContent = () => {
    switch (appState) {
      case 'search':
        return (
          <div className="flex items-center justify-center min-h-screen">
            <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
          </div>
        );

      case 'results':
        return (
          <SearchResults
            properties={searchResults}
            searchQuery={searchQuery}
            onNewSearch={handleNewSearch}
            onRequestFeature={handleRequestFeature}
            onAddToDashboard={handleAddToDashboard}
            onDeleteProperty={handleDeleteProperty}
            isLoading={isLoading}
          />
        );

      case 'dashboard':
        return (
          <UserDashboard
            appliedProperties={appliedProperties}
            inContactProperties={inContactProperties}
            scheduledProperties={scheduledProperties}
            onRequestTour={handleAddToDashboard} // Renamed for now, will be updated
            onApplyToProperty={handleApplyToProperty}
            onScheduleTour={handleScheduleTour}
            onDeleteProperty={handleDeleteProperty}
          />
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation
        currentView={appState === 'dashboard' ? 'dashboard' : 'search'}
        onViewChange={handleViewChange}
        appliedCount={appliedProperties.length}
        inContactCount={inContactProperties.length}
        scheduledCount={scheduledProperties.length}
      />

      {renderContent()}

      <FeatureRequestDialog
        isOpen={isFeatureDialogOpen}
        onClose={() => setIsFeatureDialogOpen(false)}
      />
    </main>
  );
}
