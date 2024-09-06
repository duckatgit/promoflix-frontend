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
    <div className='h-screen w-screen flex justify-center items-center'>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button className="w-full" onClick={sign_up_api}>Submit</Button>
        </CardFooter>
      </Card>
    </div>

  )
}

export default sign_up