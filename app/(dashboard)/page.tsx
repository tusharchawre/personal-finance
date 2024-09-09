"use client"

import { DataCharts } from "@/components/datacharts";
import { DataGrid } from "@/components/datagrid";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-account"




export default function DashboardPage() {



  return(
    <>
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <DataGrid />
      
      <DataCharts />
      

    </div>
   
    </>
  )
}
