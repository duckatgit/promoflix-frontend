/* eslint-disable-next-line react/jsx-key */
"use client";
import PlansCard from "@/components/ui/plans-card";
import { useToast } from "@/hooks/use-toast";
import { deleteData, fetchData, postData } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
const AUTH_URL = process.env.NEXT_PUBLIC_VIDEO_API_AUTH_URL;
const HIRELLO_URL = process.env.NEXT_PUBLIC_VIDEO_API_HIRELLO_URL;
const Plans = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [quota, setQuota] = useState("");
  const [usedQuota, setUsedQuota] = useState(null);

  const [showLoader, setShowLoader] = useState(false);

  console.log(usedQuota, "oioioiioi");

  const fetchPlansApi = async () => {
    try {
      setShowLoader(true);
      const response = await fetchData("api/plan");
      if (response.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
        setShowLoader(false);
      } else {
        setPlansData(response.result);
        setShowLoader(false);
      }
    } catch (error) {
      setShowLoader(false);

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.result,
      });
    }
  };

  const fetchPlanQuata = async () => {
    try {
      const response = await fetchData("api/quota");
      if (response.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setQuota(response.result);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error?.result,
      });
    }
  };

  useEffect(() => {
    fetchPlansApi();
    fetchPlanQuata();
  }, []);

  const handleCheckoutPlan = async (id) => {
    try {
      setLoading(true);
      setUserId(id);
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_VIDEO_API_BASE_URL
          : AUTH_URL;

      const response = await postData("api/plan/plan_checkout", {
        cancel_url: `${baseUrl}/home/plan`,
        plan_id: id,
        success_url: `${baseUrl}/home/plan`,
      });
      if (response.code != 200) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setLoading(false);
        router.push(`${response.result}`);
      }
    } catch (error) {
      setLoading(false);
      alert(error.message);
    }
  };

  const cancelPlan = async () => {
    try {
      const data = await deleteData("api/plan", {},);
      if (data.code != 200) {
        toast({
          type: "error",
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        toast({
          type: "success",
          description: "Plan cancle sucessfully",
        });

        fetchPlansApi();
        fetchPlanQuata();
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Check if plan_id matches any id in the plans array
    const matchingPlan = plansData.find((plan) => plan.id === quota.plan_id);
    if (matchingPlan) {
      // If a match is found, update usedQuota with used_quota1
      setUsedQuota(quota.used_quota1);

    }
  }, [plansData, quota]);
  return (
    <>
      {showLoader && (
        <div className="flex left-0 absolute w-full top-0 bottom-0 justify-center bg-gray-300 bg-opacity-50 ">
          <Image
            src="/assets/tube-spinner.svg"
            alt="Logo"
            width={50}
            height={50}
          />
        </div>
      )}

      <div className="w-full h-full bg-white rounded-[10px] overflow-auto">
        <h2 className="mt-[64px] mb-[12px] text-center text-[40px] font-medium">
          Ready to get started?
        </h2>
        <p className="text-[#B3B3B3] mb-[50px] text-center">
          Choose a plan to tailor your needs
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {plansData.map((plan, id) => {
            const isHighlighted = plan.id === quota.plan_id;
            return (
              <div key={id}>
                {" "}
                <PlansCard
                  key={id}
                  usedQuota={usedQuota}
                  name={plan?.name}
                  price={plan?.price}
                  billing_period={plan?.billing_period}
                  extra_videos_cost={plan?.extra_videos_cost}
                  quantity={plan?.quota1}
                  handleCheckoutPlan={handleCheckoutPlan}
                  plan_id={plan?.id}
                  loading={loading}
                  userId={userId}
                  highlighted={isHighlighted}
                  cancelPlan={cancelPlan} // Updated spelling

                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Plans;
