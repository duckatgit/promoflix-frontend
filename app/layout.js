import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import CheckRedirecting from "./redirecting";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Thomas-ai",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CheckRedirecting/>
        {children}
        <Toaster />
   
      </body>
    </html>
  );
}
