"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, loading, isAuthenticated } = useAuth();
  const { isRTL, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [loading, isAuthenticated, router]);

  // Loading Screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">{t("Verifying session...")}</p>
        </div>
      </div>
    );
  }

  // Unauthenticated fallback while redirecting
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500 dark:text-gray-400">{t("Redirecting to sign in...")}</p>
        </div>
      </div>
    );
  }

  // Dynamic class for main content margin based on sidebar state and RTL
  const mainContentMargin = isRTL
    ? isMobileOpen
      ? "mr-0"
      : isExpanded || isHovered
      ? "lg:mr-[290px]"
      : "lg:mr-[90px]"
    : isMobileOpen
    ? "ml-0"
    : isExpanded || isHovered
    ? "lg:ml-[290px]"
    : "lg:ml-[90px]";

  return (
    <div className="min-h-screen xl:flex bg-[var(--color-canvas-light,#f8fafc)] dark:bg-[var(--color-canvas-dark,#101828)]">
      {/* Sidebar and Backdrop */}
      <AppSidebar />
      <Backdrop />
      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
      >
        {/* Header */}
        <AppHeader />
        {/* Page Content */}
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">{children}</div>
      </div>
    </div>
  );
}
