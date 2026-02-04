import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Mux from "@mux/mux-node";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const clientVideo = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    const { courseId } = await params;
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found.", { status: 404 });
    }
    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await clientVideo.video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSES_DELETE]:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
};

// PATCH /api/courses/:courseId
export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", {
        status: 401,
      });
    }
    const { courseId } = await params;
    
    const values = await req.json();

    console.log("patch request:", values);

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSES_PATCH]:", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}
