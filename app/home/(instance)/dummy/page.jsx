"use client";

import React, { useEffect, useState, useRef } from "react";
// import Header from '../../auth/header/page';
import { CSVLink } from "react-csv";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { videoArrayAtom, csvDataAtom } from "@/utils/atom";
import Image from "next/image";
import { safeLocalStorage } from "@/lib/safelocastorage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { FileVideo2 } from "lucide-react";
import download from "../../../../public/assets/download.svg";
// import ProgressLoader from "./ProgressLoader";
const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Generate_video = () => {
  const searchParams = useSearchParams();
  const token = safeLocalStorage.getItem("token");
  const router = useRouter();
  const { toast } = useToast();
  const id = searchParams.get("id");
  const [socket, setSocket] = useState(null);
  const [videoArray, setVideoArray] = useAtom(videoArrayAtom);
  const [csvData, setCsvData] = useAtom(csvDataAtom);

  const connectWebSocket = () => {
    if (!socket) {
      const ws = new WebSocket(`${hirelloSocket}/${token}/${id}`); // Using the token in the URL
      ws.onopen = () => {
        console.log("Connected to the WebSocket server");
      };

      ws.onmessage = (event) => {

        const updatedData = JSON.parse(event.data)?.GeneratedVideo;
        if (updatedData && updatedData.length > 0) {
          setVideoArray((prevState) => {
            return prevState.map((data) => {
              if (data.id === updatedData[0].id) {
                return updatedData[0];
              }
              return data;
            });
          });
          toast({
            description: updatedData[0].message,
          });

          // const targetUrl = `/video/generate?id=${id}`;
          // if (router.pathname !== '/video/generate' || router.query.id !== id) {
          //   // Only navigate if we are not already on the target page
          //   setTimeout(() => {
          //     console.log(`Navigating to ${targetUrl}`);
          //     router.push(targetUrl);
          //   }, 0);
          // }
        }

        // setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
      };

      ws.onerror = (error) => {
        console.error("WebSocket Error: ", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };
      setSocket(ws); // Store the WebSocket instance
    }
  };

  useEffect(() => {
    connectWebSocket();
  }, []);

  const updateCsvData = () => {
    if (videoArray && csvData) {
      videoArray.forEach((video, videoIndex) => {
        setCsvData((preCsvData) => {
          const newCsvRecords = preCsvData?.records.map((data, recordIndex) => {
            // const isIncluded = data.some(item => video.texts.includes(item));
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

  useEffect(() => {
    if (csvData && csvData?.headers) {
      setCsvData((preData) => {
        if (
          !preData?.headers.includes("url") ||
          !preData?.headers.includes("thumbnail")
        ) {
          console.log(
            "preData",
            preData,
            !preData?.headers.includes("url"),
            !preData?.headers.includes("thumbnail")
          );
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

  return (
    <div className="w-full h-full bg-white rounded-[10px]">
      <div className="  p-[10px] flex items-center justify-between border-b border-gray-300">
        <p className="text-black font-semibold text-base">Generated Videos</p>

        {csvData && (
          <CSVLink
            className="py-2 m-0 cursor-pointer "
            filename={`${id}.csv`}
            data={csvData.records}
            headers={csvData.headers}
          >
            <Button className="py-2 px-3 cursor-pointer rounded-[8px] text-base">
              <Image
                className="mr-2"
                src={download}
                height={24}
                width={24}
                alt="download"
              />
              Download CSV
            </Button>
          </CSVLink>
        )}
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

            const findKeyword = csvData?.records[index][0] || "";
            return (
              <div className="w-[300px] " key={item.id}>
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

                    <p className="mt-4 ">
                      {findKeyword.charAt(0).toUpperCase() +
                        findKeyword.slice(1)}
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* <ProgressLoader percentage={progressPercentage} /> */}

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
  );
};

export default Generate_video;
