import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function getFormatedDate(data) {
  if (!data) return "Invalid date";
  const dateString = data;
  const date = new Date(dateString);
  const formattedDate = `${date.getDate()}/${
    date.getMonth() + 1
  }/${date.getFullYear()}`;
  return formattedDate;
}
