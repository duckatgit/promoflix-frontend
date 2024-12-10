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

const UserEmails = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [emailData, setEmailData] = useState([]);
  const [emailId, setEmailId] = useState("");
  const [editData, setEditData] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const endpoint = editData ? `api/email` : `api/email`;
      const method = editData ? putData : postData;
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
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
        setForm({ name: "", email: "", password: "" });
        setEditData(null);
        setEmailData(response.result); // Update the list
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
      console.log(response, "resss");

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
      setForm({ name: data.name, email: data.email, password: data.password });
    } else {
      setEditData(null);
      setForm({ name: "", email: "", password: "" });
    }
    setIsOpen(true);
  };

  return (
    <div className="w-full">
      <div className="text-end">
        <Button
          className="text-right text-white mb-5 cursor-pointer"
          style={{ backgroundColor: "#333333" }}
          onClick={() => openModal()}
          disabled={emailData?.length==3}
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
            <div className="grid grid-cols-3 gap-4">
              {emailData?.map((ele) => (
                <div className="max-w-sm min-w-[311px] bg-white border border-slate-200 rounded-lg p-4">
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
                            <td className="px-4 py-2">: {ele?.email}</td>
                          </tr>
                          <tr>
                            <th className="px-4 py-2 text-black font-semibold">
                              Password
                            </th>
                            <td className="px-4 py-2">: {ele?.password}</td>
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
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 w-[400px]">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex flex-col space-y-1.5 w-[400px]">
                  <Label>Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleInputChange}
                  />
                </div>
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
