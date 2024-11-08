'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '../../auth/header/page';
import { CSVLink, CSVDownload } from "react-csv";
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { videoArrayAtom } from '@/utils/atom';
import Image from 'next/image';
import { safeLocalStorage } from "@/lib/safelocastorage"
import { useToast } from '@/hooks/use-toast';
import { fetchData, postData, deleteData } from "../../../utils/api";
import { Download } from 'lucide-react';
const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Generate_video = () => {
  const searchParams = useSearchParams();
  const token = safeLocalStorage.getItem("token");
  const router = useRouter();
  const { toast } = useToast()
  const id = searchParams.get('id');
  const [socket, setSocket] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [fileData, setFileData] = useState({});
  const [videoArray, setVideoArray] = useAtom(videoArrayAtom);

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

  const getFile = async () => {
    try {
      const result = await fetchData(`api/csv/${id}`, {}, "csv");
      console.log(result, "=========resultfile");
      if (result.code == 200) {
        setHasFile(true);
        setFileData(result.result);
      }
    } catch (error) {
      console.log(error, "=========error");
    }
  };

  useEffect(() => {
    connectWebSocket()
    getFile()
  }, [])

  return (
    <div className="m-8 ">
      <Header />
      <div className="flex flex-wrap">
        <p className='py-2 px-3 cursor-pointer border w-[60px]' onClick={() => router.push(`/video/preview?id=${id}`)}>Back</p>

        {hasFile && (<CSVLink className='py-2 px-3 ml-2 cursor-pointer border ' data={fileData.records} headers={fileData.headers}>
          <Download
            className="text-neutral-400 border-2 rounded-3xl size-10 border-neutral-400 p-2 mr-2 cursor-pointer"
          />
        </CSVLink>)}
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
                className="border rounded-lg"
                src="/assets/web-icon-flat.jpg"
                alt="My Image"
                width={400}
                height={230}
              />)}

            <p className="text-center">Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generate_video;
