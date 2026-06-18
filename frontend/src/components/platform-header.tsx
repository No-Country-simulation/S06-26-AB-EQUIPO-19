"use client"

import { Globe, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LiveBadge } from "@/components/live-badge"
import { useApiStatus } from "@/lib/api/hooks"
import { cn } from "@/lib/utils"

export type ViewMode = "empresa" | "talento"

type Props = {
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}

export function PlatformHeader({ view, onViewChange }: Props) {
  const { online } = useApiStatus()
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6 justify-between">
       
          
          <LiveBadge
            live={online}
            liveLabel="API conectada"
            demoLabel="API offline"
            className="ml-1 hidden sm:inline-flex"
          />
       
        <div className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-card p-1 md:ml-0">
          {(["empresa", "talento"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onViewChange(mode)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors",
                view === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {mode === "empresa" ? "Empresa" : "Talento"}
            </button>
          ))}
        </div>

      </div>
    </header>
  )
}
