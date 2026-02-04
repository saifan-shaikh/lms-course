"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import MuxPlayer from "@mux/mux-player-react";
import { string } from "zod";
import { on } from "events";

interface VideoPlayerProps {
  chapterId: string;
  title: string;
  courseId: string;
  nextChapterId?: string;
  playbackId: string;
  isLocked: boolean;
  completeOnEnd: boolean;
}

const VideoPlayer = ({
  chapterId,
  title,
  courseId,
  nextChapterId,
  playbackId,
  isLocked,
  completeOnEnd,
}: VideoPlayerProps) => {
  // state declarations
  const [isReady, setIsReady] = useState(false);

  const router = useRouter();
  const confetti = useConfettiStore();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });
      }

      if(!nextChapterId) {
        confetti.onOpen()
      }

      toast.success("Progress updated, Chapter completed!");
      router.refresh();

      if(nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }
    } catch (error){
      console.log(error);
      toast.error("Something went wrong. Please try again.");

    }
  }

  // return statement
  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2 className="h-8 w-8 animate-spin text-secondary " />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col gap-y-2 text-secondary items-center justify-center bg-slate-800">
          <Lock className="h-8 w-8" />
          <p className="text-small">This chapter is locked</p>
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          autoPlay
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          playbackId={ playbackId}
          title={title}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
