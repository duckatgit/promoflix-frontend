"use client";
import React, { useState } from 'react'
import { LoadingSpinner } from '@/components/ui/spinner';
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
import FormDesign from '@/components/common-designs/form-design';

const Login = () => {
  const router = useRouter();
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const response = await postData('api/auth/login', {
        email: form.email,
        password: form.password,
      });
      if (response.code != 200) {
        setLoading(false);
        toast({
          type: "error",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        })
      }
      else {
        setLoading(false);
        toast({
          type: "success",
          title: "Logged in",
          description: "You are logged in successfully"
        })
        localStorage.setItem("name", response?.result?.user?.name)
        localStorage.setItem("token", response.result.token.access_token)
        router.push('/home/instance'); // Redirect to the dashboard page
      }
    } catch (error) {
      setLoading(false);
      toast({
        type: "error",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      })
      alert(error.message)
    }
  }

  return (
    <>
      <div className=' grid w-full grid-cols-1 md:grid-cols-2'>
        <div className='flex mx-4 md:mx-2'>
          <div className='h-screen w-screen flex justify-center items-center'>
            <Card>
              <div className="ml-[30px] mb-6 justify-center items-center">
                <img src="/assets/promo-logo.png" alt="" />
              </div>
              <CardHeader className="">
                <CardTitle className=" font-[Kalnia]">Welcome Back</CardTitle>
                <p className='text-xs'>Enter your email and password to access your account.</p>
              </CardHeader>
              <CardContent>
                {/* <div className="flex items-center gap-5 mb-6">
                  <span className='border bg-[#F1F0F9] p-3' ><img src="/assets/devicon_google.png" alt="" /></span>
                  <span className='border bg-[#F1F0F9] p-3'> <img src="/assets/logos_facebook.png" alt="" /></span>
                </div> */}
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
                      <Checkbox id="terms" className="border border-[#D9D9D9]" />
                      <label
                        htmlFor="terms"
                        className="text-sm ml-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember Password
                      </label>
                    </div>
                    <div>
                      <p><a href='/auth/forgot-password'><span className=" text-[#E7680F] h-[18px] underline">Forgot Password</span></a></p>
                    </div>
                  </div>
                </form>

              </CardContent>
              <CardFooter className="flex justify-between">
                <Button className="w-full text-white" style={{ backgroundColor: "#333333" }} onClick={login_api}>
                  {loading ? (
                    <>
                      Login <LoadingSpinner className="ml-2 text-white" />
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>

              </CardFooter>
              <p className="ml-[24px] text-sm my-2 mt-12">{"Don't have an account yet?"} <a href='/auth/signup'><span className="font-bold text-[#E7680F]">Create a promoflix account</span></a></p>
            </Card>
          </div>
        </div>
        <div className='mt-[20px]'>
          <FormDesign type="login" />
        </div>
      </div>
    </>
  )
}

export default Login