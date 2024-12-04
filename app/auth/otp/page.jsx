"use client"
import React, { useState, useEffect } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import { postData } from '@/utils/api'
const OtpComponent = () => {
  const router = useRouter();
  const [value, setValue] = React.useState("")
  const [email, setEmail] = useState('');
  const { toast } = useToast()

  const [resendTimer, setResendTimer] = useState(0); // Start with no timer (0 means button enabled)
  const [canResend, setCanResend] = useState(true); // Button starts enabled

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  // Resend OTP API
  const handle_resend_otp_api = async () => {
    setCanResend(false);  // Disable the button
    setResendTimer(25);   // Start the 25-second timer


    const response = await postData('api/auth/send-otp', {

      email: email,

    });
    const data = await response.json();

    if (data.code !== 200) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: data.result,
      });
    } else {
      toast({
        description: data.result,
      });
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timerId = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer]);

  // OTP API verification
  const handle_otp_api = async () => {
    try {
      let otpVal = Number(value)
      const response = await postData('api/auth/verify', {
        otp: otpVal,
        email: email,

      });
  
      if (response.code !== 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.result,
        });
      } else {
        toast({
          type: "success",
          description: "Otp Matched Successfully",
        });
        localStorage.setItem("name", response?.result?.user?.name)
        localStorage.setItem("token", response.result.token.access_token)
        router.push('/home/instance'); // Redirect to the dashboard page
        // router.push('/auth/login'); // Redirect to the success page
      }
    } catch (error) {
      console.log(error, '========error');
    }
  };

  useEffect(() => {
    if (Number(value.length) === 4) {
      handle_otp_api()
    }
  }, [value])
  return (
    <div className='grid w-full grid-cols-1 md:grid-cols-2'>
      <div className='relative'>
        <div className='font-[Kalnia] absolute top-6 left-6 text-white text-3xl underline underline-offset-8'>
          Promoflix
        </div>
        <div className='font-[Kalnia] absolute bottom-10 left-6 text-white text-5xl'>
          <div>Get Your</div>
          <div>Personalized</div>
          <div>Intro</div>
        </div>
        <img src="/assets/sign-in image.png" alt="" className='w-full p-1 h-[100vh] rounded-3xl' />
      </div>
      <div className=''>
        <div className='mb-4 items-center justify-center flex mt-24'>
          <img src="/assets/semi-final 2 (1).png" alt="" />
        </div>
        <div className='mt-24 flex items-center justify-center'>
          <div className="text-center items-center justify-center text-sm">
            <div className='mb-4'>
              <p className='font-bold text-3xl'>Enter OTP</p>
              <p className='text-sm'>Please enter your one time password that is sent to your email</p>
            </div>
            <div className='my-4'>
              <div className='flex justify-center'>
                <InputOTP
                  maxLength={4}
                  value={value}
                  onChange={(value) => setValue(value)}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div
                className={`text-blue-600 underline my-2 cursor-pointer ${!canResend ? 'opacity-50' : ''}`}
                onClick={canResend ? handle_resend_otp_api : undefined} // Disable if resend is not allowed
              >
                {canResend ? 'Resend OTP' : `Resend OTP in ${resendTimer}s`}
              </div>
            </div>
            {/* <Button className="text-black w-full mt-8 bg-yellow-400 hover:shadow-xl hover:bg-yellow-500" onClick={handle_otp_api}>Submit</Button> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtpComponent;
