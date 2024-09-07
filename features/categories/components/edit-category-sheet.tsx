
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
}  from "@/components/ui/sheet"

import { CategoryForm } from "./category-form";
import { FormValue } from "hono/types";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategory } from "../api/use-create-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";


const formSchema = insertCategorySchema.pick({
    name: true
})

type FormValues =  z.input<typeof formSchema>

export const EditCategorySheet = () =>{
    const { isOpen , onClose , id} = useOpenCategory();

    const [ConfirmationDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this category."
    )

    const categoriesQuery = useGetCategory(id)
    const editMutation  = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)



    const isPending = editMutation.isPending || deleteMutation.isPending
    const isLoading = categoriesQuery.isLoading

    const onSubmit = (values : FormValues) =>{
        editMutation.mutate(values,{
            onSuccess: () => {
                onClose()
            }
        })
    }

    
    const defaultValues = categoriesQuery.data ? {
        name : categoriesQuery.data.name
    }:
    {
        name : ""
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
                        Edit Category
                    </SheetTitle>
                    <SheetDescription>
                        Edit an Existing Category
                    </SheetDescription>
                </SheetHeader>
                {
                    isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Loader2 className="size-4 text-muted-foreground animate-spin" />

                        </div>
                    ):(
                        <CategoryForm
                        id={id}
                        onSubmit={onSubmit} disabled={isPending}
                        defaultValues={defaultValues} 
                        onDelete={onDelete}
                        />
                    )
                }

            </SheetContent>
        </Sheet>
        </>
    )
}