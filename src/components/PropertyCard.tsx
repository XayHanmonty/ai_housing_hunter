"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star, MapPin, Home, Bed, Bath, Ruler, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/mockHousing";

interface PropertyCardProps {
  property: Property;
  onRequestTour?: (property: Property) => void;
}

export function PropertyCard({ property, onRequestTour }: PropertyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleRequestTour = () => {
    if (onRequestTour) {
      onRequestTour(property);
    }
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[currentImageIndex]}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sr-only">Previous image</span>
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <span className="sr-only">Next image</span>
              →
            </button>
          </>
        )}

        {/* Image Dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Heart Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors"
        >
          <Heart
            className={`h-4 w-4 ${
              isLiked
                ? 'fill-red-500 text-red-500'
                : 'text-white hover:text-red-500'
            }`}
          />
        </button>

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {property.propertyType}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Location and Rating */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">
              {property.location.neighborhood}, {property.location.city}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-yellow-400" />
            <span className="text-sm font-medium">
              {property.rating} ({property.reviewCount})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Property Details */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-4 w-4" />
            <span>{property.squareFeet} sqft</span>
          </div>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1 mb-3">
          {property.nearTransit && (
            <Badge variant="outline" className="text-xs">
              Near Transit
            </Badge>
          )}
          {property.petFriendly && (
            <Badge variant="outline" className="text-xs">
              Pet Friendly
            </Badge>
          )}
          {property.furnished && (
            <Badge variant="outline" className="text-xs">
              Furnished
            </Badge>
          )}
          {property.amenities.slice(0, 2).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>

        {/* Price and Availability */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              ${property.price.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm">/month</span>
          </div>
          <div className="text-sm text-gray-600">
            Available {new Date(property.availableDate).toLocaleDateString()}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleRequestTour}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Request Tour
        </Button>
      </div>
    </Card>
  );
}
