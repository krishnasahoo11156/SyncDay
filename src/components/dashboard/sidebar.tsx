"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth-actions";
import {
  Calendar,
  Layers,
  History,
  Settings,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  userEmail?: string;
  displayName?: string;
}

export default function Sidebar({ userEmail, displayName }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Calendar,
    },
    {
      name: "Integrations",
      href: "/dashboard/integrations",
      icon: Layers,
    },
    {
      name: "Sync History",
      href: "/dashboard/sync-history",
      icon: History,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile Topbar Toggle */}
      <div className="md:hidden flex items-center justify-between px-6 h-16 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white">
            <Calendar className="w-4.5 h-4.5" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">SyncDay</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-zinc-400 hover:text-white focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col justify-between w-64 border-r border-zinc-800/80 bg-zinc-950/70 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 md:static ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Upper Sidebar */}
        <div className="flex flex-col gap-8 px-6 py-8">
          {/* Logo Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white p-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Sync<span className="text-brand-500">Day</span>
            </span>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 px-4 h-11 text-sm font-medium rounded-lg transition-all duration-150 ${
                    isActive
                      ? "bg-brand-600/10 border border-brand-500/30 text-brand-400"
                      : "text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${isActive ? "text-brand-400" : "text-zinc-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Lower Sidebar / User Control */}
        <div className="flex flex-col gap-4 px-6 py-6 border-t border-zinc-900">
          {/* User Information */}
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-200 truncate leading-snug">
                {displayName || userEmail?.split("@")[0] || "User"}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono truncate leading-none mt-0.5">
                {userEmail || "user@example.com"}
              </span>
            </div>
          </div>

          {/* Sign Out Action Button */}
          <button
            onClick={() => signOutAction()}
            className="flex items-center gap-3 px-4 h-10 w-full text-xs font-mono text-zinc-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-colors border border-transparent"
          >
            <LogOut className="w-3.5 h-3.5" />
            SIGN OUT SESSION
          </button>
        </div>
      </aside>

      {/* Backdrop for open mobile sidebar */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}
    </>
  );
}
