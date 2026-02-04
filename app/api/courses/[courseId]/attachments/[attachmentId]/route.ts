import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      }
    })
    if (!courseOwner){
      return new NextResponse("Forbidden", { status: 403 })
    }

    const attachment =  await db.attachment.delete({
      where: {
        id: params.attachmentId,
        courseId: params.courseId,
      }
    })
    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[COURSE_ID_ATTACHMENT_DELETE]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
