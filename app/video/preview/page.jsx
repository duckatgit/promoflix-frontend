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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowUpDown,
  Check,
  X,
  ChevronDown,
  Cross,
  Trash,
  Upload,
  Delete,
  File,
  EyeIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  const [videoThumb, setVideoThumb] = useState();
  console.log(videoThumb, "videoThumb")
  const [transcript, setTranscript] = useState("");
  const [selectedWord, setSelectedWord] = useState('');
  const [segmentID, setSegmentID] = useState('');
  const [editingWordIndex, setEditingWordIndex] = useState(null); // Add this state
  const [textDialog, setTextDialog] = useState(false);
  const [inputVisible, setInputVisible] = useState(false);
  const [deletePopUp, setDeletePopUp] = useState(false);
  const [uploadDocPopup, setUploadDocPopup] = useState(false);
  const [uploadThumbPopup, setUploadThumbPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file
  const [hasFile, setHasFile] = useState(false)
  const [deleteFilePopUp, setDeleteFilePopUp] = useState(false);
  const [filePreviewPopUp, setFilePreviewPopUp] = useState(false);
  const [fileData, setFileData] = useState({});
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [inputValue, setInputValue] = useState('');
  const [inputPosition, setInputPosition] = useState({ top: 0, left: 0 });
  const textareaRef = useRef(null);
  const [data, setData] = useState([])
  const [segmentData, setSegmentData] = useState([])
  const fileInputRef = useRef(null);
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
    };
  }
  const handleSendFile = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('csv', selectedFile);
        const response = await fetch(`http://54.225.255.162/api/csv/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        console.log(data, 'data')
        if (data.code == 200) {
          toast({
            description: "Csv file uploaded sucessfully",
          })
          getFile()
          setUploadDocPopup(false);
          setId("")
          setSelectedFile(null)
        }

      }
    } catch (error) {
      console.log(error, '==========error')
    }
  }
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
      console.log(segment_data, "manisj")
      if (segment_data.code == 200) {
        setSegmentData(segment_data.result)
      }
    } catch (error) {
      console.log(error, '========error')
      return error
    }

  }
  const getFile = async () => {
    try {
      const response = await fetch(`http://54.225.255.162/api/csv/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data.result, 'data.result')
      if (data.code == 200) {
        setHasFile(true)
        setFileData(data.result)
      }
    } catch (error) {
      console.log(error, '=========error')
    }
  }
  const deleteFile = async () => {
    try {
      const response = await fetch(`http://54.225.255.162/api/csv/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.code == 200) {
        setHasFile(false)
        setDeleteFilePopUp(false)
      }
    } catch (error) {
      console.log(error, '========error')
    }
  }

  const handleDoubleClick = (word, start, end, index) => {
    console.log(start, end, "eeeeeeeeee")
    setEditingWordIndex(index);
    setInputVisible(true)
    setStartTime(start)
    setEndTime(end)
    setInputValue(word)
    myfunction(id)
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
      const transcript_data = await get_transcript.json();
      const video_data = await response.json();
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
  const generateVideo = async () => {
    try {
      const generate_video = await fetch(`http://54.225.255.162/api/v1/generate/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const generatedVideoData = await generate_video.json();
      if (generatedVideoData.code == 200) {
        toast({
          description: "Video generated sucessfully",
        })
      }
    } catch (error) {
      console.log(error, '========error')
    }
  }
  //upload thum

  const uploadNewThumb = async () => {
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('thumb', selectedFile);
        const response = await fetch(`http://54.225.255.162/api/v1/thumb/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await response.json();
        console.log(data, 'thumbdata')
        if (data.code == 200) {
          toast({
            description: "Thumbnail uploaded sucessfully",
          })
          setVideoThumb(data?.result)
          setUploadThumbPopup(false);
          setSelectedFile(null)
          setId("")
        }
      }
    } catch (error) {
      console.log(error, '========error')
    }
  }
  useEffect(
    () => {
      if (id) {
        myfunction(id)
        getAllSegment()
        getFile()
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
    <div className='m-8 '>
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
        {!hasFile ?
          <div className=' border-2 rounded-md	'>
            <div className='m-4 flex b'>
              <div className='my-4 '>
                <Button className="bg-[#28434B]" onClick={(e) => { setUploadDocPopup(true) }}> Upload Data</Button>
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
          </div> :
          <div className='flex-col border-2 md-2 w-1/2 mt-2 p-2 rounded-r-xl  '>
            <div className='flex justify-between'>
              <div className='flex'>
                <File className='mt-2' />
                <p className='p-2'> File.csv</p>
              </div>
              <div className='flex'>
                <EyeIcon onClick={() => {
                  setFilePreviewPopUp(true)
                }} className='text-neutral-400 border-2 rounded-3xl size-10 border-neutral-400 p-2 mr-2 cursor-pointer' />
                <Trash onClick={() => {
                  setDeleteFilePopUp(true)
                }} className='text-red-600 border-2 rounded-3xl size-10 border-red-600 p-2 cursor-pointer' />
              </div>
            </div>
          </div>}
        <h1 className='mx-4 mt-2 mb-2'>Video Thumbnail</h1>
        <div className='flex justify-between border-2 rounded-lg'>
          <div className='w-1/2 m-4 relative h-[500px]'>
            <Image layout='fill' className='rounded-2xl   object-cover' src={videoThumb} alt="" />
          </div>
          <div className='w-1/2 m-4'>
            <div className='h-16 w-64 bg-[#FFF4D3] gap-2 rounded-xl p-2 justify-center items-center flex flex-col cursor-pointer' onClick={() => {
              setUploadThumbPopup(true)
            }}>
              <div className='text-[#E5AD00]'>  < Upload />  </div>
              <div className='text-[#E5AD00]' > upload new Thumbnail  </div>
            </div>
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
            <div className='my-2'>
              <Button className="bg-[#FFC000] text-black" onClick={() => {
                generateVideo()
              }}>Merge Video</Button>
              <Button className="bg-[#FFC000] text-black ml-3">Reset all</Button>
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
        </div>
      </div>


      <AlertDialog open={deleteFilePopUp} >
        <AlertDialogTrigger >
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete File</AlertDialogTitle>
            <AlertDialogDescription>
              Do you really want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteFilePopUp(false)
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[#FF2E00]" onClick={() => deleteFile()} >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>




      <AlertDialog open={deletePopUp} >
        <AlertDialogTrigger >
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Segment</AlertDialogTitle>
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


      {/* Upload doc */}
      <Dialog open={uploadDocPopup} onOpenChange={setUploadDocPopup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload CSV</DialogTitle>
          </DialogHeader>
          <div
            className='bg-[#FFF4D3] mt-4 h-32 gap-2 rounded-xl p-2 justify-center items-center flex flex-col cursor-pointer'
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the input
              id="file-upload" // Add an ID to associate with the label
            />
            <div className='text-[#E5AD00]'><Upload /></div>
            <div className='text-[#E5AD00]'>Choose File</div>
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
            className='bg-[#FFF4D3] mt-4 h-32 gap-2 rounded-xl p-2 justify-center items-center flex flex-col cursor-pointer'
            onClick={() => {
              fileInputRef.current.click();
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the input
              id="file-upload" // Add an ID to associate with the label
            />
            <div className='text-[#E5AD00]'><Upload /></div>
            <div className='text-[#E5AD00]'>Choose File</div>
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
              className="absolute right-4 w-12 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400">
              <X className="h-8 w-8" />
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


    </div >
  )
}

export default preview_video