'use client'

import React, { useEffect, useState, useRef } from 'react'
import Header from "../../auth/header/page";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import axios from "axios";

import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowUpDown,
  Check,
  X,
  ChevronDown,
  Cross,
  Trash,
  Upload,
} from "lucide-react";
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
import Image from 'next/image';
import { Textarea } from '@/components/ui/textarea';
const preview_video = () => {
  const { toast } = useToast()
  const id = window.location.href.split("id=")[1]
  const token = localStorage.getItem("token");
  const [videoUrl, setVideoUrl] = useState();
  const [videoThumb, setVideoThumb] = useState("");
  const [transcript, setTranscript] = useState("");
  const [selectedWord, setSelectedWord] = useState('');
  const [segmentID, setSegmentID] = useState('');
  const [editingWordIndex, setEditingWordIndex] = useState(null); // Add this state
  const [textDialog, setTextDialog] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);


  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [inputValue, setInputValue] = useState('');
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
  console.log(inputPosition, "inputPosition")
  const textareaRef = useRef(null);
  const [data, setData] = useState([])
  const [segmentData, setSegmentData] = useState([])


  const handleChange = (e) => {
    setText(e.target.value);
  };

  const getAllSegment = async () => {
    try {
      const response = await axios.get('http://54.225.255.162/api/v1/segment', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          instance_id: id
        },
      });
      let segment_data = response.data
      if (segment_data.code == 200) {
        setSegmentData(segment_data.result)
      }
    } catch (error) {
      console.log(error, '========error')
      return error
    }

  }


  const handleDoubleClick = (word, start, end, index) => {
    console.log(start, end, "eeeeeeeeee")
    setEditingWordIndex(index);
    setInputVisible(true)
    setStartTime(start)
    setEndTime(end)
    setInputValue(word)
  };
  const handleTickClick = async () => {
    try {
      const response = await fetch(`http://54.225.255.162/api/v1/segment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: inputValue,
          start_time: `${startTime}`,
          segment: inputValue,
          instance_id: id,
          end_time: `${endTime}`
        }),
      });
      const data = await response.json();
      if (data.code == 200) {
        toast({
          description: "Segment added SuccessfullY"
        })
        getAllSegment()
      }
      console.log('API Response:', data);
    } catch (error) {
      console.error('Error in API call:', error);
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
      const response = await axios.delete('http://54.225.255.162/api/v1/segment', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          id: segmentID
        },
      });
      if (response.data.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        })
      }
      else {
        toast({
          description: "Segment deleted sucessfully",
        })
        setDeletePopUp(false)
        getAllSegment()
      }
    } catch (error) {
      console.log(error, '=========error')
    }
  }
  const myfunction = async (id) => {
    try {
      const response = await fetch(`http://54.225.255.162/api/v1/file/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const get_transcript = await fetch(`http://54.225.255.162/api/v1/transcript/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const video_data = await response.json();
      const transcript_data = await get_transcript.json();
      console.log(transcript_data, "transcript_data")

      setData(transcript_data?.result?.words)
      console.log(transcript_data?.result?.words?.map(
        (data) => {
          return (
            data.start,
            data.end

          )
        }
      ), "transcript_data")
      console.log(video_data, "data")
      if (video_data.code == 200) {
        setVideoUrl(video_data.result.url)
        setVideoThumb(video_data.result.thumbnail)
      }
      if (transcript_data.code == 200) {
        setTranscript(transcript_data.result.transcript)
      }
    } catch (error) {
      console.log(error, '==========error')
    }
  }
  useEffect(
    () => {
      if (id) {
        myfunction(id)
        getAllSegment()
      }
    }, []
  )
  const video_url = videoUrl
  let arr = []
  if (segmentData) {
    console.log(segmentData, 'segmentData')
    arr = segmentData
  }
  console.log(arr, 'arr')
  return (
    <div className='m-8'>
      <Header />
      <div>
        <div className='flex justify-between'>
          <div className='w-1/2 m-4'>
            {videoUrl &&
              <video width="600" controls>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>}
            <p className='mt-2'>Video Title</p>
          </div>
          <div className='w-1/2 m-4 shadow-2xl'>
            <div className='flex flex-wrap justify-between bg-gray-300  border-r'>
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
            <div className=' m-4 '>
              <p>
                {data?.map(
                  (i, index) => {
                    return (
                      <span className="p-2 " onClick={() => handleDoubleClick(i.punctuated_word, i.start, i.end, index)}> {i.punctuated_word}</span>

                    )
                  }
                )}
              </p>
              {editingWordIndex !== null && (
                <div
                  className='w-1/2'
                  style={{
                    display: 'flex',
                    backgroundColor: '#fff',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    zIndex: 10,
                  }}
                >
                  <Input
                    value={inputValue}
                    onChange={handleInputChange}

                  />
                  <div className="flex justify-between ">
                    <div className='bg-gray-300 p-2 mx-2 my-1 text-gray-600' onClick={handleTickClick} style={{ cursor: 'pointer', borderRadius: '10px' }}><Check /></div>
                    <div className='bg-gray-300 p-2  mx-2 my-1 text-gray-600' onClick={handleCrossClick} style={{ cursor: 'pointer', borderRadius: '10px' }}><X /></div>
                  </div>
                </div>
              )}




            </div>
          </div>
        </div>
        <h1 className='m-4'>Upload Data From Document</h1>
        <div className='m-4 border-2 rounded-md	'>
          <div className='m-4 flex b'>
            <div className='my-4 '>
              <Button className="bg-[#28434B]"> Upload Data</Button>
            </div>
            <div className='my-6 mx-4'>
              <p>or </p>
            </div>
            <div className="flex-col space-y-1.5 my-4">
              <Input id="email" type="text" placeholder="Paste Spreadsheet URL" />
            </div>
          </div>
          <div className='m-4 text-gray-500'>
            File Must be .xls, .xlsx, .xlsm, .xlt, .xltx, . (Excel or google a sheet).
          </div>
        </div>
        <h1 className='mx-4 mt-2 mb-2'>Video Thumbnail</h1>
        <div className='flex justify-between border-2 rounded-lg'>
          <div className='w-1/2 m-4 relative h-[500px]'>
            <Image layout='fill' className='rounded-2xl   object-cover' src={videoThumb} alt="" />
          </div>
          <div className='w-1/2 m-4'>
            <div className='h-16 w-64 bg-[#FFF4D3] gap-2 rounded-xl p-2 justify-center items-center flex flex-col'>
              <div className='text-[#E5AD00]'>  < Upload />  </div>
              <div className='text-[#E5AD00]'> upload new Thumbnail  </div>
            </div>
            <div className=' m-4 '>
              <p>
                {data?.map(
                  (i, index) => {
                    return (
                      <span className="p-2 " onClick={() => handleDoubleClick(i.punctuated_word, i.start, i.end, index)}> {i.punctuated_word}</span>

                    )
                  }
                )}
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
            <div className='my-2'>
              <Button className="bg-[#FFC000] text-black">Upload
              </Button>
              <Button className="bg-[#FFC000] text-black ml-3">Reset all
              </Button>
            </div>
          </div>
        </div>
        <h1 className='mx-4 mt-2 mb-2'>Video Thumbnail</h1>
        <div className='flex justify-between border-2 rounded-lg'>
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
                {data?.map(
                  (i, index) => {
                    return (
                      <span className="p-2 " onClick={() => handleDoubleClick(i.punctuated_word, i.start, i.end, index)}> {i.punctuated_word}</span>

                    )
                  }
                )}
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
        </div>
      </div>






      <AlertDialog open={deletePopUp} >
        <AlertDialogTrigger >
          <Trash className="h-4 w-4 text-red-500" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeletePopUp(false)
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[#FF2E00]" onClick={(e) => deleteSegment(e)} >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>






    </div >
  )
}

export default preview_video