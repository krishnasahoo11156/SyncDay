"use client";

import { useState, useEffect, useTransition } from "react";
import { X, Calendar, MapPin, AlignLeft, Trash2, Loader2 } from "lucide-react";
import { eventSchema } from "@/lib/validation/event-schema";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  eventData?: {
    id?: string;
    title: string;
    description?: string;
    location?: string;
    startAt: string; // ISO format
    endAt: string; // ISO format
    isAllDay: boolean;
    color?: string;
  };
  onSubmit: (data: any) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  { name: "Violet", value: "#7c3aed" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Blue", value: "#2563eb" },
  { name: "Emerald", value: "#059669" },
  { name: "Amber", value: "#d97706" },
  { name: "Rose", value: "#e11d48" },
];

export default function EventModal({
  isOpen,
  onClose,
  mode,
  eventData,
  onSubmit,
  onDelete,
}: EventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isAllDay, setIsAllDay] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#7c3aed");

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Populate form fields on open or change of eventData
  useEffect(() => {
    if (isOpen) {
      setValidationError(null);
      if (mode === "edit" && eventData) {
        setTitle(eventData.title);
        setDescription(eventData.description || "");
        setLocation(eventData.location || "");
        setIsAllDay(eventData.isAllDay);
        setSelectedColor(eventData.color || "#7c3aed");

        const start = new Date(eventData.startAt);
        const end = new Date(eventData.endAt);

        setStartDate(start.toISOString().split("T")[0]);
        setStartTime(
          start.toTimeString().split(" ")[0].substring(0, 5) // HH:MM
        );
        setEndDate(end.toISOString().split("T")[0]);
        setEndTime(
          end.toTimeString().split(" ")[0].substring(0, 5) // HH:MM
        );
      } else if (mode === "create" && eventData) {
        // Defaults from clicked slot
        setTitle("");
        setDescription("");
        setLocation("");
        setIsAllDay(eventData.isAllDay || false);
        setSelectedColor("#7c3aed");

        const start = new Date(eventData.startAt);
        const end = new Date(eventData.endAt);

        setStartDate(start.toISOString().split("T")[0]);
        setStartTime(
          start.toTimeString().split(" ")[0].substring(0, 5)
        );
        setEndDate(end.toISOString().split("T")[0]);
        setEndTime(
          end.toTimeString().split(" ")[0].substring(0, 5)
        );
      }
    }
  }, [isOpen, mode, eventData]);

  if (!isOpen) return null;

  const handleSave = () => {
    setValidationError(null);

    // Combine Date and Time values to construct ISO ISO Strings
    const startIso = isAllDay
      ? new Date(`${startDate}T00:00:00`).toISOString()
      : new Date(`${startDate}T${startTime}:00`).toISOString();

    const endIso = isAllDay
      ? new Date(`${endDate}T23:59:59`).toISOString()
      : new Date(`${endDate}T${endTime}:00`).toISOString();

    const inputData = {
      title,
      description,
      location,
      startAt: startIso,
      endAt: endIso,
      isAllDay,
      color: selectedColor,
    };

    // Client-side schema verification using Zod
    const validated = eventSchema.safeParse(inputData);
    if (!validated.success) {
      setValidationError(validated.error.errors[0].message);
      return;
    }

    startTransition(async () => {
      try {
        await onSubmit({
          ...inputData,
          id: eventData?.id,
        });
        onClose();
      } catch (err: any) {
        setValidationError(err.message || "Failed to save event details.");
      }
    });
  };

  const handleDelete = () => {
    if (!onDelete || !eventData?.id) return;
    if (confirm("Are you sure you want to delete this event?")) {
      startTransition(async () => {
        try {
          await onDelete(eventData.id!);
          onClose();
        } catch (err: any) {
          setValidationError(err.message || "Failed to delete the event.");
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800/80 rounded-xl shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between">
          <h3 className="text-sm font-semibold font-mono text-zinc-300 uppercase tracking-wider">
            {mode === "create" ? "Create Schedule Event" : "Event details"}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Validation Alert */}
          {validationError && (
            <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium">
              {validationError}
            </div>
          )}

          {/* Title input */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
              Event Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 h-11 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
              placeholder="Add title..."
            />
          </div>

          {/* Date and Time selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                Start Date / Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 px-3 h-10 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-24 px-3 h-10 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
                End Date / Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 px-3 h-10 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                />
                {!isAllDay && (
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-24 px-3 h-10 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-xs text-white focus:outline-none transition-colors"
                  />
                )}
              </div>
            </div>
          </div>

          {/* All day checkbox */}
          <div className="flex items-center gap-3">
            <input
              id="isAllDay"
              type="checkbox"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-900/10 text-brand-600 focus:ring-brand-500 focus:ring-offset-zinc-950"
            />
            <label
              htmlFor="isAllDay"
              className="text-xs font-mono font-medium text-zinc-400 uppercase cursor-pointer selection:bg-transparent"
            >
              All-day event
            </label>
          </div>

          {/* Location field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
              Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-500">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 h-11 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
                placeholder="Add location (e.g. Online, Room 101)"
              />
            </div>
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
              Description
            </label>
            <div className="relative">
              <span className="absolute top-3 left-3 text-zinc-500">
                <AlignLeft className="w-4 h-4" />
              </span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors resize-none"
                placeholder="Add description..."
              />
            </div>
          </div>

          {/* Color Presets Picker */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
              Category Color
            </label>
            <div className="flex gap-3">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-6.5 h-6.5 rounded-full border transition-transform duration-100 ${
                    selectedColor === color.value
                      ? "scale-110 border-white"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-zinc-900 flex justify-between gap-4">
          <div>
            {mode === "edit" && onDelete && (
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="h-10 px-4 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isPending}
              className="h-10 px-4 rounded-lg border border-zinc-800 hover:bg-zinc-900 text-xs font-semibold text-zinc-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="h-10 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-brand-900/20 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Event"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
