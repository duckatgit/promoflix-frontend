"use client";
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';
import PasswordDesign from '@/components/common-designs/passwordManage';

const ForgotPassword = () => {
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



    return (
        <>
            <div className=' grid w-full grid-cols-1 md:grid-cols-2'>
                <div className='flex mx-4 md:mx-2'>
                    <div className='h-screen w-screen flex justify-center items-start pt-[50px]'>
                        <Card>
                            <div className="ml-[30px] mb-[75px] justify-center items-center">
                                <img src="/assets/promo-logo.png" alt="" />
                            </div>
                            <CardHeader className="">
                                <CardTitle className=" font-[Kalnia]">Forgot Password</CardTitle>
                                <p className='text-xs'>Please enter your email to receive a link to reset your password.</p>
                            </CardHeader>
                            <CardContent>
                                <form>
                                    <div className="grid w-full items-center gap-4 ">
                                        <div className="flex flex-col space-y-1.5 w-[400px]">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" placeholder="Enter your email" value={form.email}
                                                onChange={handleInput} />
                                        </div>
                                    </div>
                                </form>

                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button className="w-full text-white" style={{ backgroundColor: "#333333" }} >Submit</Button>

                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <div className='mt-[30px]'>
                    <PasswordDesign type="forgot" />
                </div>
            </div>
        </>
    )
}

export default ForgotPassword