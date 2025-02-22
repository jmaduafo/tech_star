import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-900/10 dark:bg-zinc-50/10 backdrop-blur-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
