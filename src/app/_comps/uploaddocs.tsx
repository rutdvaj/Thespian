"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "../utils/supabase/client";

export function InputFile() {
  const [uploading, setUploading] = useState(false);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    try {
      setUploading(true);

      const file = e.target.files?.[0];
      if (!file) return;

      // Bucket = docs, Folder = testthesp
      const filePath = `testthesp/${Date.now()}-${file.name}`;
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("docs") // bucket name
        .upload(filePath, file);

      if (error) {
        console.error("Upload error:", error.message, file, file?.size);
        return;
      }

      console.log("Uploaded file:", data);

      // Save metadata in a Postgres table
      const { error: dbError } = await supabase.from("documents").insert([
        {
          file_name: file.name,
          file_path: filePath,
          mime_type: file.type,
          size: file.size,
        },
      ]);

      if (dbError) console.error("Metadata insert error:", dbError.message);
      else console.log("Metadata saved successfully!");
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label htmlFor="doc-upload">Upload Documents</Label>
      <Input
        id="doc-upload"
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}
