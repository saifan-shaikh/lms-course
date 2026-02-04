"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

import SearchInput from "./seacrh-input";

import { isTeacher } from "@/lib/teacher";

// main component
const NavbarRoutes = () => {
  const {userId} = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/courses");
  const isSearchPage = pathname === "/search";

  // return statement
  return (
    <>
    { isSearchPage && (
      <div className="md:block hidden">
        <SearchInput />
      </div>
    )}
      <div className={"flex gap-x-2 ml-auto"}>
        {isTeacherPage || isPlayerPage ? (
          <Link href={"/"}>
            <Button size={"sm"} variant={"ghost"}>
              <LogOut className={"h-4 w-4 mr-2"} />
              Exit
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={"/teacher/courses"}>
            <Button size={"sm"} variant={"ghost"}>
              Teacher Mode
            </Button>
          </Link>
        ) : null}
        <UserButton />
      </div>
    </>
  );
};

export default NavbarRoutes;
