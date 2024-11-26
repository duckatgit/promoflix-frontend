"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import VideoTitleCard from "@/components/ui/video-title-card";

const InstancePage = () => {

    return (
        <>
            <div className="border border-slate-300 w-68 h-72 rounded-lg shadow-sm bg-white">
                <div className="flex text-start p-2 border border-b-1">
                    <h1 className="text-lg font-semibold text-gray-700">Upload File</h1>
                </div>
                <div className="flex flex-col p-2 gap-3">
                    {/* Video Title Input */}
                    <div>
                        <Input
                            id="video-title"
                            placeholder="Video Title"
                            className="w-full  border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    {/* Upload Section */}
                    <div
                        className=" w-full flex items-center justify-center hover:border-orange-500 cursor-pointer"
                    >
                        <img
                            src="/assets/upload-pic.png"
                            alt="Upload placeholder"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <VideoTitleCard />
                <VideoTitleCard />
                <VideoTitleCard />
                <VideoTitleCard />
                <VideoTitleCard />
                <VideoTitleCard />

            </div>
        </>);
};

export default InstancePage;
