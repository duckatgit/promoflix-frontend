import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { MdCheckCircleOutline } from "react-icons/md";
import { LoadingSpinner } from "./spinner";

const PlansCard = ({ name, price, billing_period, extra_videos_cost, quantity, handleCheckoutPlan, plan_id, loading, userId }) => {

    return (
        <div className="flex flex-col  rounded-lg border-1 border-slate-500 shadow-md">
            <div className={`${name === "Free Plan" ? "bg-[#f3edff]" : "bg-[#e6f1fc]"} p-4`}>
                <p>{name}</p>
                <p>{`${price}$ /${billing_period}`}  </p>
                <p>0/{quantity} used  </p>

            </div>
            <div className="p-4">
                <p className="flex gap-1 items-center"><MdCheckCircleOutline className="text-[#8a4af3]" />Clone your face & voice </p>
                <p className="flex gap-1 items-center"><MdCheckCircleOutline className="text-[#8a4af3]" />{`${quantity} videos a month`} </p>
                <p className="flex gap-1 items-center"><MdCheckCircleOutline className="text-[#8a4af3]" />{`${extra_videos_cost}$ per extra video`}  </p>
            </div>
            <div className="text-center p-4">
                <Button
                    className="w-full rounded-full"
                    onClick={() => handleCheckoutPlan(plan_id)}
                    style={{ backgroundColor: name === "Free Plan" ? "#f3edff" : "#03a9f4", color: name === "Free Plan" ? "purple" : "white" }}
                >
                    {loading && userId === plan_id ? (
                        <>
                            {name === "Free Plan" ? "Current" : "Get started"}
                            <LoadingSpinner className="ml-2 text-white" />
                        </>
                    ) : (
                        name === "Free Plan" ? "Current" : "Get started"
                    )}
                </Button>

            </div>
        </div >
    );
};

export default PlansCard;
