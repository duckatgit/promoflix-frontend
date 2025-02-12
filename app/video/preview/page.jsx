"use client";

import React, { useEffect, useState, useRef } from "react";
import Header from "../../auth/header/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { fetchData, postData, deleteData } from "../../../utils/api";
import { v4 as uuidv4 } from 'uuid';
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

const whisperxSocker = process.env.NEXT_PUBLIC_VIDEO_WHISPERX_SOCKET;
const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Preview_video = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  // console.log('searchParams', searchParams.get('id'))
  const id = searchParams.get("id");
  // console.log('id', id)
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
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [hasFile, setHasFile] = useState(false);
  const [deleteFilePopUp, setDeleteFilePopUp] = useState(false);
  const [filePreviewPopUp, setFilePreviewPopUp] = useState(false);
  const [fileData, setFileData] = useState({});
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [csvUrlInput, setCsvUrlInput] = useState('')
  const [data, setData] = useState([]);
  const [segmentData, setSegmentData] = useState([]);
  const [transcriptSteps, setTranscriptSteps] = useState('Loading...')
  const fileInputRef = useRef(null);
  const [isHighlighted, setIsHighlighted] = useState({});
  const [socket, setSocket] = useState(null);
  const [videoArray, setVideoArray] = useState([]);
  const setCsvData = useSetAtom(csvDataAtom);
  const [selectedIndices, setSelectedIndices] = useState({
    start: null,
    end: null,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const startRef = useRef(null);
  const [highlightedSegment, setHighlightedSegment] = useState("");
  const [indexToVisible, setIndexToVisible] = useState(null);

  const [receivedMessages, setReceivedMessages] = useState([]);

  const connectWebSocket = () => {
    if (!socket) {
      const ws = new WebSocket(`${hirelloSocket}/${token}/${id}`); // Using the token in the URL
      ws.onopen = () => {
        console.log("Connected to the WebSocket server");
      };

      ws.onmessage = (event) => {
        console.log(event, "event");
        console.log("Message received from server: ", event.data);
        setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
        toast({
          description: "video generated successfully sucessfully",
        });
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
  const sendMessage = async () => {
    if (!hasFile && !csvUrlInput) {
      toast({
        variant: "destructive",
        title: "",
        description: "Please upload csv file or Spreadsheet url",
      })
      return;
    }

    if (hasFile) {
      const data = await postData(`api/v1/generate/${id}`, {}, "hirello");
      if (data.code == 200) {
        console.log(data)
        setVideoArray(data.result);
        router.push(`/video/generate?id=${id}`);
      }
    } else {
      let googleSheetId = ''

      const regex = /\/d\/([a-zA-Z0-9-_]+)/;
      const match = csvUrlInput.match(regex);
      if (match) {
        googleSheetId = match[1]; // The ID is the first captured group
      } else {
        toast({
          variant: "destructive",
          title: "",
          description: "Invalid url",
        })
        return;
      }

      const data = await postData(`api/googlesheet/${id}/${googleSheetId}`, {}, "csv");
      if (data.code == 200) {
        let newVidArr = []
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
              texts: [
                "up"
              ],
              message: "Video generation has started.",
              created_at: "2024-11-13T12:25:46.963",
              updated_at: "2024-11-13T12:25:46.963"
            })
          }
        }

        setVideoArray([...newVidArr]);
        router.push(`/video/generate?id=${id}`);
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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Store the selected file in state
      const fileInput = event.target;
      if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        fileInput.value = null; // Reset the input if the same file is selected again
        setSelectedFile(selectedFile);
      }
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
            description: "Csv file uploaded sucessfully",
          });
          getFile();
          setUploadDocPopup(false);
          setId("");
          setSelectedFile(null);
        }
      }
    } catch (error) {
      console.log(error, "==========error");
    }
  };
  const getAllSegment = async () => {
    try {
      const queryParams = {
        instance_id: id,
      };
      const result = await fetchData("api/v1/segment", queryParams, "hirello");
      if (result.code == 200) {
        setSegmentData(result?.result);
        if (result?.result?.length > 0) {
          let selected = {};
          for (let item of result?.result) {
            const word = item.highlight?.toLowerCase();
            // selected[word] = true;
            selected[word] = { start_time: item?.start_time, end_time: item?.end_time, highlight: true }
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
      console.log(result, "=========resultfile");
      if (result.code == 200) {
        setHasFile(true);
        setCsvData(result.result)
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
          description: "Csv file deleted sucessfully",
        });
        setHasFile(false);
        setCsvData(null)
        setDeleteFilePopUp(false);
      }
    } catch (error) {
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
          description: "Segment added SuccessfullY",
        });
        getAllSegment();
      }
      console.log("API Response:", responseData);
    } catch (error) {
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
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        });
      } else {
        toast({
          description: "Segment deleted sucessfully",
        });
        setDeletePopUp(false);
        getAllSegment();
      }
    } catch (error) {
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
            setTranscriptSteps(() => 'Loading...')

          } else {
            setTranscriptSteps(() => data?.step)
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
  const generateVideo = async () => {
    try {
      const data = await postData(`api/v1/generate/${id}`, {}, "hirello");
      if (data.code == 200) {
        toast({
          description: "Video generated sucessfully",
        });
      }
    } catch (error) {
      console.log(error, "========error");
    }
  };

  const handleMouseDown = (index) => {
    setIndexToVisible(index);
    setIsSelecting(true);
    setSelectedIndices({ start: index, end: index });
    startRef.current = index;
  };

  const handleMouseUp = (index) => {
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
    setInputValue(segment);
    myfunction(id);
  };

  const uploadNewThumb = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("thumb", selectedFile);
        const data = await postData(`api/v1/thumb/${id}`, formData, "hirello");
        if (data.code == 200) {
          toast({
            description: "Thumbnail uploaded sucessfully",
          });
          setVideoThumb(data?.result);
          setUploadThumbPopup(false);
          setSelectedFile(null);
          setId("");
        }
      }
    } catch (error) {
      console.log(error, "========error");
    }
  };
  useEffect(() => {
    if (id) {
      myfunction(id);
      getAllSegment();
      getFile();
      // connectWebSocket();
    }
  }, []);
  const video_url = videoUrl;
  let arr = [];
  if (segmentData) {
    arr = segmentData;
  }

  function cleanAndSplit(text) {
    // Step 1: Find and capture the special characters at the end of the string
    const removedChars = text.match(/[^a-zA-Z0-9\s]+$/);

    // Step 2: Remove the special characters from the end of the string
    const cleanedText = text.replace(/[^a-zA-Z0-9\s]+$/, '');

    // Step 3: Return an object with the cleaned word and the removed special characters
    return {
      newWord: cleanedText,
      removedChar: removedChars ? removedChars[0] : ''
    };
  }


  return (
    <div className="m-8 ">
      <Header />
      <div className="flex items-center justify-between ">

        <Button
          className='py-2 px-3 ml-4 cursor-pointer border w-[60px]'
          onClick={() => router.push(`/home/dashboard`)}
        >
          Back
        </Button>

        {/* {csvData && (
          <CSVLink
            className='py-2 m-0 cursor-pointer '
            filename={`${id}.csv`}
            data={csvData.records}
            headers={csvData.headers}
          >
            <Button variant="outline" >Download CSV</Button>
          </CSVLink>
        )} */}

      </div>
      <div>
        <div className="flex justify-between">
          <div className="w-1/2 m-4">
            {videoUrl && (
              <video width="600" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            {/* <p className="mt-2">Video Title</p> */}
          </div>
          <div className="w-1/2 m-4 shadow-2xl">
            <div className="flex flex-wrap justify-between bg-gray-300  border-r">
              <div className="flex gap-4 m-4">
                {arr?.map((i, index) => {
                  return (
                    <div
                      className={`bg-white p-2 rounded-xl flex gap-1`}
                      key={index}
                    >
                      {i.name}
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
              </div>
            </div>
            <div className=" m-4 ">
              {data && data.length > 0 ?
                <p>
                  {data?.map((i, index) => {
                    const word = i?.word?.trim()?.toLowerCase();
                    const value = inputValue.trim().toLowerCase();
                    let isYellow = i.start >= isHighlighted[word]?.start_time && i.end <= isHighlighted[word]?.end_time ? true : false;
                    // let isYellow = isHighlighted[word]?.highlight && i.id === isHighlighted[word].id;
                    const { newWord, removedChar } = cleanAndSplit(i.word)
                    return (
                      <>
                        {isYellow ?
                          <>
                            <span
                              className={`my-2 ${isYellow ? "bg-[#FEF08A]" : ""}`}
                              onMouseDown={() => handleMouseDown(index)}
                              onMouseUp={() => handleMouseUp(index)}
                              key={index} // Added key for list items
                            >
                              {newWord}
                            </span>
                            <span
                              className={`my-2 }`}
                              onMouseDown={() => handleMouseDown(index)}
                              onMouseUp={() => handleMouseUp(index)}
                              key={`${index}dup`} // Added key for list items
                            >
                              {removedChar}
                            </span>
                          </>
                          :
                          <span
                            className={`my-2 ${isYellow ? "bg-[#FEF08A]" : ""}`}
                            onMouseDown={() => handleMouseDown(index)}
                            onMouseUp={() => handleMouseUp(index)}
                            key={index} // Added key for list items
                          >
                            {i.word}
                          </span>}

                        {editingWordIndex !== null && indexToVisible == index && (
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
                              onChange={handleInputChange}
                            />
                            <div className="flex justify-between ">
                              <div
                                className="bg-gray-300 p-2 mx-2 my-1 text-gray-600"
                                onClick={handleTickClick}
                                style={{
                                  cursor: "pointer",
                                  borderRadius: "10px",
                                }}
                              >
                                <Check />
                              </div>
                              <div
                                className="bg-gray-300 p-2  mx-2 my-1 text-gray-600"
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
                      </>
                    );
                  })
                  }
                </p>
                : (
                  <div className="flex flex-col w-full h-[300px] justify-center items-center ">
                    <Image
                      src="/assets/tube-spinner.svg"
                      alt="Logo"
                      width={50}
                      height={50}
                    />
                    <p>{transcriptSteps}</p>

                  </div>
                )}

            </div>
          </div>
        </div>

        <h1 className="m-4">Upload Data From Document</h1>
        {!hasFile ? (
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
        )}
        <h1 className="mx-4 mt-2 mb-2">Video Thumbnail</h1>
        <div className="flex justify-around border-2 rounded-lg">
          <div className="w-2/5 m-4 relative h-[300px]">
            <Image
              layout="fill"
              className="rounded-2xl   object-cover"
              src={videoThumb}
              alt="videoThumbnail"

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
                      {/* {matchedSegment ? `{{${matchedSegment.segment}}}` : i.punctuated_word} */}
                    </span>
                  );
                })}
              </p>
            </div>
            {/* <div className='flex flex-wrap justify-between bg-gray-300  border-r '>
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
            </div> */}
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
        </div>
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
        </div> */}
      </div>

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
      <Dialog open={uploadDocPopup} onOpenChange={setUploadDocPopup}>
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
      </Dialog>

      {/* thumb Popup */}
      <Dialog open={uploadThumbPopup} onOpenChange={setUploadThumbPopup}>
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
      </Dialog>

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
