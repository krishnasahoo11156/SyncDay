import { getEventsAction } from "@/actions/event-actions";
import CalendarView from "@/components/calendar/calendar-view";

export default async function DashboardPage() {
  const { events = [], error } = await getEventsAction();

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Dashboard Section Header */}
      <div className="flex flex-col text-left">
        <h1 className="text-2xl font-bold tracking-tight text-white">Your Calendar</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">
          Manage your schedule locally and sync when ready
        </p>
      </div>

      {/* Render Error if any */}
      {error && (
        <div className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium text-left leading-relaxed">
          {error}
        </div>
      )}

      {/* Interactive Calendar Grid */}
      <div className="flex-1 bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-4 backdrop-blur-md relative min-h-[500px]">
        {/* Subtle glow behind the calendar */}
        <div className="absolute inset-0 -z-10 bg-brand-500/5 blur-[80px] rounded-xl pointer-events-none" />
        
        <CalendarView initialEvents={events} />
      </div>
    </div>
  );
}
