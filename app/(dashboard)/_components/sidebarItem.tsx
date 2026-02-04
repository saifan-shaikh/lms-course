"use client";
import { LucideIcon } from "lucide-react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  href: string;
  label: string;
}

// main Component
const SidebarItem = ({ icon: Icon, href, label }: SidebarItemProps) => {
  const pathName = usePathname();
  const router = useRouter();

  const isActive =
    (pathName === "/" && href === "/") ||
    pathName === href ||
    pathName?.startsWith(`${href}/`);

  // return statement
  return (
    <button
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
      onClick={() => router.push(href)}
      type="button"
    >
      <div className={"flex items-center gap-x-2 py-4"}>
        <Icon
          className={cn("text-slate-500", isActive && "text-sky-700")}
          size={22}
        />
        {label}
      </div>
			<div className={cn(
				"ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
				isActive && "opacity-100"
			)}/>
    </button>
  );
};

export default SidebarItem;
