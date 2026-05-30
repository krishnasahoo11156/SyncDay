"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldAlert } from "lucide-react";

interface GoogleCalendarCardProps {
  initialConnected: boolean;
  googleEmail?: string | null;
  lastSyncedAt?: string | null;
}

export default function GoogleCalendarCard({
  initialConnected,
  googleEmail,
  lastSyncedAt,
}: GoogleCalendarCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = () => {
    // Redirect to connect API endpoint which initiates Google OAuth redirect
    window.location.href = "/api/google/connect";
  };

  const handleDisconnect = () => {
    if (!confirm("Are you sure you want to disconnect Google Calendar?")) return;
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/google/disconnect", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to disconnect Google Calendar.");
        }

        router.refresh();
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="w-full max-w-2xl bg-zinc-950/40 border border-zinc-800/80 rounded-xl p-6 relative backdrop-blur-md text-left">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        {/* Left Info Column */}
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center p-3 text-white">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Google Calendar Integration</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-md">
              Synchronize your SyncDay planned events into a dedicated Google calendar. Keep your personal calendar protected and isolated.
            </p>
          </div>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-2 px-3 h-8 rounded-full border border-zinc-800 bg-zinc-900/30 text-[10px] font-mono text-zinc-400">
          {initialConnected ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-400">CONNECTED</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
              <span>DISCONNECTED</span>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium">
          {error}
        </div>
      )}

      {/* Conditional Rendering based on state */}
      {initialConnected ? (
        <div className="mt-6 border-t border-zinc-900 pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">CONNECTED ACCOUNT</span>
              <span className="text-zinc-300 truncate">{googleEmail}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 uppercase tracking-wider text-[10px]">CALENDAR CREATED</span>
              <span className="text-zinc-300">SyncDay Events</span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleDisconnect}
              disabled={isPending}
              className="h-9 px-4 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold text-red-400 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Disconnecting...</span>
                </>
              ) : (
                "Disconnect Calendar"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 border-t border-zinc-900 pt-6 space-y-6">
          <div className="p-3.5 rounded-lg border border-brand-500/20 bg-brand-500/5 flex gap-3 text-xs leading-relaxed text-zinc-300">
            <ShieldAlert className="w-5 h-5 text-brand-400 flex-shrink-0" />
            <div className="text-left font-light">
              <span className="font-semibold text-brand-400">Permissions Guarantee:</span> We request the narrow <code className="px-1 py-0.5 rounded bg-zinc-900 text-brand-300 text-[10px]">calendar.app.created</code> permission. SyncDay can only access secondary calendars that it creates. We will never view, edit, or delete events on your default personal calendar.
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleConnect}
              disabled={isPending}
              className="h-10 px-6 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white flex items-center gap-2 shadow-md shadow-brand-900/20 transition-colors disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Connect Google Calendar</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
