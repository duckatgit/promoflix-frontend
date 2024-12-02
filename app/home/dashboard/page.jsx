"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import Header from "@/app/auth/header/page";
import Dashboard from "@/components/dashboard";
import { fetchData } from '../../../utils/api';
import { postData } from "../../../utils/api";

const DataTableDemo = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [allInstances, setAllInstances] = useState([]);
  const [instance, setInstance] = useState();
  const getAllInstance = async () => {
    try {
      const queryParams = {
        page: 0,
        limit: 10
      };
      const result = await fetchData('api/v1/instance', queryParams, "hirello");
      if (result.code != 200) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: data.result,
        })
      }
      else {
        const data = result.result.instances
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
        const response = await postData('api/v1/instance', {
          name: instance,
        }, "hirello");
        if (response.code !== 200) {
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
