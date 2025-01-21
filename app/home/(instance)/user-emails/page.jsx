"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteData, fetchData, postData, putData } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import Image from "next/image";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbEdit } from "react-icons/tb";
import { Pointer } from "lucide-react";
import { maskPassword } from "@/lib/utils";
import StickyBanner from "./Banner";
import { useAtom } from "jotai";
import { emailsAtom } from "@/utils/atom";


const UserEmails = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [emailData, setEmailData] = useAtom(emailsAtom);
  const [emailId, setEmailId] = useState("");
  const [editData, setEditData] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    delay:"",
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));

    // Clear validation error when user provides valid input
    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };


  const handleSave = async () => {
    try {
      if (validateForm()) {
      setLoading(true);
      const endpoint = editData ? `api/email` : `api/email`;
      const method = editData ? putData : postData;
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        delay:Number(form.delay),
        ...(editData && { id: editData.id }), // Include ID for editing
      };

      const response = await method(endpoint, payload, "share_dev");
      if (response.code !== 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        toast({
          type: "success",
          description: editData
            ? "Email edited successfully."
            : "Email added successfully.",
        });
        setIsOpen(false);
        setForm({ name: "", email: "", password: "", delay:"" });
        setEditData(null);
        setEmailData(response.result); // Update the list
      }
    }
    } catch (error) {
      console.error("Error:", error.message);
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmail = async () => {
    try {
      setLoading(true);
      const response = await deleteData(
        `api/email`,
        { id: emailId },
        "share_dev"
      );
      if (response.code != 200) {
        setLoading(false);
        setDeletePopUp(false);
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setLoading(false);
        toast({
          type: "success",
          description: "email deleted successfully.",
        });
        setDeletePopUp(false);
        setEmailData(response?.result);
      }
    } catch (error) {
      setLoading(false);
      setDeletePopUp(false);
      console.log("error.message", error.message);
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.message?.result,
      });
    }
  };
  const fetchEmails = async () => {
    try {
      setShowLoader(true);
      const response = await fetchData("api/email", {}, "share_dev");

      if (response.code != 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
        setShowLoader(false);
      } else {
        setEmailData(response?.result);
        setShowLoader(false);
      }
    } catch (error) {
      setShowLoader(false);
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.result,
      });
    }
  };
  useEffect(() => {
    if (emailData?.length == 0) {
      fetchEmails();
    }
  }, []);

  const openModal = (data = null) => {
    if (data) {
      setEditData(data); // Set data to edit  
      setForm({ name: data.name, email: data.email, password: data.password, delay:data.delay });
    } else {
      setEditData(null);
      setForm({ name: "", email: "", password: "" ,delay:''});
    }
    setIsOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!form.name) {
      newErrors.name = "Name is required.";
    }

    // Email validation
    if (!form.email) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Password validation
    if (!form.password) {
      newErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    // Delay dropdown validation
    if (!form.delay) {
      newErrors.delay = "Please select a delay value.";
    }

    setErrors(newErrors);

    // Return true if no errors exist
    return Object.keys(newErrors).length === 0;
  };
  return (
    <div className="w-full">
      <StickyBanner path={'user-emails'}/>
      <div className="text-end">
        <Button
          className="text-right text-white mb-5 cursor-pointer"
          style={{ backgroundColor: "#333333" }}
          onClick={() => openModal()}
          disabled={emailData?.length == 3}
        >
          Add Email
        </Button>
      </div>
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
        <>
          {emailData?.length > 0 ? (
            <div className="flex content-baseline gap-2 " >
              {emailData?.map((ele, index) => (
                <div  className="max-w-sm min-w-[311px] mb-4 bg-white border border-slate-200 rounded-lg p-4" key={index}>
                  <div className="flex justify-between items-center flex-wrap ">
                    <div className=" w-full text-end">
                      <button
                        className="text-[#B4B4B4] hover:text-gray-600 mx-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(ele);
                        }}
                      >
                        <TbEdit size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600 "
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletePopUp(true);
                          setEmailId(ele?.id);
                        }}
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </div>
                    <div className="w-full mt-4">
                      <table className="table-auto w-full text-left text-sm">
                        <tbody>
                          <tr>
                            <th className="px-4 py-2 text-black font-semibold">
                              Name
                            </th>
                            <td className="px-4 py-2">: {ele?.name}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 text-black font-semibold">
                              Email
                            </th>
                            <td className="px-4 py-2" style={{wordBreak:"break-word"}}>: {ele?.email}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 text-black font-semibold">
                              Password
                            </th>
                            <td className="px-4 py-2">:  {maskPassword(ele?.password)}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 text-black font-semibold">
                              Delay
                            </th>
                            <td className="px-4 py-2">:  {ele?.delay}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Not data found..</p>
          )}
        </>
      )}
      {/* add email modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editData ? "Edit Email" : "Add Email"}</DialogTitle>
          </DialogHeader>

          <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
            <form>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5 ">
                  <Label htmlFor="name" className="mb-2" >Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="email"  className="mb-2">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleInputChange}
                    className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="password" className="mb-2">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                    className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="delay" className="mb-2">Delay</Label>
                  <select
                    id="delay"
                    value={form.delay}
                    onChange={handleInputChange}
                    className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${
                      errors.delay ? "border-red-500" : ""
                    }`}
                    aria-labelledby="delay"
                  >
                    {!form.delay && (
                      <option value="" disabled hidden>
                        Select a value
                      </option>
                    )}
                    {[0, 1, 2, 3].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                  {errors.delay && <p className="text-red-500">{errors.delay}</p>}
                </div>

                <p><>Note: The email password is encrypted and can only be used for sending emails through this website</></p>
              </div>
            </form>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setForm({ name: "", email: "", password: "" });
                setEditData(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#FFC000] text-black"
              onClick={handleSave}
            >
              {loading ? (
                <>
                  Submit <LoadingSpinner className="ml-2 text-white" />
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* delete email modal */}
      <AlertDialog open={deletePopUp}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete </AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeletePopUp(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#E7680F]"
              onClick={() => handleDeleteEmail()}
            >
              {loading ? (
                <>
                  Continue <LoadingSpinner className="ml-2 text-white" />
                </>
              ) : (
                "Continue"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserEmails;
