"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { UploadedFile } from "@/lib/types/general.types";

const uploadFilesToCloudinary = async (files: File[]) => {
  const uploadedResults: { url: string }[] = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/cloudinary/upload/single", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || "Upload failed");
    uploadedResults.push({ url: result.url });
  }

  return uploadedResults;
};

export const CloudinaryUploader = React.forwardRef<
  UploadedFile[],
  {
    isSubmitting: boolean;
    accept?: boolean;
  }
>(({ isSubmitting, accept = true }, ref) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const results = await uploadFilesToCloudinary(acceptedFiles);

      setFiles((prev) => [
        ...prev,
        ...acceptedFiles.map((file, i) => ({
          file,
          preview: URL.createObjectURL(file),
          uploadedUrl: results[i]?.url,
          fileName: file.name,
        })),
      ]);
    } catch (err) {
      console.error("Cloudinary upload error:", err);
    }
  }, []);

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (ref && typeof ref !== "function") {
      ref.current = files;
    }
  }, [files, ref]);

  let acceptedFiles;
  if (accept) {
    acceptedFiles = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    };
  } else {
    acceptedFiles = {
      "application/pdf": [".pdf"],
      "application/msword": [".doc", ".docx"],
      "text/plain": [".txt"],
    };
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFiles,
    multiple: true,
  });

  return (
    <Card className="p-4 space-y-4">
      <Label className="text-base">Upload Image</Label>
      <div
        {...getRootProps()}
        className={`border border-dashed border-zinc-300 dark:border-zinc-700 p-6 rounded-md text-center cursor-pointer transition-colors ${
          isDragActive
            ? "bg-zinc-100 dark:bg-zinc-800"
            : "bg-zinc-50 dark:bg-zinc-900"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Drag & drop files here, or click to select
        </p>
        <p className="text-xs text-zinc-400 mt-1">
          {accept ? "Accepted: images" : "Accepted: documents"}
        </p>
      </div>

      {files.length > 0 && (
        <CardContent className="space-y-2 max-h-60 overflow-y-auto">
          {files.map(({ file, uploadedUrl }, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex flex-col text-sm">
                <span className="font-medium">{file.name}</span>
                {uploadedUrl ? (
                  <a
                    href={uploadedUrl}
                    className="text-xs text-blue-600 dark:text-blue-400"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View File
                  </a>
                ) : (
                  <span className="text-xs text-zinc-400">Uploading...</span>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
});

CloudinaryUploader.displayName = "CloudinaryUploader";
