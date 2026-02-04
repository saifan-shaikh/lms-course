import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export const PUT = async (
  req: Request,
  { params }: { params: { courseId: string } }
) => {
  try {
    const { userId } = await auth();
    if(!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    };

    const courseOwner = await db.course.findUnique({
      where: {
        userId: userId,
        id: params.courseId,
      },
    });
    if(!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { list } = await req.json();

    for(const item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data:{
          position: item.position,
        },
      })
    }
    
    return new NextResponse("Success", { status: 200 })

  } catch (error) {
    console.log("[CHAPTERS REORDER PUT]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
