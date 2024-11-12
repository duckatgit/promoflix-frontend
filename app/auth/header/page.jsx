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



  return (
    <div className="flex justify-between mt-2">
      <div >
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
            <DropdownMenuItem style={{ cursor: "pointer" }} onClick={logOutUser}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Header;
