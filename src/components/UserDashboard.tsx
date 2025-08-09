"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/data/mockHousing";
import { PropertyDashboardCard } from "./PropertyDashboardCard";
import {
  Calendar,
  MessageCircle,
  FileText,
  Home,
  Clock,
  CheckCircle
} from "lucide-react";

interface UserDashboardProps {
  appliedProperties: Property[];
  inContactProperties: Property[];
  scheduledProperties: Property[];
  onRequestTour: (property: Property) => void;
  onApplyToProperty: (property: Property) => void;
  onScheduleTour: (property: Property) => void;
}

export function UserDashboard({
  appliedProperties,
  inContactProperties,
  scheduledProperties,
  onRequestTour,
  onApplyToProperty,
  onScheduleTour
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("applied");

  const EmptyState = ({
    icon: Icon,
    title,
    description
  }: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 max-w-md">{description}</p>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
        <p className="text-gray-600">Track your applications, contacts, and scheduled tours</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedProperties.length}</div>
            <p className="text-xs text-muted-foreground">
              Properties applied to
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Contact</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inContactProperties.length}</div>
            <p className="text-xs text-muted-foreground">
              Active conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled Tours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledProperties.length}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming viewings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Property Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applied" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Applied ({appliedProperties.length})
          </TabsTrigger>
          <TabsTrigger value="in-contact" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            In Contact ({inContactProperties.length})
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Scheduled ({scheduledProperties.length})
          </TabsTrigger>
        </TabsList>

        {/* Applied Properties Tab */}
        <TabsContent value="applied" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Applications Submitted
              </CardTitle>
              <CardDescription>
                Properties you have formally applied to
              </CardDescription>
            </CardHeader>
            <CardContent>
              {appliedProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appliedProperties.map((property) => (
                    <PropertyDashboardCard
                      key={property.id}
                      property={property}
                      status="applied"
                      onRequestTour={() => onRequestTour(property)}
                      onApplyToProperty={() => onApplyToProperty(property)}
                      onScheduleTour={() => onScheduleTour(property)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={FileText}
                  title="No applications yet"
                  description="When you apply to properties, they'll appear here. Start by browsing available properties and submitting applications."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* In Contact Properties Tab */}
        <TabsContent value="in-contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Active Conversations
              </CardTitle>
              <CardDescription>
                Properties you've expressed interest in or are discussing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inContactProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inContactProperties.map((property) => (
                    <PropertyDashboardCard
                      key={property.id}
                      property={property}
                      status="in-contact"
                      onRequestTour={() => onRequestTour(property)}
                      onApplyToProperty={() => onApplyToProperty(property)}
                      onScheduleTour={() => onScheduleTour(property)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={MessageCircle}
                  title="No active conversations"
                  description="When you request tours or contact landlords about properties, they'll appear here."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Properties Tab */}
        <TabsContent value="scheduled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Tours
              </CardTitle>
              <CardDescription>
                Properties with scheduled viewing appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scheduledProperties.map((property) => (
                    <PropertyDashboardCard
                      key={property.id}
                      property={property}
                      status="scheduled"
                      onRequestTour={() => onRequestTour(property)}
                      onApplyToProperty={() => onApplyToProperty(property)}
                      onScheduleTour={() => onScheduleTour(property)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No scheduled tours"
                  description="Schedule property tours to see them in person. Tours will appear here once confirmed."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
