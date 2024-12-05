"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { fetchData, putData } from "@/utils/api";
import { safeLocalStorage } from "@/lib/safelocastorage";
import { useAtom } from "jotai";
import { updatedNameAtom } from "@/utils/atom";
import { getFormatedDate } from "@/lib/utils";

function UserProfile() {
  const { toast } = useToast();

  const [updateName, setUpdateName] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [userName, setUserName] = useState("");
  const [userDeta, setUserDeta] = useState("");
  const [updatedName, setUpdatedName] = useAtom(updatedNameAtom);

  const [plansData, setPlansData] = useState([]);
  const [planName, setPlanName] = useState("");
  const [subscriptionDate, setSubscriptionDate] = useState("");

  const [isDate, setIsDate] = useState("");



  const profile = async () => {
    try {
      setShowLoader(true);

      const result = await fetchData("api/user", {}, "");
      if (result.code != 200) {
        setShowLoader(false);

        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        setShowLoader(false);

        const data = result;
        setUserDeta(data.result);
        setUserName(data.result.user.name);
        setUpdatedName(data?.result?.user?.name);
        setSubscriptionDate(data?.result?.quota?.created_at);
        safeLocalStorage.setItem("name", data?.result?.user.name);
        safeLocalStorage.setItem("email", data?.result?.user.email);
        // setAllInstances(data);
      }
    } catch (error) {
      setShowLoader(false);

      console.log(error);
    }
  };

  const fetchPlansApi = async () => {
    try {
      const response = await fetchData("api/plan");
      if (response.code != 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setPlansData(response.result);
      }
    } catch (error) {
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.result,
      });
    }
  };

  const updateProfile = async () => {
    try {
      const data = await putData(
        "api/user",
        {
          name: userName,
        },
        ""
      );
      if (data.code != 200) {
        toast({
          type: "error",
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
      } else {
        toast({
          type: "success",
          description: "Name Updated successfully",
        });
        profile();
        setUpdateName(false);
      }
    } catch (error) {
      console.log(error, "===========error");
    }
  };

  useEffect(() => {
    profile();
    fetchPlansApi();
  }, []);

  // useEffect(() => {
  //   // Check if plan_id matches any id in the plans array
  //   console.log(userDeta?.quota?.plan_id)
  //   const matchingPlan = plansData.find((plan) => plan.id === userDeta?.quota?.plan_id);
  //   if (matchingPlan) {

  //     setPlanName(plansData.name)

  //   }
  // }, [plansData, userDeta]);

  useEffect(() => {
    // Match plan_id from userState1 with id in userState2
    const matchingPlan = plansData.find(
      (plan) => plan.id === userDeta?.quota?.plan_id
    );

    if (matchingPlan) {
      setPlanName(matchingPlan.name);

      // Store the matched name in state
    } else {
      setPlanName("No matching plan found"); // Handle case where no match is found
    }
  }, [userDeta, plansData]); // Re-run effect if either state changes

  return (
    <>
      {showLoader ? (
        <div className="flex left-0 absolute w-full top-0 bottom-0 justify-center bg-gray-300 bg-opacity-50 ">
          <Image
            src="/assets/tube-spinner.svg"
            alt="Logo"
            width={50}
            height={50}
          />
        </div>
      ) : (
        <div
          style={{ height: "min-content" }}
          className="shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px] bg-white min-w-[300px] p-4"
        >
          <div className="w-full">
            <table className="table-auto w-full text-left text-sm">
              <tbody>
                <tr className="border-b">
                  <th className="px-4 py-2 text-black font-semibold">
                    User Name
                  </th>
                  <td className="px-4 py-2">: {userDeta?.user?.name}</td>
                  <td className="px-4 py-2 text-right">
                    <img
                      className="cursor-pointer inline-block"
                      src="/assets/edit.svg"
                      alt="Edit Icon"
                      onClick={() => setUpdateName(true)}
                    />
                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-black font-semibold">
                    User Email
                  </th>
                  <td className="px-4 py-2" colSpan="2">
                    : {userDeta?.user?.email}
                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-black font-semibold">
                    User Sign Up Date
                  </th>
                  <td className="px-4 py-2" colSpan="2">

                    : {getFormatedDate(userDeta.user?.created_at)}

                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-black font-semibold">
                    User Subscription
                  </th>
                  <td className="px-4 py-2" colSpan="2">
                    : {planName}
                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-black font-semibold">
                    Subscription Date
                  </th>
                  <td className="px-4 py-2" colSpan="2">
                    : {getFormatedDate(subscriptionDate)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Dialog open={updateName} onOpenChange={setUpdateName}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Name</DialogTitle>
          </DialogHeader>
          <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
            <div className="flex flex-col space-y-1.5 w-[400px]">
              <input
                className="h-10 rounded-md text-black border-2 p-2 border-black"
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateName(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#FFC000] text-black"
              onClick={() => {
                updateProfile();
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserProfile;
