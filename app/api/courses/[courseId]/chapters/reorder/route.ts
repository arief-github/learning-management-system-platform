import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { list } = await req.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId,
            }
        })

        if(!ownCourse) {
            return NextResponse.json({ error: "Course not found or you do not have permission to reorder chapters" }, { status: 404 });
        }

        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            });
        }

        return NextResponse.json({ message: "Chapters reordered successfully" }, { status: 200 });

    } catch(error) {
        return NextResponse.json({ error: "Failed to reorder chapters" }, { status: 500 });
    }
}
