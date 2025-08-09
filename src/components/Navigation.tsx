"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  LayoutDashboard,
  FileText,
  MessageCircle,
  Calendar,
  Home
} from "lucide-react";

interface NavigationProps {
  currentView: 'search' | 'dashboard';
  onViewChange: (view: 'search' | 'dashboard') => void;
  appliedCount: number;
  inContactCount: number;
  scheduledCount: number;
}

export function Navigation({
  currentView,
  onViewChange,
  appliedCount,
  inContactCount,
  scheduledCount
}: NavigationProps) {
  const totalActivity = appliedCount + inContactCount + scheduledCount;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Home className="h-8 w-8 text-rose-500" />
            <span className="text-xl font-bold text-gray-900">AI Housing Hunter</span>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            <Button
              variant={currentView === 'search' ? 'default' : 'ghost'}
              onClick={() => onViewChange('search')}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search Properties
            </Button>

            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => onViewChange('dashboard')}
              className="flex items-center gap-2 relative"
            >
              <LayoutDashboard className="h-4 w-4" />
              My Dashboard
              {totalActivity > 0 && (
                <Badge
                  variant="destructive"
                  className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {totalActivity}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Dashboard Quick Stats (only shown when on dashboard) */}
        {currentView === 'dashboard' && totalActivity > 0 && (
          <div className="pb-4">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {appliedCount > 0 && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span>{appliedCount} Applied</span>
                </div>
              )}
              {inContactCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span>{inContactCount} In Contact</span>
                </div>
              )}
              {scheduledCount > 0 && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>{scheduledCount} Scheduled</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
