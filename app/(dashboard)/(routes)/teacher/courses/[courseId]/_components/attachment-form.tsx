"use client";

import React, { useState } from "react";

import * as z from "zod";
import axios from "axios";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";


import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formSchema = z.object({
  url: z.string().min(1),
});

// interface declaration
interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[]};
  courseId: string;
}

const AttachmentForm = (props: AttachmentFormProps) => {
  // props declaration
  const { initialData, courseId } = props;

  // state declaration
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const router = useRouter();

  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course Description Updated Successfully");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDeleteAttachment = async (attachmentId: string) => {
    try {
      setDeletingId(attachmentId);
      await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`);
      toast.success("Attachment deleted successfully");
      router.refresh();
    } catch{
      toast.error("Something went wrong while deleting the attachment");
    } finally{
      setDeletingId(null)
    }
  }

  // return statement
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Attachments
        <Button onClick={() => toggleEdit()} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (
          <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm mt-2 text-slate-500 italic">
              No attachments added yet.
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div className="space-y-2">
              {initialData.attachments.map( attachment => {
                return(
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-md"
                  >
                    <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                    <p className="text-xs line-clamp-1">{attachment.name}</p>
                    {deletingId === attachment.id && (
                      <div>
                        <Loader2 className="h-4 w-4 animate-spin"/>
                      </div>
                    )}
                    {deletingId !== attachment.id && (
                      <button
                        className="ml-auto hover:opacity-75 transition"
                        onClick={() => onDeleteAttachment(attachment.id)}
                      >
                        <X className="h-4 w-4"/>
                      </button>
                    )}
                  </div>
                )
              })}

            </div>
          )}
          </>
        )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={ url => {
              if(url) {
                onSubmit({ url: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add anything your students might need to complete the course.
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachmentForm;
