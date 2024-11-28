"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import VideoTitleCard from "@/components/ui/video-title-card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { deleteData, fetchData, postData, putData } from "@/utils/api";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const InstancePage = () => {
    const { toast } = useToast();
    const router = useRouter();
    const [allInstances, setAllInstances] = useState([]);
    const [id, setId] = useState('')
    const [updateInstanceModal, setupdateInstanceModal] = useState(false);
    const [updatedInstance, setUpdatedInstance] = useState('');
    const [updatedInstanceId, setUpdatedInstanceID] = useState();


    const fileInputRef = useRef(null);
    const [instance, setInstance] = useState("");

    const getAllInstance = async () => {
        try {
            const queryParams = {
                page: 0,
                limit: 100
            };
            const result = await fetchData('api/v1/instance', queryParams, "hirello");
            if (result.code != 200) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: data.result,
                })
            }
            else {
                const data = result.result.instances
                setAllInstances(data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(
        () => {
            getAllInstance()
        }, [])

    const createInstance = async () => {
        try {
            if (instance) {
                const response = await postData('api/v1/instance', {
                    name: instance,
                }, "hirello");
                if (response.code !== 200) {
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                    });
                } else {
                    setId(response?.result?.id)
                    setInstance("")
                    toast({
                        description: "Instence Added successfully",
                    });

                }
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message,
            });
        }
    };


    const handleBlur = (e) => {
        setInstance(e.target.value);
    };

    useEffect(() => {
        if (instance?.length > 0) {
            createInstance();
            getAllInstance()
        }
    }, [instance])

    const handleSendFile = async (file) => {
        try {
            console.log(file, "file");

            const formData = new FormData();
            formData.append('file', file);
            const data = await postData(`api/v1/file/${id}`, formData, "hirello");
            if (data.code == 200) {
                router.push(`/video/preview?id=${id}`)
            }
        } catch (error) {
            console.log(error, '==========error')
        }
    }
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleSendFile(file)
        };
    }
    const deleteInstance = async (instanceId) => {
        try {
            const queryParams = {
                id: instanceId,
            };
            const data = await deleteData('api/v1/instance', queryParams, "hirello");
            if (data.code != 200) {
                toast({
                    type: "error",
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: data.result,
                })
            }
            else {
                toast({
                    type: "success",
                    description: "Instance deleted sucessfully",
                })
                getAllInstance()
            }
        } catch (error) {
            console.log(error)
        }
    };
    const updateInstance = async () => {
        try {
            const data = await putData('api/v1/instance', {
                id: updatedInstanceId,
                name: updatedInstance,
                "data_id": null,
                "video_id": null
            }, "hirello");
            if (data.code != 200) {
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                });
            } else {
                toast({
                    description: "Instence Updated successfully",
                });
                setInstance("")

            }
        } catch (error) {
            console.log(error, '===========error')
        }
    }
    return (
        <div className="flex gap-5 h-full overflow-y-auto">
            <div className="  shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px] h-72 bg-white sticky top-[0]">
                <div className="flex text-start p-2 border border-b-1">
                    <h1 className="text-lg font-semibold text-gray-700">Upload File</h1>
                </div>
                <div className="flex flex-col p-4 gap-3">
                    {/* Video Title Input */}
                    <div>
                        <Input
                            id="video-title"
                            placeholder="Video Title"
                            className="w-full  border border-gray-300 rounded-md p-2 outline-none focus:ring-2 focus:ring-orange-500"
                            onBlur={(e) => handleBlur(e)}
                        />
                    </div>
                    {/* Upload Section */}

                    <div class="relative border-2 border-dashed border-gray-300 rounded-[10px] px-[36px] py-[41px] text-center h-auto">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            id="file-upload"
                            className="w-28 absolute right-[20px] top-[48px] opacity-0"
                        />
                        <div class="flex flex-col items-center justify-center space-y-2">
                            <div class="text-orange-500 text-4xl">
                                <img src="/assets/bx_image-add.png" alt="upload icon" />
                            </div>
                            {/* <!-- Upload Instructions --> */}
                            <p class="text-sm font-medium text-gray-700">
                                Upload Data, or <span class="text-orange-500 cursor-pointer">Browse</span>
                            </p>
                            <p class="text-xs text-gray-500">Maximum File size is 50 mb</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 self-baseline">
                {allInstances?.map((ele) =>
                    <VideoTitleCard title={ele?.name} id={ele?.id} deleteInstance={deleteInstance} updateInstance={updateInstance} setupdateInstanceModal={setupdateInstanceModal} setUpdatedInstanceID={setUpdatedInstanceID} />
                )}
            </div>
            <Dialog open={updateInstanceModal} onOpenChange={setupdateInstanceModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Instance
                        </DialogTitle>
                    </DialogHeader>
                    <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
                        <div className="flex flex-col space-y-1.5 w-[400px]">
                            <input className="h-10 rounded-md" type="text" value={updatedInstance} onChange={(e) => { setUpdatedInstance(e.target.value); }} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setupdateInstanceModal(false)}>
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
        </div>);

};

export default InstancePage;
