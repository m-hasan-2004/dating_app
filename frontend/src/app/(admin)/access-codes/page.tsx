"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  AccessCode,
  fetchAccessCodes,
  getAccessCode,
  createAccessCode,
  updateAccessCodePatch,
  updateAccessCodePut,
  deleteAccessCode,
} from "@/services/accessCodeService";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PlusIcon, TrashBinIcon, CheckLineIcon, CloseLineIcon, CopyIcon } from "@/icons";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/context/LanguageContext";
import { formatDate } from "@/utils/formatters";
import { useRouter } from "next/navigation";

export default function AccessCodesManagement() {
  const { user, loading: authLoading } = useAuth();
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const isAdmin = Boolean(user?.is_staff || (user as any)?.is_superuser);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/');
    }
  }, [authLoading, isAdmin, router]);

  if (!isAdmin && !authLoading) {
    return null;
  }

  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state: "all" | "active" | "inactive"
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDeleteSelectedOpen, setIsDeleteSelectedOpen] = useState<boolean>(false);

  // Selected item state
  const [selectedCode, setSelectedCode] = useState<AccessCode | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => { setCopiedId(null); }, 2000);
  };

  // Form State
  const [activeFormValue, setActiveFormValue] = useState<boolean>(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [bulkSubmitting, setBulkSubmitting] = useState<boolean>(false);

  // Quantity state for bulk generation
  const [generateQuantity, setGenerateQuantity] = useState<number>(1);

  // Fetch access codes
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let active_param: boolean | undefined = undefined;
      if (filterStatus === "active") active_param = true;
      if (filterStatus === "inactive") active_param = false;

      const response = await fetchAccessCodes({ active: active_param });

      if (Array.isArray(response)) {
        setAccessCodes(response);
        setTotalCount(response.length);
      } else if (response && Array.isArray(response.results)) {
        setAccessCodes(response.results);
        setTotalCount(response.count);
      } else {
        setAccessCodes([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err.message || t("Failed to load access codes"));
    } finally {
      setLoading(false);
    }
    setSelectedIds(new Set());
  }, [filterStatus, t]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Selection helpers ──────────────────────────────────────────
  const isAllSelected = accessCodes.length > 0 && selectedIds.size === accessCodes.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < accessCodes.length;
  const hasSelection = selectedIds.size > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(accessCodes.map((c) => c.id)));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  // Handle single row Activate / Deactivate Toggle
  const handleToggleStatus = async (item: AccessCode) => {
    try {
      const updated = await updateAccessCodePatch(item.id, { active: !item.active });
      setAccessCodes((prev) =>
        prev.map((c) => (c.id === updated.id ? { ...c, active: updated.active } : c))
      );
    } catch (err: any) {
      alert(`${t("Failed to update status")}: ${err.message}`);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setGenerateQuantity(1);
    setFormError(null);
    setIsCreateOpen(true);
  };

  // Create Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.max(1, generateQuantity || 1);
    setFormSubmitting(true);
    setFormError(null);
    try {
      await Promise.all(Array.from({ length: count }).map(() => createAccessCode({ active: true })));
      setIsCreateOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || t("Failed to generate access codes"));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open View Detail Modal
  const handleViewDetail = async (id: number) => {
    try {
      const codeData = await getAccessCode(id);
      setSelectedCode(codeData);
      setIsDetailOpen(true);
    } catch (err: any) {
      alert(`${t("Failed to fetch details")}: ${err.message}`);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item: AccessCode) => {
    setSelectedCode(item);
    setActiveFormValue(item.active);
    setFormError(null);
    setIsEditOpen(true);
  };

  // Edit Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCode) return;
    setFormSubmitting(true);
    setFormError(null);
    try {
      await updateAccessCodePut(selectedCode.id, { active: activeFormValue });
      setIsEditOpen(false);
      loadData();
    } catch (err: any) {
      setFormError(err.message || t("Failed to update access code"));
    } finally {
      setFormSubmitting(false);
    }
  };

  // Open single Delete Modal
  const handleOpenDelete = (item: AccessCode) => {
    setSelectedCode(item);
    setIsDeleteOpen(true);
  };

  // Single Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!selectedCode) return;
    setFormSubmitting(true);
    try {
      await deleteAccessCode(selectedCode.id);
      setIsDeleteOpen(false);
      loadData();
    } catch (err: any) {
      alert(`${t("Failed to delete access code")}: ${err.message}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // ── Bulk selection actions ─────────────────────────────────────
  const handleActivateSelected = async () => {
    const targets = accessCodes.filter((item) => selectedIds.has(item.id) && !item.active);
    if (targets.length === 0) { alert(t("All selected codes are already active.")); return; }
    setBulkSubmitting(true);
    try {
      await Promise.all(targets.map((item) => updateAccessCodePatch(item.id, { active: true })));
      loadData();
    } catch (err: any) {
      alert(`${t("Failed to activate")}: ${err.message}`);
    } finally {
      setBulkSubmitting(false);
    }
  };

  const handleDeactivateSelected = async () => {
    const targets = accessCodes.filter((item) => selectedIds.has(item.id) && item.active);
    if (targets.length === 0) { alert(t("All selected codes are already inactive.")); return; }
    setBulkSubmitting(true);
    try {
      await Promise.all(targets.map((item) => updateAccessCodePatch(item.id, { active: false })));
      loadData();
    } catch (err: any) {
      alert(`${t("Failed to deactivate")}: ${err.message}`);
    } finally {
      setBulkSubmitting(false);
    }
  };

  const handleDeleteSelectedConfirm = async () => {
    setBulkSubmitting(true);
    try {
      await Promise.all(Array.from(selectedIds).map((id) => deleteAccessCode(id)));
      setIsDeleteSelectedOpen(false);
      loadData();
    } catch (err: any) {
      alert(`${t("Failed to delete selected codes")}: ${err.message}`);
    } finally {
      setBulkSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle={t("Access Codes Management")} />

      <ComponentCard title={t("Access Codes Overview")}>
        {/* Top Controls */}
        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-gray-800 rounded-xl w-fit border border-slate-200/60 dark:border-gray-700/60">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === "all"
                  ? "bg-white dark:bg-gray-700 text-[var(--color-primary)] shadow-2xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("All")}
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === "active"
                  ? "bg-white dark:bg-gray-700 text-[var(--color-primary)] shadow-2xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("Active")}
            </button>
            <button
              onClick={() => setFilterStatus("inactive")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                filterStatus === "inactive"
                  ? "bg-white dark:bg-gray-700 text-[var(--color-primary)] shadow-2xs"
                  : "text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {t("Inactive")}
            </button>
          </div>

          {/* Actions toolbar */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleActivateSelected}
              disabled={!hasSelection || bulkSubmitting}
              className="inline-flex items-center justify-center font-semibold gap-2 rounded-xl px-4 py-2.5 text-sm bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <CheckLineIcon className="w-4 h-4" />
              {hasSelection ? `${t("Activate")} (${selectedIds.size})` : t("Activate")}
            </button>

            <button
              type="button"
              onClick={handleDeactivateSelected}
              disabled={!hasSelection || bulkSubmitting}
              className="inline-flex items-center justify-center font-semibold gap-2 rounded-xl px-4 py-2.5 text-sm bg-amber-500 text-white shadow-xs hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <CloseLineIcon className="w-4 h-4" />
              {hasSelection ? `${t("Deactivate")} (${selectedIds.size})` : t("Deactivate")}
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteSelectedOpen(true)}
              disabled={!hasSelection || bulkSubmitting}
              className="inline-flex items-center justify-center font-semibold gap-2 rounded-xl px-4 py-2.5 text-sm bg-rose-600 text-white shadow-xs hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <TrashBinIcon className="w-4 h-4" />
              {hasSelection ? `${t("Delete")} (${selectedIds.size})` : t("Delete")}
            </button>

            <Button onClick={handleOpenCreate} startIcon={<PlusIcon className="w-4 h-4" />}>
              {t("Generate Access Code")}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 mb-4 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-xl dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Table / Loading State */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 dark:text-gray-400">
            {t("Loading access codes...")}
          </div>
        ) : accessCodes.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-gray-400">
            {t("No access codes found.")}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-gray-800">
            <Table>
              <TableHeader className="border-b border-slate-200/80 dark:border-gray-800 bg-slate-50/80 dark:bg-gray-800/60">
                <TableRow>
                  {/* Select-all checkbox */}
                  <TableCell isHeader className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => { if (el) el.indeterminate = isIndeterminate; }}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                      aria-label={t("Select all")}
                    />
                  </TableCell>
                  <TableCell isHeader className={`py-3.5 px-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-semibold text-slate-500 uppercase tracking-wider`}>
                    {t("ID")}
                  </TableCell>
                  <TableCell isHeader className={`py-3.5 px-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-semibold text-slate-500 uppercase tracking-wider`}>
                    {t("Code")}
                  </TableCell>
                  <TableCell isHeader className={`py-3.5 px-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-semibold text-slate-500 uppercase tracking-wider`}>
                    {t("Status")}
                  </TableCell>
                  <TableCell isHeader className={`py-3.5 px-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-semibold text-slate-500 uppercase tracking-wider`}>
                    {t("Date Created")}
                  </TableCell>
                  <TableCell isHeader className={`py-3.5 px-4 ${isRTL ? 'text-right' : 'text-left'} text-xs font-semibold text-slate-500 uppercase tracking-wider`}>
                    {t("Actions")}
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100 dark:divide-gray-800">
                {accessCodes.map((item) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-gray-800/50 transition-colors ${
                      selectedIds.has(item.id) ? "bg-[var(--color-primary)]/10 dark:bg-brand-900/10" : ""
                    }`}
                  >
                    <TableCell className="py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(item.id)}
                        onChange={() => toggleSelectOne(item.id)}
                        className="w-4 h-4 rounded border-slate-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                        aria-label={`Select row ${item.id}`}
                      />
                    </TableCell>
                    <TableCell className={`py-3 px-4 text-sm font-semibold text-slate-900 dark:text-white ${isRTL ? 'text-right' : 'text-left'}`}>
                      #{item.id}
                    </TableCell>
                    <TableCell
                      onClick={() => handleCopyCode(item.id, item.code)}
                      className={`py-3 px-4 text-sm font-mono font-semibold text-[var(--color-primary)] dark:text-brand-400 cursor-pointer hover:underline select-all ${isRTL ? 'text-right' : 'text-left'}`}
                      title={t("Click to copy code")}
                    >
                      {item.code}
                    </TableCell>
                    <TableCell className={`py-3 px-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                      <Badge color={item.active ? "success" : "error"} variant="light">
                        {item.active ? t("Active") : t("Inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className={`py-3 px-4 text-sm text-slate-600 dark:text-gray-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                      {item.date_created ? formatDate(item.date_created, isRTL) : "-"}
                    </TableCell>
                    <TableCell className={`py-3 px-4 text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center justify-start gap-2">
                        {/* Copy Code Button */}
                        <button
                          onClick={() => handleCopyCode(item.id, item.code)}
                          title={copiedId === item.id ? t("Copied!") : t("Copy Code")}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            copiedId === item.id
                              ? "bg-success-100 text-success-600 dark:bg-success-900/40 dark:text-success-400"
                              : "text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                          }`}
                        >
                          {copiedId === item.id ? (
                            <CheckLineIcon className="w-5 h-5" />
                          ) : (
                            <CopyIcon className="w-5 h-5" />
                          )}
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(item)}
                          title={item.active ? t("Deactivate Code") : t("Activate Code")}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            item.active
                              ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                              : "text-green-600 hover:bg-green-50 dark:hover:bg-green-950/40"
                          }`}
                        >
                          {item.active ? <CloseLineIcon className="w-5 h-5" /> : <CheckLineIcon className="w-5 h-5" />}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleOpenDelete(item)}
                          title={t("Delete Code")}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                        >
                          <TrashBinIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ComponentCard>

      {/* ── CREATE MODAL ─────────────────────────────────────────── */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} className="max-w-md w-full" showCloseButton={false}>
        <div className="p-6 w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {t("Generate Access Codes")}
          </h3>
          <p className="text-xs text-gray-500 mb-4 text-center">
            {t("Enter the number of access codes you want to generate.")}
          </p>

          {formError && (
            <div className="p-3 mb-4 text-xs text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              {formError}
            </div>
          )}

          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
                {t("Number of Codes to Generate")}
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={generateQuantity}
                onChange={(e) => setGenerateQuantity(parseInt(e.target.value, 10) || 1)}
                className="w-full px-4 py-2.5 text-center text-lg font-semibold border border-gray-300 rounded-xl dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                {t("Cancel")}
              </Button>
              <Button disabled={formSubmitting}>
                {formSubmitting
                  ? t("Generating...")
                  : `${t("Generate Access Code")} (${generateQuantity})`}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── EDIT MODAL ───────────────────────────────────────────── */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} className="max-w-md w-full" showCloseButton={false}>
        <div className="p-6 w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {t("Update Access Code")} #{selectedCode?.id}
          </h3>
          <p className="text-xs font-mono text-brand-600 mb-4 truncate text-center">
            {selectedCode?.code}
          </p>

          {formError && (
            <div className="p-3 mb-4 text-xs text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400">
              {formError}
            </div>
          )}

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="flex items-center justify-center gap-2 py-2">
              <input
                type="checkbox"
                id="edit_active"
                checked={activeFormValue}
                onChange={(e) => setActiveFormValue(e.target.checked)}
                className="w-4 h-4 text-brand-500 rounded border-gray-300"
              />
              <label htmlFor="edit_active" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("Active")}
              </label>
            </div>

            <div className="flex justify-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                {t("Cancel")}
              </Button>
              <Button disabled={formSubmitting}>
                {formSubmitting ? t("Saving...") : t("Save Changes")}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── DETAIL MODAL ─────────────────────────────────────────── */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} className="max-w-md w-full" showCloseButton={false}>
        <div className="p-6 w-full">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t("Access Code Details")}
          </h3>

          {selectedCode && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="font-medium text-gray-500">{t("ID")}:</span>
                <span className="text-gray-900 dark:text-white">{selectedCode.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="font-medium text-gray-500">{t("Code")}:</span>
                <span className="font-mono font-bold text-brand-600 select-all">{selectedCode.code}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="font-medium text-gray-500">{t("Status")}:</span>
                <Badge color={selectedCode.active ? "success" : "error"}>
                  {selectedCode.active ? t("Active") : t("Inactive")}
                </Badge>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="font-medium text-gray-500">{t("Date Created")}:</span>
                <span className="text-gray-900 dark:text-white">
                  {selectedCode.date_created ? formatDate(selectedCode.date_created, isRTL) : "-"}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-5 mt-4 border-t border-gray-200 dark:border-gray-800">
            <Button onClick={() => setIsDetailOpen(false)}>{t("Close")}</Button>
          </div>
        </div>
      </Modal>

      {/* ── DELETE MODAL (single) ────────────────────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="max-w-md w-full" showCloseButton={false}>
        <div className="p-6 w-full text-center">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            {t("Confirm Delete")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {t("Are you sure you want to delete access code")}{" "}
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              &ldquo;{selectedCode?.code}&rdquo;
            </span>
            ?
          </p>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteConfirm}
              disabled={formSubmitting}
            >
              {formSubmitting ? t("Deleting...") : t("Delete")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── DELETE SELECTED MODAL ────────────────────────────────── */}
      <Modal isOpen={isDeleteSelectedOpen} onClose={() => setIsDeleteSelectedOpen(false)} className="max-w-md w-full" showCloseButton={false}>
        <div className="p-6 w-full text-center">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            {t("Confirm Delete")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {t("Are you sure you want to delete")}{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedIds.size} {t("selected")} {t("access code(s)")}
            </span>
            ? {t("This action cannot be undone.")}
          </p>

          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => setIsDeleteSelectedOpen(false)}>
              {t("Cancel")}
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteSelectedConfirm}
              disabled={bulkSubmitting}
            >
              {bulkSubmitting
                ? t("Deleting...")
                : `${t("Delete")} ${selectedIds.size} ${t("Code")}`}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
