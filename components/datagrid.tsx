"use client"

import { useGetSummary } from "@/features/summary/api/use-get-transactions";
import { formatDateRange } from "@/lib/utils";
import { useSearchParams } from "next/navigation"
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp , FaArrowTrendDown } from "react-icons/fa6";

import { DataCard, DataCardLoading } from "./data-card";


export const DataGrid = () => {
    const { data , isLoading} = useGetSummary()
    const params = useSearchParams();
    const to = params.get("to") || undefined;
    const from = params.get("from") || undefined;

    const dataRangeLabel = formatDateRange({from, to})


    if(isLoading){
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8 px-4">
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />

            </div>
        )
    }




    
  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8 px-4">
        <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        variant="default"
        icon={FaPiggyBank}
        dateRange={dataRangeLabel}
        
        />

<DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        variant="default"
        icon={FaArrowTrendUp}
        dateRange={dataRangeLabel}
        
        />

<DataCard
        title="Expense"
        value={data?.expenseAmount}
        percentageChange={data?.expenseChange}
        variant="default"
        icon={FaArrowTrendDown}
        dateRange={dataRangeLabel}
        
        />

    </div>
    
    
  
)}