"use client"

import * as z from "zod";
import { useState } from "react";
import { Pencil, PlusCircle,  ImageIcon, File, Loader2, X } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Attachment, Course } from '@prisma/client'
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import axios from "axios";
import { utapi } from "uploadthing/server";

// setup type-safe for props handling
interface AttachmentFormProps {
    initialData: Course & { attachments: Attachment[] };   
    courseId: string; 
}

const formSchema = z.object({
    url: z.string().min(1)
})

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const toggleEdit = () => setIsEditing((current) => !current)

    const router = useRouter();

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/attachments`,values)
            toast.success("Attachment added successfully");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("Failed to add attachment");
        }
    }

    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted successfully");   
            router.refresh();
        } catch {
            toast.error("Failed to delete attachment");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    { isEditing ? (<>Cancel</>) : null }
                    {
                        !isEditing ? (
                            <>
                                <PlusCircle className="h-4 w-4 mr-2"/>
                                Add a File
                            </>
                        ) : null
                    }
                </Button>
            </div>
            {
                !isEditing ? (
                    <>
                        {initialData.attachments.length === 0 && (
                            <p className="text-sm mt-2 text-slate-500 italic">
                                No attachments yet
                            </p>
                        )}
                        {
                            initialData.attachments.length > 0 && (
                                <div className="space-y-2">
                                    {initialData.attachments.map((attachment) => (
                                        <div
                                            key={attachment.id}
                                            className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                                        >
                                            <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                            <p className="text-xs line-clamp-1">
                                                {attachment.name}
                                            </p>
                                            {deletingId === attachment.id ? (
                                                <> <Loader2 className="h-4 w-4 animate-spin"/> </>
                                            ) : null}
                                            { deletingId !== attachment.id ? (
                                                <button
                                                    onClick={() => onDelete(attachment.id)}
                                                    className="ml-auto hover:opacity-75 transition"
                                                >
                                                    <X className="h-4 w-4"/>
                                                </button>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ) 
                        }
                    </>
                ) : null
            }
            {
                isEditing ? (
                    <>
                        <FileUpload
                            endpoint="courseAttachment"
                            onChange={(url) => {
                                if(url) {
                                    onSubmit({ url });
                                }
                            }}
                        />
                        <div className="text-xs text-muted-foreground mt-4">
                            Add anyting your students might need to access, such as lecture notes, assignments, or resources. to complete the course.
                        </div>
                    </>
                ) : null
            }
        </div>
    )
}