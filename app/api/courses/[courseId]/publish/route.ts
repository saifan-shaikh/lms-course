import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { courseId } = await params;
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return new NextResponse("Course not found.", { status: 404 });
    }

    const hasPublishedChapters = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    // if( !course.title || !course.description || course.categoryId || course.imageUrl || !hasPublishedChapters )

    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !hasPublishedChapters
    ) {
      return new NextResponse(
        "Course cannot be published. Please make sure all required fields are filled and at least one chapter is published.",
        { status: 400 }
      );
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_PUBLISH_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
