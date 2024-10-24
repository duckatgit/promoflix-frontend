'use client'
import React, { useEffect, useState } from 'react'
import { NameLogo } from '@/components/ui/name-logo';
import { safeLocalStorage } from "@/lib/safelocastorage"

const Header = () => {
    const [name, setname] = useState('John Doe')

    useEffect(() => {
        const data = safeLocalStorage.getItem("name");
        setname(data)
    }, [])

    return (
        <div className="flex justify-between mt-2">
            <div>
                <img src="/assets/semi-final 2 (1).png" alt="" />
            </div>
            <div style={{ width: "500px" }}>
            </div>
            <div>
                <NameLogo name={name} />
            </div>
        </div>
    )
}

export default Header