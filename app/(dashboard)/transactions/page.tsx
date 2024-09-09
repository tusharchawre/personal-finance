"use client"

import { Button } from "@/components/ui/button";
import {


    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {transactions as transactionSchema} from "@/db/schema";

import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";


import { Skeleton } from "@/components/ui/skeleton";

import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import ImportCard from "./import-card";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";



enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT",
}


const INITIAL_IMPORT_RESULT = {
    data: [],
    errors: [],
    meta: {}
};


const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResult, setImportResult] = useState(INITIAL_IMPORT_RESULT);


    const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
        console.log({results});
        setImportResult(results);
        setVariant(VARIANTS.IMPORT);
    };

    const onCancelImport = () => {
        setImportResult(INITIAL_IMPORT_RESULT);
        setVariant(VARIANTS.LIST);
    };



    const newTransaction = useNewTransaction()
    const createTransactions = useBulkCreateTransactions()
    const deleteTransactions =  useBulkDeleteTransactions();
    const transactionQuery = useGetTransactions();
    const transaction = transactionQuery.data || [];

    const isDisabled = 
    transactionQuery.isLoading || deleteTransactions.isPending;


    const onSubmitImport = async (
        values: typeof transactionSchema.$inferInsert[]
    ) => {
        const accountId = await confirm();

        if(!accountId){
            return toast.error("Please select an account");
        }

        const data = values.map((value)=>({
            ...value,
            accountId: accountId as string
        }))

        createTransactions.mutate(data , {
            onSuccess: ()=>{
                onCancelImport();
        }}
    )

    }


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

    if(variant === VARIANTS.IMPORT){
        return(
            <>
            <div>
                <AccountDialog />
               <ImportCard 
               data={importResult.data} 
               onCancel={onCancelImport} 
               onSubmit={onSubmitImport}
               />
            </div>
            </>
        )
    }



    return ( <>
    <div className="max-w-screen-xl mx-auto w-full pb-10 -mt-24">
       <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Transactions History
            </CardTitle>
            <div className="flex flex-col lg:flex-row gap-y-2 gap-x-2 items-center">

            
            <Button size="sm" onClick={newTransaction.onOpen} className="w-full lg:w-auto">
                <Plus />
                Add New
            </Button>

            <UploadButton 
            onUpload={onUpload}
            />
            </div>

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