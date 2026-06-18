import type { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: string
  delta?: string
  deltaPositive?: boolean
  icon: LucideIcon
}

export function StatCard({ label, value, delta, deltaPositive = true, icon: Icon }: Props) {
  return (
    <Card className="gap-0 p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between">
        <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
        {delta && (
          <span
            className={cn(
              "text-xs font-medium",
              deltaPositive ? "text-primary" : "text-destructive",
            )}
          >
            {delta}
          </span>
        )}
      </div>
    </Card>
  )
}
