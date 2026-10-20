"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { user, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/signin?logged_out=true");
  };

  const displayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || t("Guest User");

  return (
    <div className="flex items-center gap-2">
      {/* Profile Button */}
      <Link
        href="/profile"
        className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 bg-white border-[1.5px] border-slate-300 rounded-full hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] shadow-sm hover:shadow-md hover:-translate-y-0.5 dark:border-slate-700/80 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-[var(--color-primary)] dark:hover:bg-[var(--color-primary)]/20 transition-all cursor-pointer group"
        title={t("Profile")}
      >
        <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
          {mounted && user?.username ? user.username.charAt(0).toUpperCase() : "U"}
        </span>
        <span className="font-bold text-slate-900 dark:text-white">{t("Profile")}</span>
      </Link>

      {/* Sign Out Button (Placed at extreme edge: Left in RTL, Right in LTR) */}
      {!mounted ? (
        <div className="w-20 h-8" />
      ) : isAuthenticated ? (
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-rose-600 bg-rose-50 border-[1.5px] border-rose-300 rounded-full hover:bg-rose-100 hover:text-rose-700 hover:border-rose-400 dark:text-rose-400 dark:bg-rose-950/30 dark:border-rose-900/50 dark:hover:bg-rose-900/50 dark:hover:border-rose-700 transition-all cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 group active:scale-95"
          title={t("Sign Out")}
        >
          <svg
            className="w-4 h-4 text-rose-500 group-hover:text-rose-700 dark:text-rose-400 dark:group-hover:text-rose-300 transition-colors"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>{t("Sign out")}</span>
        </button>
      ) : (
        <Link
          href="/signin"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-full hover:bg-[var(--color-primary)]/20 transition-all cursor-pointer shadow-xs"
        >
          <span>{t("Sign in")}</span>
        </Link>
      )}
    </div>
  );
}
