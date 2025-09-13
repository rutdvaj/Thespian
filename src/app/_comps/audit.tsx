"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useAuditLogStore } from "../_store/auditstore";
import { UUID } from "crypto";

interface AuditLog {
  file_name: string;
  id?: UUID;
  mime_type: string;
  size?: string;
}

export function AuditLogSidebar() {
  const supabase = createClient();
  const refreshTag = useAuditLogStore((s) => s.refreshTag);
  const [docs, setDocs] = useState<AuditLog[]>([]);

  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("file_name, mime_type, id, size")
      .limit(10);

    if (error) {
      console.error("Error fetching documents:", error.message);
      setDocs([]);
    } else {
      setDocs(data ?? []);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, [refreshTag]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {docs.map((doc) => (
        <div
          key={doc.id as string}
          className="flex items-center justify-between h-12 w-full rounded-lg bg-muted/50 px-4"
        >
          {/* Left side: file details */}
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate">
              {doc.file_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {doc.mime_type}
            </span>
          </div>

          {/* Right side: size or timestamp */}
          <div className="flex flex-col items-end text-xs text-gray-500">
            {doc.size && <span>{Math.round(Number(doc.size) / 1024)} KB</span>}
          </div>
        </div>
      ))}

      {/* If no logs */}
      {docs.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-4">
          No audit logs found.
        </div>
      )}
    </div>
  );
}
