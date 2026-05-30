"use client";

import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  createEventAction,
  updateEventAction,
  deleteEventAction,
} from "@/actions/event-actions";
import EventModal from "./event-modal";
import { Loader2 } from "lucide-react";

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

  // Modal State Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEventData, setSelectedEventData] = useState<any | undefined>(
    undefined
  );

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
      // Update local state sync status to pending
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

  // Open modal in Create mode on cell click
  const handleDateClick = (arg: any) => {
    const startDate = new Date(arg.date);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    setSelectedEventData({
      title: "",
      description: "",
      location: "",
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString(),
      isAllDay: arg.allDay,
      color: "#7c3aed",
    });
    setModalMode("create");
    setIsModalOpen(true);
  };

  // Open modal in Edit mode on event card click
  const handleEventClick = (clickInfo: any) => {
    const { event } = clickInfo;
    setSelectedEventData({
      id: event.id,
      title: event.title,
      description: event.extendedProps.description || "",
      location: event.extendedProps.location || "",
      startAt: event.start.toISOString(),
      endAt: (event.end || event.start).toISOString(),
      isAllDay: event.allDay,
      color: event.backgroundColor,
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // Submit create or edit form
  const handleModalSubmit = async (formData: any) => {
    setIsUpdating(true);
    if (modalMode === "create") {
      const res = await createEventAction(formData);
      if (res && res.error) {
        throw new Error(res.error);
      } else if (res && res.event) {
        // Append newly created event to local state
        setEvents((prev) => [
          ...prev,
          {
            id: res.event.id,
            title: res.event.title,
            start: res.event.start_at,
            end: res.event.end_at,
            allDay: res.event.is_all_day,
            backgroundColor: res.event.color || "#7c3aed",
            borderColor: res.event.color || "#7c3aed",
            extendedProps: {
              description: res.event.description,
              location: res.event.location,
              syncStatus: res.event.sync_status,
            },
          },
        ]);
      }
    } else {
      // Edit mode
      const res = await updateEventAction(formData.id, formData);
      if (res && res.error) {
        throw new Error(res.error);
      } else if (res && res.event) {
        // Replace event in local state
        setEvents((prev) =>
          prev.map((evt) =>
            evt.id === formData.id
              ? {
                  ...evt,
                  title: res.event.title,
                  start: res.event.start_at,
                  end: res.event.end_at,
                  allDay: res.event.is_all_day,
                  backgroundColor: res.event.color || "#7c3aed",
                  borderColor: res.event.color || "#7c3aed",
                  extendedProps: {
                    description: res.event.description,
                    location: res.event.location,
                    syncStatus: res.event.sync_status,
                  },
                }
              : evt
          )
        );
      }
    }
    setIsUpdating(false);
  };

  // Delete event handler
  const handleModalDelete = async (eventId: string) => {
    setIsUpdating(true);
    const res = await deleteEventAction(eventId);
    if (res && res.error) {
      throw new Error(res.error);
    } else {
      // Remove deleted event from local state
      setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
    }
    setIsUpdating(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Background loading spinner overlay */}
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

      {/* Event Details and Creation Dialog Modal */}
      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        eventData={selectedEventData}
        onSubmit={handleModalSubmit}
        onDelete={handleModalDelete}
      />
    </div>
  );
}
