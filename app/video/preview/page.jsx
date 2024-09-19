'use client'

import React, { useEffect, useState } from 'react'
import Header from "../../auth/header/page";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  ChevronDown,
  Trash,
  Upload,
} from "lucide-react";
import Image from 'next/image';
const preview_video = () => {
  const token = localStorage.getItem("token");
  const [videoUrl, setVideoUrl] = useState();
  const [videoThumb, setVideoThumb] = useState("");
  const [transcript, setTranscript] = useState("");




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
      let id = window.location.href.split("id=")[1]
      if (id) {

        myfunction(id)
      }
    }, []
  )
  const video_url = videoUrl
  console.log(video_url, 'video_url')
  const arr = ['first name', "last name", "email", "address", "company"]
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
                    return <p className='bg-white p-2 rounded-xl'> {i} </p>
                  }
                )}
              </div>
            </div>
            <div className='mt-4 px-4'>
              {transcript}
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
            <div className='mt-4 px-4 border-2 rounded-xl'>
              {transcript}
            </div>
            <div className='flex flex-wrap justify-between bg-gray-300  border-r '>
              <div className='flex gap-4 m-4'>
                {arr?.map(
                  (i) => {
                    return <p className='bg-white p-2 rounded-xl'> {i} </p>
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
                    return <p className='bg-white p-2 rounded-3xl border-2'> {i} </p>
                  }
                )}
              </div>
            </div>
          </div>
          <div className='w-1/2 '>
            <Label htmlFor="email">Email Body (Must Include “Video” Tag)</Label>
            <div className='mt-2 px-2 border-2 rounded-xl m-2 p-2'>
              {transcript}
            </div>
            <div className='flex flex-wrap justify-between bg-gray-300  border-r '>
              <div className='flex gap-4 m-4'>
                {arr?.map(
                  (i) => {
                    return <p className='bg-white p-2 rounded-xl'> {i} </p>
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


    </div >
  )
}

export default preview_video