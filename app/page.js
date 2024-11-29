"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(true); // Track if redirect is happening

  useEffect(() => {
    // We use setTimeout to simulate redirect check only on client-side
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      router.replace('/home/instance');
    } else {
      router.replace('/auth/login');
    }

    setIsRedirecting(false); // After redirect logic, stop blocking content
  }, [router]);

  // Don't render content while redirection logic is in process
  if (isRedirecting) {
    return null; // Return nothing while redirecting, you can add a loading indicator here if you want
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* Content will only show if no redirection is needed */}
      </main>
    </div>
  );
}
