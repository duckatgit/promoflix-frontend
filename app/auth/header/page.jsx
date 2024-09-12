import { Input } from '@/components/ui/input'
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { NameLogo } from '@/components/ui/name-logo';
const Header = () => {
    return (
        <div className="flex justify-between mt-2">
            <div>
                <img src="/assets/semi-final 2 (1).png" alt="" />
            </div>
            <div style={{ width: "500px" }}>
                <Input
                    placeholder="Filter emails..."

                    className="w-full"
                />
            </div>
            <div>
                <NameLogo name="John Doe" />
            </div>
        </div>
    )
}

export default Header