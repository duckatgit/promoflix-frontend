// "use client";

// import React, { useEffect, useState, useRef } from "react";
// // import Header from '../../auth/header/page';
// import { CSVLink } from "react-csv";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAtom } from "jotai";
// import { videoArrayAtom, csvDataAtom } from "@/utils/atom";
// import Image from "next/image";
// import { safeLocalStorage } from "@/lib/safelocastorage";
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { FileVideo2 } from "lucide-react";
// import download from "../../../../../public/assets/download.svg";
// import ProgressLoader from "./ProgressLoader";

// const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

// const Generate_video = () => {
//   const searchParams = useSearchParams();
//   const token = safeLocalStorage.getItem("token");
//   const router = useRouter();
//   const { toast } = useToast();
//   const id = searchParams.get("id");
//   const [socket, setSocket] = useState(null);
//   const [videoArray, setVideoArray] = useAtom(videoArrayAtom);
//   const [csvData, setCsvData] = useAtom(csvDataAtom);
// console.log(videoArray , "video array")

//   const connectWebSocket = () => {
//     if (!socket) {
//       const ws = new WebSocket(`${hirelloSocket}/${token}`); // Using the token in the URL
//       ws.onopen = () => {
//         console.log("Connected to the WebSocket server");
//       };

//       ws.onmessage = (event) => {
//         console.log(event, "event");
//         // console.log('Message received from server: ', JSON.parse(event.data));

//         const updatedData = JSON.parse(event.data)?.GeneratedVideo;

//         console.log("updatedData", updatedData);
//         if (updatedData && updatedData.length > 0) {
//           setVideoArray((prevState) => {
//             return prevState.map((data) => {
//               if (data.id === updatedData[0].id) {
//                 return updatedData[0];
//               }
//               return data;
//             });
//           });

//           toast({
//             description: updatedData[0].message,
//           });

//           // const targetUrl = `/video/generate?id=${id}`;
//           // if (router.pathname !== '/video/generate' || router.query.id !== id) {
//           //   // Only navigate if we are not already on the target page
//           //   setTimeout(() => {
//           //     console.log(`Navigating to ${targetUrl}`);
//           //     router.push(targetUrl);
//           //   }, 0);
//           // }
//         }

//         // setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
//       };

//       ws.onerror = (error) => {
//         console.error("WebSocket Error: ", error);
//       };

//       ws.onclose = () => {
//         console.log("WebSocket connection closed");
//       };
//       setSocket(ws); // Store the WebSocket instance
//     }
//   };

//   useEffect(() => {
//     connectWebSocket();
//   }, []);

//   const updateCsvData = () => {
//     if (videoArray && csvData) {
//       videoArray.forEach((video, videoIndex) => {
//         setCsvData((preCsvData) => {
//           const newCsvRecords = preCsvData?.records.map((data, recordIndex) => {
//             // const isIncluded = data.some(item => video.texts.includes(item));
//             if (
//               videoIndex === recordIndex &&
//               video.status === "succeeded" &&
//               !data.includes(video.video_url)
//             ) {
//               let newCsvRecData = [...data];
//               return [
//                 ...newCsvRecData,
//                 video.video_url,
//                 video.thumbnail,
//                 video.gif,
//                 video.status,
//               ];
//             } else {
//               return data;
//             }
//           });
//           return { ...preCsvData, records: newCsvRecords };
//         });
//       });
//     }
//   };

//   useEffect(() => {
//     updateCsvData();
//   }, [videoArray]);

//   useEffect(() => {
//     if (csvData && csvData?.headers) {
//       setCsvData((preData) => {
//         if (
//           !preData?.headers.includes("url") ||
//           !preData?.headers.includes("thumbnail")
//         ) {
//           console.log(
//             "preData",
//             preData,
//             !preData?.headers.includes("url"),
//             !preData?.headers.includes("thumbnail")
//           );
//           return {
//             ...preData,
//             headers: [...preData.headers, "url", "thumbnail", "gif", "status"],
//           };
//         } else {
//           return preData;
//         }
//       });
//     }
//   }, []);

//   return (
//     <div className="w-full h-full bg-white rounded-[10px]">
//       <div className="flex items-center justify-between mt-4  mx-4">
//         <Button
//           className="py-2 px-3  cursor-pointer border w-[60px] "
//           onClick={() => router.push(`/home/video/preview?id=${id}`)}
//         >
//           Back
//         </Button>

//         {csvData && (
//           <CSVLink
//             className="py-2 m-0 cursor-pointer "
//             filename={`${id}.csv`}
//             data={csvData?.records}
//             headers={csvData?.headers}
//           >
//             <Button className="py-2 px-3 cursor-pointer rounded-[8px] text-base">
//               <Image
//                 className="mr-2"
//                 src={download}
//                 height={24}
//                 width={24}
//                 alt="download"
//               />
//               Download CSV
//             </Button>
//           </CSVLink>
//         )}
//       </div>

