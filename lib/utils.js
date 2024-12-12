import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function getFormatedDate(data) {
  if (!data) return "Invalid date";
  const date = new Date(data);
  if (isNaN(date.getTime())) return "Invalid date"; 
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0"); 
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// utils/maskPassword.js
export const maskPassword = (password) => {
  if (!password || typeof password !== "string") {
    return "";
  }
  return "*".repeat(password.length);
};
