import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();
        const { title } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const courseOwner = await db.course.findFirst({
            where: {
                id: params.courseId,
                userId,
            },
        });

        if (!courseOwner) {
            return NextResponse.json({ error: "Course not found or you do not have permission to add chapters" }, { status: 404 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: { courseId: params.courseId },
            orderBy: { createdAt: "desc" },
        })

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition,
            }
        })

        return NextResponse.json(chapter, { status: 201 });
    } catch(error) {
        console.error("[CHAPTER] Error creating chapter:", error);
        return NextResponse.json({ error: "Failed to create chapter" }, { status: 500 });
    }
}