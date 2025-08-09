"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FeatureRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeatureRequestDialog({ isOpen, onClose }: FeatureRequestDialogProps) {
  const [request, setRequest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!request.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after showing success
    setTimeout(() => {
      setIsSubmitted(false);
      setRequest("");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRequest("");
      setIsSubmitted(false);
      onClose();
    }
  };

  const suggestedFeatures = [
    "Price alerts for specific properties",
    "Commute time calculator",
    "Virtual property tours",
    "Neighborhood safety scores",
    "School district ratings",
    "Walkability scores",
    "Energy efficiency ratings",
    "Parking availability",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request New Features</DialogTitle>
          <DialogDescription>
            Help us improve our platform by suggesting new filters or features you'd like to see.
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Thank you for your feedback!
            </h3>
            <p className="text-center text-gray-600">
              We'll review your suggestion and consider it for future updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your feature request
              </label>
              <Textarea
                id="request"
                placeholder="I would like to see a filter for..."
                value={request}
                onChange={(e) => setRequest(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Popular feature requests:
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {suggestedFeatures.slice(0, 4).map((feature, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setRequest(feature)}
                    className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border text-gray-700 transition-colors"
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !request.trim()}
                className="flex-1 bg-rose-500 hover:bg-rose-600"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Request
                  </div>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
