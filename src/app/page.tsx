import Link from "next/link";
import { Calendar, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-between p-2 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#fafafa]">
              Sync<span className="text-brand-500">Day</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-4 h-9 flex items-center rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-md shadow-brand-900/20"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Introducing SyncDay Beta
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
            Plan your day. <br className="sm:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-400 to-indigo-500">
              Sync to Google Calendar.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-zinc-400 max-w-2xl font-light">
            A secure, professional personal planner that exports your events to a dedicated Google Calendar with a single click. Keep your schedules isolated and organized.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto h-12 px-8 flex items-center justify-between gap-2 text-base font-semibold rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors shadow-lg shadow-brand-900/30"
            >
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto h-12 px-8 flex items-center justify-between border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 text-zinc-300 hover:text-white rounded-lg transition-colors"
            >
              Sign in to Dashboard
            </Link>
          </div>

          {/* Interactive CSS Mockup Preview */}
          <div className="mt-16 sm:mt-24 w-full max-w-5xl rounded-xl border border-zinc-800 bg-[#121215] p-3 sm:p-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="px-4 py-1 rounded-md bg-zinc-900 text-xs text-zinc-400 font-mono">
                syncday.app/dashboard
              </div>
              <div className="w-12" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[350px] sm:h-[400px]">
              {/* Sidebar Mock */}
              <div className="border border-zinc-800/80 rounded-lg p-3 bg-zinc-950/50 flex flex-col justify-between hidden md:flex">
                <div className="space-y-4">
                  <div className="h-8 rounded bg-brand-600/10 flex items-center justify-between p-2 text-xs font-semibold text-brand-400">
                    + Create Event
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded bg-zinc-800 w-3/4" />
                    <div className="h-3 rounded bg-zinc-800 w-1/2" />
                  </div>
                </div>
                <div className="border-t border-zinc-900 pt-3 space-y-2 text-left">
                  <span className="text-[10px] text-zinc-500 font-mono">GOOGLE INTEGRATION</span>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Connected
                  </div>
                </div>
              </div>

              {/* Main Calendar Grid Mock */}
              <div className="col-span-3 border border-zinc-800/80 rounded-lg p-4 bg-zinc-950/30 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-zinc-300">May 2026</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-zinc-900 text-[10px] text-zinc-400 rounded">Month</span>
                      <span className="px-2 py-1 bg-zinc-900 text-[10px] text-zinc-400 rounded">Week</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className="aspect-square border border-zinc-900/60 rounded p-1 flex flex-col justify-between relative bg-zinc-900/20">
                        <span className="text-[9px] text-zinc-600 font-mono">{i + 15}</span>
                        {i === 3 && (
                          <div className="absolute inset-x-1 bottom-1 p-1 bg-brand-500/25 border border-brand-500/40 rounded text-[8px] text-brand-300 truncate">
                            Sprint Planning
                          </div>
                        )}
                        {i === 7 && (
                          <div className="absolute inset-x-1 bottom-1 p-1 bg-indigo-500/25 border border-indigo-500/40 rounded text-[8px] text-indigo-300 truncate">
                            Design Review
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-zinc-900 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-[10px] text-zinc-500 font-mono">2 pending local changes</span>
                  </div>
                  <div className="px-4 py-1.5 rounded-lg bg-brand-600 text-xs font-semibold text-white flex items-center gap-1.5 shadow-md shadow-brand-900/30">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Sync to Google
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-t border-zinc-900 bg-zinc-950/20 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center tracking-tight text-white mb-16">
              Designed for professional workflows
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-zinc-900 bg-[#121215]/50 p-8 rounded-xl text-left hover:border-zinc-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-between p-2.5 text-brand-400 mb-6">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">Clean Calendar Engine</h3>
                <p className="mt-3 text-sm text-zinc-400 font-light leading-relaxed">
                  Toggle views between Month, Week, and Day modes. Effortlessly drag-and-drop elements to reschedule plans dynamically.
                </p>
              </div>

              <div className="border border-zinc-900 bg-[#121215]/50 p-8 rounded-xl text-left hover:border-zinc-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-between p-2.5 text-emerald-400 mb-6">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">One-Click Google Sync</h3>
                <p className="mt-3 text-sm text-zinc-400 font-light leading-relaxed">
                  Instantly publish local plans into a dedicated "SyncDay Events" secondary Google calendar. Avoid duplicates with strict database sync mappings.
                </p>
              </div>

              <div className="border border-zinc-900 bg-[#121215]/50 p-8 rounded-xl text-left hover:border-zinc-800 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-between p-2.5 text-indigo-400 mb-6">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-100">Permissions Shielding</h3>
                <p className="mt-3 text-sm text-zinc-400 font-light leading-relaxed">
                  Keep your main calendar protected. The application only accesses secondary calendars created by the app, ensuring user data privacy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-zinc-500 font-mono">
          <span>&copy; {new Date().getFullYear()} SyncDay. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
