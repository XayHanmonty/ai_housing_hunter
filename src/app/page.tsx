"use client";

import { useState } from "react";
import { SearchInterface } from "@/components/SearchInterface";
import { SearchResults } from "@/components/SearchResults";
import { FeatureRequestDialog } from "@/components/FeatureRequestDialog";
import { mockProperties, filterProperties, SearchFilters, Property } from "@/data/mockHousing";

type AppState = 'search' | 'results';

// Configuration for backend URL
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export default function HomePage() {
  const [appState, setAppState] = useState<AppState>('search');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFeatureDialogOpen, setIsFeatureDialogOpen] = useState(false);

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

  return (
    <main className="min-h-screen bg-gray-50">
      {appState === 'search' ? (
        <div className="flex items-center justify-center min-h-screen">
          <SearchInterface onSearch={handleSearch} isLoading={isLoading} />
        </div>
      ) : (
        <SearchResults
          properties={searchResults}
          searchQuery={searchQuery}
          onNewSearch={handleNewSearch}
          onRequestFeature={handleRequestFeature}
          isLoading={isLoading}
        />
      )}

      <FeatureRequestDialog
        isOpen={isFeatureDialogOpen}
        onClose={() => setIsFeatureDialogOpen(false)}
      />
    </main>
  );
}
