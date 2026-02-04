"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";

type CourseProgressButtonProps = {
  chapterId: string;
  courseId: string;
  isCompleted?: boolean;
  nextChapterId?: string;
};

// main component
const CourseProgressButton = (props: CourseProgressButtonProps) => {
  // destructure props
  const { chapterId, courseId, isCompleted, nextChapterId } = props;

  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      // Simulate API call
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
        isCompleted: !isCompleted,
      })

      if (!isCompleted && !nextChapterId) {
        // Mark as not completed
        confetti.onOpen()
      }
      if(!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
      }

      toast.success("Progress Updated!");
      router.refresh();
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const Icon = isCompleted ? XCircle : CheckCircle;

  // return statement
  return (
    <Button
      className="w-full md:w-auto"
      disabled={isLoading}
      onClick={onClick}
      size="sm"
      variant={isCompleted ? "outline" : "success"}
      type="button"
    >
      {isCompleted ? "Not Completed" : "Mark as Complete"}
      <Icon className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default CourseProgressButton;
