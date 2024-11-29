"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import VideoTitleCard from "@/components/ui/video-title-card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { deleteData, fetchData, postData, putData } from "@/utils/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const InstancePage = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [allInstances, setAllInstances] = useState([]);
  const [id, setId] = useState("");
  const [updateInstanceModal, setupdateInstanceModal] = useState(false);
  const [updatedInstance, setUpdatedInstance] = useState("");
  const [updatedInstanceId, setUpdatedInstanceID] = useState();

  const fileInputRef = useRef(null);
  const [instance, setInstance] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const getAllInstance = async () => {
    try {
      const queryParams = {
        page: 0,
        limit: 100,
      };
      const result = await fetchData("api/v1/instance", queryParams, "hirello");
      if (result.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        const data = result.result.instances;
        setAllInstances(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllInstance();
  }, []);

  //   const createInstance = async () => {
  //     try {
  //       if (instance) {
  //         const response = await postData(
  //           "api/v1/instance",
  //           {
  //             name: instance,
  //           },
  //           "hirello"
  //         );
  //         setInstance("");
  //         if (response.code !== 200) {
  //           toast({
  //             variant: "destructive",
  //             title: "Uh oh! Something went wrong.",
  //           });
  //         } else {
  //           setId(response?.result?.id);
  //           setInstance("");
  //           toast({
  //             description: "Instence Added successfully",
  //           });
  //         }
  //       }
  //     } catch (error) {
  //       toast({
  //         variant: "destructive",
  //         title: "Uh oh! Something went wrong.",
  //         description: error.message,
  //       });
  //     }
  //   };
  console.log(id, "ididdidid");
  const createInstance = async () => {
    if (!instance) return; // Exit early if no instance is provided

    try {
      const response = await postData(
        "api/v1/instance",
        { name: instance },
        "hirello"
      );
      console.log(response, "ppppppp");
      // Clear input regardless of the response

      if (response?.code === 200) {
        setId(response?.result?.id);
        toast({
          description: "Instance added successfully",
        });

        setInstance("");
        getAllInstance();
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response?.message || "Unexpected error occurred.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  //   const handleBlur = (e) => {
  //     setInstance(e.target.value);
  //   };
  // Function to handle blur
  const handleBlur = (e) => {
    // setInstance(e.target.value.trim());
    createInstance();
    setIsTyping(false);
  };

  // Function to handle input changes
  const handleChange = (e) => {
    setInstance(e.target.value);
    setIsTyping(true);
  };

  // useEffect(() => {
  //   if (instance?.length > 0) {
  //     createInstance();
  //   }
  // }, [instance]);

  const handleSendFile = async (file) => {
    try {
      setShowLoader(true);
      const formData = new FormData();
      formData.append("file", file);

      const data = await postData(`api/v1/file/${id}`, formData, "hirello");
      if (data.code == 200) {
        setShowLoader(false);
        router.push(`/home/video/preview?id=${id}`);
      }
    } catch (error) {
      setShowLoader(false);
      console.log(error, "==========error");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxFileSize = 50 * 1024 * 1024; // 50 MB in bytes

    if (file) {
      if (file.size > maxFileSize) {
        toast({
          variant: "destructive",
          title: "File too large",
          description:
            "The maximum file size is 50 MB. Please select a smaller file.",
        });
        return;
      }

      handleSendFile(file); // Process the file if the size is valid
    }
  };

  const deleteInstance = async (instanceId) => {
    try {
      const queryParams = {
        id: instanceId,
      };
      const data = await deleteData("api/v1/instance", queryParams, "hirello");
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
          description: "Instance deleted sucessfully",
        });
        setId("");
        getAllInstance();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateInstance = async () => {
    try {
      const data = await putData(
        "api/v1/instance",
        {
          id: updatedInstanceId,
          name: updatedInstance,
          data_id: null,
          video_id: null,
        },
        "hirello"
      );
      if (data.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
        });
      } else {
        toast({
          description: "Instence Updated successfully",
        });
        setInstance("");
      }
    } catch (error) {
      console.log(error, "===========error");
    }
  };
  return (
    <>
      <Dialog open={updateInstanceModal} onOpenChange={setupdateInstanceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Instance</DialogTitle>
          </DialogHeader>
          <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
            <div className="flex flex-col space-y-1.5 w-[400px]">
              <input
                className="h-10 rounded-md text-black border-2 p-2 border-black"
                type="text"
                value={updatedInstance}
                onChange={(e) => {
                  setUpdatedInstance(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setupdateInstanceModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FFC000] text-black"
              onClick={() => {
                updateInstance();
                setupdateInstanceModal(false);
                getAllInstance();
              }}
            >
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex gap-5 h-full overflow-y-auto">
        <div
          style={{ height: "fit-content" }}
          className="  shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px] bg-white min-w-[300px]"
        >
          <div className="flex text-start p-2 border border-b-1">
            <h1 className="text-lg font-semibold text-gray-700">Upload File</h1>
          </div>

          <div className="flex flex-col p-4 gap-3">
            {/* Video Title Input */}
            <div>
              <Input
                id="video-title"
                placeholder="Video Title"
                value={instance}
                className="w-full  border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => handleChange(e)}
                onBlur={(e) => handleBlur(e)}
              />
            </div>
            {/* Upload Section */}

            <div
              className={`relative ${
                id ? "cursor-pointer" : "cursor-no-drop"
              } border-2 border-dashed border-gray-300 rounded-[10px] px-[16px] py-[20px] text-center `}
              onClick={() => {
                if (id) {
                  fileInputRef.current.click(); // Only trigger the click if `id` is present
                }
              }}
              title={!id ? "First create an instance, then upload video." : ""}
            >
              {showLoader && (
                <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full bg-[#62666917]">
                  <Image
                    src="/assets/tube-spinner.svg"
                    alt="Logo"
                    width={50}
                    height={50}
                  />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                id="file-upload"
                className="w-28 absolute right-[20px] top-[48px]"
                style={{ display: "none" }}
                accept="video/*" // Restrict file type to video
              />
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="text-orange-500 text-4xl">
                  <img src="/assets/bx_image-add.png" alt="upload icon" />
                </div>
                {/* Upload Instructions */}
                <p className="text-sm font-medium text-gray-700">
                  Upload Data, or{" "}
                  <span
                    className={`${
                      id
                        ? "text-orange-500 cursor-pointer"
                        : "text-gray-500 cursor-no-drop"
                    }`}
                  >
                    Browse
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Maximum File size is 50 mb
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          className="flex flex-wrap gap-4 "
          style={{ alignContent: "baseline" }}
        >
          {allInstances?.map((ele) => (
            <VideoTitleCard
              title={ele?.name}
              id={ele?.id}
              deleteInstance={deleteInstance}
              updateInstance={setUpdatedInstance}
              setupdateInstanceModal={setupdateInstanceModal}
              setUpdatedInstanceID={setUpdatedInstanceID}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default InstancePage;
