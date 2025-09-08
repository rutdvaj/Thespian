"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createClient } from "../utils/supabase/client";
import { useUploadStore } from "../_store/uploadstore";

export function AlertDialogDemo() {
  const [file, setFile] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const supabase = createClient();

  const { setUploadSuccess } = useUploadStore.getState();
  // Handle file selection
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setSelectedFile(file || null);
  }

  // Handle upload on button click
  async function handleUpload() {
    try {
      setUploading(true);

      if (!selectedFile) {
        console.error("No file selected");
        return;
      }

      // Bucket = docs, Folder = testthesp
      const filePath = `testthesp/${Date.now()}-${selectedFile.name}`;

      // ---- File Upload Try-Catch ----
      let uploadedFileData;
      try {
        const { data, error } = await supabase.storage
          .from("docs") // bucket name
          .upload(filePath, selectedFile);

        if (error) {
          setUploadSuccess(false);
          console.error(
            "Upload error:",
            error.message,
            selectedFile,
            selectedFile?.size
          );
          return;
        } else {
          setUploadSuccess(true);
        }

        uploadedFileData = data;
        console.log("Uploaded file:", uploadedFileData);
        console.log(setUploadSuccess);
      } catch (uploadErr) {
        console.error("Unexpected upload error:", uploadErr);
        return;
      }

      // ---- Metadata Insert Try-Catch ----
      try {
        const { error: dbError } = await supabase.from("documents").insert([
          {
            file_name: file,
            file_path: filePath,
            mime_type: selectedTag,
            size: selectedFile.size,
          },
        ]);

        if (dbError) {
          console.error("Metadata insert error:", dbError.message);
        } else {
          console.log("Metadata saved successfully!");
        }
      } catch (dbErr) {
        console.error("Unexpected metadata insert error:", dbErr);
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Upload Document</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Upload your document</AlertDialogTitle>
        <div className="grid w-full max-w-sm items-center gap-3">
          <Label htmlFor="picture">Document</Label>
          <Input id="picture" type="file" onChange={handleFileSelect} />
        </div>
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input
            type="email"
            placeholder="File Name"
            onChange={(e) => setFile(e.target.value)}
          />
        </div>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Tags</SelectLabel>
              <SelectItem value="Identity & Personal">
                Identity & Personal
              </SelectItem>
              <SelectItem value="Address & Proof">Address & Proof</SelectItem>
              <SelectItem value="Education / Employment">
                Education / Employment
              </SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Travel">Travel</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="submit"
              variant="outline"
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
