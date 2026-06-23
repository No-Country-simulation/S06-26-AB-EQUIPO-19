import { cn } from "@/lib/utils"

type Props = {
  value: number
  size?: number
  stroke?: number
  className?: string
  label?: string
}

function getScoreColor(value: number): string {
  if (value >= 90) return "#22c55e"
  if (value >= 70) return "#f59e0b"
  if (value >= 50) return "#f97316"
  return "#ef4444"
}

export function ScoreRing({ value, size = 64, stroke = 6, className, label }: Props) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = getScoreColor(value)
  const isComplete = value >= 100

  return (
    <div
      className={cn("relative inline-flex flex-col items-center justify-center gap-0.5", className)}
      style={{ width: size }}
      title={`Score de ${label ?? "inclusão"}: ${value}/100`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap={isComplete ? "butt" : "round"}
            strokeDasharray={circumference}
            strokeDashoffset={isComplete ? 0 : offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-mono font-bold tabular-nums leading-none"
            style={{ fontSize: size * 0.26, color }}
          >
            {value}
          </span>
        </div>
      </div>
      {label && (
        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  )
}
