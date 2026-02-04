import { createUploadthing, type FileRouter } from "uploadthing/next";

import { auth } from "@clerk/nextjs/server";

import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async () => {
  const { userId } = await auth();
  const isAuthorized = isTeacher(userId)
  if (!userId || !isAuthorized) {
    throw new Error("Unauthorized");
  }
  return { userId };
}; 


export const ourFileRouter = {
  // image
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(async () => await handleAuth())
  .onUploadComplete(() => {}),
  // attachments
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
  .middleware(async () => await handleAuth())
  .onUploadComplete(() => {}),
  // video
  chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
  .middleware(async () => await handleAuth())
  .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
