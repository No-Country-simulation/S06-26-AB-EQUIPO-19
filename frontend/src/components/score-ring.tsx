import { cn } from "@/lib/utils"

type Props = {
  value: number
  size?: number
  stroke?: number
  className?: string
  label?: string
}

export function ScoreRing({ value, size = 56, stroke = 5, className, label }: Props) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-sm font-semibold tabular-nums leading-none">{value}</span>
        {label && <span className="mt-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}
