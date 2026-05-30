import Link from "next/link";
import { Calendar, ArrowLeft, AlignLeft } from "lucide-react";

export default function TermsPage() {
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
          <AlignLeft className="w-8 h-8" />
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Terms of Service</h1>
        </div>
        
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mb-8">
          Last updated: May 30, 2026
        </p>

        <div className="space-y-8 text-sm text-zinc-400 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our planner web application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use or access the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">2. Service Scope</h2>
            <p>
              SyncDay provides a web-based calendar and planner utility that lets users schedule events locally and push those events into a dedicated secondary calendar in their Google Calendar account. The service is currently in beta. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice or liability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">3. User Accounts</h2>
            <p>
              To access calendar dashboard features, you must register an account:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You agree to provide true, accurate, and current email addresses during registration.</li>
              <li>You are responsible for maintaining the confidentiality of your account password and session tokens.</li>
              <li>You are fully responsible for all scheduling modifications and database creations executed under your profile.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">4. Google Calendar Integration Rules</h2>
            <p>
              When using our Google sync engine:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must comply with Google's own API policies, OAuth regulations, and terms.</li>
              <li>You agree not to manipulate or flood the Google Calendar API through our sync buttons in a way that violates Google API quota thresholds.</li>
              <li>We hold no responsibility for adjustments Google makes to its OAuth consent requirements, scope restrictions, or service access limits.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">5. Acceptable Use</h2>
            <p>
              You agree not to use SyncDay to:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Commit illegal actions, distribute spam, or record abusive, fraudulent, or harassing calendar descriptions.</li>
              <li>Attempt to reverse-engineer our server-side encryption methods or inject malicious code into our API route endpoints.</li>
              <li>Impersonate Google branding or imply that our application is developed or endorsed by Google Inc.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided on an <span className="font-semibold">"AS IS"</span> and <span className="font-semibold">"AS AVAILABLE"</span> basis. We make no warranties, expressed or implied, regarding the reliability of synchronization operations, PostgreSQL database persistence, or uninterrupted access during server load fluctuations.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, SyncDay and its developers shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use the Service, including but not limited to lost events data, Google API access errors, or database connectivity losses.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-zinc-200">8. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with local regulations, without regard to conflict of law principles.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center text-xs text-zinc-500 font-mono">
          <span>&copy; {new Date().getFullYear()} SyncDay. All rights reserved.</span>
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
