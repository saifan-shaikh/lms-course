"use client";
import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthings";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (ufsUrl?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={ res => {
        onChange( res?.[0].ufsUrl);
      }}
      onUploadError={ (error: Error) => {
        toast.error(`Upload failed: ${error?.message}`)
      }}
    />
);
};
