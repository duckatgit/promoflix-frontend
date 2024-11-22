"use client";
import React, { useEffect, useState } from "react";
import { NameLogo } from "@/components/ui/name-logo";
import { safeLocalStorage } from "@/lib/safelocastorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { fetchData } from "@/utils/api";

const Header = () => {
  const [name, setname] = useState("John Doe");
  const router = useRouter();
  const { toast } = useToast()
  useEffect(() => {
    const data = safeLocalStorage.getItem("name");
    setname(data);
  }, []);

  const logOutUser = () => {
    toast({
      description: "Logout SuccessfullY"
    })
    safeLocalStorage.removeItem('token')
    safeLocalStorage.removeItem('name')
    router.push('/auth/login');
  }

  const fetchBillingHistory = async () => {
    try {
      const baseUrl = process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : AUTH_URL;
      const response = await fetchData('api/plan/customer_portal', { return_url: baseUrl })
      if (response.code != 200) {
        alert("failed to fetch Billing History")
      }
      else {
        router.push(`${response.result}`);
      }
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="flex justify-between mt-2">
      <div className="cursor-pointer" onClick={() => router.push('/home/dashboard')}>
        <img src="/assets/semi-final 2 (1).png" alt="" />
      </div>
      <div style={{ width: "500px" }}></div>
      <div>
        {/* <NameLogo name={name} /> */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <NameLogo name={name} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={() => router.push('/home/dashboard/plans')}>Plans</DropdownMenuItem>
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={() => fetchBillingHistory()}>Billing History</DropdownMenuItem>
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={logOutUser}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
