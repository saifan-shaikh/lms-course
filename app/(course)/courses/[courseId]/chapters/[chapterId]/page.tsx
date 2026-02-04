import React from "react";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { auth } from "@clerk/nextjs/server";
import getChapter from "@/actions/get-chapter";

import { Banner } from "@/components/banner";
import { Separator } from "@/components/ui/separator";

import VideoPlayer from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import CourseProgressButton from "./_components/course-progress-button";

interface ChapterIdPageProps {
  params: {
    courseId: string;
    chapterId: string;
  };
}

const ChapterIdPage = async ({
  params: { courseId, chapterId },
}: ChapterIdPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {
    course,
    chapter,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    courseId,
    chapterId,
  });

  if (!chapter || !course) {
    return redirect("/");
  }

  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  // return statement
  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          label={"You already completed this chapter"}
          variant={"success"}
        />
      )}
      {isLocked && (
        <Banner
          label={
            "You need to puchase this course to see the content of this chapter"
          }
          variant={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapter.id}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId as string}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase && (
              <CourseProgressButton
                chapterId={chapter.id}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            )}
            {!purchase && (
              <CourseEnrollButton courseId={courseId} price={course.price!} />
            )}
          </div>
          <Separator />
          <div>
            <p className="p-2">{chapter.description}</p>
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    className="flex items-center w-full p-3 bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
