"use client";

import React, { useState, useEffect, useRef } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { useLanguage } from "@/context/LanguageContext";
import {
  exportDatabaseApi,
  importDatabaseApi,
  listDatabaseBackupsApi,
  triggerManualBackupApi,
  downloadBackupFileApi,
  BackupItem,
} from "@/services/api/databaseBackup";

export default function DatabaseBackupManager() {
  const { t, isRTL } = useLanguage();

  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBackups = async () => {
    setIsLoadingList(true);
    try {
      const res = await listDatabaseBackupsApi();
      setBackups(res.backups || []);
    } catch {
      // Backend may not have volume mounted in dev or empty
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  const handleExport = async () => {
    setIsExporting(true);
    setFeedback(null);
    try {
      await exportDatabaseApi();
      setFeedback({
        type: "success",
        message: isRTL
          ? "خروجی پایگاه داده با موفقیت ایجاد و دانلود شد (backup.sql)."
          : "Database export completed successfully (backup.sql).",
      });
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || (isRTL ? "خطا در تهیه خروجی دیتابیس." : "Failed to export database."),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const name = file.name.toLowerCase();
      if (!name.endsWith(".sql") && !name.endsWith(".sql.gz") && !name.endsWith(".gz")) {
        setFeedback({
          type: "error",
          message: isRTL
            ? "فرمت فایل نامعتبر است. فرمت مورد انتظار backup.sql یا backup.sql.gz می‌باشد."
            : "Invalid file format. Expected format: backup.sql or backup.sql.gz.",
        });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setFeedback(null);
    }
  };

  const handleExecuteImport = async () => {
    if (!selectedFile) return;
    setConfirmModalOpen(false);
    setIsImporting(true);
    setFeedback(null);

    try {
      const res = await importDatabaseApi(selectedFile);
      setFeedback({
        type: "success",
        message:
          res.message ||
          (isRTL
            ? "پایگاه داده با موفقیت از فایل پشتیبان بازیابی شد."
            : "Database successfully restored from backup."),
      });
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      fetchBackups();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || (isRTL ? "خطا در وارد کردن دیتای پایگاه داده." : "Failed to import database."),
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleManualBackupTrigger = async () => {
    setIsCreatingBackup(true);
    setFeedback(null);
    try {
      const res = await triggerManualBackupApi();
      setFeedback({
        type: "success",
        message:
          res.message ||
          (isRTL
            ? "پشتیبان دستی با موفقیت ایجاد شد."
            : "Manual backup created successfully."),
      });
      fetchBackups();
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || (isRTL ? "خطا در ایجاد پشتیبان." : "Failed to create backup."),
      });
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleDownloadBackup = async (filename: string) => {
    try {
      await downloadBackupFileApi(filename);
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err.message || (isRTL ? "خطا در دانلود فایل پشتیبان." : "Failed to download backup file."),
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ComponentCard
      title={isRTL ? "پشتیبان‌گیری و بازیابی پایگاه داده (Export / Import)" : "Database Backup & Restore (Export / Import)"}
      desc={
        isRTL
          ? "مدیریت خروجی گرفتن، وارد کردن داده‌ها، پشتیبان‌های خودکار دوره‌ای و فرآیند بازیابی PostgreSQL."
          : "Manage database export, import, automated minute-by-minute backups, and PostgreSQL recovery."
      }
    >
      <div className="space-y-8">
        {/* Feedback message banner */}
        {feedback && (
          <div
            className={`p-4 text-sm font-medium rounded-xl flex items-center justify-between gap-3 ${
              feedback.type === "success"
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Action Grid: Export & Import */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Export Database */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold text-lg">
                    📤
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {isRTL ? "خروجی گرفتن از پایگاه داده (Export)" : "Export Database"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isRTL ? "فرمت مورد انتظار: backup.sql" : "Expected format: backup.sql"}
                    </p>
                  </div>
                </div>
                <Badge variant="solid" color="primary" size="sm">
                  PostgreSQL
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isRTL
                  ? "یک نسخه کامل از ساختار جداول و تمامی داده‌های فعال دیتابیس را در قالب اسکریپت استاندارد SQL تولید و در قالب فایل backup.sql دانلود نمایید."
                  : "Generates a full PostgreSQL dump of all schemas, tables, and records into standard uncompressed backup.sql for direct download."}
              </p>
            </div>

            <div className="pt-6">
              <Button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full justify-center gap-2"
              >
                {isExporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{isRTL ? "در حال آماده‌سازی خروجی..." : "Exporting Database..."}</span>
                  </>
                ) : (
                  <>
                    <span>📥</span>
                    <span>{isRTL ? "دریافت فایل backup.sql" : "Download backup.sql"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Card 2: Import Database */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-lg">
                    📥
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {isRTL ? "وارد کردن دیتای پایگاه داده (Import)" : "Import Database"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isRTL ? "پذیرش فایل‌های .sql و .sql.gz" : "Accepts .sql & .sql.gz files"}
                    </p>
                  </div>
                </div>
                <Badge variant="light" color="warning" size="sm">
                  {isRTL ? "عملیات حساس" : "Critical"}
                </Badge>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isRTL
                  ? "یک فایل پشتیبان (backup.sql) را بارگذاری کرده و در پایگاه داده اعمال نمایید. داده‌های موجود جایگزین و بروزرسانی خواهند شد."
                  : "Upload a SQL dump file (backup.sql or .sql.gz) to restore database records into PostgreSQL directly."}
              </p>

              {/* File selector input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".sql,.gz,.tar.gz"
                onChange={handleFileChange}
                className="hidden"
                id="db-backup-upload-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[var(--color-primary)] rounded-xl p-3 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900/40"
              >
                {selectedFile ? (
                  <div className="text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2">
                    <span>📄</span>
                    <span className="font-semibold">{selectedFile.name}</span>
                    <span className="text-slate-400">({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {isRTL
                      ? "برای انتخاب فایل backup.sql کلیک کنید"
                      : "Click to select backup.sql file"}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                disabled={!selectedFile || isImporting}
                variant="outline"
                className="w-full justify-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/30"
              >
                {isImporting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                    <span>{isRTL ? "در حال بازیابی پایگاه داده..." : "Restoring Database..."}</span>
                  </>
                ) : (
                  <>
                    <span>⚡</span>
                    <span>{isRTL ? "اجرای بازیابی و واردسازی" : "Restore from Selected File"}</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Automated & Manual Backups Section */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-white/[0.01] space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <span>🕒</span>
                <span>{isRTL ? "پشتیبان‌های خودکار و دستی سرور (/backups/)" : "Server Backups Directory (/backups/)"}</span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isRTL
                  ? "پشتیبان‌ها خودکار هر دقیقه توسط Cron Job در کانتینر ایجاد می‌شوند (نگهداری ۲۴ ساعت اخیر)."
                  : "Backups are created automatically every minute via cron jobs inside the container (Retention: last 24 hours / 1440 minutes)."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={fetchBackups}
                disabled={isLoadingList}
              >
                🔄 {isRTL ? "بروزرسانی لیست" : "Refresh"}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleManualBackupTrigger}
                disabled={isCreatingBackup}
              >
                {isCreatingBackup ? (
                  isRTL ? "در حال ایجاد..." : "Creating..."
                ) : (
                  <>+ {isRTL ? "ایجاد پشتیبان دستی" : "Create Manual Backup"}</>
                )}
              </Button>
            </div>
          </div>

          {/* Backup list table */}
          {isLoadingList ? (
            <div className="py-6 text-center text-xs text-slate-500">
              <span className="inline-block w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mr-2"></span>
              {isRTL ? "در حال بارگذاری لیست پشتیبان‌ها..." : "Loading backups..."}
            </div>
          ) : backups.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
              {isRTL
                ? "هنوز فایلی در دایرکتوری /backups/ موجود نیست یا کانتینر هنوز فایل پشتیبان جدیدی ثبت نکرده است."
                : "No backup files found yet in /backups/ directory."}
            </div>
          ) : (
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-xs text-left rtl:text-right">
                <thead className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">{isRTL ? "نام فایل" : "File Name"}</th>
                    <th className="py-2.5 px-3">{isRTL ? "حجم" : "Size"}</th>
                    <th className="py-2.5 px-3">{isRTL ? "تاریخ و ساعت" : "Date & Time"}</th>
                    <th className="py-2.5 px-3 text-center">{isRTL ? "عملیات" : "Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {backups.map((b) => (
                    <tr key={b.name} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02]">
                      <td className="py-2 px-3 font-mono text-slate-800 dark:text-slate-200">
                        {b.name}
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                        {b.size_formatted}
                      </td>
                      <td className="py-2 px-3 text-slate-500">
                        {new Date(b.modified).toLocaleString(isRTL ? "fa-IR" : "en-US")}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadBackup(b.name)}
                          className="text-xs py-1 px-2.5"
                        >
                          ⬇ {isRTL ? "دانلود" : "Download"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Structured CLI Documentation & Reference Guide */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-slate-900 text-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📖</span>
              <span>
                {isRTL
                  ? "راهنمای ساختار و دستورات پشتیبان‌گیری و بازیابی (Backup and Restore Guide)"
                  : "Backup and Restore Guide & Reference CLI"}
              </span>
            </h4>
            <Badge variant="solid" color="primary" size="sm">
              Docker & CLI
            </Badge>
          </div>

          {/* Section 1: Automated Backups */}
          <div className="space-y-1">
            <h5 className="text-xs font-semibold text-emerald-400">
              {isRTL ? "۱. پشتیبان‌گیری خودکار (Automated Backups)" : "1. Automated Backups"}
            </h5>
            <p className="text-xs text-slate-300">
              {isRTL
                ? "پشتیبان‌ها خودکار هر دقیقه توسط Cron Jobs درون کانتینر ایجاد می‌شوند."
                : "Backups are created automatically every minute via cron jobs inside the container."}
            </p>
          </div>

          {/* Section 2: Manual Backup Commands */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-sky-400">
                {isRTL ? "۲. پشتیبان‌گیری دستی (Manual Backup)" : "2. Manual Backup"}
              </h5>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `docker compose exec web /usr/local/bin/backup_db.sh\ndocker compose exec web ls -la /backups/\ndocker cp dating_app_web:/backups/dating_app_20231201_120000.sql.gz ./`,
                    "manual-backup"
                  )
                }
                className="text-[11px] text-sky-300 hover:text-sky-100"
              >
                {copiedIndex === "manual-backup" ? "✓ کپی شد" : "کپی دستورات"}
              </button>
            </div>
            <pre className="p-3 bg-black/60 rounded-xl text-xs font-mono text-emerald-300 overflow-x-auto">
{`# Create backup
docker compose exec web /usr/local/bin/backup_db.sh

# List backups
docker compose exec web ls -la /backups/

# Copy backup to host
docker cp dating_app_web:/backups/dating_app_20231201_120000.sql.gz ./`}
            </pre>
          </div>

          {/* Section 3: Restore from Backup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-semibold text-amber-400">
                {isRTL ? "۳. بازیابی از فایل پشتیبان (Restore from Backup)" : "3. Restore from Backup"}
              </h5>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    `docker cp ./backup.sql.gz dating_app_web:/backups/\ndocker compose exec web bash -c "gunzip -c /backups/backup.sql.gz | psql -h db -U hasan -d dating_app"\npsql -h db -U hasan -d dating_app < backup.sql`,
                    "restore-backup"
                  )
                }
                className="text-[11px] text-amber-300 hover:text-amber-100"
              >
                {copiedIndex === "restore-backup" ? "✓ کپی شد" : "کپی دستورات"}
              </button>
            </div>
            <div className="text-[11px] text-amber-200">
              ⚠️ {isRTL ? "در صورت لزوم ابتدا دیتابیس را از طریق pgAdmin حذف (Drop) کنید." : "First Drop Using Pgadmin if required."}
            </div>
            <pre className="p-3 bg-black/60 rounded-xl text-xs font-mono text-amber-200 overflow-x-auto">
{`# Copy backup to container
docker cp ./backup.sql.gz dating_app_web:/backups/

# Restore database (compressed)
docker compose exec web bash -c "gunzip -c /backups/backup.sql.gz | psql -h db -U hasan -d dating_app"

# Uncompressed SQL file
psql -h db -U hasan -d dating_app < backup.sql`}
            </pre>
          </div>

          {/* Section 4: Backup Locations & Retention */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h5 className="text-xs font-semibold text-purple-400">
              {isRTL ? "۴. مسیرها و مشخصات ذخیره‌سازی (Backup Locations & Retention)" : "4. Backup Locations & Retention"}
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-black/40">
                <span className="text-slate-400 block text-[11px]">{isRTL ? "مسیر کانتینر" : "Container Path"}</span>
                <span className="font-mono text-white">/backups/</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <span className="text-slate-400 block text-[11px]">{isRTL ? "والیوم داکر" : "Host Volume"}</span>
                <span className="font-mono text-white">dating_app_backups</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <span className="text-slate-400 block text-[11px]">{isRTL ? "مدت نگهداری" : "Retention"}</span>
                <span className="text-white font-medium">{isRTL ? "۲۴ ساعت اخیر (۱۴۴۰ دقیقه)" : "Last 24 hours (1440 min)"}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/40">
                <span className="text-slate-400 block text-[11px]">{isRTL ? "فرمت مورد انتظار" : "Expected Format"}</span>
                <span className="font-mono text-emerald-400 font-semibold">backup.sql</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Database Restore */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center text-xl font-bold">
                ⚠️
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isRTL ? "تأیید بازیابی پایگاه داده" : "Confirm Database Restore"}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isRTL
                ? `آیا مطمئن هستید که می‌خواهید دیتابیس را از فایل "${selectedFile?.name}" بازیابی کنید؟ این عملیات داده‌های موجود را تغییر داده و غیرقابل بازگشت است.`
                : `Are you sure you want to restore the database from "${selectedFile?.name}"? This action will overwrite or update existing database records.`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setConfirmModalOpen(false)}
              >
                {isRTL ? "انصراف" : "Cancel"}
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={handleExecuteImport}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isRTL ? "بله، شروع بازیابی" : "Yes, Restore Database"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </ComponentCard>
  );
}
