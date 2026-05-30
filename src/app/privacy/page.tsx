import Link from "next/link";
import { Calendar, ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#09090b]">
      {/* Static Header Navigation */}
      <header className="border-b border-zinc-900 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-mono">
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO HOME</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-brand-600 flex items-center justify-center text-white p-1.5">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">SyncDay</span>
          </div>
        </div>
      </header>

      {/* Content Body */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 text-left">
        <div className="flex items-center gap-3.5 mb-6 text-brand-400">
          <Shield className="w-8 h-8" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Privacy Policy</h1>
        </div>
        
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-8">
          Last updated: May 30, 2026
        </p>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">1. Introduction</h2>
            <p>
              Welcome to SyncDay ("we", "our", "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our web application located at <span className="text-zinc-300 font-mono text-xs">syncday.app</span> and its associated features, specifically our Google Calendar integration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">2. Information We Collect</h2>
            <p>
              When you create an account and utilize SyncDay, we collect specific parameters to ensure operational delivery:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold text-zinc-300">Account Credentials</span>: We collect your name, email address, and hashed passwords when you register an account via Supabase.
              </li>
              <li>
                <span className="font-semibold text-zinc-300">Google Calendar OAuth Data</span>: If you connect Google Calendar, we ask for your Google account email and an offline OAuth refresh token. We request only the narrow <code className="px-1 py-0.5 rounded bg-zinc-900 text-brand-300 text-xs">calendar.app.created</code> scope.
              </li>
              <li>
                <span className="font-semibold text-zinc-300">Calendar Events</span>: We store the titles, descriptions, locations, start/end dates and times, and colors of events you create locally inside SyncDay.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">3. How We Use Your Information</h2>
            <p>
              We use the collected information solely to provide, support, and enhance our services:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>To render your personal calendar dashboard locally inside SyncDay.</li>
              <li>To refresh your Google Calendar access token automatically and push your SyncDay events directly to a dedicated, secondary Google Calendar named <span className="font-semibold text-zinc-300">"SyncDay Events"</span>.</li>
              <li>We <span className="font-semibold text-red-400">never</span> view, edit, modify, or delete events on your default personal calendar, nor do we access other calendars you own.</li>
              <li>We do not sell, rent, share, or trade your private calendar data or account information with third-party advertisers or external services.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">4. Cryptographic Data Security</h2>
            <p>
              We prioritize data security. Your Google Calendar OAuth refresh tokens are securely encrypted at rest using industry-standard symmetric **AES-256-GCM** encryption before being saved in our PostgreSQL database. Decryption is performed strictly server-side only when actively executing a sync operation. We never store or expose Google client secrets or tokens in browser code.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">5. Data Deletion and Account Revocation</h2>
            <p>
              You maintain full ownership of your data and calendar configurations:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold text-zinc-300">Google Disconnection</span>: You can disconnect Google Calendar at any time in your Integrations dashboard. This automatically sends a revocation request to Google's authorization servers to immediately destroy the token and purges the connection row from our database.
              </li>
              <li>
                <span className="font-semibold text-zinc-300">Account Purging</span>: You can delete your entire SyncDay profile at any time in your Settings panel. This will immediately cascade-delete all local profiles, events, connections, sync maps, and historical transaction logs from our database.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">6. Policy Modifications</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page with a revised date stamp.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">7. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact us at <span className="text-brand-400 font-mono">support@syncday.app</span>.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-xs text-zinc-500 font-mono">
          <span>&copy; {new Date().getFullYear()} SyncDay. All rights reserved.</span>
          <Link href="/terms" className="hover:text-zinc-300 transition-colors">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
