import { apiClient } from "./client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface BackupItem {
  name: string;
  size: number;
  size_formatted: string;
  modified: string;
}

export interface BackupListResponse {
  backups: BackupItem[];
  backup_dir: string;
}

export async function exportDatabaseApi(): Promise<void> {
  const url = `${API_BASE_URL}/api/backup/export/`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    let errMessage = "Failed to export database.";
    try {
      const err = await response.json();
      errMessage = err.error || err.detail || errMessage;
    } catch {
      // ignore
    }
    throw new Error(errMessage);
  }

  const blob = await response.blob();
  const disposition = response.headers.get("content-disposition");
  let filename = "backup.sql";
  if (disposition && disposition.indexOf("filename=") !== -1) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, "");
    }
  }

  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  a.remove();
}

export async function importDatabaseApi(file: File): Promise<{ status: string; message: string }> {
  const formData = new FormData();
  formData.append("backup_file", file);

  return apiClient<{ status: string; message: string }>("/api/backup/import/", {
    method: "POST",
    body: formData,
  });
}

export async function listDatabaseBackupsApi(): Promise<BackupListResponse> {
  return apiClient<BackupListResponse>("/api/backup/list/", {
    method: "GET",
  });
}

export async function triggerManualBackupApi(): Promise<{ status: string; message: string; filename?: string }> {
  return apiClient<{ status: string; message: string; filename?: string }>("/api/backup/list/", {
    method: "POST",
  });
}

export async function downloadBackupFileApi(filename: string): Promise<void> {
  const url = `${API_BASE_URL}/api/backup/download/${encodeURIComponent(filename)}/`;
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to download backup file: ${filename}`);
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  a.remove();
}
