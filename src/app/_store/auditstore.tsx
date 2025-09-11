import { create } from "zustand";

export type AuditEventType = "upload" | "download" | "delete";

export type AuditEvent = {
  id: string;
  type: AuditEventType;
  documentName: string;
  timestamp: string; // ISO string
};

type AuditLogState = {
  logs: AuditEvent[];
  refreshTag: boolean;

  // 🔹 Getters
  getLogs: () => AuditEvent[];
  getRefreshTag: () => boolean;

  // 🔹 Setters
  addLog: (event: AuditEvent) => void;
  clearLogs: () => void;
  toggleRefresh: () => void;
  resetRefresh: () => void;

  // 🔹 Helpers
  logUpload: (documentName: string) => void;
  logDownload: (documentName: string) => void;
  logDelete: (documentName: string) => void;
};

export const useAuditLogStore = create<AuditLogState>((set, get) => ({
  logs: [],
  refreshTag: false,

  // 👉 Getters
  getLogs: () => get().logs,
  getRefreshTag: () => get().refreshTag,

  // 👉 Setters
  addLog: (event) =>
    set((state) => ({
      logs: [event, ...state.logs], // prepend new logs (latest first)
    })),

  clearLogs: () => set({ logs: [] }),

  toggleRefresh: () => set((state) => ({ refreshTag: !state.refreshTag })),

  resetRefresh: () => set({ refreshTag: false }),

  // 👉 Helpers
  logUpload: (documentName) => {
    get().addLog({
      id: crypto.randomUUID(),
      type: "upload",
      documentName,
      timestamp: new Date().toISOString(),
    });
    get().toggleRefresh(); // 🔹 trigger refresh after upload
  },

  logDownload: (documentName) => {
    get().addLog({
      id: crypto.randomUUID(),
      type: "download",
      documentName,
      timestamp: new Date().toISOString(),
    });
    get().toggleRefresh(); // 🔹 trigger refresh after download
  },

  logDelete: (documentName) => {
    get().addLog({
      id: crypto.randomUUID(),
      type: "delete",
      documentName,
      timestamp: new Date().toISOString(),
    });
    get().toggleRefresh(); // 🔹 trigger refresh after delete
  },
}));
