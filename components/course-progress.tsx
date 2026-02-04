import React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type CourseProgressProps = {
  size?: "default" | "sm";
  value: number;
  variant?: "success" | "default";
};

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

// main component
const CourseProgress = (props: CourseProgressProps) => {
  // props declaration
  const { size, value, variant } = props;

  return <div>
    <Progress className="h-2" value={value} variant={variant}/>
    <p className={cn(
      "font-medium mt-2",
      colorByVariant[variant || "default"],
      sizeByVariant[size || "default"]
    )}>
      {Math.round(value)}% Complete
    </p>
  </div>;
};

export default CourseProgress;
