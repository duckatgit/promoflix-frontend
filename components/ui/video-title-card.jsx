import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getFormatedDate } from "@/lib/utils";

function VideoTitleCard({
  title,
  id,
  getVideo,
  deleteInstance,
  updateInstance,
  setupdateInstanceModal,
  setUpdatedInstanceID,
  locked,
  thumbnail,
  created_at,
}) {
  const router = useRouter();

  return (
    <>
      <div
        className="max-w-sm cursor-pointer  min-w-[311px] bg-white border border-slate-200 rounded-lg p-4 h-[216px] "
        onClick={(e) => {
          e.stopPropagation();
          if (locked) {
            router.push(`/home/video/generate?id=${id}`);
          } else {
            getVideo(id);
          }
        }}
      >
        <div className="flex justify-between items-center ">
          <p className=" text-lg font-semibold text-[#333333]">{title}</p>
          <div>
            <button
              className="text-[#B4B4B4] hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                setupdateInstanceModal(true),
                  setUpdatedInstanceID(id),
                  updateInstance(title);
              }}
            >
              <TbEdit size={20} />
            </button>
            {!locked && (
              <button
                className="text-red-500 hover:text-red-600 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteInstance(id);
                }}
              >
                <RiDeleteBin6Line size={20} />
              </button>
            )}
          </div>
        </div>
        {/* <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-[#B4B4B4]">{title}</h3>
      </div> */}

        {/* <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-3">
                    <h4 className="text-sm font-medium text-[#B4B4B4]">Variable<br /> Selected</h4>
                    <p className="text-2xl font-normal text-[#333333]">28</p>
                </div>
                <div className="flex gap-3">
                    <h4 className="text-sm font-medium text-[#B4B4B4]">No. Of<br /> Recipients</h4>
                    <p className="text-2xl font-normal text-[#333333]">50</p>
                </div>
            </div> */}
        {thumbnail && (
          <Image
            src={thumbnail}
            width={280}
            height={100}
            className="rounded-[8px] mt-2"
            style={{ height: "130px", objectFit: "cover" }}
            alt="thumbnail"
          />
        )}
        {thumbnail === null && (
          <div
            className={`relative mt-2  cursor-pointer border-2 border-dashed border-gray-300 rounded-[10px] px-[16px] py-[20px] text-center h-[130px]`}
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="text-orange-500 text-4xl">
                <img src="/assets/bx_image-add.png" alt="upload icon" />
              </div>
              {/* Upload Instructions */}
              <p className="text-sm font-medium text-gray-700">
                Upload Data, or{" "}
                <span className="text-orange-500 cursor-pointer">Browse</span>
              </p>
              <p className="text-xs text-gray-500">
                Maximum File size is 100 mb
              </p>
            </div>
          </div>
        )}

        <p className="text-gray-500 text-[10px] mt-2">
          Created at : {getFormatedDate(created_at)}
        </p>
      </div>
    </>
  );
}

export default VideoTitleCard;
