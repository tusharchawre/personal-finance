
import { cn, formatCurrency, formatPercent } from "@/lib/utils"
import { IconType } from "react-icons"


import { VariantProps, cva } from "class-variance-authority"
import { Icon } from "next/dist/lib/metadata/types/metadata-types"
import { Card
    ,CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
 } from "./ui/card"
import { CountUp } from "./count-up"
import { Skeleton } from "./ui/skeleton"


const boxVariants = cva(
    " shrink-0 rounded-md p-3",{
        variants:{
            variant:{
                default: "bg-blue-500/20",
                success: "bg-emerald-500/20",
                danger: "bg-rose-500/20",
                warning: "bg-yellow-500/20",
            }
        }
        , defaultVariants: {
        variant: "default",
    }
    }
)



const iconVariants = cva(
    "size-6",{
        variants:{
          variant:{
                default: "fill-blue-500",
                success: "fill-emerald-500",
                danger: "fill-rose-500",
                warning: "fill-yellow-500",
            }
        },
        defaultVariants: {
        variant: "default",
    }
    }
)

type BoxVariants = VariantProps<typeof boxVariants>
type IconVariants = VariantProps<typeof iconVariants>

interface DataCardProps extends BoxVariants , IconVariants{
    icon: IconType;
    title: string;
    value?: number;
    dateRange: string;
    percentageChange?: number;
}


export const DataCard = ({
    title,
    value = 0,
    percentageChange = 0,
    dateRange,
    icon : Icon,
    variant
}: DataCardProps) => {
    return (

        <Card className="border-none drop-shadow-sm">

            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
            <div className="space-y-2">
                <CardTitle className="text-2xl line-clamp-1">
                    {title}
                </CardTitle>
                <CardDescription className="line-clamp-1">
                    {dateRange}
                </CardDescription>
            </div>
            <div className={cn(boxVariants({variant}))}>
                <Icon className={cn(iconVariants({variant}))} />

            </div>
            </CardHeader>
            <CardContent>
                <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
                    <CountUp 
                    preserveValue
                    start={0}
                    end={value}
                    decimals={2}
                    decimalPlaces={2}
                    formattingFn={formatCurrency}
                    />

                </h1>
                <p className={cn(
                    "text-muted-foreground text-sm line-clamp-1",
                    percentageChange > 0 && "text-emerald-500",
                    percentageChange < 0 && "text-rose-500",
                )}>
                    {formatPercent(percentageChange, {addPrefix: true})} from last period
                </p>
            </CardContent>
        </Card>

    )
}

export const DataCardLoading = () => {
    return (
      <Card className="h-[192px] border-none drop-shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
  
          <Skeleton className="size-12" />
        </CardHeader>
  
        <CardContent>
          <Skeleton className="mb-2 h-10 w-24 shrink-0" />
          <Skeleton className="h-4 w-40 shrink-0" />
        </CardContent>
      </Card>
    );
  };