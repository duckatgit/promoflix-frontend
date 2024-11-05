'use client';

import React, { useEffect, useState, useRef } from 'react';
import Header from '../../auth/header/page';

import { useSearchParams } from 'next/navigation';
import { useAtom } from 'jotai';
import { videoArrayAtom } from '@/utils/atom';
import Image from 'next/image';
import { safeLocalStorage } from "@/lib/safelocastorage"

const hirelloSocket = process.env.NEXT_PUBLIC_VIDEO_HIRELLO_SOCKET;

const Generate_video = () => {
  const searchParams = useSearchParams();
  const token = safeLocalStorage.getItem("token");
  const id = searchParams.get('id');
  const [socket, setSocket] = useState(null);

  const [videoArray] = useAtom(videoArrayAtom);

  const connectWebSocket = () => {
    if (!socket) {
      const ws = new WebSocket(`${hirelloSocket}/${token}`); // Using the token in the URL
      ws.onopen = () => {
        console.log('Connected to the WebSocket server');
      };

      ws.onmessage = (event) => {
        console.log(event, "event")
        console.log('Message received from server: ', event.data);
        // setReceivedMessages((prevMessages) => [...prevMessages, event.data]);
        toast({
          description: "video generated successfully sucessfully",
        })
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

  useEffect(()=>{
    connectWebSocket()
  },[])

  return (
    <div className="m-8 ">
      <Header />
      <div className="flex flex-wrap justify-evenly">
        {videoArray?.map((item) => (
          <div className="w-[230px] mt-2" key={item.id}>
            <Image
              className="border rounded-lg"
              src="/assets/web-icon-flat.jpg"
              alt="My Image"
              width={230}
              height={230}
            />
            <p className="text-center">Status: {item.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Generate_video;
