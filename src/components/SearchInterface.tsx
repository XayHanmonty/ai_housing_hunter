"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInterfaceProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchInterface({ onSearch, isLoading }: SearchInterfaceProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Perfect Home
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Use natural language to describe what you're looking for
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative flex items-center bg-white rounded-full shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center pl-6 pr-4 py-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <span className="ml-2 text-gray-600 font-medium">Anywhere</span>
          </div>

          <div className="flex-1 border-l border-gray-200">
            <Input
              type="text"
              placeholder="Describe your ideal home..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 rounded-none h-16 text-lg px-6 focus:ring-0 focus:outline-none"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="m-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 h-12 flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </form>
    </div>
  );
}
