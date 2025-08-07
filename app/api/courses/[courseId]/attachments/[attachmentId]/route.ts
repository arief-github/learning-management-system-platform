import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { UTApi } from "uploadthing/server";
import { success } from "zod";

export async function DELETE(req: Request, { params }: { params: { courseId: string, attachmentId: string } }) {
    try {
        const { userId } = auth();
        const utApi = new UTApi();
  
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: { id: params.courseId, userId }
        });

        if(!courseOwner) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const attachment = await db.attachment.findUnique({
            where: {
                id: params.attachmentId,
            }
        }); 

        if(!attachment) {
            return new NextResponse("Attachment not found", { status: 404 });
        }

        const fileUrl = attachment.url;
        const fileKey = fileUrl.split('/').pop();

        if (fileKey) {
            await utApi.deleteFiles([fileKey]);
            console.log("File deleted from Uploadthing:", fileKey);
        }
        
        await db.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId,
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("[Attachment DELETE Error]:", error);
        
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}