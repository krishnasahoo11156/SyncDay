"use client";

import { Search, RefreshCw, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { useTransition, useState, useEffect } from "react";

interface TopbarProps {
  isGoogleConnected?: boolean;
  lastSyncedAt?: string | null;
  onSyncTrigger?: () => Promise<any>;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Topbar({
  isGoogleConnected = false,
  lastSyncedAt = null,
  onSyncTrigger,
  searchQuery = "",
  onSearchChange,
}: TopbarProps) {
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Auto-close toast after 4 seconds
  useEffect(() => {
    if (toast?.show) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSyncClick = () => {
    if (!onSyncTrigger) return;
    setToast(null);

    startTransition(async () => {
      try {
        const res = await onSyncTrigger();
        if (res && res.error) {
          setToast({
            show: true,
            type: "error",
            message: `Sync failed: ${res.error}`,
          });
        } else if (res && res.success) {
          if (res.succeeded === 0 && res.attempted === 0) {
            setToast({
              show: true,
              type: "success",
              message: "Calendar is already fully in sync. No changes detected.",
            });
          } else {
            setToast({
              show: true,
              type: "success",
              message: `Successfully synced ${res.succeeded} events to Google Calendar!`,
            });
          }
        } else {
          setToast({
            show: true,
            type: "success",
            message: "Synchronization completed successfully.",
          });
        }
      } catch (err: any) {
        setToast({
          show: true,
          type: "error",
          message: err.message || "A general error occurred during sync.",
        });
      }
    });
  };

  return (
    <>
      <header className="h-16 border-b border-zinc-800 bg-zinc-950/20 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search calendar events..."
            className="w-full pl-10 pr-4 h-10 border border-zinc-800 bg-zinc-900/10 focus:border-brand-500 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>
        <div className="sm:hidden flex-1" />

        {/* Right-Side Dashboard Actions */}
        <div className="flex items-center gap-4">
          {/* Google Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 h-8 rounded-full border border-zinc-800 bg-zinc-900/30 text-[10px] font-mono text-zinc-400">
            {isGoogleConnected ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Google Connected</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Google Disconnected</span>
              </>
            )}
          </div>

          {/* Sync Now Button Control */}
          {isGoogleConnected && (
            <button
              onClick={handleSyncClick}
              disabled={isPending}
              className="px-4 h-9 rounded-lg bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 text-xs font-semibold text-white flex items-center gap-2 shadow-md shadow-brand-900/20 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span>Sync Now</span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Floating Success/Error Toast Message Container */}
      {toast?.show && (
        <div className="fixed top-20 right-6 z-50 animate-fade-in-up w-full max-w-sm rounded-xl p-4 shadow-xl border bg-zinc-950/90 backdrop-blur-md flex items-start justify-between gap-3 text-left border-zinc-800">
          <div className="flex gap-2.5">
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <div className="space-y-1">
              <h4 className="text-xs font-bold font-mono tracking-wider uppercase text-zinc-300">
                {toast.type === "success" ? "Sync Completed" : "Sync Failed"}
              </h4>
              <p className="text-xs text-zinc-400 font-light leading-normal leading-relaxed">
                {toast.message}
              </p>
            </div>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </>
  );
}
