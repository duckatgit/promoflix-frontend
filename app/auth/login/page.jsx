"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { postData } from '@/utils/api';
import { useRouter } from 'next/navigation';

const Login = () => {
  const router = useRouter();
  const { toast } = useToast()
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const handleInput = (e) => {
    const { id, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value
    }))
  }

  let login_api = async () => {
    try {
      const response = await postData('api/auth/login', {
        email: form.email,
        password: form.password,
      });
      if (response.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        })
      }
      else {
        toast({
          description: "Login SuccessfullY"
        })
        localStorage.setItem("name", response?.result?.user?.name)
        localStorage.setItem("token", response.result.token.access_token)
        router.push('/home/dashboard'); // Redirect to the dashboard page
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <>
      <div className=' grid w-full grid-cols-1 md:grid-cols-2'>
        <div className='relative  '>
          <div className='font-[Kalnia] absolute top-6 left-6 text-white text-3xl underline underline-offset-8'>
            Promoflix
          </div>
          <div className='font-[Kalnia] absolute bottom-10 left-6 text-white text-5xl'>
            <div>
              Get Your
            </div>
            <div>
              Personalized
            </div>
            <div>
              Intro
            </div>
          </div>
          <img src="/assets/sign-in image.png" alt="" className='w-full p-1 h-[100vh] rounded-3xl' />
        </div>

        <div className='flex mx-4 md:mx-2'>
          <div className='h-screen w-screen flex justify-center items-center'>
            <Card>
              <div className="ml-32 mb-6 justify-center items-center">
                <img src="/assets/semi-final 2 (1).png" alt="" />
              </div>
              <CardHeader className="justify-center items-center">
                <CardTitle className=" font-[Kalnia]">Welcome Back</CardTitle>
                <p className='text-xs'>Enter your email and password to access your account.</p>
              </CardHeader>
              <CardContent>
                <form>
                  <div className="grid w-full items-center gap-4 ">
                    <div className="flex flex-col space-y-1.5 w-[400px]">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" value={form.email}
                        onChange={handleInput} />
                    </div>
                    <div className="flex flex-col space-y-1.5 w-[400px]">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" value={form.password} placeholder="Enter your password"
                        onChange={handleInput} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 justify-between">
                    <div>
                      <Checkbox id="terms" className="" />
                      <label
                        htmlFor="terms"
                        className="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember Password
                      </label>
                    </div>
                    <div>
                      <p><a href='/auth/signup'><span className=" text-[#FFC000] h-[18px] underline">Forgot Password</span></a></p>
                    </div>
                  </div>
                </form>

              </CardContent>
              <CardFooter className="flex justify-between">
                <Button className="w-full text-black" style={{ backgroundColor: "#FFC000" }} onClick={login_api}>Login</Button>
              </CardFooter>
              <p className="text-center text-sm my-2 mt-12">Do you have an account? <a href='/auth/signup'><span className="font-bold text-[#FFC000]">Sign up</span></a></p>
            </Card>
          </div>
        </div>
      </div><div>

      </div></>
  )
}

export default Login