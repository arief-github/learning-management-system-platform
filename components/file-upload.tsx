"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({ onChange, endpoint}: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                console.log("Upload complete:", res);
                if (res && res[0] && res[0].url) {
                    onChange(res[0].url);
                } else {
                    toast.error("Upload failed: No URL returned.");
                }
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`);
            }}
        />
    )
}