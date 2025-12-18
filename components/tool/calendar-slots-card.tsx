"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";

interface CalendarSlot {
  id: string;
  startTime: string; // ISO 8601 format or timestamp
  endTime: string;
  date: string; // YYYY-MM-DD format
  available: boolean;
}

interface CalendarSlotsCardProps {
  slots?: CalendarSlot[];
  timezone?: string;
  onSlotSelect?: (slot: CalendarSlot) => void;
}

export function CalendarSlotsCard({
  slots = [],
  timezone = "Asia/Hong_Kong",
  onSlotSelect,
}: CalendarSlotsCardProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("zh-HK", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("zh-HK", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const handleSlotClick = (slot: CalendarSlot) => {
    if (!slot.available) return;
    setSelectedSlotId(slot.id);
    onSlotSelect?.(slot);
  };

  // Group slots by date
  const slotsByDate = slots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, CalendarSlot[]>);

  if (slots.length === 0) {
    return (
      <Card className="mt-3 max-w-md border-2">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground text-center">
            暫無可用時段
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-3 max-w-md border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calendar className="size-4" />
          可預約時段
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(slotsByDate).map(([date, dateSlots]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="size-3" />
              {formatDate(date)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {dateSlots.map((slot) => (
                <Button
                  key={slot.id}
                  variant={
                    selectedSlotId === slot.id ? "default" : "outline"
                  }
                  size="sm"
                  className="text-xs"
                  disabled={!slot.available}
                  onClick={() => handleSlotClick(slot)}
                >
                  {formatTime(slot.startTime)}
                </Button>
              ))}
            </div>
          </div>
        ))}
        {timezone && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            時區: {timezone}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