//       <div className="  p-[10px]  border-b border-gray-300">
//         <p className="text-black font-semibold text-base">Generated Videos </p>
//       </div>
//       <div className="h-[88%] p-[10px] overflow-y-auto flex flex-wrap content-baseline gap-4 mt-4">
//         {videoArray && videoArray.length > 0 ? (
//           videoArray?.map((item, index) => {
//             const statusPercentageMap = {
//               pending: 0,
//               processing: 50,
//               completed: 100,
//             };

//             const progressPercentage = statusPercentageMap[item.status] || 0;

//             const findKeyword = csvData?.records[index][0] || "";
//             return (
//               <div className="w-[300px] " key={item.id}>
//                 {item?.video_url ? (
//                   <div>
//                     <video
//                       width="100%"
//                       height="178"
//                       className="rounded-[10px]"
//                       controls
//                     >
//                       <source src={item?.video_url} type="video/mp4" />
//                       Your browser does not support the video tag.
//                     </video>

//                     <p className="mt-4 ">
//                       {findKeyword.charAt(0).toUpperCase() +
//                         findKeyword.slice(1)}
//                     </p>
//                   </div>
//                 ) : (
//                   <div>
//                     <ProgressLoader percentage={progressPercentage} />

//                     <p className="mt-4">
//                       {findKeyword.charAt(0).toUpperCase() +
//                         findKeyword.slice(1)}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         ) : (
//           <p className="mt-2 mb-16">No data found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Generate_video;

"use client";

import React, { use, useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import { useRouter, useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { videoArrayAtom, csvDataAtom } from "@/utils/atom";
import Image from "next/image";
import { safeLocalStorage } from "@/lib/safelocastorage";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import download from "../../../../../public/assets/download.svg";
import ProgressLoader from "./ProgressLoader";
import { fetchData, postData } from "@/utils/api";
import { FaShareAlt } from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";

const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Generate_video = () => {
  const searchParams = useSearchParams();
  const token = safeLocalStorage.getItem("token");
  const router = useRouter();
  const { toast } = useToast();
  const id = searchParams.get("id");

  const [socket, setSocket] = useState(null);
  const [shareButton, setShareButton] = useState(false);

  const [videoArray, setVideoArray] = useAtom(videoArrayAtom);
  const [csvData, setCsvData] = useAtom(csvDataAtom);
  const [showLoader, setShowLoader] = useState(false);

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
  // Connect to WebSocket
  const connectWebSocket = (id) => {
    if (!socket && token) {
      const ws = new WebSocket(`${hirelloSocket}/${token}/${id}`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        // console.log("Raw WebSocket Data:", event.data);

        try {
          const parsedData = JSON.parse(event.data);
          // console.log("Parsed WebSocket Data:", parsedData);

          const updatedData = parsedData?.GeneratedVideo;
          if (updatedData && updatedData.videos?.length > 0) {
            setVideoArray((prevState) => {
              // Create a copy of the current state to update
              let updatedArray = [...prevState];

              // Iterate over each video in updatedData.videos
              updatedData.videos.forEach((newVideo) => {
                const index = updatedArray.findIndex(
                  (data) => data.id === newVideo.id
                );

                if (index !== -1) {
                  // If the video is already in the array, update it
                  updatedArray[index] = newVideo;
                } else {
                  // If the video is not in the array, add it
                  updatedArray.push(newVideo);
                }
              });

              // Return the updated array
              return updatedArray;
            });

            setShareButton(updatedData?.status?.completed);

            // Assuming the message is in the first video or status
            toast({
              description:
                updatedData.status?.message || updatedData.videos[0].message,
            });
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
      };

      setSocket(ws);
    }
  };
  const regenerateAllVideoById = async (id) => {
    try {
      setShowLoader(true)
      const result = await postData(`api/v1/regenerate/${id}`, {}, "hirello");
      console.log(result, "regenerate");
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
    connectWebSocket(id);
    return () => {
      if (socket) {
        socket.close(); // Clean up the WebSocket connection on component unmount
      }
    };
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
                    src={download}
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
             

              onClick={() => {
                regenerateAllVideoById(id);
                }}
            >
              <IoMdRefresh size={25} />
              <span className="ml-2">Regenerate Video</span>
            </Button>
            {shareButton && (
              <Button
                className="py-2 px-3 cursor-pointer rounded-[8px] text-base"
                onClick={() => {
                  handleClick();
                }}
              >
                <FaShareAlt />
                <span className="ml-2">Share</span>
              </Button>
            )}
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
