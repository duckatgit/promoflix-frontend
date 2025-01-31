"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emailsAtom } from "@/utils/atom";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";

import React, { useState } from "react";
import { useEffect } from "react";
import StickyBanner from "../user-emails/Banner";
import { useSearchParams } from "next/navigation";

const ShareEmails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [emailData, setEmailData] = useAtom(emailsAtom);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [column, setColumn] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const id = searchParams.get("id");
  const arrayParam = localStorage.getItem("array")
  const userArrayParam = localStorage.getItem("userArray")

  const array = arrayParam ? JSON.parse(arrayParam) : [];
  const userArray = userArrayParam ? JSON.parse(userArrayParam) : [];

  const handleClick = (item) => {
    // Append the clicked item in the format {{item}} to the subject
    setSubject((prevSubject) => `${prevSubject}{{${item}}}`);
  };
  const handleClickBody = (item) => {
    // Append the clicked item in the format {{item}} to the subject
    setBody((prevSubject) => `${prevSubject}{{${item}}}`);
  };
  const handleChange = (e) => {
    setSubject(e.target.value);
  };
  const handleChangeBody = (e) => {
    setBody(e.target.value);
  };

  const filterArray = (array, excludeKeywords) => {
    // Ensure the array exists and is an array
    if (!Array.isArray(array)) return [];
    // Filter out items that include any keyword in the excludeKeywords array
    return array.filter((item) =>
      Array.isArray(excludeKeywords)
        ? !excludeKeywords.some((keyword) => item.includes(keyword))
        : !item.includes(excludeKeywords)
    );
  };

  return (
    <>
      {emailData?.length > 0 ? (
        <div className="">
          <div className="mb-3">
            {" "}
            <Button
              className="py-2 px-3 cursor-pointer border w-[60px]"
              onClick={() => router.push(`/home/video/generate?id=${id}`)}
            >
              Back
            </Button>
          </div>
          <div className="flex gap-4 w-full bg-white p-4 shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px]">
            {/* left section */}
            <div className="w-[50%] my-[5px] bg-white ">
              {/* Email to List */}
              <div>
                <h1 className="font-semibold leading-6">
                  Email Videos to list
                </h1>
                <label className="block text-sm font-medium mb-1 my-[2px]">
                  Select the email you&apos;d like to send from. You can create
                  more emails in{" "}
                  <Link
                    href="/home/user-emails"
                    className="text-blue-600 hover:underline"
                  >
                    Settings
                  </Link>
                </label>
                <select
                  className="w-full p-2 mb-[20px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={selectedEmail}
                  onChange={(e) => setSelectedEmail(e.target.value)}
                >
                  {emailData?.map((ele) => (
                    <option key={ele?.email} value={ele?.email}>
                      {ele?.email}
                    </option>
                  ))}
                </select>
              </div>
              {/* Select Column */}
              <div>
                <h1 className="font-semibold leading-6">
                  Select column that contains your emails
                </h1>
                <label className="block text-sm font-medium my-[2px]">
                  The email addresses in the selected column will be sent the
                  email.
                </label>
                {/* <select
                  className="w-full p-2 mb-[20px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                >
                  <option value="">Select a column</option>
                  <option value="name">No column</option>
                  <option value="linkedin page">LinkedIn Page</option>
                  <option value="email">Email</option>
                </select> */}

                <select
                  className="w-full p-2 mb-[20px] border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={column}
                  onChange={(e) => setColumn(e.target.value)}
                >
                  <option value="">Select a column</option>
                  {filterArray(array, ["url", "video", "thumbnail", "gif", "status"])?.map((ele) => (
                    <option key={ele} value={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
              </div>
              {/* Subject */}
              <div>
                <h1 className="font-semibold leading-6">Subject</h1>
                <label className="block text-sm font-medium mb-1">
                  Click to add column header:
                </label>
                <div className="my-3 flex gap-2 flex-wrap">
                  {filterArray(array, ["url", "video", "thumbnail", "gif", "status"])?.map((item, i) => (
                    <div key={i}
                      className="py-2 px-6 text-blue-500 bg-white   font-medium border border-blue-500  rounded-2xl cursor-pointer"
                      onClick={() => handleClick(item)}
                    >{item}</div>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Hey {{First Name}}..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={subject}

                  onChange={handleChange}
                />
                {/* <p className="text-red-500 text-xs mt-1">
                  The email subject should not be empty
                </p> */}
              </div>
              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-5">
                <Button
                  className="w-full text-blue-500 bg-white hover:text-white hover:bg-blue-500 font-medium border border-blue-500 rounded-2xl"
                  onClick={""}
                >
                  🚀 Send to {userArray?.length} recipients
                </Button>
                <Button
                  className="w-full text-blue-500 bg-white hover:text-white hover:bg-blue-500 font-medium border border-blue-500  rounded-2xl"
                  onClick={""}
                >
                  Send me a sample email
                </Button>
              </div>
            </div>
            {/* right section */}
            <div className="w-[50%] my-[5px] bg-white ">
              {/* Body */}
              <div>
                <h1 className="font-semibold leading-6 mb-[2px]">
                  {"Body (must include {{video}}) variable) all csv headers + video, gif, thumbnail"}
                </h1>
                <div className="my-3 flex gap-2 flex-wrap">
                  {filterArray(array, "status")?.map((item, i) => (
                    <div key={i}
                      className="py-2 px-6 text-blue-500 bg-white   font-medium border border-blue-500  rounded-2xl cursor-pointer"
                      onClick={() => handleClickBody(item)}
                    >{item}</div>
                  ))}
                </div>
                <textarea
                  placeholder="Hey {{First Name}}..."
                  rows="7"
                  className="w-full p-2 border border-gray-300  rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={body}

                  onChange={handleChangeBody}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full ">
          <StickyBanner />
          <div className="text-end">
            <Button
              className="text-right text-white mb-5 cursor-pointer"
              style={{ backgroundColor: "#333333" }}
              onClick={() => router.push(`/home/user-emails`)}
            >
              Add Email
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
export default ShareEmails;
