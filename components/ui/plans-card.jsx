import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MdCheckCircleOutline } from "react-icons/md";
import { LoadingSpinner } from "./spinner";

const PlansCard = ({
  name,
  price,
  billing_period,
  extra_videos_cost,
  quantity,
  handleCheckoutPlan,
  plan_id,
  loading,
  userId,
}) => {
  console.log(name, "price");
  return (
    <div className="w-[270px] border rounded-[10px] border-[#D9D9D9]">
      <div className={`bg-[#FFFAF6] p-4 m-4`}>
        <p className="text-center text-[24px] font-medium mb-4">{name}</p>
        <p className="text-[#B3B3B3] ">
          {" "}
          <span className="text-4xl text-black font-bold">
            {" "}
            <sup className="text-[22px] text-black  right-[-10px] top-[-10px]">
              $
            </sup>{" "}
            {price}
          </span>{" "}
          / <span> {billing_period} </span>{" "}
        </p>
        <p className="text-[#B3B3B3] my-4">0/{quantity} used </p>
      </div>
      <div className="p-4 mx-8">
        <ul className="list-disc text-[#757575]">
          <li>Clone your face & voice</li>
          <li>{`${quantity} videos a month`}</li>
          <li>{`${extra_videos_cost}$ per extra video`}</li>
        </ul>
      </div>
      <div className="text-center p-4">
        <Button
          className={`py-2 px-3 cursor-pointer rounded-[8px] text-base w-[204px] ${
            name === "Free Plan"
              ? "bg-transparent text-[#E7680F] border border-[#E7680F]  "
              : ""
          }`}
          onClick={() => handleCheckoutPlan(plan_id)}
        >
          {loading && userId === plan_id ? (
            <>
              {name === "Free Plan" ? "Current" : "Get started"}
              <LoadingSpinner className="ml-2 text-white" />
            </>
          ) : name === "Free Plan" ? (
            "Current"
          ) : (
            "Buy"
          )}
        </Button>
      </div>
    </div>
  );
};

export default PlansCard;
