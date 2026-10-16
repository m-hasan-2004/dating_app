"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DatabaseBackupManager from "@/components/site-settings/DatabaseBackupManager";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/context/LanguageContext";

export default function DatabaseBackupPage() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const isSuperUser = Boolean((user as any)?.is_superuser);

  useEffect(() => {
    if (!authLoading && !isSuperUser) {
      router.replace("/dashboard");
    }
  }, [authLoading, isSuperUser, router]);

  if (authLoading || !isSuperUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb
        pageTitle={isRTL ? "پشتیبان‌گیری و بازیابی پایگاه داده" : "Database Backup & Restore"}
      />

      <div className="space-y-6">
        <DatabaseBackupManager />
      </div>
    </div>
  );
}
