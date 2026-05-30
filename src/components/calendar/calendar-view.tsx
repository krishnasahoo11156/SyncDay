"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { updateEventAction } from "@/actions/event-actions";
import { Loader2 } from "lucide-react";

interface EventData {
  id: string;
  title: string;
  description?: string;
  location?: string;
  start_at: string;
  end_at: string;
  is_all_day: boolean;
  color?: string;
  sync_status: "pending" | "synced" | "failed";
}

interface CalendarViewProps {
  initialEvents: any[];
}

export default function CalendarView({ initialEvents }: CalendarViewProps) {
  const [events, setEvents] = useState<any[]>(
    initialEvents.map((evt) => ({
      id: evt.id,
      title: evt.title,
      start: evt.start_at,
      end: evt.end_at,
      allDay: evt.is_all_day,
      backgroundColor: evt.color || "#7c3aed",
      borderColor: evt.color || "#7c3aed",
      extendedProps: {
        description: evt.description,
        location: evt.location,
        syncStatus: evt.sync_status,
      },
    }))
  );

  const [isUpdating, setIsUpdating] = useState(false);

  // Drag and drop / Resize Event Handler
  const handleEventChange = async (changeInfo: any) => {
    setIsUpdating(true);
    const { event } = changeInfo;

    const eventId = event.id;
    const updatedInput = {
      title: event.title,
      description: event.extendedProps.description || "",
      location: event.extendedProps.location || "",
      startAt: event.start.toISOString(),
      endAt: (event.end || event.start).toISOString(),
      isAllDay: event.allDay,
      color: event.backgroundColor,
    };

    const res = await updateEventAction(eventId, updatedInput);

    if (res && res.error) {
      alert(`Failed to update event: ${res.error}`);
      changeInfo.revert();
    } else if (res && res.event) {
      // Update local state sync status to pending since it changed
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === eventId
            ? {
                ...evt,
                start: res.event.start_at,
                end: res.event.end_at,
                allDay: res.event.is_all_day,
                extendedProps: {
                  ...evt.extendedProps,
                  syncStatus: "pending",
                },
              }
            : evt
        )
      );
    }
    setIsUpdating(false);
  };

  // Click on empty space (to be wired to Chunk 3C modal)
  const handleDateClick = (arg: any) => {
    // Temporary placeholder trigger for Chunk 3C
    console.log("Date slot clicked:", arg.dateStr);
  };

  // Click on existing event (to be wired to Chunk 3C modal)
  const handleEventClick = (clickInfo: any) => {
    // Temporary placeholder trigger for Chunk 3C
    console.log("Event card clicked:", clickInfo.event.title);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Background loading spinner overlay during drag & drop */}
      {isUpdating && (
        <div className="absolute inset-0 bg-zinc-950/20 backdrop-blur-[1px] z-20 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-brand-400 font-mono shadow-xl">
            <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
            <span>Updating schedule...</span>
          </div>
        </div>
      )}

      {/* FullCalendar Component */}
      <div className="flex-1 text-[#fafafa] font-sans fc-theme-custom">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventChange={handleEventChange}
          height="auto"
          contentHeight={600}
        />
      </div>
    </div>
  );
}
