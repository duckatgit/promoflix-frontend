import React from "react";
import { TbEdit } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
function VideoTitleCard({ title, id, deleteInstance, updateInstance, setupdateInstanceModal, setUpdatedInstanceID }) {
    return (
        <div className="max-w-sm mx-auto bg-white border border-slate-200 rounded-lg p-4 h-[200px] ">
            <div className="flex justify-end space-x-2">
                <button className="text-[#B4B4B4] hover:text-gray-600" onClick={() => { setupdateInstanceModal(true), setUpdatedInstanceID(id) }}>
                    <TbEdit size={20} />
                </button>
                <button className="text-red-500 hover:text-red-600" onClick={() => deleteInstance(id)}>
                    <RiDeleteBin6Line size={20} />
                </button>
            </div>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#B4B4B4]">{title}</h3>

            </div>
            <p className="mt-1 text-lg font-semibold text-[#333333]">
                An Exclusive AI-Generated Interview with Industry Experts
            </p>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-3">
                    <h4 className="text-sm font-medium text-[#B4B4B4]">Variable<br /> Selected</h4>
                    <p className="text-2xl font-normal text-[#333333]">28</p>
                </div>
                <div className="flex gap-3">
                    <h4 className="text-sm font-medium text-[#B4B4B4]">No. Of<br /> Recipients</h4>
                    <p className="text-2xl font-normal text-[#333333]">50</p>
                </div>
            </div>
        </div>
    );
}

export default VideoTitleCard;
