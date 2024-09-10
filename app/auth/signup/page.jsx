"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import Image from 'next/image'
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
const sign_up = () => {
  const router = useRouter(); // Initialize useRouter
  const { toast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,  // Update the specific field in the form object
    }));
  };

  let sign_up_api = async () => {
    try {
      const response = await fetch('http://localhost:3004/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      if (data.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        })
      }
      else {
        localStorage.setItem("email", form.email)
        toast({
          description: data.result,
        })
        router.push('/auth/otp'); // Redirect to the success page
      } // handle response data
    } catch (error) {
      alert(error.message)

    }
  }
  return (
    <div className='flex w-full'>
      <div className='w-1/2 '>
        <img src="/assets/Frame 16.png" alt="" className='w-full h-[100vh] ' />
      </div>
      <div className='w-1/2 flex'>
        <div className='flex w-full h-screen justify-center items-center border-none'>
          <Card >
            <CardHeader className="justify-center items-center px-14 py-6">
              <img src="/assets/semi-final 2 (1).png" alt="" />
              <CardTitle >Welcome</CardTitle>
              <p className='text-xs'>Enter your details to create your account</p>
            </CardHeader>
            <CardContent className="">
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter your name" value={form.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email" value={form.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" placeholder="Enter your password" value={form.password}
                      onChange={handleInputChange}  // Handle input change
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirm_password">Confirm Password</Label>
                    <Input id="confirm_password" placeholder="Re-Enter your password" value={form.password}
                      onChange={handleInputChange}  // Handle input change
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full text-black" style={{ backgroundColor: "#FFC000" }} onClick={sign_up_api}>Submit</Button>
            </CardFooter>
            <p className="text-center text-sm my-2">Already Have an Account?<a className="text-[#FFC000]" href='/auth/login'> Sign In</a></p>
          </Card>
        </div>
      </div>
    </div >

  )
}

export default sign_up