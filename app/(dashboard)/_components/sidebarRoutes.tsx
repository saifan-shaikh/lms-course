"use client";

import React from "react";
import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarItem from "./sidebarItem";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

// main Component
const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes("/teacher");

  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  // return Statement
  return (
    <div className={"flex flex-col w-full"}>
      {routes.map((route) => {
        return (
          <SidebarItem
            icon={route.icon}
            href={route.href}
            key={route.href}
            label={route.label}
          />
        );
      })}
    </div>
  );
};

export default SidebarRoutes;
