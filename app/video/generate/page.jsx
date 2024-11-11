'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '../../auth/header/page';
import { CSVLink } from "react-csv";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { videoArrayAtom, csvDataAtom } from '@/utils/atom';
import Image from 'next/image';
import { safeLocalStorage } from "@/lib/safelocastorage"
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Generate_video = () => {
  const searchParams = useSearchParams();
  const token = safeLocalStorage.getItem("token");
  const router = useRouter();
  const { toast } = useToast()
  const id = searchParams.get('id');
  const [socket, setSocket] = useState(null);
  const [videoArray, setVideoArray] = useAtom(videoArrayAtom);
  const [csvData, setCsvData] = useAtom(csvDataAtom)

  const connectWebSocket = () => {
    if (!socket) {
      const ws = new WebSocket(`${hirelloSocket}/${token}`); // Using the token in the URL
      ws.onopen = () => {
        console.log('Connected to the WebSocket server');
      };

      ws.onmessage = (event) => {
        // console.log(event, "event")
        // console.log('Message received from server: ', JSON.parse(event.data));

        const updatedData = JSON.parse(event.data)?.GeneratedVideo

        if (updatedData && updatedData.length > 0) {
          setVideoArray((prevState) => {
            return prevState.map((data) => {
              if (data.id === updatedData[0].id) {
                return updatedData[0]
              }
              return data
            })
          })
          toast({
            description: updatedData[0].message,
          })

          const targetUrl = `/video/generate?id=${id}`;
          if (router.pathname !== '/video/generate' || router.query.id !== id) {
            // Only navigate if we are not already on the target page
            setTimeout(() => {
              console.log(`Navigating to ${targetUrl}`);
              router.push(targetUrl);
            }, 0);
          }
        }

        // setReceivedMessages((prevMessages) => [...prevMessages, event.data]);

      };

      ws.onerror = (error) => {
        console.error('WebSocket Error: ', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };
      setSocket(ws); // Store the WebSocket instance
    }
  };

  useEffect(() => {
    connectWebSocket()
  }, [])


  const updateCsvData = () => {
    if (videoArray) {
      videoArray.forEach((video, videoIndex) => {
        setCsvData((preCsvData) => {
          const newCsvRecords = preCsvData.records.map((data, recordIndex) => {
            // const isIncluded = data.some(item => video.texts.includes(item));
            if (videoIndex === recordIndex && video.status === 'succeeded' && !data.includes(video.video_url)) {
              let newCsvRecData = [...data]
              return [...newCsvRecData, video.video_url]
            } else {
              return data
            }
          })
          return { ...preCsvData, records: newCsvRecords }
        })
      })
    }
  }

  useEffect(() => {
    updateCsvData()
  }, [videoArray])

  return (
    <div className="m-8 ">
      <Header />
      <div className="flex items-center justify-between">

        <Button
          className='py-2 px-3 cursor-pointer border w-[60px]'
          onClick={() => router.push(`/video/preview?id=${id}`)}
        >
          Back
        </Button>

        {csvData && (
          <CSVLink
            className='py-2 px-3 ml-2 cursor-pointer '
            filename={`${id}.csv`}
            data={csvData.records}
            headers={csvData.headers}
          >
            <Button variant="outline" >Download CSV</Button>
          </CSVLink>
        )}

      </div>


      <div className="flex flex-wrap justify-evenly">
        {videoArray?.map((item) => (
          <div className="w-[400px] mt-2" key={item.id}>
            {item?.video_url ?
              (
                <video width="400" controls>
                  <source src={item?.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )
              :
              (<Image
                src="/assets/web-icon-flat.jpg"
                alt="My Image"
                width={400}
                height={230}
                className="border rounded-lg w-[400px] h-[225px]"
                objectFit='stretch'
              />)}

            <p className="text-center">Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generate_video;
