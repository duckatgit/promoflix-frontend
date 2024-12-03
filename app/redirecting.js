"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CheckRedirecting() {
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

}
