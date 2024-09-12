import React from 'react'
import Header from "../../auth/header/page";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
const preview_video = () => {
  const arr = ['first name', "last name", "email", "address", "company"]
  const videoURL = 'https://rr5---sn-5hne6nzs.googlevideo.com/videoplayback?expire=1726162148&ei=hNDiZq6EBuKM6dsPnsepkQM&ip=195.123.218.149&id=o-AGi-O5LV1GjZapXJAS2Wzr2hasqiSu4AhXDQtA0BxqFT&itag=18&source=youtube&requiressl=yes&xpc=EgVo2aDSNQ%3D%3D&mh=rw&mm=31%2C29&mn=sn-5hne6nzs%2Csn-5hneknes&ms=au%2Crdu&mv=m&mvi=5&pl=23&initcwndbps=282500&bui=AQmm2exaM6IAwGK_gi1E3MVNZxgNo2tJIFTNd96PelvhoJYDGocK6Op8Xbwg8ujz5pgG5xBQuKu5-lKn&spc=Mv1m9rZoANGLTRP-3gXP7EGnsOLTwPv_QfOdRSpe17Pr09dUib2a9jw&vprv=1&svpuc=1&mime=video%2Fmp4&ns=P7YsEKm7ZVuoKUJzw8tAwSgQ&rqh=1&cnr=14&ratebypass=yes&dur=159.126&lmt=1709261862564317&mt=1726140088&fvip=4&c=WEB_CREATOR&sefc=1&txp=4538434&n=h-If6va70bYMYw&sparams=expire%2Cei%2Cip%2Cid%2Citag%2Csource%2Crequiressl%2Cxpc%2Cbui%2Cspc%2Cvprv%2Csvpuc%2Cmime%2Cns%2Crqh%2Ccnr%2Cratebypass%2Cdur%2Clmt&sig=AJfQdSswRQIhAIsdx7IxQin016_TWaOBMQ_Ob0dkK58uIbI7dD1_MUCHAiBP3MK3pShJ57Nb9urI8fS6vPAEZ8QVkXH8b67iiH0AFg%3D%3D&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=ABPmVW0wRAIgZWSEBmSnC4bVspeXp0vgbm2R-ljMadYifOzPcSGcpc4CIBx5wWNYMi0zjB0LX7zuCqk2RwdBwFcYhd_Ms108EI5P&title=New%20BUDOT%20dance%202021%20%5BMonkey%5D'; // Replace with your video URL

  return (
    <div className='m-8'>
      <Header />
      <div className='flex justify-between'>
        <div className='w-1/2 m-4'>
          <video width="600" controls>
            <source src={videoURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
        <div className='w-1/2 m-4'>
          <img className='rounded-2xl' src="https://i.iheart.com/v3/re/new_assets/610952da451455560ad79f24?ops=max(1060,0),quality(80)" alt="" />
        </div>
        <div className='w-1/2 m-4'>
          <div className='h-16 w-64 bg-[#FFF4D3] gap-2 rounded-xl p-2 justify-center items-center flex flex-col'>
            <div className='text-[#E5AD00]'>  < Upload />  </div>
            <div className='text-[#E5AD00]'> upload new Thumbnail  </div>
          </div>
          <div className='mt-4 px-4 border-2 rounded-xl'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever sinc.when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
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
    </div >
  )
}

export default preview_video