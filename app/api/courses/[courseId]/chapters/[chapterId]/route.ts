import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";

const clientVideo = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
});

// DELETE /api/courses/:courseId/chapters/:chapterId
export const DELETE = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const {userId} = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if(!courseOwner) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
    });
    if(!chapter) {
      return new NextResponse("Chapter Not Found", {status: 404}); 
    };

    if(chapter.videoUrl) {
      const exoistingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        },
      });
      if(exoistingMuxData) {
        await clientVideo.video.assets.delete(exoistingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: exoistingMuxData.id,
          },
        });
      };
    }

    const deletedChapter = await db.chapter.delete({
      where:{
        id: params.chapterId,
      },
    })

    const publishedChaptersInCourse = await db.chapter.findMany({
      where:{
        courseId:params.courseId,
        isPublished: true,
      },
    });

    if(!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data:{
          isPublished: false,
        }
      })
    }

    return NextResponse.json(deletedChapter);
  } catch (error) {
    console.log("[CHAPTER_ID_DELETE]:", error);
    return new NextResponse("Internal Server Error", {status: 500})
  }
}

// PATCH /api/courses/:courseId/chapters/:chapterId
export const PATCH = async (
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if(!courseOwner) {
      return new NextResponse("Unauthorized", {status: 401});
    }

    const {isPublished, ...values} = await req.json();
    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      }
    });

    // TODO: handle Video Upload
    if(values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where:{
          chapterId: params.chapterId,
        }
      });

      if(existingMuxData){
        await clientVideo.video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where:{
            id: existingMuxData.id,
          }
        });
      }

      const asset = await clientVideo.video.assets.create({
        inputs:[values.videoUrl],
        playback_policies: ["public"],
        test: false,
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id
        }
      });
    }

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTERS_PATCH]:", error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
};
