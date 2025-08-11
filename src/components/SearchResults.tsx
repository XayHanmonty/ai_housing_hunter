"use client";

import { Property } from "@/app/page";
import { PropertyCard } from "./PropertyCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter } from "lucide-react";

interface SearchResultsProps {
  properties: Property[];
  searchQuery: string;
  onNewSearch: () => void;
  onRequestFeature: () => void;
  onAddToDashboard?: (property: Property) => void;
  onDeleteProperty?: (propertyId: string) => void;
  isLoading?: boolean;
}

export function SearchResults({
  properties,
  searchQuery,
  onNewSearch,
  onRequestFeature,
  onAddToDashboard,
  onDeleteProperty,
  isLoading
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Search Results
          </h2>
          <p className="text-gray-600">
            Found {properties.length} {properties.length === 1 ? 'property' : 'properties'} for "{searchQuery}"
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onNewSearch}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            New Search
          </Button>
          <Button
            onClick={onRequestFeature}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Request Feature
          </Button>
        </div>
      </div>

      {/* Results Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onAddToDashboard={onAddToDashboard}
              onDelete={onDeleteProperty}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h10M7 15h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or explore different neighborhoods.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onNewSearch} className="bg-rose-500 hover:bg-rose-600">
                Try Different Search
              </Button>
              <Button onClick={onRequestFeature} variant="outline">
                Request New Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {properties.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Can't find what you're looking for?
            </p>
            <Button
              onClick={onRequestFeature}
              variant="outline"
              className="mx-auto"
            >
              Request New Features or Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
