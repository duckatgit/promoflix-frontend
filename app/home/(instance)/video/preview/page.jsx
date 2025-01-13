"use client";

import React, { useEffect, useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import { v4 as uuidv4 } from "uuid";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Trash, Upload, File, EyeIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { useRouter, useSearchParams } from "next/navigation";
import { safeLocalStorage } from "@/lib/safelocastorage";

import Image from "next/image";
import { useAtom, useSetAtom } from "jotai";
import { videoArrayAtom, csvDataAtom } from "@/utils/atom";
import Header from "@/app/auth/header/page";
import { fetchData, postData, deleteData } from "@/utils/api";
import { getContrastingColor, getRandomColor } from "@/lib/getRandomColor";
import { LoadingSpinner } from "@/components/ui/spinner";
import Stepper from "@/components/ui/stepper";
import { getFormatedDate } from "@/lib/utils";

const whisperxSocker = process.env.NEXT_PUBLIC_VIDEO_WHISPERX_SOCKET;
const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Preview_video = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  // console.log('searchParams', searchParams.get('id'))
  const id = searchParams.get("id");
  const token = safeLocalStorage.getItem("token");
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState();
  const [videoThumb, setVideoThumb] = useState();
  const [transcript, setTranscript] = useState("");
  const [segmentID, setSegmentID] = useState("");
  const [editingWordIndex, setEditingWordIndex] = useState(null); // Add this state
  const [inputVisible, setInputVisible] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [uploadDocPopup, setUploadDocPopup] = useState(false);
  const [uploadThumbPopup, setUploadThumbPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to store the selected file
  // State to store the selected file
  const [thumbnailFile, setThumbnailFile] = useState(null); // State to store the selected file

  const [hasFile, setHasFile] = useState(false);
  const [deleteFilePopUp, setDeleteFilePopUp] = useState(false);
  const [filePreviewPopUp, setFilePreviewPopUp] = useState(false);
  const [fileData, setFileData] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [variableCount, setVariableCount] = useState(0);
  console.log(variableCount, "variable count");
  const [countQuota, setCountQuota] = useState(0);

  const [csvUrlInput, setCsvUrlInput] = useState("");
  const [data, setData] = useState([]);
  console.log(data);
  const [segmentData, setSegmentData] = useState([]);

  const [transcriptSteps, setTranscriptSteps] = useState("Loading...");

  const stepMapping = {
    queue: "1/5 Queue",
    download: "2/5 Download",
    decode: "3/5 Decode",
    transcribe: "4/5 Transcribe",
    align: "5/5 Align",
  };
  const fileInputRef = useRef(null);
  const fileInputRef2 = useRef(null);
  const [isHighlighted, setIsHighlighted] = useState({});
  console.log(isHighlighted, "ishighlighted");
  const [socket, setSocket] = useState(null);

  const [videoArray, setVideoArray] = useAtom(videoArrayAtom);

  const setCsvData = useSetAtom(csvDataAtom);
  const [selectedIndices, setSelectedIndices] = useState({
    start: null,
    end: null,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const startRef = useRef(null);
  const [highlightedSegment, setHighlightedSegment] = useState("");
  const [indexToVisible, setIndexToVisible] = useState(null);

  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [allInstances, setAllInstances] = useState([]);
  const [plansData, setPlansData] = useState([]);
  const [quota, setQuota] = useState([]);
  const [usedQuota, setUsedQuota] = useState(null);


  const hasCalledNext = useRef(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };
  // const bgColor = ["#FDE6EB","#F2E6FF","#CCFBF1","#FFEDD5",""]

  const sendMessage = async () => {
    setLoading(true);
    if (!hasFile && !csvUrlInput) {
      toast({
        type: "error",
        title: "",
        description: "Please upload csv file or Spreadsheet url",
      });
      setLoading(false);
      return;
    }

    if (hasFile) {
      try {
        const data = await postData(`api/v1/generate/${id}`, {}, "hirello");
        console.log(data, "data generate");
        if (data.code == 200) {
          setLoading(false);

          setVideoArray(data.result);
          router.push(`/home/video/generate?id=${id}`);
        }
      } catch (error) {
        console.log(error, "errrrr");

        setLoading(false);
        toast({
          type: "error",
          description: error?.message,
        });
      }
    } else {
      let googleSheetId = "";

      const regex = /\/d\/([a-zA-Z0-9-_]+)/;
      const match = csvUrlInput.match(regex);
      if (match) {
        googleSheetId = match[1]; // The ID is the first captured group
      } else {
        toast({
          variant: "destructive",
          title: "",
          description: "Invalid url",
        });
        return;
      }

      const data = await postData(
        `api/googlesheet/${id}/${googleSheetId}`,
        {},
        "csv"
      );
      if (data.code == 200) {
        let newVidArr = [];
        if (data.result?.records) {
          for (let i = 0; i < data.result?.records; i++) {
            newVidArr.push({
              id: uuidv4(),
              user_id: "09d220c2-f815-44dc-9f64-6a870dfd8ca8",
              instance_id: id,
              video_url: null,
              thumbnail: null,
              gif: null,
              status: "queued",
              texts: ["up"],
              message: "Video generation has started.",
              created_at: "2024-11-13T12:25:46.963",
              updated_at: "2024-11-13T12:25:46.963",
            });
          }
        }

        setVideoArray([...newVidArr]);
        router.push(`/home/video/generate?id=${id}`);
      }
    }

    let message = {
      GetVideo: {
        instance_id: id,
      },
    };
    if (socket && message) {
      socket.send(JSON.stringify(message));
    }
  };

  const handleSendFile = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("csv", selectedFile);
        const data = await postData(`api/csv/${id}`, formData, "csv");
        if (data.code == 200) {
          toast({
            type: "success",
            description: "Csv file uploaded sucessfully",
          });

          await getFile();
          setSelectedFile(null);
        }
      }
    } catch (error) {
      toast({
        type: "error",
        description: "failed to upload Csv file ",
      });
      console.log(error, "==========error");
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxFileSize = 100 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxFileSize) {
      toast({
        type: "warning",
        description: "File size exceeds 50MB. Please choose a smaller file.",
      });
      fileInputRef.current.value = "";
      return;
    }
    if (file && file.type.startsWith("image/")) {
      toast({
        type: "warning",
        description: "Please select a valid file.",
      });
      const fileInput = event.target;
      fileInput.value = null;
    } else {
      if (file) {
        setFileName(file?.name);
        setSelectedFile(file); // Store the selected file in state
        const fileInput = event.target;
        if (fileInput.files.length > 0) {
          const selectedFile = fileInput.files[0];
          fileInput.value = null; // Reset the input if the same file is selected again
          setSelectedFile(selectedFile);
        }
      }
    }
  };
  const handleThumbnailFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setThumbnailFile(file); // Store the selected file in state
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        fileInput.value = null; // Reset the input if the same file is selected again
        setThumbnailFile(selectedFile);
      }
    } else {
      toast({
        type: "warning",
        description: "Please select a valid image file.",
      });
      const fileInput = event.target;
      fileInput.value = null;
    }
  };
  useEffect(() => {
    if (selectedFile) {
      handleSendFile();
    }
  }, [selectedFile]);

  useEffect(() => {
    if (thumbnailFile) {
      uploadNewThumb();
    }
  }, [thumbnailFile]);

  const getAllSegment = async () => {
    try {
      const queryParams = {
        instance_id: id,
      };
      const result = await fetchData("api/v1/segment", queryParams, "hirello");
      if (result.code == 200) {
        setSegmentData(result?.result);
        if (result?.result.length > 0 && activeStep == 1) {
          handleNext(2);
        }
        if (result?.result?.length > 0) {
          let selected = {};
          for (let item of result?.result) {
            const word = item.highlight?.toLowerCase();
            // selected[word] = true;
            // selected = word;

            selected[word] = {
              start_time: item?.start_time,
              end_time: item?.end_time,
              highlight: true,
            };
          }
          setIsHighlighted(selected);
        } else {
          setIsHighlighted({});
        }
      }
    } catch (error) {
      console.log(error, "========error");
      return error;
    }
  };

  const getFile = async () => {
    try {
      const result = await fetchData(`api/csv/${id}`, {}, "csv");

      if (result.code == 200) {
        handleNext(3);
        setHasFile(true);
        setCsvData(result.result);
        setFileData(result.result);
      }
    } catch (error) {
      console.log(error, "=========error");
    }
  };
  const deleteFile = async () => {
    try {
      const data = await deleteData(`api/csv/${id}`, {}, "csv");
      if (data.code == 200) {
        toast({
          type: "success",
          description: "Csv file deleted sucessfully",
        });
        setHasFile(false);
        setCsvData(null);
        setDeleteFilePopUp(false);
      }
    } catch (error) {
      toast({
        type: "error",
        description: "failed to delete Csv file ",
      });
      console.log(error, "========error");
    }
  };

  const getKeyFromUrl = (url) => {
    const parsedUrl = new URL(url);
    const segments = parsedUrl.pathname.split("/");
    const keyWithExtension = segments.pop();
    return keyWithExtension;
  };

  function findWords(index) {
    let end = data[data.length - 1].start;
    let start = data[0].start;

    for (let i = index; i < data.length - 1; i++) {
      const current = data[i];
      const next = data[i + 1];
      const updatedStartTime = next.start;
      const updatedEndTime = current.end;
      if (updatedStartTime - updatedEndTime > 0.2) {
        end = current.end;
        break;
      }
    }

    for (let i = index; i > 0; i--) {
      const current = data[i];
      const previous = data[i - 1];
      const updatedStartTime = current.start;
      const updatedEndTime = previous.end;
      if (updatedStartTime - updatedEndTime > 0.2) {
        start = current.start;
        break;
      }
    }

    setStartTime(start);
    setEndTime(end);
  }
  const handleDoubleClick = (word, start, end, index) => {
    findWords(index);
  };
  const handleTickClick = async () => {
    try {
      let highlight_si;
      let highlight_ei;
      if (selectedIndices.start == selectedIndices.end) {
        highlight_si = 1;
        highlight_ei = 1;
      } else {
        highlight_si = 0;
        highlight_ei = selectedIndices.end - selectedIndices.start;
      }
      let segments = "";

      for (let item of data) {
        if (startTime <= item.start && endTime >= item.end) {
          segments = segments + item.word;
        }
      }
      console.log(highlight_si, "highlight_si 0000");
      console.log(highlight_ei, "highlight_ei 0000");
      console.log(segments, "segments 0000");
      let cal_startTime = startTime - 0.1;
      let cal_endTime = endTime + 0.1;
      const responseData = await postData(
        `api/v1/segment`,
        {
          name: inputValue?.trim(),
          start_time: cal_startTime,
          segment: segments?.trim(),
          instance_id: id,
          end_time: cal_endTime,
          highlight_si: highlight_si,
          highlight_ei: highlight_ei,
          highlight: highlightedSegment?.trim(),
        },
        "hirello"
      );
      if (responseData.code == 200) {
        toast({
          type: "success",
          description: "Segment added SuccessfullY",
        });
        // quota?.quota2
        // setVariableCount((pre)=>pre + 1)
        setVariableCount((prev) => (prev < quota?.quota2 ? prev + 1 : prev));

        await getAllSegment();
      }
    } catch (error) {
      console.log(error?.response?.data.result, "kjkjkjkjkj");
      toast({
        type: "error",
        description: error?.response?.data?.result,
      });
      console.error("Error in API call:", error);
    }
    setEditingWordIndex(null);
  };

  const handleCrossClick = () => {
    setEditingWordIndex(null); // Close the input without saving
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const deleteSegment = async () => {
    try {
      const data = await deleteData(
        `api/v1/segment`,
        {
          id: segmentID,
        },
        "hirello"
      );
      if (data.code != 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        toast({
          type: "success",
          description: "Segment deleted sucessfully",
        });
        setDeletePopUp(false);
        getAllSegment();
      }
    } catch (error) {
      toast({
        type: "error",
        description: error?.message,
      });
      console.log(error, "=========error");
    }
  };
  const myfunction = async (id) => {
    try {
      const video_result = await fetchData(`api/v1/file/${id}`, {}, "hirello");
      if (video_result.code == 200) {
        setVideoUrl(video_result.result.url);
        setVideoThumb(video_result.result.thumbnail);
        const socket = new WebSocket(whisperxSocker);
        const id = getKeyFromUrl(video_result.result.url);
        socket.onopen = () => {
          socket.send(
            JSON.stringify({
              bucket: "hirello-1183",
              key: `videos/${id}`,
            })
          );
        };
        const newWords = [];
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data && data.segments) {
            data.segments.forEach((segment) => {
              if (segment.words) {
                segment.words.forEach((word) => {
                  newWords.push({
                    word: word.word,
                    start: word.start,
                    end: word.end,
                  });
                });
              }
            });
            setTranscriptSteps(() => "Loading...");
          } else {
            setTranscriptSteps(() => data?.step);
          }
          if (hasCalledNext.current == false && newWords.length > 0) {
            hasCalledNext.current = true;
            handleNext(1);
          }
          setData(() => [...newWords]);
        };

        socket.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        socket.onclose = () => {
          console.log("WebSocket connection closed");
        };
      }
    } catch (error) {
      console.log(error, "==========error");
    }
  };

  const handleMouseDown = (index) => {
    console.log(index, "index handleMouseDown handleMouseDown");
    setIndexToVisible(index);
    setIsSelecting(true);
    setSelectedIndices({ start: index, end: index });
    startRef.current = index;
  };

  const handleMouseUp = (index, startTime, endTime) => {
    console.log(startTime, endTime, "start end");
    console.log(index, "index handleMouseUp");
    setIsSelecting(false);
    const start = startRef.current;
    const end = index;

    const selectedStart = Math.min(start, end);
    const selectedEnd = Math.max(start, end);
    setSelectedIndices({ start: selectedStart, end: selectedEnd });
    findWords(selectedStart);
    let segment = "";
    for (let i = selectedStart; i <= selectedEnd; i++) {
      segment = segment + data[i].word;
    }
    setHighlightedSegment(segment);
    setEditingWordIndex(selectedStart);
    setInputVisible(true);
    setInputValue(`variable ${variableCount + 1}`);
    myfunction(id);
  };

  const uploadNewThumb = async () => {
    try {
      if (thumbnailFile) {
        const formData = new FormData();
        formData.append("thumb", thumbnailFile);
        const data = await postData(`api/v1/thumb/${id}`, formData, "hirello");

        if (data.code == 200) {
          toast({
            type: "success",
            description: "Thumbnail uploaded sucessfully",
          });
          setVideoThumb(data?.result);
          setThumbnailFile(null);
          // setId("");
        }
      }
    } catch (error) {
      toast({
        type: "error",
        description: error?.message,
      });
      console.log(error, "========error");
    }
  };
  const getAllInstance = async (instanceID) => {
    try {
      const queryParams = {
        page: 0,
        limit: 10,
      };
      const result = await fetchData("api/v1/instance", queryParams, "hirello");
      if (result.code != 200) {
        toast({
          type: "error",

          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        const data = result.result.instances;
        setAllInstances(data.filter((ele) => ele.id === instanceID));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlansApi = async () => {
    try {
      const response = await fetchData("api/plan");
      if (response.code != 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setPlansData(response.result);
      }
    } catch (error) {
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.result,
      });
    }
  };
  const fetchPlanQuata = async () => {
    try {
      const response = await fetchData("api/quota");
      if (response.code != 200) {
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        setQuota(response.result);
      }
    } catch (error) {
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error?.result,
      });
    }
  };

  useEffect(() => {
    // Check if plan_id matches any id in the plans array
    const matchingPlan = plansData.find((plan) => plan.id === quota.plan_id);
    if (matchingPlan) {
      // If a match is found, update usedQuota with used_quota1
      setUsedQuota(quota.used_quota2);
    }
  }, [plansData, quota]);
  useEffect(() => {
    if (id) {
      getAllInstance(id);
      if (activeStep === 0) {
        myfunction(id);
      }
      if (activeStep === 1) {
        getAllSegment();
      }
      if (activeStep === 2) {
        getFile();
      }
      // connectWebSocket();
    }
  }, [id, activeStep]);

  useEffect(() => {
    fetchPlanQuata();
    fetchPlansApi();
  }, []);

  const video_url = videoUrl;
  let arr = [];

  useEffect(() => {
    setCountQuota(segmentData.length);
  }, [segmentData]);

  // 8th

//   useEffect(() => {
//     // Target the <p> tag
//     const paragraph = document.getElementById("data");

//     // If the paragraph is not found, log an error
//     if (!paragraph) {
//       console.error("Element with ID 'data' not found.");
//       return; // Exit if element is not found
//     }

//     // Initialize an empty string to hold the target phrase
//     let targetText = "";

//     // Loop through the isHighlighted state and build the target phrase
//     Object.keys(isHighlighted).forEach((key) => {
//       if (isHighlighted[key].highlight) {
//         targetText += key + " "; // Concatenate the phrases where highlight is true
//       }
//     });

//     // Trim and set the target phrase
//     const targetPhrase1 = targetText.trim();
//     console.log(targetPhrase1, "targetPhrase1");

//     // Convert the phrase to an array of words
//     const targetWords = targetPhrase1.split(" ");

//     // Find all <span> tags inside the <p> tag
//     const spans = Array.from(paragraph.querySelectorAll("span"));

  
// console.log(spans, "spans 1111")
// console.log(targetWords, "targetWords 1111")

//     // Add highlight for the target phrase
//     for (let i = 0; i <= spans.length - targetWords.length; i++) {
//       // Check if the sequence matches the target words
//       let isMatch = true;
//       for (let j = 0; j < targetWords.length; j++) {
//         if (
//           spans[i + j].textContent.trim().toLowerCase() !==
//           targetWords[j].toLowerCase()
//         ) {
//           isMatch = false;
//           break;
//         }
//       }
// console.log(isMatch, "kjjjkjkjkj")
//       // If a match is found, add the `bg-[#FEF08A]` class to the relevant spans
//       if (isMatch) {
//         for (let j = 0; j < targetWords.length; j++) {
//           const index = i + j;
//           spans[index].classList.add("bg-[#FEF08A]");
//         }
//       }
//     }

//     // Clear highlights from spans not in the target phrase
//     spans.forEach((span) => {
//       const spanText = span.textContent.trim().toLowerCase();
//       if (!targetWords.includes(spanText)) {
//         span.classList.remove("bg-[#FEF08A]");
//       }
//     });
//     console.log(" kklk 11111")
//   }, [isHighlighted]);


// 9th

// useEffect(() => {
//   // Target the <p> tag
//   const paragraph = document.getElementById("data");

//   // If the paragraph is not found, log an error
//   if (!paragraph) {
//     console.error("Element with ID 'data' not found.");
//     return; // Exit if the element is not found
//   }

//   // Initialize an empty string to hold the target phrase
//   let targetText = "";

//   // Loop through the isHighlighted state and build the target phrase
//   Object.keys(isHighlighted).forEach((key) => {
//     if (isHighlighted[key].highlight) {
//       targetText += key + " "; // Concatenate the phrases where highlight is true
//     }
//   });

//   // Trim and set the target phrase
//   const targetPhrase1 = targetText.trim();
//   console.log(targetPhrase1, "targetPhrase1");

//   // Convert the phrase to an array of words
//   const targetWords = targetPhrase1.split(" ").filter(Boolean);

//   // Find all <span> tags inside the <p> tag
//   const spans = Array.from(paragraph.querySelectorAll("span"));

//   console.log(spans, "spans 1111");
//   console.log(targetWords, "targetWords 1111");

//   // Clear all highlights before applying new ones
//   spans.forEach((span) => {
//     span.classList.remove("bg-[#FEF08A]");
//   });

//   // Add highlight for the target phrase
//   for (let i = 0; i <= spans.length - targetWords.length; i++) {
//     // Check if the sequence matches the target words
//     let isMatch = true;
//     for (let j = 0; j < targetWords.length; j++) {
//       if (
//         spans[i + j].textContent.trim().toLowerCase() !==
//         targetWords[j].toLowerCase()
//       ) {
//         isMatch = false;
//         break;
//       }
//     }

//     // If a match is found, add the `bg-[#FEF08A]` class to the relevant spans
//     if (isMatch) {
//       for (let j = 0; j < targetWords.length; j++) {
//         spans[i + j].classList.add("bg-[#FEF08A]");
//       }
//     }
//   }
// }, [isHighlighted]);


 // 10th

//  useEffect(() => {
//   // Target the <p> tag
//   const paragraph = document.getElementById("data");

//   // If the paragraph is not found, log an error
//   if (!paragraph) {
//     console.error("Element with ID 'data' not found.");
//     return; // Exit if the element is not found
//   }

//   // Find all <span> tags inside the <p> tag
//   const spans = Array.from(paragraph.querySelectorAll("span"));

//   // Track all words to highlight based on isHighlighted
//   const highlightWords = [];

//   // Build the array of words to highlight
//   Object.keys(isHighlighted).forEach((key) => {
//     if (isHighlighted[key].highlight) {
//       highlightWords.push(...key.split(" ").map((word) => word.toLowerCase().trim()));
//     }
//   });

//   console.log(highlightWords, "highlightWords");

//   // Clear all highlights
//   spans.forEach((span) => {
//     span.classList.remove("bg-[#FEF08A]");
//   });

//   // Apply highlights for all matching words
//   spans.forEach((span) => {
//     const spanText = span.textContent.trim().toLowerCase();
//     if (highlightWords.includes(spanText)) {
//       span.classList.add("bg-[#FEF08A]");
//     }
//   });

//   console.log("Highlights updated");
// }, [isHighlighted]);


  if (segmentData) {
    arr = segmentData;
  }

 
  const steps = [
    { title: "Video ", icon: "icon1" },
    { title: "Transcript ", icon: "icon2" },
    { title: "Add Variable", icon: "icon3" },
    { title: " Upload CSV", icon: "icon4" },
    { title: "Generate", icon: "icon5" },
  ];

  const handleNext = (num) => {
    // alert(num)
    if (num < steps.length - 1) {
      setActiveStep(num);
    }
  };
  // useState(() => {
  //   if (!hasFile) {
  //     handleNext(2);
  //   }
  // }, [hasFile]);
  function cleanAndSplit(text) {
    // Step 1: Find and capture the special characters at the end of the string
    const removedChars = text.match(/[^a-zA-Z0-9\s]+$/);

    // Step 2: Remove the special characters from the end of the string
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]+$/, "");

    // Step 3: Return an object with the cleaned word and the removed special characters
    return {
      newWord: cleanedText,
      removedChar: removedChars ? removedChars[0] : "",
    };
  }

  return (
    <div className=" h-[100%] overflow-y-auto w-full">
      {allInstances.length > 0 && !allInstances[0]?.locked && (
        <Stepper
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          segmentArray={arr}
          hasFile={hasFile}
          steps={steps}
        />
      )}
      {/* first section */}
      <div className="flex justify-between h-[452px] gap-4">
        {/* left section */}
        <div
          className="w-1/2 p-4 bg-white rounded-[10px]"
          style={{ height: "fit-content" }}
        >
          <div>
            {videoUrl && (
              <video width="600" controls className="w-full h-[300px]">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {allInstances.length > 0 && (
              <div className="w-[260px] mt-4">
                <table className="table-auto w-full text-left text-sm">
                  <tbody>
                    <tr>
                      <th className="px-4 py-2 text-black font-semibold">
                        Video Title
                      </th>
                      <td className="px-4 py-2">: {allInstances[0]?.name}</td>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 text-black font-semibold">
                        Uploaded Date
                      </th>
                      <td className="px-4 py-2">
                        : {getFormatedDate(allInstances[0]?.created_at)}
                      </td>
                    </tr>
                    <tr>
                      <th className="px-4 py-2 text-black font-semibold">
                        Updated At
                      </th>
                      <td className="px-4 py-2">
                        : {getFormatedDate(allInstances[0]?.updated_at)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* right section */}
        <div className="w-1/2 bg-white rounded-[10px] ">
          <div className="flex justify-between p-4  border-b border-gray-300 mb-4">
            <div className="flex flex-wrap gap-2">
              {arr?.map((i, index) => {
                // const bgColor = getRandomColor();
                // const textColor = getContrastingColor(bgColor);
                {
                  /* console.log(i, "countQuota iiiii"); */
                }

                return (
                  <div
                    className={`justify-between items-center bg-[#333333] text-white px-3 py-1 rounded-xl flex gap-1 `}
                    // style={{ backgroundColor: bgColor }}
                    key={index}
                  >
                    <p
                      className="truncate mb-[2px]"
                      // style={{ color: textColor }}
                    >
                      {" "}
                      {i.name}
                      {/* {`variable ${variableCount  }`} */}
                    </p>
                    <X
                      className="cursor-pointer"
                      size={16}
                      onClick={() => {
                        {
                          setDeletePopUp(true);
                          setSegmentID(i.id);
                          // setVariableCount((pre)=>pre  - 1)
                          setVariableCount((prev) =>
                            prev > 0 ? prev - 1 : prev
                          );
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
            <div>
              {arr.length > 0 && (
                <span>{`${countQuota}/${quota?.quota2}`}</span>
              )}
            </div>
          </div>

          <div id="data"
            className={`p-4 pt-0 text-[16px] leading-[24px] text-justify max-h-[316px] overflow-y-auto `}
          >
            {data && data.length > 0 ? (
              <>
                <p >
                  {data
                    ?.slice(0, showAll ? data.length : 150)
                    ?.map((i, index) => {
                      const word = i?.word?.trim()?.toLowerCase();
                      const value = inputValue.trim().toLowerCase();
                      let isYellow =
                        i.start >= isHighlighted[word]?.start_time &&
                        i.end <= isHighlighted[word]?.end_time
                          ? true
                          : false;

                      {
                        /* Object.keys(isHighlighted).forEach((phrase) => {
                        if (
                          phrase.includes(word) &&
                          i.start >= isHighlighted[phrase]?.start_time &&
                          i.end <= isHighlighted[phrase]?.end_time
                        ) {
                          isYellow = true;
                        }
                      }); */
                      }

                      {
                        /* Object.keys(isHighlighted).forEach((phrase) => {
                        const words = phrase
                          .split(" ")
                          .map((w) => w.trim().toLowerCase());
                        const phraseLength = words.length; */
                      }

                      // Check if the sequence matches
                      {
                        /* const matchesSequence = data
                          .slice(index, index + phraseLength)
                          .every(
                            (item, offset) =>
                              words[offset] === item.word.trim().toLowerCase()
                          ); */
                      }
                      {
                        /* const matchesSequence = data
                          .slice(index, index + phraseLength)
                          .every((item, offset) => {
                            // Log the current slice being checked
                            console.log(
                              "Slice being checked:",
                              data.slice(index, index + phraseLength)
                            );

                            // Log the current word in the phrase and the current item from the slice
                            console.log("Phrase word:", words[offset]);
                            console.log(
                              "Current item word:",
                              item.word.trim().toLowerCase()
                            );

                            // Log the comparison result
                            const isMatch =
                              words[offset] === item.word.trim().toLowerCase();
                            console.log(
                              `Is match at offset ${offset}:`,
                              isMatch
                            );

                            // Return the comparison result
                            return isMatch;
                          });

                        console.log(matchesSequence, words, "matchesSequence");
                        if (matchesSequence) {
                          isYellow = true;
                        }
                      }); */
                      }
                      const { newWord, removedChar } = cleanAndSplit(i.word);
                      return (
                        <React.Fragment key={index}>
                          {isYellow ? (
                            <>
                              <span
                                className={`my-2 ${
                                  isYellow ? "bg-[#FEF08A]" : ""
                                }`}
                                onMouseDown={() => {
                                  if (countQuota < quota?.quota2) {
                                    handleMouseDown(index);
                                  } else {
                                    console.log("limit reached");
                                  }
                                }}
                                onMouseUp={() => {
                                  if (countQuota < quota?.quota2) {
                                    // handleMouseUp(index);
                                    handleMouseUp(index, i.start, i.end);
                                  } else {
                                    console.log("limit reached");
                                  }
                                }}
                                key={index} // Added key for list items
                              >
                                {newWord}
                              </span>

                              <span
                                className={`my-2 }`}
                                // onMouseDown={() => handleMouseDown(index)}
                                onMouseDown={() => {
                                  if (countQuota < quota?.quota2) {
                                    handleMouseDown(index);
                                  } else {
                                    console.log("limit reached");
                                  }
                                }}
                                // onMouseUp={() => handleMouseUp(index)}
                                onMouseUp={() => {
                                  if (countQuota < quota?.quota2) {
                                    handleMouseUp(index);
                                    handleMouseUp(index, i.start, i.end);
                                  } else {
                                    console.log("limit reached");
                                  }
                                }}
                                key={`${index}dup`} // Added key for list items
                              >
                                {removedChar}
                              </span>
                            </>
                          ) : (
                            <span
                              className={`my-2 ${
                                isYellow ? "bg-[#FEF08A]" : ""
                              }`}
                              // onMouseDown={() => handleMouseDown(index)}
                              onMouseDown={() => {
                                if (countQuota < quota?.quota2) {
                                  handleMouseDown(index);
                                } else {
                                  console.log("limit reached");
                                }
                              }}
                              // onMouseUp={() => handleMouseUp(index)}
                              onMouseUp={() => {
                                if (countQuota < quota?.quota2) {
                                  // handleMouseUp(index);
                                  handleMouseUp(index, i.start, i.end);
                                } else {
                                  console.log("limit reached");
                                }
                              }}
                              key={index} // Added key for list items
                            >
                              {i.word}
                            </span>
                          )}

                          {editingWordIndex !== null &&
                            indexToVisible == index && (
                              <div
                                className="w-auto absolute"
                                style={{
                                  display: "flex",
                                  backgroundColor: "#fff",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                  zIndex: 10,
                                }}
                              >
                                <Input
                                  value={inputValue}
                                  disabled
                                  // onChange={handleInputChange}
                                />
                                <div className="flex justify-between ">
                                  <div
                                    className="bg-gray-300 p-2 mr-2 ml-3 text-gray-600"
                                    onClick={handleTickClick}
                                    style={{
                                      cursor: "pointer",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <Check />
                                  </div>
                                  <div
                                    className="bg-gray-300 p-2  mr-2  text-gray-600"
                                    onClick={handleCrossClick}
                                    style={{
                                      cursor: "pointer",
                                      borderRadius: "10px",
                                    }}
                                  >
                                    <X />
                                  </div>
                                </div>
                              </div>
                            )}
                        </React.Fragment>
                      );
                    })}
                </p>
                {data.length > 150 && ( // Show "Read More" if data exceeds 200 words
                  <div className="text-end mt-4 mb-4">
                    <Button
                      className="text-white rounded-[6px] px-[10px] py-[5px]"
                      style={{ backgroundColor: "#333333" }}
                      onClick={toggleShowAll}
                    >
                      {showAll ? "Show Less" : "Read more"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col w-full h-[300px] justify-center items-center ">
                <Image
                  src="/assets/tube-spinner.svg"
                  alt="Logo"
                  width={50}
                  height={50}
                />
                <p>{stepMapping[transcriptSteps]}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* second section */}

      <div className="flex gap-4 w-full   mt-4 ">
        {/* left section */}
        {(activeStep == 2 || activeStep == 3) && (
          <div className="w-[30%] shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px]  bg-white">
            <p className="font-semibold text-[16px] p-[10px] border-b border-gray-200">
              Upload Data From Document
            </p>
            <div className="p-4">
              <div
                className={`${
                  allInstances[0]?.locked ? "cursor-no-drop" : "cursor-pointer"
                } relative border-2 border-dashed border-gray-300 rounded-[10px] h-[205px] px-[26px] py-[42px] text-center`}
                onClick={() => {
                  if (!allInstances[0]?.locked) {
                    fileInputRef.current.click();
                  }
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-orange-500 text-4xl">
                    <img src="/assets/bx_image-add.png" alt="upload icon" />
                  </div>
                  {/* <!-- Upload Instructions --> */}
                  <p className="text-sm font-medium text-gray-700">
                    Upload Your List (.CSV only), or{" "}
                    <span className="text-orange-500">Browse</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum File size is 100 mb
                  </p>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  id="file-upload"
                  style={{ display: "none" }}
                  className="w-28 absolute right-[65px] top-[50px]"
                />
              </div>

              {/* <!-- Separator --> */}
              <div className="flex items-center justify-center my-4">
                <span className="text-gray-400 text-sm">or</span>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Paste Spreadsheet URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-orange-200 text-sm text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Make sure file is shared with &quot;anyone with a link&quot;
                </p>
              </div>
              {hasFile && (
                <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between">
                  <div className="flex justify-between">
                    <div className="flex">
                      <File className="mt-2" />
                      <p className="p-2"> File.csv</p>
                    </div>
                    <div className="flex">
                      <EyeIcon
                        onClick={() => {
                          setFilePreviewPopUp(true);
                        }}
                        className="text-neutral-400 border-2 rounded-3xl size-10 border-neutral-400 p-2 mr-2 cursor-pointer"
                      />
                      {!allInstances[0]?.locked && (
                        <Trash
                          onClick={() => {
                            setDeleteFilePopUp(true);
                          }}
                          className={`${
                            allInstances[0]?.locked
                              ? " cursor-not-allowed"
                              : "cursor-pointer"
                          } text-red-600 border-2 rounded-3xl size-10 border-red-600 p-2 `}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* right section */}
        {activeStep == 3 && (
          <div className="w-[70%]  bg-white shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px]">
            <p className="font-semibold text-[16px] p-[10px] border-b border-gray-200">
              Video Thumbnail
            </p>
            <div className="p-4 ">
              <div className="flex gap-4 mb-[20px]">
                <div className="w-1/2 ">
                  <div className="w-full relative h-[200px]">
                    {videoThumb && (
                      <Image
                        layout="fill"
                        className="rounded-2xl   object-cover"
                        src={videoThumb}
                        alt="logo"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${
                    allInstances[0]?.locked
                      ? "cursor-no-drop"
                      : "cursor-pointer"
                  } relative w-1/2 flex flex-col items-center justify-center bg-[#FFF5F0] border-2 border-dashed border-orange-400 rounded-md`}
                  onClick={() => {
                    if (!allInstances[0]?.locked) {
                      fileInputRef2.current.click();
                    }
                  }}
                >
                  <div className="text-orange-500 text-4xl">
                    <img src="/assets/bx_image-add.png" alt="upload icon" />
                  </div>
                  <p className=" mt-2 text-orange-500 text-sm font-medium">
                    Upload New Thumbnail
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef2}
                    onChange={handleThumbnailFileChange}
                    id="file-upload"
                    accept="image/*"
                    style={{ display: "none" }}
                    className="w-28 absolute right-[65px] top-[55px]"
                  />
                </div>
              </div>
              <div className="  border border-[#B4B4B4] rounded-[10px]">
                <div className="  border-b border-[#B4B4B4]">
                  <div className="p-4">
                    <p className="text-[16px] leading-[24px] text-left">
                      Create Thumbnail Message. Use the merge fields on the
                      right to insert your message.
                    </p>
                  </div>
                </div>
                {/* <div className="flex flex-wrap gap-2 p-4 ">
                  {arr?.map((i, index) => {
                    // const bgColor = getRandomColor();
                    // const textColor = getContrastingColor(bgColor);
                    return (
                      <div
                        className={`justify-between bg-[#333333] text-white px-3 py-1 rounded-xl flex gap-1 `}
                        // style={{ backgroundColor: bgColor }}
                        key={index}
                      >
                        <p
                          className="truncate "
                          // style={{ color: textColor }}
                        >
                          {" "}
                          {i.name}
                        </p>
                        <X
                          className="cursor-pointer"
                          onClick={() => {
                            {
                              setDeletePopUp(true);
                              setSegmentID(i.id);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>  */}
              </div>
              <div className="flex gap-2 p-4 ">
                <Button
                  className="text-white"
                  style={{ backgroundColor: "#333333", cursor: "pointer" }}
                  onClick={() => {
                    if (allInstances[0]?.locked) {
                      router.push(`/home/video/generate?id=${id}`);
                    } else {
                      sendMessage();
                    }
                  }}
                >
                  {allInstances[0]?.locked ? (
                    "Generate Page"
                  ) : loading ? (
                    <>
                      Merge Video <LoadingSpinner className="ml-2 text-white" />
                    </>
                  ) : (
                    "Merge Video"
                  )}
                </Button>

                {/* <Button
                  className=" text-white"
                  style={{ backgroundColor: "#333333" }}
                >
                  Reset All
                </Button> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* third section */}
      {/* <div className=" h-[452px]  mt-4 bg-white">
        <h1 className="font-semibold leading-6 p-[10px] border-b border-b-[#D9D9D9]">Send Email</h1>
        <div className="flex gap-4 w-full shadow-[0px_6px_16px_0px_#0000000F]">
          left section
          <div className="w-[30%] shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px]  bg-white border-2 border-red-500">

          </div>
          right section
          <div className="w-[70%]  bg-white shadow-[0px_6px_16px_0px_#0000000F] rounded-[10px] border-2 border-red-500">
          </div></div>
      </div> */}

      {/* <h1 className="m-4">Upload Data From Document</h1> */}
      {/* {!hasFile ? (
          <div className=" border-2 rounded-md	">
            <div className="m-4 flex b">
              <div className="my-4 ">
                <Button
                  className="bg-[#28434B]"
                  onClick={(e) => {
                    setUploadDocPopup(true);
                  }}
                >
                  Upload Data
                </Button>
              </div>
              <div className="my-6 mx-4">
                <p>or </p>
              </div>
              <div className="flex-col space-y-1.5 my-4">
                <Input
                  id="email"
                  type="text"
                  placeholder="Paste Spreadsheet URL"
                  value={csvUrlInput}
                  onChange={(e) => { setCsvUrlInput(e.target.value) }}
                />
              </div>
            </div>
            <div className="m-4 text-gray-500">
              File Must be .xls, .xlsx, .xlsm, .xlt, .xltx, . (Excel or google a
              sheet).
            </div>
          </div>
        ) : (
          <div className="flex-col border-2 md-2 w-1/2 mt-2 p-2 rounded-r-xl  ">
            <div className="flex justify-between">
              <div className="flex">
                <File className="mt-2" />
                <p className="p-2"> File.csv</p>
              </div>
              <div className="flex">
                <EyeIcon
                  onClick={() => {
                    setFilePreviewPopUp(true);
                  }}
                  className="text-neutral-400 border-2 rounded-3xl size-10 border-neutral-400 p-2 mr-2 cursor-pointer"
                />
                <Trash
                  onClick={() => {
                    setDeleteFilePopUp(true);
                  }}
                  className="text-red-600 border-2 rounded-3xl size-10 border-red-600 p-2 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )} */}
      {/* <h1 className="mx-4 mt-2 mb-2">Video Thumbnail</h1> */}
      {/* <div className="flex justify-around border-2 rounded-lg">
          <div className="w-2/5 m-4 relative h-[300px]">
            <Image
              layout="fill"
              className="rounded-2xl   object-cover"
              src={videoThumb}
              alt=""
            />
          </div>
          <div className="w-2/5 m-4">
            <div
              className="h-16 w-64 bg-[#FFF4D3] gap-2 rounded-xl p-2 justify-center items-center flex flex-col cursor-pointer"
              onClick={() => {
                setUploadThumbPopup(true);
              }}
            >
              <div className="text-[#E5AD00]">
                <Upload />{" "}
              </div>
              <div className="text-[#E5AD00]"> upload new Thumbnail </div>
            </div>
            <div className=" m-4 ">
              <p>
                {data?.map((i, index) => {
                  const word = i?.word?.trim();
                  let isYellow = isHighlighted[word];
                  return (
                    <span
                      className={`my-2 break-all ${isYellow ? "bg-[#FEF08A]" : ""
                        }`}
                      onClick={() =>
                        handleDoubleClick(
                          i.punctuated_word,
                          i.start,
                          i.end,
                          index
                        )
                      }
                      key={index} // Added key for list items
                    >
                      {matchedSegment ? `{{${matchedSegment.segment}}}` : i.punctuated_word}
                    </span>
                  );
                })}
              </p>
            </div>
            
            <div className='flex flex-wrap justify-between bg-gray-300  border-r '>
              <div className='flex gap-4 m-4'>
                {arr?.map(
                    (i) => {
                      return <p className='bg-white p-2 rounded-xl'> {i.name}<X className='cursor-pointer' onClick={() => {
                        {
                          setDeletePopUp(true)
                          setSegmentID(i.id)
                        }
                      }} /></p>
                    }
                  )}
              </div>
            </div>
            <div className="my-2">
              <Button
                className="bg-[#FFC000] text-black"
                onClick={() => {
                  sendMessage();
                }}
              >
                Generated Videos
              </Button>

              <Button
                onClick={() => router.push(`/video/generate?id=${id}`)}
                className="bg-[#FFC000] text-black ml-3">
                Go to generate page
              </Button>

            </div>
          </div>
        </div>  */}
      {/* <h1 className='mx-4 mt-2 mb-2'>Video Thumbnail</h1> */}
      {/* <div className='flex justify-between border-2 rounded-lg'>
          <div className='w-1/2 m-4'>
            <div>
              <Label htmlFor="email">Email Videos from</Label>
              <Select>
                <SelectTrigger className="w-[580px] my-2">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='my-20'>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value="Hey, {{First name}}, I made a video for you" />
              <div className='flex my-4'>
                {arr?.map(
                  (i) => {
                    return <p className='bg-white p-2 rounded-xl'> {i.name}<X className='cursor-pointer' onClick={() => {
                      {
                        setDeletePopUp(true)
                        setSegmentID(i.id)
                      }
                    }} /></p>
                  }
                )}
              </div>
            </div>
          </div>
          <div className='w-1/2 '>
            <Label htmlFor="email">Email Body (Must Include “Video” Tag)</Label>
            <div className=' m-4 '>
              <p>
                {data?.map((i, index) => {
                  // Find the matched segment
                  const matchedSegment = segmentData?.find(
                    (segment) => segment.start_time == i.start && segment.end_time == i.end
                  );
                  return (
                    <span
                      className="p-2 break-all"
                      onClick={() => handleDoubleClick(i.punctuated_word, i.start, i.end, index)}
                      key={index} // Added key for list items
                    >
                      {matchedSegment ? `{{${matchedSegment.segment}}}` : i.punctuated_word}
                    </span>
                  );
                })}
              </p>





            </div>
            <div className='flex flex-wrap justify-between bg-gray-300  border-r '>
              <div className='flex gap-4 m-4'>
                {arr?.map(
                  (i) => {
                    return <p className='bg-white p-2 rounded-xl'> {i.name}<X className='cursor-pointer' onClick={() => {
                      {
                        setDeletePopUp(true)
                        setSegmentID(i.id)
                      }
                    }} /></p>
                  }
                )}
              </div>
            </div>
            <div className='my-2 mb-2'>
              <Button className="bg-[#FFC000] text-black">Send to All 145 Emails
              </Button>
              <Button className="bg-[#FFC000] text-black ml-3">Reset all
              </Button>
            </div>
            <Label htmlFor="email">First just send a test email to: </Label>
            <div className='flex'>
              <Select>
                <SelectTrigger className="w-[580px] my-2">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-[#FFC000] text-black ml-1 mt-2">Send
              </Button>
            </div>
          </div>
        </div>  */}

      <AlertDialog open={deleteFilePopUp}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteFilePopUp(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#FF2E00]"
              onClick={() => deleteFile()}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deletePopUp}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment</AlertDialogTitle>
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
              className="bg-[#FF2E00]"
              onClick={(e) => deleteSegment(e)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload doc */}
      {/* <Dialog open={uploadDocPopup} onOpenChange={setUploadDocPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload CSV</DialogTitle>
          </DialogHeader>
          <div
            className="bg-[#FFF4D3] mt-4 h-32 gap-2 rounded-xl p-2 justify-center items-center flex flex-col cursor-pointer"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input
              id="file-upload" // Add an ID to associate with the label
            />
            <div className="text-[#E5AD00]">
              <Upload />
            </div>
            <div className="text-[#E5AD00]">Choose File</div>
          </div>

          <div className="gap-4 border-dashed justify-center flex flex-col items-center">
            {selectedFile?.name && <p>{selectedFile.name}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadDocPopup(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FFC000] text-black"
              onClick={() => {
                handleSendFile();
              }}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>  */}

      {/* thumb Popup */}
      {/* <Dialog open={uploadThumbPopup} onOpenChange={setUploadThumbPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Thumb</DialogTitle>
          </DialogHeader>
          <div
            className="bg-[#FFF4D3] mt-4 h-32 gap-2 rounded-xl p-2 justify-center items-center flex flex-col cursor-pointer"
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }} // Hide the input
              id="file-upload" // Add an ID to associate with the label
            />
            <div className="text-[#E5AD00]">
              <Upload />
            </div>
            <div className="text-[#E5AD00]">Choose File</div>
          </div>

          <div className="gap-4 border-dashed justify-center flex flex-col items-center">
            {selectedFile?.name && <p>{selectedFile.name}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setUploadThumbPopup(false);
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#FFC000] text-black"
              onClick={uploadNewThumb}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>  */}

      {filePreviewPopUp && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-80 z-40"></div>

          {/* Popup Content */}
          <div className="fixed left-[5%] top-[20%] right-[5%] z-50 grid sm:rounded-lg dark:border-neutral-800 gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200">
            {/* Close button */}
            <span
              onClick={() => setFilePreviewPopUp(false)}
              className="absolute right-4 w-12 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400"
            >
              <X className="h-8 w-8 cursor-pointer" />
            </span>

            {/* CSV Preview */}
            <div>CSV Preview</div>
            <div className="gap-4 border-dashed justify-center flex flex-col m-4 items-center">
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    {fileData?.headers?.map((header, index) => (
                      <TableHead key={index}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fileData?.records &&
                    fileData.records.map((record, index) => (
                      <TableRow key={index}>
                        {record.map((data, i) => (
                          <TableCell key={i}>{data}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Preview_video;
