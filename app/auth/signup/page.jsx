"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { postData } from '@/utils/api';
import { LoadingSpinner } from '@/components/ui/spinner';

const Sign_up = () => {
  const router = useRouter();
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
  };

  let sign_up_api = async () => {
    try {
      setLoading(true);
      const response = await postData('api/auth/signup', {
        email: form.email,
        name: form.name,
        password: form.password,
      });

      if (response.code != 200) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        })
      }
      else {
        setLoading(false);
        localStorage.setItem("email", form.email)
        toast({
          description: "OTP sent to your email successfully.",
        })
        router.push('/auth/otp'); // Redirect to the success page
      } // handle response data
    } catch (error) {
      alert(error.message)

    }
  }
  return (
    <div className=' grid w-full grid-cols-1 md:grid-cols-2'>
      <div className='relative  '>
        <div className='font-[Kalnia] absolute top-6 left-6 text-white text-3xl underline underline-offset-8'>
          Promoflix
        </div>
        <div className='font-[Kalnia] absolute bottom-10 left-6 text-white text-5xl'>
          <div >
            Get Your
          </div>
          <div >
            Personalized
          </div>
          <div>
            Intro
          </div>
        </div>
        <img src="/assets/sign-in image.png" alt="" className='w-full p-1 h-[100vh] rounded-3xl' />
      </div>
      <div className='flex mx-4 md:mx-2'>
        <div className='flex w-full h-screen justify-center items-center border-none'>
          <Card >
            <CardHeader className="justify-center items-center px-14 py-6">
              <img src="/assets/semi-final 2 (1).png" alt="" />
              <CardTitle style={{
                fontSize: '32px'
              }} className=" font-[Kalnia] ">Welcome</CardTitle>
              <p className='text-xs'>Enter your details to create your account</p>
            </CardHeader>
            <CardContent className="">
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5 ">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" value={form.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 w-[400px]">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email" value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 w-[400px]">
                    <Label>Password</Label>
                    <Input id="password" placeholder="Enter your password" value={form.password}
                      onChange={handleInputChange}  // Handle input change
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 w-[400px]">
                    <Label>Confirm Password</Label>
                    <Input id="confirm_password" placeholder="Re-Enter your password" value={form.confirmPassword} onChange={handleInputChange} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full text-black" style={{ backgroundColor: "#FFC000" }} onClick={sign_up_api}>
                {loading ? (
                  <>
                    Submit <LoadingSpinner className="ml-2 text-white" />
                  </>
                ) : (
                  "Submit"
                )}</Button>
            </CardFooter>
            <p className="text-center text-sm my-2">Already Have an Account?<a className="text-[#FFC000] font-bold" href='/auth/login'> Sign In</a></p>
          </Card>
        </div>
      </div>
    </div >

  )
}

export default Sign_up