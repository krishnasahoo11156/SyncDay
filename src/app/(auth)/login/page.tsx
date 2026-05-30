"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signInAction } from "@/actions/auth-actions";
import { Calendar, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const res = await signInAction(formData);
      if (res && res.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 lg:px-8 bg-[#09090b]">
      <div className="w-full max-w-md space-y-8 bg-zinc-950/40 p-8 rounded-xl border border-zinc-800/80 shadow-xl backdrop-blur-md relative">
        
        {/* Glow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Logo and Headings */}
        <div className="flex flex-col items-center justify-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-6 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-between p-2 text-white transition-transform group-hover:scale-105">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Sync<span className="text-brand-500">Day</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-1.5 text-xs text-zinc-500 font-mono">
            ENTER YOUR CREDENTIALS TO LOG IN
          </p>
        </div>

        {/* Form Error Alert */}
        {error && (
          <div className="p-3.5 rounded-lg border border-red-500/20 bg-red-500/5 text-xs text-red-400 font-medium text-left leading-relaxed">
            {error}
          </div>
        )}

        {/* Submission Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider mb-2 text-left"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              className="w-full px-4 h-11 border border-zinc-800 bg-zinc-900/20 focus:border-brand-500 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors disabled:opacity-50"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider"
              >
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                disabled={isPending}
                className="w-full pl-4 pr-10 h-11 border border-zinc-800 bg-zinc-900/20 focus:border-brand-500 rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors disabled:opacity-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 text-sm font-semibold text-white rounded-lg flex items-center justify-center gap-2 shadow-md shadow-brand-900/20 transition-colors"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-xs text-zinc-500 font-mono">
          NEW TO SYNCDAY?{" "}
          <Link
            href="/signup"
            className="font-bold text-brand-400 hover:text-brand-300 hover:underline transition-colors uppercase"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}
