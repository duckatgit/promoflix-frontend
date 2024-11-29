"use client";
import PlansCard from "@/components/ui/plans-card";
import { useToast } from "@/hooks/use-toast";
import { fetchData, postData } from "@/utils/api";
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

  const fetchPlansApi = async () => {
    try {
      const response = await fetchData("api/plan");
      if (response.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setPlansData(response.result);
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
  }, []);

  const handleCheckoutPlan = async (id) => {
    try {
      setLoading(true);
      setUserId(id);
      const baseUrl =
        process.env.NODE_ENV === "development"
          ? process.env.NEXT_PUBLIC_BASE_URL
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
  return (
    <div className="w-full h-full bg-white rounded-[10px] overflow-auto">
      <h2 className="mt-[64px] mb-[12px] text-center text-[40px] font-medium">Ready to get started?</h2>
      <p className="text-[#B3B3B3] mb-[50px] text-center">Choose a plan to tailor your needs</p>
      <div className="flex flex-wrap justify-center gap-3">
        {plansData.map((plan, id) => {
          return (
            <>
              {" "}
              <PlansCard
                key={id}
                name={plan?.name}
                price={plan?.price}
                billing_period={plan?.billing_period}
                extra_videos_cost={plan?.extra_videos_cost}
                quantity={plan?.quota1}
                handleCheckoutPlan={handleCheckoutPlan}
                plan_id={plan?.id}
                loading={loading}
                userId={userId}
              />
            </>
          );
        })}
      </div>
    </div>
  );
};
export default Plans;
