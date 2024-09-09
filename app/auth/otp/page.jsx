"use client"
import React, { useState, useEffect } from 'react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const OtpComponent = () => {
  const router = useRouter(); // Initialize useRouter
  const [value, setValue] = React.useState("")
  const [email, setEmail] = useState('');
  const { toast } = useToast()

  // Timer state and button disable state
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

    const response = await fetch('http://localhost:3004/api/send_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
      }),
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
      const response = await fetch('http://localhost:3004/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp: otpVal,
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

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
        router.push('/auth/login'); // Redirect to the success page
      }
    } catch (error) {
      console.log(error, '========error');
    }
  };

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <div className="space-y-2">
        <h1>Please check your email</h1>
        <div className="text-center text-sm">
          {value == "" ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
        <InputOTP
          maxLength={4}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>

        {/* Resend OTP button with timer */}
        <Button
          onClick={handle_resend_otp_api}
          disabled={!canResend}  // Disable when canResend is false
        >
          {canResend ? "Resend OTP" : `Resend OTP in ${resendTimer}s`}  {/* Show countdown when disabled */}
        </Button>

        <Button className="w-full" onClick={handle_otp_api}>Submit</Button>
      </div>
    </div>
  )
}

export default OtpComponent;
