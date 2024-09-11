"use client";
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
const login = () => {
  const router = useRouter(); // Initialize useRouter
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
      const response = await fetch('http://localhost:3004/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      console.log(data)
      if (data.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        })
      }
      else {
        toast({
          description: data.result.message,
        })
        router.push('/auth/login'); // Redirect to the dashboard page

      }
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

        <div className='h-screen w-screen flex justify-center items-center'>
          <Card className="w-[350px]">
            <CardHeader className="justify-center items-center">
              <img src="/assets/semi-final 2 (1).png" alt="" />
              <CardTitle>Welcome Back</CardTitle>
              <p className='text-xs'>Enter your email and password to access your account.</p>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" placeholder="Enter your email" value={form.email}
                      onChange={handleInput}
                    />

                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" value={form.password} placeholder="Enter your password"
                      onChange={handleInput}
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button className="w-full text-black" style={{ backgroundColor: "#FFC000" }} onClick={login_api}>Login</Button>
            </CardFooter>
            <p className="text-center text-sm my-2" >Do you have an account? <a href='/auth/signup'><span className="underline text-[#FFC000]">Sign up</span></a></p>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default login