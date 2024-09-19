"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  Edit,
  Trash,
  Upload,
} from "lucide-react";

import { NameLogo } from "@/components/ui/name-logo";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Header from "@/app/auth/header/page";
import Dashboard from "@/components/dashboard";

// Mock Data
const token = localStorage.getItem("token");
const DataTableDemo = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [allInstances, setAllInstances] = useState([]);
  const [instance, setInstance] = useState();
  const getAllInstance = async () => {
    try {
      const response = await axios.get('http://54.225.255.162/api/v1/instance', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          page: 0,
          limit: 100
        },
      });
      if (response.data.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        })
      }
      else {
        const data = response.data.result.instances
        setAllInstances(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(
    () => {
      getAllInstance()
    }, []
  )
  const createInstance = async () => {
    try {
      if (instance) {
        const response = await fetch('http://54.225.255.162/api/v1/instance', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: instance,
          }),
        });
        if (!response.ok) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
          });
        }
        const data = await response.json();
        if (data.code !== 200) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
          });
        } else {
          toast({
            description: "Instence Added successfully",
          });
          setInstance("")
          router.push('/home/dashboard'); // Redirect to the dashboard page
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    }
  };

  return (
    <div className="mx-8">

      <Header />
      <Suspense fallback={<p>Loading feed..........</p>}>
        <Dashboard instance={instance} setInstance={setInstance} createInstance={createInstance} allInstances={allInstances} getAllInstance={getAllInstance} />
      </Suspense>

    </div>
  );
};

export default DataTableDemo;
