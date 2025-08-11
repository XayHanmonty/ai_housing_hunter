/*
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  images: string[];
  location: {
    city: string;
    neighborhood: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  amenities: string[];
  nearTransit: boolean;
  petFriendly: boolean;
  furnished: boolean;
  rating: number;
  reviewCount: number;
  propertyType: string;
  squareFeet: number;
  availableDate: string;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Modern 2BR Apartment in Mission Bay",
    description: "Bright and spacious 2-bedroom apartment with stunning city views and modern amenities.",
    price: 4200,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ],
    location: {
      city: "San Francisco",
      neighborhood: "Mission Bay",
      address: "123 Mission Bay Blvd",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    amenities: ["Gym", "Pool", "Parking", "Laundry", "Pet Area"],
    nearTransit: true,
    petFriendly: true,
    furnished: false,
    rating: 4.8,
    reviewCount: 24,
    propertyType: "Apartment",
    squareFeet: 1200,
    availableDate: "2024-02-01"
  },
  {
    id: "2",
    title: "Cozy 1BR Studio near BART",
    description: "Perfect for young professionals, walking distance to Montgomery BART station.",
    price: 2800,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    ],
    location: {
      city: "San Francisco",
      neighborhood: "Financial District",
      address: "456 Montgomery St",
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    amenities: ["Laundry", "Security", "Internet"],
    nearTransit: true,
    petFriendly: false,
    furnished: true,
    rating: 4.5,
    reviewCount: 18,
    propertyType: "Studio",
    squareFeet: 650,
    availableDate: "2024-01-15"
  },
  {
    id: "3",
    title: "Spacious 3BR House in Oakland",
    description: "Beautiful family home with backyard, perfect for pets and families.",
    price: 3500,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop"
    ],
    location: {
      city: "Oakland",
      neighborhood: "Temescal",
      address: "789 Temescal Ave",
      coordinates: { lat: 37.8044, lng: -122.2711 }
    },
    amenities: ["Backyard", "Parking", "Washer/Dryer", "Garden"],
    nearTransit: true,
    petFriendly: true,
    furnished: false,
    rating: 4.9,
    reviewCount: 31,
    propertyType: "House",
    squareFeet: 1800,
    availableDate: "2024-03-01"
  },
  {
    id: "4",
    title: "Luxury 2BR in SOMA",
    description: "High-end apartment with premium finishes and rooftop access.",
    price: 5200,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop"
    ],
    location: {
      city: "San Francisco",
      neighborhood: "SOMA",
      address: "321 Folsom St",
      coordinates: { lat: 37.7849, lng: -122.4194 }
    },
    amenities: ["Rooftop", "Concierge", "Gym", "Pool", "Valet Parking"],
    nearTransit: true,
    petFriendly: true,
    furnished: true,
    rating: 4.7,
    reviewCount: 42,
    propertyType: "Apartment",
    squareFeet: 1400,
    availableDate: "2024-02-15"
  },
  {
    id: "5",
    title: "Affordable 1BR in Richmond",
    description: "Budget-friendly option near Golden Gate Park with vintage charm.",
    price: 2200,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aab21900?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop"
    ],
    location: {
      city: "San Francisco",
      neighborhood: "Richmond",
      address: "654 Geary Blvd",
      coordinates: { lat: 37.7849, lng: -122.4594 }
    },
    amenities: ["Laundry", "Parking"],
    nearTransit: false,
    petFriendly: true,
    furnished: false,
    rating: 4.2,
    reviewCount: 15,
    propertyType: "Apartment",
    squareFeet: 800,
    availableDate: "2024-01-20"
  },
  {
    id: "6",
    title: "Modern Studio in Berkeley",
    description: "Contemporary studio near UC Berkeley campus, perfect for students or young professionals.",
    price: 2400,
    bedrooms: 0,
    bathrooms: 1,
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop"
    ],
    location: {
      city: "Berkeley",
      neighborhood: "Downtown Berkeley",
      address: "987 University Ave",
      coordinates: { lat: 37.8715, lng: -122.2730 }
    },
    amenities: ["Study Area", "Bike Storage", "Internet", "Laundry"],
    nearTransit: true,
    petFriendly: false,
    furnished: true,
    rating: 4.6,
    reviewCount: 28,
    propertyType: "Studio",
    squareFeet: 500,
    availableDate: "2024-02-01"
  }
];

export interface SearchFilters {
  bedrooms?: number;
  maxPrice?: number;
  minPrice?: number;
  city?: string;
  neighborhood?: string;
  nearTransit?: boolean;
  petFriendly?: boolean;
  furnished?: boolean;
  propertyType?: string;
}

export function filterProperties(properties: Property[], filters: SearchFilters): Property[] {
  return properties.filter(property => {
    if (filters.bedrooms !== undefined && property.bedrooms !== filters.bedrooms) {
      return false;
    }
    if (filters.maxPrice !== undefined && property.price > filters.maxPrice) {
      return false;
    }
    if (filters.minPrice !== undefined && property.price < filters.minPrice) {
      return false;
    }
    if (filters.city && !property.location.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }
    if (filters.neighborhood && !property.location.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())) {
      return false;
    }
    if (filters.nearTransit !== undefined && property.nearTransit !== filters.nearTransit) {
      return false;
    }
    if (filters.petFriendly !== undefined && property.petFriendly !== filters.petFriendly) {
      return false;
    }
    if (filters.furnished !== undefined && property.furnished !== filters.furnished) {
      return false;
    }
    if (filters.propertyType && property.propertyType.toLowerCase() !== filters.propertyType.toLowerCase()) {
      return false;
    }
    return true;
  });
}
*/
