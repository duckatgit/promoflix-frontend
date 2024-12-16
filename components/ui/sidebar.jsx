"use client";

import React, { useEffect, useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import { useRouter, usePathname } from "next/navigation"; // usePathname to get the current route
import { fetchData } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { safeLocalStorage } from "@/lib/safelocastorage";
import { useAtom } from "jotai";
import { updatedNameAtom } from "@/utils/atom";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const Sidebar = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("John Doe");
  const router = useRouter();
  const pathname = usePathname(); // Current route path
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [updatedName, setUpdatedName] = useAtom(updatedNameAtom);
  const [uploadFileModal, setUploadFileModal] = useState(false);

  useEffect(() => {
    const name = safeLocalStorage.getItem("name");
    const email = safeLocalStorage.getItem("email");
    setName(name);
    setEmail(email);
  }, []);

  const logOutUser = () => {
    toast({
      type: "success",
      title: "Logout",
      description: "You are logged out successfully",
    });
    safeLocalStorage.removeItem("token");
    safeLocalStorage.removeItem("name");
    Cookies.remove("token");
    router.push("/auth/login");
  };

  const fetchBillingHistory = async () => {
    try {
      const baseUrl = "https://promoflix-frontend-seven.vercel.app";

      const response = await fetchData("api/plan/customer_portal", {
        return_url: baseUrl,
      });
      if (response.code != 200) {
        alert("Failed to fetch Billing History");
      } else {
        window.open(response.result, "_blank");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const profile = async () => {
    try {
      const result = await fetchData("api/user", {}, "");
      if (result.code != 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        const data = result;
        setUpdatedName(data?.result?.user?.name);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div
        className={` max-w-[30%] bg-white transition-all duration-300 flex flex-col items-start relative rounded-lg ${isCollapsed ? "w-[60px] collapsed" : "min-w-[180px]"
          }`}
      >
        <div
          className="sidebar-icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label="Toggle Sidebar"
        >
          {isCollapsed ? (
            <CiCircleChevRight size={20} className="text-[#E7680F]" />
          ) : (
            <CiCircleChevLeft size={20} className="text-[#E7680F]" />
          )}
        </div>

        <div className="sidebar-content">
          <div className="p-2">
            <div
              className={`menu-item ${pathname === "/home/instance" ? "menu-item-active" : ""
                }`}
              onClick={() => router.push("/home/instance")}
            >
              <span className="icon">
                {pathname === "/home/instance" ? (
                  <img src="/assets/orange-instance.svg" alt="Instance Icon" />
                ) : (
                  <img src="/assets/black-instance.svg" alt="Instance Icon" />
                )}
              </span>
              <span className="text">Video Projects</span>
            </div>
            <div
              className={`menu-item ${pathname === "/home/plan" ? "menu-item-active" : ""
                }`}
              onClick={() => router.push("/home/plan")}
            >
              <span className="icon">
                {pathname === "/home/plan" ? (
                  <img src="/assets/orange-plan.svg" alt="Pricing Plans Icon" />
                ) : (
                  <img src="/assets/black-plan.svg" alt="Pricing Plans Icon" />
                )}
              </span>
              <span className="text">Pricing Plans</span>
            </div>
            <div
              className={`menu-item ${pathname === "/home/billing-history" ? "menu-item-active" : ""
                }`}
              onClick={() => fetchBillingHistory()}
            >
              <span className="icon">
                {pathname === "/home/billing-history" ? (
                  <img
                    src="/assets/orange-billing.svg"
                    alt="Billing History Icon"
                  />
                ) : (
                  <img
                    src="/assets/billing-icon.png"
                    alt="Billing History Icon"
                  />
                )}
              </span>
              <span className="text">Billing History</span>
            </div>
            <div
              className={`menu-item ${pathname === "/home/user-emails" ? "menu-item-active" : ""
                }`}
              onClick={() => router.push("/home/user-emails")}
            >
              <span className="icon">
                {pathname === "/home/user-emails" ? (
                  <img src="/assets/orange-email-icon.svg" alt="Email Icon" />
                ) : (
                  <img src="/assets/black-email-icon.svg" alt="Email Icon" />
                )}
              </span>
              <span className="text">Emails</span>
            </div>
            <div
              className={`menu-item ${pathname === "/home/userprofile" ? "menu-item-active" : ""
                }`}
              onClick={() => router.push("/home/userprofile")}
            >
              <span className="icon">
                {pathname === "/home/userprofile" ? (
                  <img src="/assets/orange-setting.svg" alt="Instance Icon" />
                ) : (
                  <img src="/assets/black-setting.svg" alt="Instance Icon" />
                )}
              </span>
              <span className="text">Setting</span>
            </div>
          </div>
        </div>

        <div className="border-b-2 border-[#D9D9D9] w-full">
          <div
            className="flex items-center  p-4 pb-[10px] cursor-pointer"
            onClick={() => {
              setUploadFileModal(true);
            }}
          >
            <span className="icon">
              <img src="/assets/help.svg" alt="Instance Icon" />
            </span>
            <span className="text">Help</span>
          </div>

          <div className="p-4 pl-[18px]">
            <div className="user-info ">
              <span
                className={`border-[#757575] text-[#757575] font-medium border-2 w-5 h-5 rounded-[50%] bg-white   text-center font-sans text-[14px]   
                  `}


              >
                <span
                  className={`relative`}
                  style={{
                    top: "-3px",
                  }}
                >
                  {updatedName ? updatedName?.charAt(0) : name?.charAt(0)}
                </span>
              </span>
              <div className="text ml-3">
                <p className="text ">
                  {updatedName ? updatedName : name}
                </p>

                {/* <p
                className="font-[12px] text-[#757575] leading-[15.6px]"
                style={{ wordBreak: "break-word" }}
              >
                {email}
              </p> */}
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex items-center p-4 w-full cursor-pointer"
          onClick={logOutUser}
        >
          <span className="icon">
            <RiLogoutCircleRLine className="text-[#FF2E00]" size={25} />
          </span>
          <span className="text text-[#ff2f00]">Logout</span>
        </div>
        <div></div>
      </div>

      <Dialog open={uploadFileModal} onOpenChange={setUploadFileModal}>
        <DialogContent className="w-[90vw] max-w-none">
          <DialogHeader>
            <DialogTitle>Tour for website</DialogTitle>
          </DialogHeader>

          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <div className="h-[82vh] ">
                  <div className="bg-[#edeef2] h-[80%]">
                    <Image
                      src="/assets/ss1.png"
                      alt="tour"
                      className="w-full h-full"
                      width={500}
                      height={500}
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <p className="mt-8">
                    <strong>
                      Choose your variable(s): In the transcript, select the
                      word(s) you want to replace in each video. Click the
                      checkmark to confirm. This becomes &quot;Variable 1.&quot; (Paid
                      subscribers can select a second set of words to replace as
                      &quot;Variable 2.&quot;)
                    </strong>
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-[80vh] " style={{ overflowY: "auto" }}>
                  <div className="bg-[#edeef2] h-[80%]">
                    <Image
                      src="/assets/ss2.png"
                      alt="tour"
                      className="w-full h-full"
                      width={500}
                      height={500}
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <p className="mt-4">
                    <strong>
                      Prepare your spreadsheet: Make sure your spreadsheet has a
                      column named &quot;Variable 1&quot; (and &quot;Variable 2&quot; if you have a
                      paid subscription). Each row in these columns should
                      contain the specific information you want to use in place
                      of the variable(s) in your video.
                    </strong>
                    <p className="mt-1">
                      <strong>
                        {" "}
                        Example: If &quot;Variable 1&quot; is the name &quot;David&quot; in your
                        video, your &quot;Variable 1&quot; column in the spreadsheet would
                        contain the names of each person you want to address
                        (e.g., &quot;Susan,&quot; &quot;John,&quot; &quot;Jennifer&quot;). Customize your
                        thumbnail: Choose an eye-catching image to be the first
                        thing your viewers see.
                      </strong>
                    </p>
                  </p>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="h-[80vh] ">
                  <div className="bg-[#edeef2] h-[80%]">
                    <Image
                      src="/assets/ss3.png"
                      alt="tour"
                      className="w-full h-full"
                      width={500}
                      height={500}
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <p className="mt-4">
                    <strong>
                      Add thumbnail text (optional): Include a short message on
                      your thumbnail to further personalize the video or grab
                      attention
                    </strong>
                  </p>
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="h-[80vh] ">
                  <div className="bg-[#edeef2] h-[80%]">
                    <Image
                      src="/assets/ss4.png"
                      alt="tour"
                      className="w-full h-full"
                      width={500}
                      height={500}
                      style={{ objectFit: "contain" }}
                    />
                  </div>

                  <p className="mt-4">
                    <strong>
                      {" "}
                      Generate your videos: Click &quot;Merge Video&quot; to start the
                      process. Our system will create a unique video for each
                      contact in your spreadsheet, replacing the variable(s)
                      with the corresponding information from your spreadsheet.{" "}
                    </strong>
                  </p>
                </div>
              </CarouselItem>
            </CarouselContent>
            <div className="relative mb-3 ">
              <CarouselPrevious className="absolute left-0 rounded-[10px] px-9 py-4 " />
              <CarouselNext className="absolute right-0 rounded-[10px] px-9 py-4" />
            </div>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
  ``;
};

export default Sidebar;
