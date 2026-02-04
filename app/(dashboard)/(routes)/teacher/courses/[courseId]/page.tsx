import React from "react";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";

import { db } from "@/lib/db";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachment-form";
import ChapterForm from "./_components/chapters-form";
import { Banner } from "@/components/banner";
import CourseActions from "./_components/actions";

type Props = {
  params: {
    courseId: string;
  };
};
// { params: { courseId }
// This page is used to display the details of a specific course
const CourseIdPage = async (props: Props) => {
  //props declaration
  const { courseId } = await props.params;

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }
  // fetch course data from the database
  const course = await db.course.findUnique({
    where: {
      id: courseId,
      userId: userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  // fetch category data from the database
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    course.title,
    course.description,
    // course.imageUrl,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  // return statement
  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course Setup</h1>
            <span className="text-sm text-slate-700">
              Complete All Fields {completionText}
            </span>
          </div>
          {/* add actions */}
          <CourseActions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        {/* course grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 ">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} size={"sm"} />
              <h2 className="text-xl">Customize your Course</h2>
            </div>
            {/* title */}
            <TitleForm courseId={course.id} initialData={course} />
            {/* description */}
            <DescriptionForm courseId={course.id} initialData={course} />
            {/* ImageForm */}
            <ImageForm courseId={course.id} initialData={course} />
            {/* Category */}
            <CategoryForm
              courseId={course.id}
              initialData={course}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <ChapterForm courseId={course.id} initialData={course} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your couse</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
