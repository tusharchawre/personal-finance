type Props = {  
    data: string[][];
    onCancel: () => void;
    onSubmit: (data: any) => void;
}

const dateFormat = "dd/MM/yy";
const outputFormat = "yyyy-MM-dd ";


const requiredOptions = [

    "income",
    "expense",
    "date",
    "payee",
]

interface SelectedColumnState {
    [key: string]: string | null;
}

import { Button } from "@/components/ui/button";
import {


    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useState } from "react";
import { ImportTable } from "./import-table";
import { convertAmountToMiliUnits } from "@/lib/utils";
import {format , parse} from "date-fns";




const ImportCard = ({data, onCancel, onSubmit}: Props) => {
    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({});

    const headers = data[0];
    const body = data.slice(1);

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
            const newSelectedColumns = {...prev};

            for(const key in newSelectedColumns){
                if(newSelectedColumns[key] === value){
                    newSelectedColumns[key] = null;
                }
        }

        if(value === "skip"){
            value = null;
        }

        newSelectedColumns[`columns_${columnIndex}`] = value;

        return newSelectedColumns;
        });
    };


    const progress = Object.values(selectedColumns).filter(Boolean).length

    const handleContinue = () => {
       const getColumnIndex = (column: string) => {
        return column.split("_")[1];
       }

       const mappedData = {
        headers: headers.map((_header, index)=>{
            const columnIndex = getColumnIndex(`columns_${index}`);
            return selectedColumns[`columns_${columnIndex}`] || null;
        }),
        body: body.map((row)=>{
            const transformedRow = row.map((cell, index)=>{
                const columnIndex = getColumnIndex(`columns_${index}`);
                return selectedColumns[`columns_${columnIndex}`] ? cell : null;
            });

            return transformedRow.every((item)=> item === null) ? [] : transformedRow;

        }).filter((row)=> row.length > 0)
       }

    const arrayOfData = mappedData.body.map((row)=>{

        return row.reduce((acc:any , cell, index)=>{
            const header = mappedData.headers[index];
            if(header !== null){
                acc[header] = cell;

            }

            return acc;
        } , {})


    })



    const formattedData = arrayOfData.map((item) => {

        if (item.date) {
            const parsedDate = parse(item.date, "dd/MM/yy", new Date());
            const formattedDate = format(parsedDate, outputFormat);
    
            return {
                ...item,
                amount: convertAmountToMiliUnits(parseFloat(item.income) - parseFloat(item.expense)),
                date: formattedDate,
            };
        }
       
    });
    console.log({formattedData});
    onSubmit(formattedData);
    

}




    return ( 
        <>
        <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-xl line-clamp-1">
                Import Transaction
            </CardTitle>
            <div className="flex flex-col lg:flex-row gap-y-2 gap-x-2 items-center">

            
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
                Cancel
            </Button>
            <Button
            className="w-full lg:w-auto"
            disabled={progress < requiredOptions.length}
            onClick={handleContinue}
            size="sm"
            
            >
                Continue ({progress}/{requiredOptions.length})
            </Button>

           
            </div>

        </CardHeader>
        <CardContent >
            <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
            />
        </CardContent>
        </Card>

        
        </>
     );
}  
 
export default ImportCard;