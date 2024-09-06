"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
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
      console.log(data); // handle response data
      alert('Login successful');
      setEmail("")
      setPassword("")
    } catch (error) {
      alert(error.message)
    }
  }
  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
          <Button className="w-full" onClick={login_api}>Login</Button>
        </CardFooter>
        <p className="text-center text-sm my-2" >Do you have an account? <a href='/auth/signup'><span className="underline">Sign up</span></a></p>
      </Card>
    </div>
  )
}

export default login