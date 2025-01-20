"use client";

import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { videoArrayAtom, csvDataAtom } from "@/utils/atom";
import Image from "next/image";

import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { fetchData, postData } from "@/utils/api";
import ProgressLoader from "../generate/ProgressLoader";
import { FaShareAlt } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const Generate_video = () => {
  const searchParams = useSearchParams();

  const router = useRouter();
  const { toast } = useToast();
  const id = searchParams.get("id");

  const [videoArray, setVideoArray] = useAtom(videoArrayAtom);

  const [csvData, setCsvData] = useAtom(csvDataAtom);


  const [showLoader, setShowLoader] = useState(true);
  const [filteredCsvData, setFilteredCsvData] = useState([]);

  const excludeHeaders = ["url", "thumbnail", "gif", "status"];
  // Function to filter out specific properties
  const filterHeaders = () => {
    const filteredHeaders = csvData?.headers.filter(
      (header) => !excludeHeaders.includes(header)
    );
    setFilteredCsvData(filteredHeaders);
  };
  useEffect(() => {
    filterHeaders();
  }, [csvData]);

  const getAllVideoById = async (id) => {
    try {
      const result = await fetchData(`api/v1/generate/${id}`, {}, "hirello");
      if (result.code != 200) {
        setShowLoader(false);

        toast({
          type: "error",

          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        setShowLoader(false);

        const data = result;

        setVideoArray(data.result);
      }
    } catch (error) {
      setShowLoader(false);

      console.log(error);
    }
  };

  const regenerateAllVideoById = async (id) => {
    try {
      const result = await postData(`api/v1/regenerate/${id}`, {}, "hirello");
      if (result.code != 200) {
        setShowLoader(false);

        toast({
          type: "error",

          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        setShowLoader(false);

        const data = result;

        setVideoArray(data.result);
      }
    } catch (error) {
      setShowLoader(false);

      console.log(error);
    }
  };

  useEffect(() => {
    getAllVideoById(id);
  }, [id]);

  // Update CSV data when video array changes
  const updateCsvData = () => {
    if (videoArray && csvData) {
      videoArray.forEach((video, videoIndex) => {
        setCsvData((preCsvData) => {
          const newCsvRecords = preCsvData?.records.map((data, recordIndex) => {
            if (
              videoIndex === recordIndex &&
              video.status === "succeeded" &&
              !data.includes(video.video_url)
            ) {
              let newCsvRecData = [...data];
              return [
                ...newCsvRecData,
                video.video_url,
                video.thumbnail,
                video.gif,
                video.status,
              ];
            } else {
              return data;
            }
          });
          return { ...preCsvData, records: newCsvRecords };
        });
      });
    }
  };

  useEffect(() => {
    updateCsvData();
  }, [videoArray]);

  // Initialize CSV headers if not already set
  useEffect(() => {
    if (csvData && csvData?.headers) {
      setCsvData((preData) => {
        if (
          !preData?.headers.includes("url") ||
          !preData?.headers.includes("thumbnail")
        ) {
          return {
            ...preData,
            headers: [...preData.headers, "url", "thumbnail", "gif", "status"],
          };
        } else {
          return preData;
        }
      });
    }
  }, []);
  const handleClick = () => {
    // const id = id
    const queryParams = new URLSearchParams();
    queryParams.set("id", id);
    queryParams.set("array", JSON.stringify(filteredCsvData));

    router.push(`/home/shareEmails?${queryParams.toString()}`);
  };

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

      <div className="w-full h-full bg-white rounded-[10px]">
        <div className="flex items-center justify-between mt-4 mx-4">
          <Button
            className="py-2 px-3 cursor-pointer border w-[60px]"
            onClick={() => router.push(`/home/video/preview?id=${id}`)}
          >
            Back
          </Button>

          <div className="flex items-center gap-3">
            {csvData && (
              <CSVLink
                className="py-2 m-0 cursor-pointer"
                filename={`${id}.csv`}
                data={csvData?.records}
                headers={csvData?.headers}
              >
                <Button className="py-2 px-3 cursor-pointer rounded-[8px] text-base">
                  <Image
                    className="mr-2"
                    src={"/assets/download.svg"}
                    height={24}
                    width={24}
                    alt="download"
                  />
                  Download CSV
                </Button>
              </CSVLink>
            )}

            <Button
              className="py-2 px-3 cursor-pointer rounded-[8px] text-base"
              onClick={() => regenerateAllVideoById(id)}
            >
              <IoMdRefresh size={25} />
              <span className="ml-2">Regenerate Video</span>
            </Button>
            <Button
              className="py-2 px-3 cursor-pointer rounded-[8px] text-base"
              onClick={() => {
                handleClick();
              }}
            >
              <FaShareAlt />
              <span className="ml-2">Share</span>
            </Button>
          </div>
        </div>

        <div className="p-[10px] border-b border-gray-300">
          <p className="text-black font-semibold text-base">Generated Videos</p>
        </div>

        <div className="h-[88%] p-[10px] overflow-y-auto flex flex-wrap content-baseline gap-4 mt-4">
          {videoArray && videoArray.length > 0 ? (
            videoArray?.map((item, index) => {
              const statusPercentageMap = {
                pending: 0,
                processing: 50,
                completed: 100,
              };

              const progressPercentage = statusPercentageMap[item.status] || 0;
              const findKeyword = csvData?.records[index]?.[0] || "";

              return (
                <div className="w-[300px]" key={item.id}>
                  {item?.video_url ? (
                    <div>
                      <video
                        width="100%"
                        height="178"
                        className="rounded-[10px]"
                        controls
                      >
                        <source src={item?.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <p className="mt-4">
                        {findKeyword.charAt(0).toUpperCase() +
                          findKeyword.slice(1)}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <ProgressLoader percentage={progressPercentage} />
                      <p className="mt-4">
                        {findKeyword.charAt(0).toUpperCase() +
                          findKeyword.slice(1)}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="mt-2 mb-16">No data found</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Generate_video;
