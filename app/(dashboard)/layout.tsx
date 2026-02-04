import React from "react";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <div className={"h-full"}>
        <div 
          className={"h-[80px] md:pl-56 fixed inset-y-0 w-full z-50"}
        >
          <Navbar />
        </div>
        <div
          className={"w-0 md:flex flex-col md:w-56 h-full fixed inset-y-0 z-50"}
        >
          <Sidebar />
        </div>
      </div>
      <main className={"md:pl-56 pt-[80px] h-full"}>{children}</main>
    </div>
  );
};

export default DashboardLayout;
