import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-gray-200 rounded-lg", className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card card-hover">
      <Skeleton className="h-48 w-full rounded-lg mb-4" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function BlogCardSkeleton() {
  return (
    <div className="card card-hover flex flex-col overflow-hidden">
      <Skeleton className="h-48 w-full -mx-6 -mt-6 mb-4 rounded-none" />
      <Skeleton className="h-3 w-24 mb-2" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <Skeleton className="h-4 w-20 mt-auto" />
    </div>
  );
}
