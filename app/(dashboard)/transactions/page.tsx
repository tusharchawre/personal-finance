"use client"

import { Button } from "@/components/ui/button";
import {


    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"

import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";


import { Skeleton } from "@/components/ui/skeleton";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";




const TransactionsPage = () => {
    const newTransaction = useNewTransaction()
    const deleteTransactions =  useBulkDeleteTransactions();
    const transactionQuery = useGetTransactions();
    const transaction = transactionQuery.data || [];

    const isDisabled = 
    transactionQuery.isLoading || deleteTransactions.isPending;


    if(transactionQuery.isLoading){
        return(
            <div className="max-w-screen-xl mx-auto w-full pb-10 -mt-24">
                       <Card className="border-none drop-shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-8 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-[500px] w-full flex items-center justify-center">
                                <Loader2 className="size-6 text-slate-300 animate-spin" />

                            </div>
                        </CardContent>
                       </Card>
            </div>

        )
    }





    return ( <>
    <div className="max-w-screen-xl mx-auto w-full pb-10 -mt-24">
       <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Transactions History
            </CardTitle>
            <Button size="sm" onClick={newTransaction.onOpen}>
                <Plus />
                Add New
            </Button>

        </CardHeader>
        <CardContent>

        <DataTable 
        onDelete={(row)=>{
            const ids = row.map((r)=> r.original.id)
            deleteTransactions.mutate({ids})
        } }  
        disabled={isDisabled} 
        filterKey="payee" 
        data={transaction} 
        columns={columns} 
        />

        </CardContent>

       </Card>
    </div>
    </> );
}
 
export default TransactionsPage;