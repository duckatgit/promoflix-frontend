import React, { useEffect, useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { fetchData } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { safeLocalStorage } from "@/lib/safelocastorage";
import { NameLogo } from "./name-logo";

const Sidebar = () => {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("John Doe");

    const router = useRouter();
    const { toast } = useToast()
    const [isCollapsed, setIsCollapsed] = useState(false);
    console.log(isCollapsed, "tt");

    useEffect(() => {
        const name = safeLocalStorage.getItem("name");
        const email = safeLocalStorage.getItem("email");
        setName(name);
        setEmail(email)
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
        <div className={`max-w-[30%] bg-white   transition-all duration-300 flex flex-col  items-start relative rounded-lg ${isCollapsed ? "w-[60px] collapsed" : ""}`}>
            <div
                className="sidebar-icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                aria-label="Toggle Sidebar"
            >
                {isCollapsed ? <CiCircleChevRight size={20} className="text-[#E7680F]" /> : <CiCircleChevLeft size={20} className="text-[#E7680F]" />}
            </div>

            <div className="sidebar-content">
                <div className="border-b-4 border-[#edeef2] p-2">


                    <div className="menu-item hover:menu-item-active" onClick={() => router.push('/home/dashboard/plans')}>
                        <span className="icon">
                            <img
                                src="/assets/pricing-plans-icon.png"
                                alt="Pricing Plans Icon"
                            />
                        </span>
                        <span className="text">Pricing Plans</span>
                    </div>
                    <div className="menu-item hover:menu-item-active" onClick={() => fetchBillingHistory()}>
                        <span className="icon">
                            <img src="/assets/billing-icon.png" alt="Billing History Icon" />
                        </span>
                        <span className="text">Billing History</span>
                    </div>
                </div>
            </div>
            <div className="border-b-2 border-[#D9D9D9] w-full">


                <div className="p-4">
                    <div className="user-info flex items-center">
                        <span className="avatar w-[35px] h-[35px] rounded-full bg-white border-[3px] border-[#f1c40f] text-center font-sans text-[18px] font-bold text-[#333] mr-2">{name?.charAt(0)}</span>
                        <div className="text">
                            <p className="text-black font-semibold leading-[20.8px]">{name}</p>
                            <p className="font-[12px] text-[#757575] leading-[15.6px]">{email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className=" flex items-center p-4 w-full" onClick={logOutUser}>
                <span className="icon">
                    <RiLogoutCircleRLine className="text-[#FF2E00]" size={25} />
                </span>
                <span className="text text-[#ff2f00]">Logout</span>
            </div>


        </div>
    );
};

export default Sidebar;
