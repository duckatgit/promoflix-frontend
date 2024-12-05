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

import React, { useEffect, useState } from "react";
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

  // Connect to WebSocket
  const connectWebSocket = () => {
    if (!socket && token) {
      const ws = new WebSocket(`${hirelloSocket}/${token}`);

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        console.log("Raw WebSocket Data:", event.data);

        try {
          const parsedData = JSON.parse(event.data);
          console.log("Parsed WebSocket Data:", parsedData);

          const updatedData = parsedData?.GeneratedVideo;

          if (updatedData && updatedData.length > 0) {
            setVideoArray((prevState) => {
              const updatedArray = prevState.map((data) =>
                data.id === updatedData[0].id ? updatedData[0] : data
              );
              console.log("Updated Video Array:", updatedArray);
              return updatedArray;
            });

            toast({
              description: updatedData[0].message,
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

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (socket) {
        socket.close(); // Clean up the WebSocket connection on component unmount
      }
    };
  }, []);

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

  return (
    <div className="w-full h-full bg-white rounded-[10px]">
      <div className="flex items-center justify-between mt-4 mx-4">
        <Button
          className="py-2 px-3 cursor-pointer border w-[60px]"
          onClick={() => router.push(`/home/video/preview?id=${id}`)}
        >
          Back
        </Button>

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
  );
};

export default Generate_video;
