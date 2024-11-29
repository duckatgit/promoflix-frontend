// import React, { useEffect, useState } from "react";
// import { RiLogoutCircleRLine } from "react-icons/ri";
// import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
// import { useRouter } from "next/navigation";
// import { fetchData } from "@/utils/api";
// import { useToast } from "@/hooks/use-toast";
// import { safeLocalStorage } from "@/lib/safelocastorage";
// import { NameLogo } from "./name-logo";

// const Sidebar = () => {
//   const [name, setName] = useState("John Doe");
//   const [email, setEmail] = useState("John Doe");

//   const router = useRouter();
//   const { toast } = useToast();
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   console.log(isCollapsed, "tt");

//   useEffect(() => {
//     const name = safeLocalStorage.getItem("name");
//     const email = safeLocalStorage.getItem("email");
//     setName(name);
//     setEmail(email);
//   }, []);

//   const logOutUser = () => {
//     toast({
//       type: "success",
//       title: "Logout",
//       description: "You are logout successfullY",
//     });
//     safeLocalStorage.removeItem("token");
//     safeLocalStorage.removeItem("name");
//     router.push("/auth/login");
//   };

//   const fetchBillingHistory = async () => {
//     try {
//       const baseUrl =
//         process.env.NODE_ENV === "development"
//           ? "http://localhost:3000"
//           : AUTH_URL;
//       const response = await fetchData("api/plan/customer_portal", {
//         return_url: baseUrl,
//       });
//       if (response.code != 200) {
//         alert("failed to fetch Billing History");
//       } else {
//         router.push(`${response.result}`);
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };
//   return (
//     <div
//       className={`max-w-[30%] bg-white   transition-all duration-300 flex flex-col  items-start relative rounded-lg ${isCollapsed ? "w-[60px] collapsed" : ""}`}
//     >
//       <div
//         className="sidebar-icon"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//         aria-label="Toggle Sidebar"
//       >
//         {isCollapsed ? (
//           <CiCircleChevRight size={20} className="text-[#E7680F]" />
//         ) : (
//           <CiCircleChevLeft size={20} className="text-[#E7680F]" />
//         )}
//       </div>

//       <div className="sidebar-content">
//         <div className="p-2">
//           <div
//             className="menu-item hover:menu-item-active"
//             onClick={() => router.push("/home/instance")}
//           >
//             <span className="icon">
//               <img src="/assets/black-instance.svg" alt="Pricing Plans Icon" />
//             </span>
//             <span className="text">Instance</span>
//           </div>
//           <div
//             className="menu-item hover:menu-item-active"
//             onClick={() => router.push("/home/plan")}
//           >
//             <span className="icon">
//               <img src="/assets/black-plan.svg" alt="Pricing Plans Icon" />
//             </span>
//             <span className="text">Pricing Plans</span>
//           </div>
//           <div
//             className="menu-item hover:menu-item-active"
//             onClick={() => fetchBillingHistory()}
//           >
//             <span className="icon">
//               <img src="/assets/billing-icon.png" alt="Billing History Icon" />
//             </span>
//             <span className="text">Billing History</span>
//           </div>
//         </div>
//       </div>
//       <div className="border-b-2 border-[#D9D9D9] w-full">
//         <div className="p-4">
//           <div className="user-info ">
//             <span
//               className={` avatar  rounded-[50%] bg-white border-[3px] border-[#f1c40f] text-center font-sans text-[18px] font-bold text-[#333] flex justify-center items-center ${isCollapsed ? "w-full h-[30px] " : "w-[35px] h-[35px]" }`}
//             style={{wordBreak:"break-word"}}
//             >
//               {name?.charAt(0)}
//             </span>
//             <div className="text ml-2">
//               <p className="text-black font-semibold leading-[20.8px]">
//                 {name}
//               </p>
//               <p className="font-[12px] text-[#757575] leading-[15.6px]">
//                 {email}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className=" flex items-center p-4 w-full" onClick={logOutUser}>
//         <span className="icon">
//           <RiLogoutCircleRLine className="text-[#FF2E00]" size={25} />
//         </span>
//         <span className="text text-[#ff2f00]">Logout</span>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

"use client"; // Add this if you're in the app directory

