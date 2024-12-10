import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { FaRegClone } from "react-icons/fa6";
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
  getCloneInstance,
  sendMessage
}) {
  const router = useRouter();

  return (
    <>
      <div
        className="max-w-sm cursor-pointer  min-w-[311px] bg-white border border-slate-200 rounded-lg p-4 h-[380px] "
        onClick={(e) => {
          e.stopPropagation();
          if (locked) {
            // sendMessage(id)
            router.push(`/home/video/generated2?id=${id}`);
          } else {
            getVideo(id);
          }
        }}
      >
        <div className="flex justify-between items-center flex-wrap ">
          <p className=" text-lg font-semibold text-[#333333] mb-[8px] mr-[14px]">{title}</p>
          <div>
            {thumbnail && (
              <button
                className="text-[#B4B4B4] hover:text-gray-600 "
                onClick={(e) => {
                  e.stopPropagation();

                  getCloneInstance(id);
                }}
              >
                <FaRegClone size={18} />
              </button>
            )}

            <button
              className="text-[#B4B4B4] hover:text-gray-600 mx-2"
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
                className="text-red-500 hover:text-red-600 "
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

        {thumbnail && (
          <img
            src={thumbnail}
            className="rounded-[8px] mt-2"
            style={{ height: "80%", width: "100%", objectFit: "cover" }}
            alt="thumbnail"
          />
        )}
        {thumbnail === null && (
          <div
            className={`relative mt-2 h-[80%] cursor-pointer border-2 border-dashed border-gray-300 rounded-[10px] px-[16px] py-[20px] text-center `}
          >
            <div className="flex flex-col items-center justify-center space-y-2 h-full">
              <div className="text-orange-500 text-4xl">
                <img src="/assets/bx_image-add.png" alt="upload icon" />
              </div>
              {/* Upload Instructions */}
              <p className="text-sm font-medium text-gray-700">
              Upload <span className="text-orange-500">Original</span> Video, or{" "}
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
