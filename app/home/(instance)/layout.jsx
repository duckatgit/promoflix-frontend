"use client";

import Header from "@/app/auth/header/page";
import Sidebar from "@/components/ui/sidebar";
import React from "react";

export default function Layout({ children }) {
    return (
        <div className="bg-[#edeef2]">
            <div className=""><Header /></div>
            <div className="flex gap-5 mx-8 my-4  ">
                <Sidebar />
                {children}
            </div>

        </div>
    );
}
