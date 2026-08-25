import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatsCardSkeleton() {
  return (
    <Card className="@container/card relative overflow-hidden gap-0">
      <CardHeader className="flex flex-col gap-2">
        <div className="flex flex-row gap-x-2 items-center">
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardFooter className="flex flex-row justify-end pt-0">
        <div className="flex flex-col gap-y-1 items-end">
          <Skeleton className="h-6 w-28 rounded-lg" />
          <Skeleton className="h-6 w-28 rounded-lg" />
        </div>
      </CardFooter>
      <div className="px-6 pb-4">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
    </Card>
  );
}

export function TableRowSkeleton({ columns = 5 }) {
  return (
    <div className="flex items-center space-x-4 py-4 px-4 b/order-b border-border/50">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-4 flex-1" />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="w-full bg-card rounded-xl border border-border overflow-hidden">
      <div className="bg-muted/50 p-4 border-b border-border">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-0">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ className }) {
  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-end gap-2 pt-4 min-h-[200px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-lg"
            style={{ height: `${[40, 70, 45, 80, 55, 60][i % 6]}%` }}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export function StockCardSkeleton() {
  return (
    <Card className="@container/stock h-full">
      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-48 mt-2" />
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-lg" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4 ml-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-16 w-full rounded-lg mt-2" />
      </CardContent>
    </Card>
  );
}

export function SimpleCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-row gap-x-2 items-center">
          <Skeleton className="size-10 rounded-md" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-4 w-32 mt-4" />
      </CardHeader>
    </Card>
  );
}

export function DashboardHomeSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 lg:p-6">
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-7">
        <div className="col-span-3">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-2">
          <StatsCardSkeleton />
        </div>
        <div className="col-span-2">
          <StatsCardSkeleton />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-5 lg:col-span-3">
          <TableSkeleton columns={4} />
        </div>
        <div className="col-span-5 lg:col-span-2">
          <ChartSkeleton />
        </div>
      </div>
    </div>
  );
}

export function TableRowsSkeleton({ rows = 5, columns = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b transition-colors hover:bg-muted/50">
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="p-4 align-middle whitespace-nowrap">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