import React, { useEffect, useState } from "react";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CiCircleChevRight, CiCircleChevLeft } from "react-icons/ci";
import { useRouter, usePathname } from "next/navigation"; // usePathname to get the current route
import { fetchData } from "@/utils/api";
import { useToast } from "@/hooks/use-toast";
import { safeLocalStorage } from "@/lib/safelocastorage";

const Sidebar = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("John Doe");
  const router = useRouter();
  const pathname = usePathname(); // Current route path
  const { toast } = useToast();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const name = safeLocalStorage.getItem("name");
    const email = safeLocalStorage.getItem("email");
    setName(name);
    setEmail(email);
  }, []);

  const logOutUser = () => {
    toast({
      type: "success",
      title: "Logout",
      description: "You are logged out successfully",
    });
    safeLocalStorage.removeItem("token");
    safeLocalStorage.removeItem("name");
    router.push("/auth/login");
  };

  const fetchBillingHistory = async () => {
    try {
      const baseUrl = 'https://promoflix-frontend-seven.vercel.app'

      const response = await fetchData("api/plan/customer_portal", {
        return_url: baseUrl,
      });
      if (response.code != 200) {
        alert("Failed to fetch Billing History");
      } else {
        router.push(`${response.result}`);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div
      className={`max-w-[30%] bg-white transition-all duration-300 flex flex-col items-start relative rounded-lg ${isCollapsed ? "w-[60px] collapsed" : ""
        }`}
    >
      <div
        className="sidebar-icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <CiCircleChevRight size={20} className="text-[#E7680F]" />
        ) : (
          <CiCircleChevLeft size={20} className="text-[#E7680F]" />
        )}
      </div>

      <div className="sidebar-content">
        <div className="p-2">
          <div
            className={`menu-item ${pathname === "/home/instance" ? "menu-item-active" : ""
              }`}
            onClick={() => router.push("/home/instance")}
          >
            <span className="icon">
              {pathname === "/home/instance" ? (
                <img src="/assets/orange-instance.svg" alt="Instance Icon" />
              ) : (
                <img src="/assets/black-instance.svg" alt="Instance Icon" />
              )}
            </span>
            <span className="text">Instance</span>
          </div>
          <div
            className={`menu-item ${pathname === "/home/plan" ? "menu-item-active" : ""
              }`}
            onClick={() => router.push("/home/plan")}
          >
            <span className="icon">
              {pathname === "/home/plan" ? (
                <img src="/assets/orange-plan.svg" alt="Pricing Plans Icon" />
              ) : (
                <img src="/assets/black-plan.svg" alt="Pricing Plans Icon" />
              )}
            </span>
            <span className="text">Pricing Plans</span>
          </div>
          <div
            className={`menu-item ${pathname === "/home/billing-history" ? "menu-item-active" : ""
              }`}
            onClick={() => fetchBillingHistory()}
          >
            <span className="icon">
              {pathname === "/home/billing-history" ? (
                <img src="/assets/orange-billing.svg" alt="Billing History Icon" />

              ) : (
                <img src="/assets/billing-icon.png" alt="Billing History Icon" />

              )}
            </span>
            <span className="text">Billing History</span>
          </div>
        </div>
      </div>
      <div className="border-b-2 border-[#D9D9D9] w-full">
        <div className="p-4">
          <div className="user-info ">
            <span
              className={`avatar rounded-[50%] bg-white border-[3px] border-[#f1c40f] text-center font-sans text-[18px] font-bold text-[#333] flex justify-center items-center ${isCollapsed ? "w-full h-[30px]" : "w-[35px] h-[35px]"
                }`}
            >
              {name?.charAt(0)}
            </span>
            <div className="text ml-2">
              <p className="text-black font-semibold leading-[20.8px]">
                {name}
              </p>
              <p
                className="font-[12px] text-[#757575] leading-[15.6px]"
                style={{ wordBreak: "break-word" }}
              >
                {email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center p-4 w-full cursor-pointer" onClick={logOutUser} >
        <span className="icon">
          <RiLogoutCircleRLine className="text-[#FF2E00]" size={25} />
        </span>
        <span className="text text-[#ff2f00]">Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
