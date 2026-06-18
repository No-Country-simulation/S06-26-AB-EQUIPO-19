import { cn } from "@/lib/utils"

type Props = {
  live: boolean
  // rótulo opcional quando ao vivo / em demonstração
  liveLabel?: string
  demoLabel?: string
  className?: string
}

// Selo que indica se o dado vem da API em tempo real ou do conjunto de demonstração.
export function LiveBadge({
  live,
  liveLabel = "Dados ao vivo",
  demoLabel = "Demonstração",
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium",
        live
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-secondary text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          live ? "animate-pulse bg-primary" : "bg-muted-foreground/50",
        )}
      />
      {live ? liveLabel : demoLabel}
    </span>
  )
}
