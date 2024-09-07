"use client"

import { Button } from "@/components/ui/button";
import {


    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";




const AccountsPage = () => {
    const newAccount = useNewAccount()
    const deleteaccounts =  useBulkDeleteAccounts();
    const accountsQuery =  useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = 
    accountsQuery.isLoading || deleteaccounts.isPending;


    if(accountsQuery.isLoading){
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
                Accounts page
            </CardTitle>
            <Button size="sm" onClick={newAccount.onOpen}>
                <Plus />
                Add New
            </Button>

        </CardHeader>
        <CardContent>

        <DataTable 
        onDelete={(row)=>{
            const ids = row.map((r)=> r.original.id)
            deleteaccounts.mutate({ids})
        } }  
        disabled={isDisabled} 
        filterKey="name" 
        data={accounts} 
        columns={columns} 
        />

        </CardContent>

       </Card>
    </div>
    </> );
}
 
export default AccountsPage;