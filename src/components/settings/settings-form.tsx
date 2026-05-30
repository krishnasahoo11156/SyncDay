"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Globe, 
  Trash2, 
  ShieldAlert, 
  Check, 
  Loader2, 
  AlertCircle, 
  X 
} from "lucide-react";

interface SettingsFormProps {
  initialProfile: {
    display_name: string | null;
    timezone: string | null;
  };
  updateProfileSettings: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
  deleteAccountAction: () => Promise<{ error?: string } | undefined>;
}

const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "America/New_York (Eastern Time)" },
  { value: "America/Chicago", label: "America/Chicago (Central Time)" },
  { value: "America/Denver", label: "America/Denver (Mountain Time)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (Pacific Time)" },
  { value: "Europe/London", label: "Europe/London (Greenwich Mean Time)" },
  { value: "Europe/Paris", label: "Europe/Paris (Central European Time)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (India Standard Time)" },
  { value: "Asia/Singapore", label: "Asia/Singapore (Singapore Time)" },
  { value: "Asia/Tokyo", label: "Asia/Tokyo (Japan Standard Time)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (Eastern Standard Time)" },
];

export default function SettingsForm({
  initialProfile,
  updateProfileSettings,
  deleteAccountAction,
}: SettingsFormProps) {
  const [displayName, setDisplayName] = useState(initialProfile.display_name || "");
  const [timezone, setTimezone] = useState(initialProfile.timezone || "UTC");
  
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("timezone", timezone);

    try {
      const result = await updateProfileSettings(formData);
      if (result?.error) {
        setToast({ type: "error", message: result.error });
      } else if (result?.success) {
        setToast({ type: "success", message: "Preferences updated successfully." });
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to update settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== "DELETE") return;
    
    setIsDeleting(true);
    setToast(null);
    setShowDeleteModal(false);

    try {
      const result = await deleteAccountAction();
      if (result?.error) {
        setToast({ type: "error", message: result.error });
        setIsDeleting(false);
      }
    } catch (err: any) {
      setToast({ type: "error", message: err.message || "Failed to delete account." });
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-3xl w-full">
      {/* Toast Alert Popups */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border backdrop-blur-xl flex items-center gap-3 shadow-2xl transition-all duration-300 max-w-sm animate-slide-in ${
            toast.type === "success" 
              ? "border-emerald-500/20 bg-emerald-950/80 text-emerald-400" 
              : "border-red-500/20 bg-red-950/80 text-red-400"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          )}
          <span className="text-xs font-medium leading-normal">{toast.message}</span>
          <button 
            onClick={() => setToast(null)} 
            className="p-1 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors ml-auto"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Form Preferences Card */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md relative overflow-hidden flex flex-col gap-6 text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full filter blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col">
          <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
            <User className="w-5 h-5 text-brand-400" />
            <span>Profile Preferences</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Customize your dashboard layout identity and operational calendar timezone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Display Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="displayName" className="text-xs font-semibold text-zinc-300">
              Display Name
            </label>
            <div className="relative">
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                disabled={isSaving || isDeleting}
                className="w-full h-11 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/85 focus:border-brand-500 rounded-lg pl-3.5 pr-4 text-sm font-medium text-white placeholder-zinc-500 outline-none transition-all duration-150 disabled:opacity-50"
                placeholder="e.g. John Doe"
                required
              />
            </div>
          </div>

          {/* Timezone Selector */}
          <div className="flex flex-col gap-2">
            <label htmlFor="timezone" className="text-xs font-semibold text-zinc-300">
              System Timezone
            </label>
            <div className="relative">
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                disabled={isSaving || isDeleting}
                className="w-full h-11 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/85 focus:border-brand-500 rounded-lg px-3 text-sm font-medium text-white outline-none transition-all duration-150 disabled:opacity-50 appearance-none cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value} className="bg-zinc-950 text-zinc-200">
                    {tz.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 flex items-center">
                <Globe className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Form Controls */}
        <div className="flex justify-end pt-2 border-t border-zinc-900">
          <button
            type="submit"
            disabled={isSaving || isDeleting}
            className="h-10 px-5 bg-brand-600 hover:bg-brand-500 disabled:bg-brand-600/50 text-xs font-semibold tracking-wide uppercase text-white rounded-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer disabled:pointer-events-none"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>SAVING CHANGES...</span>
              </>
            ) : (
              <span>SAVE CONFIGURATION</span>
            )}
          </button>
        </div>
      </form>

      {/* Danger Zone Deletion Card */}
      <div className="p-6 rounded-2xl border border-red-950/80 bg-red-950/5 relative overflow-hidden flex flex-col gap-6 text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full filter blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col">
          <h2 className="text-lg font-bold tracking-tight text-red-400 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" />
            <span>Danger Zone</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1 font-sans">
            Permanently delete your profile and revoke all active integrations. This action is irreversible.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-xs text-red-300 font-light leading-relaxed flex flex-col gap-2.5">
          <p className="font-semibold text-red-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>Please note the following critical steps upon deletion:</span>
          </p>
          <ul className="list-disc pl-4 space-y-1.5 text-zinc-400">
            <li>Your Google OAuth application credentials will be immediately revoked from Google server authorization.</li>
            <li>Your local planner account, scheduling profiles, local events, connection mappings, and complete history logs will be purged permanently from the database.</li>
            <li>Your dedicated <span className="font-semibold text-zinc-300">SyncDay Events</span> calendar in Google will remain untouched, but all connection tokens are destroyed.</li>
          </ul>
        </div>

        <div className="flex justify-end pt-2 border-t border-zinc-900/40">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={isSaving || isDeleting}
            className="h-10 px-5 border border-red-500/30 bg-red-500/10 hover:bg-red-600 hover:text-white text-xs font-semibold tracking-wide uppercase text-red-400 rounded-lg flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer disabled:pointer-events-none"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>PURGING SYSTEM PROFILE...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>DELETE PERMANENTLY</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modern Deletion Confirmation Modal Overlay */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-5 shadow-2xl relative animate-scale-up text-left">
            <button 
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteConfirmationText("");
              }}
              className="absolute top-4 right-4 p-1 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-base font-bold tracking-tight text-white">Delete Account?</h3>
                <span className="text-[10px] text-zinc-500 font-mono">CONFIRM SYSTEM PURGE</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-light">
              This action is highly destructive and cannot be undone. To proceed, please type <span className="font-mono text-white bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 font-semibold select-none">DELETE</span> in the input field below to confirm your request.
            </p>

            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="w-full h-11 bg-zinc-900 border border-zinc-800 hover:border-zinc-700/85 focus:border-red-500 rounded-lg px-3.5 text-sm font-semibold text-white placeholder-zinc-600 outline-none transition-all duration-150"
                placeholder='Type "DELETE"'
                autoFocus
              />
            </div>

            <div className="flex gap-3 mt-1.5">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmationText("");
                }}
                className="flex-1 h-10 border border-zinc-850 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-semibold tracking-wide uppercase rounded-lg transition-colors cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmationText !== "DELETE"}
                className="flex-1 h-10 bg-red-600 hover:bg-red-500 disabled:bg-red-600/30 text-white disabled:text-red-400/50 text-xs font-semibold tracking-wide uppercase rounded-lg transition-all duration-150 cursor-pointer disabled:pointer-events-none flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>PURGE NOW</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
