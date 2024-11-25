"use client"
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast"
import SuccessIcon from "./../../public/assets/success-toast.png"
import WarningIcon from "./../../public/assets/warning-toast.png"
import ErrorIcon from "./../../public/assets/error-toast.png"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  const getToastDetails = (type) => {
    switch (type) {
      case "success":
        return {
          icon: <Image src={SuccessIcon} alt="SuccessIcon" />,
          style: "bg-green-100 border-l-4 border-green-500",
        };
      case "warning":
        return {
          icon: <Image src={WarningIcon} alt="SuccessIcon" />,
          style: "bg-yellow-100 border-l-4 border-yellow-500",
        };
      case "error":
        return {
          icon: <Image src={ErrorIcon} alt="SuccessIcon" />,
          style: "bg-red-100 border-l-4 border-red-500",
        };
      default:
        return {
          icon: null,
          style: "bg-gray-100 border-l-4 border-gray-300",
        };
    }
  };

  return (
    (<ToastProvider>
      {toasts.map(function ({ id, title, description, action, type = "default", ...props }) {
        const { icon, style } = getToastDetails(type);
        return (
          (<Toast key={id} {...props} className={`flex items-center p-3 ${style}`}>
            {icon && <div className="mr-3">{icon}</div>}
            <div className="grid gap-1 flex-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>)
        );
      })}
      <ToastViewport />
    </ToastProvider>)
  );
}
