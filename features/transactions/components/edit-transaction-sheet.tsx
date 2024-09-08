
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
}  from "@/components/ui/sheet"

import { TransactionForm } from "./transaction-form";
import { FormValue } from "hono/types";
import { insertTransactionSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";


const formSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues =  z.input<typeof formSchema>

export const EditTransactionSheet = () =>{
    const { isOpen , onClose , id} = useOpenTransaction();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this Transaction"
    )

    const transactionQuery = useGetTransaction(id)

    const editMutation  = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)



    const categoryMutation = useCreateCategory();
    const categoryQuery = useGetCategories();
    const onCreateCategory = (name : string) => categoryMutation.mutate({name})

    const categoryOptions = (categoryQuery.data ?? []).map((category)=>({
        label: category.name,
        value: category.id
    }))



    const accountMutation = useCreateAccount();
    const accountsQuery = useGetAccounts();
    const onCreateAccount = (name : string) => accountMutation.mutate({name})

    const accountOptions = (accountsQuery.data ?? []).map((account)=>({
        label: account.name,
        value: account.id
    }))


   
    const onSubmit = (values : FormValues) =>{
        editMutation.mutate(values,{
            onSuccess: () => {
                onClose()
            }
        })
    }

    const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categoryMutation.isPending || accountMutation.isPending

    const isLoading = transactionQuery.isLoading || categoryQuery.isLoading || accountsQuery.isLoading

    
    const defaultValues = transactionQuery.data ? {
        accountId : transactionQuery.data.accountsId,
        categoryId : transactionQuery.data.categoryId,
        payee : transactionQuery.data.payee,
        amount : transactionQuery.data.amount.toString(),
        notes : transactionQuery.data.notes,
        date : transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date()
    }:
    {
       accountId : "",
       categoryId : "",
       payee : "",
       amount : "",
       notes : "",
       date : new Date()

    }



  

    

    const onDelete = async () => {
        const ok = await confirm();
        if(ok){
            deleteMutation.mutate(undefined,{
                onSuccess: () =>{
                    onClose();
                }}
            )
        }
    }




    return(
        <>
       <ConfirmationDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit an Existing Transaction
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />

                        </div>
                    ):(
                        <TransactionForm
                        id={id}
                        defaultValues={defaultValues}
                    onDelete={onDelete}
                onSubmit={onSubmit} 
                disabled={isPending}
                categoryOptions={categoryOptions}
                onCreateCategory={onCreateCategory}
                accountOptions={accountOptions}
                onCreateAccount={onCreateAccount}
                />
                    )
                }

            </SheetContent>
        </Sheet>
        </>
    )
}