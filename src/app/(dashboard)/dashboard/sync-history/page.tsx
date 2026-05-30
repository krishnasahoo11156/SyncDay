import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { History, CheckCircle2, AlertCircle, ArrowUpRight, Shield } from "lucide-react";
import { format } from "date-fns";

export default async function SyncHistoryPage() {
  const supabase = await createClient();

  // Load the current authenticated user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch sync logs from Supabase, limited to top 50 entries
  const { data: logs, error } = await supabase
    .from("sync_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="flex flex-col gap-6 h-full text-left">
      {/* Header section */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold tracking-tight text-white">Sync History</h1>
        <p className="text-xs text-zinc-500 font-mono mt-0.5 uppercase tracking-wide">
          Audit and trace your Google Calendar synchronization transactions
        </p>
      </div>

      {error && (
        <div className="p-3.5 max-w-4xl rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium">
          Failed to load sync logs: {error.message}
        </div>
      )}

      {/* Render Logs Table or Onboarding Empty State */}
      {!logs || logs.length === 0 ? (
        <div className="flex-1 border border-dashed border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center text-center max-w-4xl bg-zinc-950/20 backdrop-blur-md">
          <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-850 flex items-center justify-center p-3 text-zinc-500 mb-6">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300">No sync logs available</h3>
          <p className="mt-2 text-xs text-zinc-500 max-w-xs font-light leading-relaxed">
            Your sync logs will appear here once you connect Google Calendar and click "Sync Now" in the top header.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-4xl rounded-xl border border-zinc-800 bg-zinc-950/40 p-4 sm:p-6 backdrop-blur-md relative overflow-x-auto">
          {/* Subtle glow behind the card */}
          <div className="absolute inset-0 -z-10 bg-brand-500/5 blur-[80px] rounded-xl pointer-events-none" />

          <table className="w-full border-collapse text-left text-xs font-mono text-zinc-400">
            <thead>
              <tr className="border-b border-zinc-900 pb-3 text-zinc-500 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3.5 pl-2">SYNC TIME & DATE</th>
                <th className="py-3.5">TYPE</th>
                <th className="py-3.5 text-center">ATTEMPTED</th>
                <th className="py-3.5 text-center text-emerald-500">SUCCEEDED</th>
                <th className="py-3.5 text-center text-red-500">FAILED</th>
                <th className="py-3.5 pr-2 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const date = new Date(log.created_at);
                const isSuccess = !log.error_message && log.events_failed === 0;

                return (
                  <tr
                    key={log.id}
                    className="border-b border-zinc-900/50 hover:bg-zinc-900/10 transition-colors"
                  >
                    {/* Date and Time Column */}
                    <td className="py-4 pl-2 font-sans font-medium text-zinc-200">
                      <div className="flex flex-col">
                        <span>{format(date, "MMM dd, yyyy")}</span>
                        <span className="text-[10px] text-zinc-500 font-mono mt-0.5 uppercase">
                          {format(date, "hh:mm:ss a")}
                        </span>
                      </div>
                    </td>

                    {/* Sync Type Column */}
                    <td className="py-4 font-mono font-medium text-zinc-400">
                      <span className="inline-block px-2 py-0.5 rounded bg-zinc-900 text-[10px]">
                        {log.sync_type === "manual" ? "MANUAL SYNC" : "AUTO SYNC"}
                      </span>
                    </td>

                    {/* Attempted Events Count */}
                    <td className="py-4 text-center text-zinc-300 font-bold">
                      {log.events_attempted}
                    </td>

                    {/* Succeeded Events Count */}
                    <td className="py-4 text-center text-emerald-500 font-bold">
                      {log.events_succeeded}
                    </td>

                    {/* Failed Events Count */}
                    <td className="py-4 text-center text-red-500 font-bold">
                      {log.events_failed}
                    </td>

                    {/* Sync Status Column */}
                    <td className="py-4 pr-2 text-right">
                      <div className="flex flex-col items-end gap-1">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[9px] font-bold text-emerald-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            <span>SUCCESS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-[9px] font-bold text-red-400">
                            <AlertCircle className="w-3 h-3 text-red-500" />
                            <span>FAILED</span>
                          </span>
                        )}
                        
                        {log.error_message && (
                          <span className="text-[9px] text-red-400 font-sans mt-1 text-right max-w-xs block leading-tight">
                            {log.error_message}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
