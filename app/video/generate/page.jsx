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
import { FileVideo2 } from 'lucide-react';
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
        console.log(event, "event")
        // console.log('Message received from server: ', JSON.parse(event.data));

        const updatedData = JSON.parse(event.data)?.GeneratedVideo

        console.log('updatedData', updatedData)
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
    if (videoArray && csvData) {
      videoArray.forEach((video, videoIndex) => {
        setCsvData((preCsvData) => {
          const newCsvRecords = preCsvData?.records.map((data, recordIndex) => {
            // const isIncluded = data.some(item => video.texts.includes(item));
            if (videoIndex === recordIndex && video.status === 'succeeded' && !data.includes(video.video_url)) {
              let newCsvRecData = [...data]
              return [...newCsvRecData, video.video_url, video.thumbnail, video.gif, video.status]
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

  useEffect(() => {
    if (csvData && csvData?.headers) {
      setCsvData((preData) => {
        if (!preData?.headers.includes('url') || !preData?.headers.includes('thumbnail')) {
          console.log('preData', preData, !preData?.headers.includes('url'), !preData?.headers.includes('thumbnail'))
          return { ...preData, headers: [...preData.headers, 'url', 'thumbnail', 'gif', 'status'] }
        } else {
          return preData
        }
      })
    }
  }, [])

  console.log(csvData)

  console.log('videoArray', videoArray)

  return (
    <div className="m-8 ">
      <Header />
      <div className="flex items-center justify-between ">

        <Button
          className='py-2 px-3 ml-4 cursor-pointer border w-[60px]'
          onClick={() => router.push(`/video/preview?id=${id}`)}
        >
          Back
        </Button>

        {csvData && (
          <CSVLink
            className='py-2 m-0 cursor-pointer '
            filename={`${id}.csv`}
            data={csvData.records}
            headers={csvData.headers}
          >
            <Button variant="outline" >Download CSV</Button>
          </CSVLink>
        )}

      </div>


      <div className="flex flex-wrap ml-4 border justify-around">
        <div className='w-full p-4 font-bold '>
          <p>Generated Videos</p>

        </div>
        {videoArray && videoArray.length > 0 ? videoArray?.map((item, index) => {
          const findKeyword = csvData?.records[index][0] || ''
          return (
            <div className="w-[300px] mt-2 mb-2 ml-2" key={item.id}>
              {item?.video_url ?
                (
                  <div className='flex w-[300px] p-4 overflow-hidden border'>
                    <div className='flex flex-col items-center w-3/5 border-r-2 p-2'>
                      <video width="150" controls>
                        <source src={item?.video_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <div className='flex flex-col items-start pl-2 w-2/5'>
                      <p className="text-center font-bold">{findKeyword.charAt(0).toUpperCase() + findKeyword.slice(1)}</p>
                    </div>
                  </div>
                )
                :
                (
                  <div className='flex w-[300px] p-4 overflow-hidden border'>
                    <div className='flex flex-col items-center w-3/5 border-r-2 p-2'>
                      <FileVideo2 size={60} strokeWidth={1} className="" key={item.id} />
                      <p className="text-center">{item.status}</p>
                    </div>
                    <div className='flex flex-col items-start pl-2 w-2/5'>
                      <p className="text-center font-bold">{findKeyword.charAt(0).toUpperCase() + findKeyword.slice(1)}</p>
                    </div>
                  </div>
                )}

            </div>
          )

        }) : <p className='mt-2 mb-16'>No data found</p>}
      </div>
    </div>
  );
};

export default Generate_video;
