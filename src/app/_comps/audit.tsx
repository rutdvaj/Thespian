"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
} from "../../components/ui/sidebar";
import { useAuditLogStore } from "../_store/auditstore";
import { UUID } from "crypto";

// 🔹 Define the structure of each document row
interface AuditLog {
  file_name: string;
  mime_type: string;
  created_at: string; // ISO string from Supabase
  size?: string;
  id?: UUID;
}

export function AuditLogSidebar() {
  const supabase = createClient();
  const refreshTag = useAuditLogStore((s) => s.refreshTag);
  const [docs, setDocs] = useState<AuditLog[]>([]);

  // 🔹 Fetch function
  async function fetchDocuments() {
    const { data, error } = await supabase
      .from("documents")
      .select("file_name, mime_type,id")
      .order("size", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error.message);
      setDocs([]);
    } else {
      setDocs((data as AuditLog[]) ?? []);
      console.log("data:", data);
    }
  }

  // 🔹 Re-fetch when refreshTag changes
  useEffect(() => {
    // if (!refreshTag) return;
    console.log("component mounted");
    fetchDocuments();
  }, [refreshTag]);

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        {docs.map((doc) => (
          <a key={`${doc.id}`} className="...">
            <div className="flex flex-col w-full items-center gap-2"></div>
            <div className="flex flex-col w-full items-center gap-2">
              <span>{doc.file_name}</span>
              <span>{doc.mime_type}</span>
            </div>
          </a>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
