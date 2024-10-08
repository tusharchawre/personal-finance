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

import { useNewCategory } from "@/features/categories/hooks/use-new-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";




const CategoriesPage = () => {
    const newCategory = useNewCategory()
    const deleteCategories =  useBulkDeleteCategories();
    const categoriesQuery =  useGetCategories();
    const accounts = categoriesQuery.data || [];

    const isDisabled = 
    categoriesQuery.isLoading || deleteCategories.isPending;


    if(categoriesQuery.isLoading){
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
                Categories page
            </CardTitle>
            <Button size="sm" onClick={newCategory.onOpen}>
                <Plus />
                Add New
            </Button>

        </CardHeader>
        <CardContent>

        <DataTable 
        onDelete={(row)=>{
            const ids = row.map((r)=> r.original.id)
            deleteCategories.mutate({ids})
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
 
export default CategoriesPage;