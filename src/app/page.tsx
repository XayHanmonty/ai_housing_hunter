"use client";

import { useState } from "react";
import { SearchInterface } from "@/components/SearchInterface";
import { SearchResults } from "@/components/SearchResults";
import { UserDashboard } from "@/components/UserDashboard";
import { Navigation } from "@/components/Navigation";
import { FeatureRequestDialog } from "@/components/FeatureRequestDialog";
import { mockProperties, filterProperties, SearchFilters, Property } from "@/data/mockHousing";

type AppState = 'search' | 'results' | 'dashboard';

// Configuration for backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

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
      // Call our Python FastAPI backend to parse the natural language query
      const response = await fetch(`${BACKEND_URL}/api/parse-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Failed to parse search query: ${response.status} ${response.statusText}`);
      }

      const { filters }: { filters: SearchFilters } = await response.json();

      // Filter properties based on parsed criteria
      const filteredProperties = filterProperties(mockProperties, filters);

      // Simulate network delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSearchResults(filteredProperties);
      setAppState('results');
    } catch (error) {
      console.error('Search error:', error);
      // On error, show all properties as fallback
      setSearchResults(mockProperties);
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
  const handleRequestTour = (property: Property) => {
    // Add to in-contact list if not already there
    if (!inContactProperties.find(p => p.id === property.id)) {
      setInContactProperties(prev => [...prev, property]);
    }

    // Switch to dashboard to show the update
    setAppState('dashboard');

    // Show a brief notification (you could enhance this with a toast)
    console.log(`Tour requested for ${property.title}`);
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
            onRequestTour={handleRequestTour}
            isLoading={isLoading}
          />
        );

      case 'dashboard':
        return (
          <UserDashboard
            appliedProperties={appliedProperties}
            inContactProperties={inContactProperties}
            scheduledProperties={scheduledProperties}
            onRequestTour={handleRequestTour}
            onApplyToProperty={handleApplyToProperty}
            onScheduleTour={handleScheduleTour}
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
