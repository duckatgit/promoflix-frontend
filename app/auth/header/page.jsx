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
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";

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
      type: "success",
      title: "Logout",
      description: "You are logout successfullY"
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
      const response = await fetchData('api/plan/customer_portal', { return_url: `${baseUrl}/home/instance` })
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
    <div className="flex justify-between px-8 py-[10px] bg-white ">
      <div className="cursor-pointer" onClick={() => router.push('/home/instance')}>
        <img src="/assets/promo-logo.png" alt="" />
      </div>
      {/* <div style={{ width: "450px" }}></div> */}


      <div className="flex gap-10">
        <div className="relative border border-[#bababa] w-60 flex items-center rounded-lg px-2">
          {/* Search Icon */}
          <IoSearchOutline className="text-gray-500 text-lg" />

          {/* Search Input */}
          <input
            id="search"
            placeholder="Search"
            value=""
            className="w-full pl-2 outline-none border-none bg-transparent"
          // onChange={handleInputChange}  
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <NameLogo name={name} />
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent>
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={() => router.push('/home/dashboard/plans')}>Plans</DropdownMenuItem>
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={() => fetchBillingHistory()}>Billing History</DropdownMenuItem>
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={logOutUser}>Log out</DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
