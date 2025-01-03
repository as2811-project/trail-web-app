"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";
import { uploadResume } from "@/app/actions/uploadResume";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadResume(formData);

    if (result.error) {
      setStatus("error");
      setMessage(result.error);
    } else {
      setStatus("success");
      setMessage("File uploaded successfully!");
      setFile(null);
    }

    setTimeout(() => {
      setStatus("idle");
      setMessage("");
    }, 3000);
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6 border border-transparent dark:shadow-lg dark:bg-stone-900 dark:shadow-lg">
      <div
        className={`relative border-2 border-dashed border-pink-500 rounded-lg p-8 text-center ${
          isDragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${!isDragging && "shadow-lg hover:shadow-none"}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="*/*"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className="h-12 w-12 text-muted-foreground" />
          </div>

          {file ? (
            <div className="flex items-center justify-between p-2 border rounded bg-muted/50">
              <span className="text-sm truncate max-w-[200px]">
                {file.name}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Drag and drop your file here, or{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => inputRef.current?.click()}
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-muted-foreground">
                  Upload your resume in PDF format
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-4">
          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={status === "uploading"}
          >
            {status === "uploading" ? "Uploading..." : "Upload File"}
          </Button>
        </div>
      )}

      {message && (
        <p
          className={`mt-4 text-sm text-center ${
            status === "error" ? "text-destructive" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </Card>
  );
}
