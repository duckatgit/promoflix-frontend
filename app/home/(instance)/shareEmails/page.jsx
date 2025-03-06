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
import { postData } from "@/utils/api";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";

const ShareEmails = () => {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [emailData, setEmailData] = useAtom(emailsAtom);
  const [selectedEmail, setSelectedEmail] = useState({ email: "", emai_id: '' });
  const [column, setColumn] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const id = searchParams.get("id");
  const arrayParam = localStorage.getItem("array")
  const userArrayParam = localStorage.getItem("userArray")

  const array = arrayParam ? JSON.parse(arrayParam) : [];
  const userArray = userArrayParam ? JSON.parse(userArrayParam) : [];
  const [errors, setErrors] = useState({ email: false, body: false, subject: false, column: false });
  const [loading, setLoading] = useState(false);

  const handleClick = (item) => {
    // Append the clicked item in the format {{item}} to the subject
    setSubject((prevSubject) => `${prevSubject} {${item}}`);
    setErrors((prev) => ({ ...prev, subject: false }));

  };
  const handleClickBody = (item) => {
    // Append the clicked item in the format {{item}} to the subject
    setBody((prevSubject) => `${prevSubject} {${item}}`);
    setErrors((prev) => ({ ...prev, body: false }));
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

  const validateForm = (send = null) => {
    let newErrors = { ...errors };

    // Validate required fields
    newErrors.email = !selectedEmail?.email;
    newErrors.subject = !subject;
    newErrors.body = !body;

    if (send === "recipient") {
      newErrors.column = !column;
    }

    // Update state with errors
    setErrors(newErrors);

    // Check if there are no errors
    const hasErrors = Object.values(newErrors).some((error) => error);

    return !hasErrors;
  };
  const sendSampleEmail = async () => {
    try {
      if (validateForm()) {
        setLoading(true);
        const payload = {
          email_id: selectedEmail?.id,
          subject: subject,
          body: body,

        }
        const response = await postData(`api/share/sample/${id}`, payload, "share_dev");

        if (response.code != 200) {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: data.result,
          })
        }
        else {
          setLoading(false);
          toast({
            type: "success",
            description: "sample email send successfully.",
          })
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('error.message', error.message)
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.message,
      })

    }
  }
  const sendEmailToRecipients = async () => {
    try {
      if (validateForm('recipient')) {
        setLoading(true);
        const payload = {
          email_id: selectedEmail?.id,
          to: column,
          subject: subject,
          body: body,

        }
        const response = await postData(`api/share/${id}`, payload, "share_dev");

        if (response.code != 200) {
          setLoading(false);
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: data.result,
          })
        }
        else {
          setLoading(false);
          toast({
            type: "success",
            description: "Email send to recipients successfully.",
          })
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('error.message', error.message)
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.message,
      })
    }
  }
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
          <div className={`relative flex gap-4 w-full bg-white p-4 shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px] ${loading ? "pointer-events-none opacity-50" : ""}`}>
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
                  className={`w-full p-2 ${!errors?.email ? 'mb-[20px] border border-gray-300 ' : "border border-red-500"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  value={selectedEmail?.email}
                  onChange={(e) => {
                    const selectedOption = emailData.find((ele) => ele.email === e.target.value);
                    setSelectedEmail({ email: e.target.value, id: selectedOption?.id });
                    setErrors((prev) => ({ ...prev, email: e.target.value ? false : true }));
                  }}
                >
                  <option value="">Select an email</option>
                  {emailData?.map((ele, index) => (
                    <option id={ele?.id} value={ele?.email} key={index}>
                      {ele?.email}
                    </option>
                  ))}
                </select>
                {errors.email && <p className="text-red-500 mb-5">Please select an email</p>}
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
                  className={`w-full p-2 ${!errors?.column ? 'mb-[20px] border border-gray-300 ' : "border border-red-500"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  value={column}
                  onChange={(e) => {
                    setColumn(e.target.value)
                    setErrors((prev) => ({ ...prev, column: e.target.value ? false : true }));
                  }}
                >
                  <option value="">Select a column</option>
                  {filterArray(array, ["url", "Video", "thumbnail", "gif", "status"])?.map((ele) => (
                    <option key={ele} value={ele}>
                      {ele}
                    </option>
                  ))}
                </select>
                {errors.column && <p className="text-red-500 mb-5">Please select column</p>}
              </div>
              {/* Subject */}
              <div>
                <h1 className="font-semibold leading-6">Subject</h1>
                <label className="block text-sm font-medium mb-1">
                  Click to add column header:
                </label>
                <div className="my-3 flex gap-2 flex-wrap">
                  {filterArray(array, ["Video"])?.map((item, i) => (
                    <div key={i}
                      className="py-2 px-6 text-blue-500 bg-white   font-medium border border-blue-500  rounded-2xl cursor-pointer"
                      onClick={() => handleClick(item)}
                    >{item}</div>
                  ))}
                </div>
                <input
                  id="subject"
                  type="text"
                  placeholder="Hey {{First Name}}..."
                  className={`w-full p-2 ${!errors?.subject ? 'border border-gray-300 ' : "border border-red-500"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setErrors((prev) => ({ ...prev, subject: e.target.value ? false : true }));
                  }}
                />
                {errors.subject && <p className="text-red-500">The email subject should not be empty</p>}
              </div>
              {/* Buttons */}
              <div className="flex flex-col gap-2 mt-5">
                <Button
                  className="w-full text-blue-500 bg-white hover:text-white hover:bg-blue-500 font-medium border border-blue-500 rounded-2xl"
                  onClick={() => sendEmailToRecipients()}
                >
                  🚀 Send to {userArray?.length} recipients
                </Button>
                <Button
                  className="w-full text-blue-500 bg-white hover:text-white hover:bg-blue-500 font-medium border border-blue-500  rounded-2xl"
                  onClick={() => sendSampleEmail()}
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
                  {"Body"}
                </h1>
                <div className="my-3 flex gap-2 flex-wrap">
                  {filterArray(array, ["Video"])?.map((item, i) => (
                    <div key={i}
                      className="py-2 px-6 text-blue-500 bg-white   font-medium border border-blue-500  rounded-2xl cursor-pointer"
                      onClick={() => handleClickBody(item)}
                    >{item}</div>
                  ))}
                </div>
                <textarea
                  id='body'
                  placeholder="Hey {{First Name}}..."
                  rows="7"
                  className={`w-full p-2 ${!errors?.body ? 'border border-gray-300 ' : "border border-red-500"} rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  value={body}
                  onChange={(e) => {
                    setBody(e.target.value);
                    setErrors((prev) => ({ ...prev, body: e.target.value ? false : true }));
                  }}
                ></textarea>
                {errors.body && <p className="text-red-500">The body should not be empty</p>}
                {errors.body && <p className="text-red-500">The body should contain the <code>{"{{Video*}}"}</code> and <code>{"{variable 1}"}</code></p>}
              </div>
            </div>
            {loading && (
              <Image
                src="/assets/tube-spinner.svg"
                alt="Logo"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                width={50}
                height={50}
              />
            )}
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
