"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Star, Bed, Bath, Ruler, Calendar, MessageCircle, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Property } from "@/data/mockHousing";

interface PropertyDashboardCardProps {
  property: Property;
  status: "applied" | "in-contact" | "scheduled";
  onRequestTour: () => void;
  onApplyToProperty: () => void;
  onScheduleTour: () => void;
}

export function PropertyDashboardCard({
  property,
  status,
  onRequestTour,
  onApplyToProperty,
  onScheduleTour
}: PropertyDashboardCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getStatusInfo = () => {
    switch (status) {
      case "applied":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: CheckCircle,
          label: "Application Submitted",
          description: "Your application is being reviewed"
        };
      case "in-contact":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: MessageCircle,
          label: "In Contact",
          description: "Active conversation with landlord"
        };
      case "scheduled":
        return {
          color: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Calendar,
          label: "Tour Scheduled",
          description: "Viewing appointment confirmed"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: FileText,
          label: "Unknown",
          description: ""
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const getAvailableActions = () => {
    switch (status) {
      case "applied":
        return [
          { label: "Schedule Tour", action: onScheduleTour, variant: "outline" as const }
        ];
      case "in-contact":
        return [
          { label: "Apply Now", action: onApplyToProperty, variant: "default" as const },
          { label: "Schedule Tour", action: onScheduleTour, variant: "outline" as const }
        ];
      case "scheduled":
        return [
          { label: "Apply Now", action: onApplyToProperty, variant: "default" as const }
        ];
      default:
        return [];
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Status Header */}
      <div className={`px-4 py-3 border-b ${statusInfo.color.replace('bg-', 'border-').replace('-100', '-200')}`}>
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4" />
          <div>
            <p className="font-semibold text-sm">{statusInfo.label}</p>
            <p className="text-xs opacity-75">{statusInfo.description}</p>
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.images[currentImageIndex]}
          alt={property.title}
          fill
          className="object-cover"
        />

        {/* Image Navigation */}
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

        {/* Property Type Badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {property.propertyType}
          </Badge>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
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
              {property.rating}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
          {property.title}
        </h3>

        {/* Property Details */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Bed className="h-3 w-3" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-3 w-3" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler className="h-3 w-3" />
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
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-bold text-gray-900">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-gray-600 text-sm">/month</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {getAvailableActions().map((action, index) => (
            <Button
              key={index}
              onClick={action.action}
              variant={action.variant}
              size="sm"
              className="flex-1 text-xs"
            >
              {action.label}
            </Button>
          ))}
        </div>

        {/* Status-specific additional info */}
        {status === "scheduled" && (
          <div className="mt-3 p-2 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-700 font-medium">
              📅 Tour: Tomorrow 2:00 PM
            </p>
          </div>
        )}

        {status === "applied" && (
          <div className="mt-3 p-2 bg-green-50 rounded-lg">
            <p className="text-xs text-green-700 font-medium">
              ✅ Applied: 2 days ago
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
