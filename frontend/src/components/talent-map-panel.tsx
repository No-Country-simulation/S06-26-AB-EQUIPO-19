"use client"

import { MapPin, X, Signal, ChevronDown, ChevronUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { BrazilMap } from "@/components/brazil-map"
import { LiveBadge } from "@/components/live-badge"
import { useInsights } from "@/lib/api/hooks"
import { cn } from "@/lib/utils"
import { useState } from "react"

const LEGEND = [
  { label: "Alta", color: "oklch(0.82 0.14 175)" },
  { label: "", color: "oklch(0.68 0.115 179)" },
  { label: "Média", color: "oklch(0.55 0.09 183)" },
  { label: "", color: "oklch(0.42 0.06 190)" },
  { label: "Baixa", color: "oklch(0.30 0.03 205)" },
]

const PAGE_SIZE = 15

type Props = {
  selectedState: string | null
  onSelectState: (s: string | null) => void
}

export function TalentMapPanel({ selectedState, onSelectState }: Props) {
  const { stateData, regions, isLive } = useInsights()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const rankingRegions = regions
    ? [...regions].sort((a, b) => b.perfis - a.perfis)
    : null
  const rankingStates = [...stateData].sort((a, b) => b.talents - a.talents)
  const maxPerfis = rankingRegions
    ? Math.max(1, ...rankingRegions.map((r) => r.perfis))
    : 1
  const maxTalents = Math.max(1, ...rankingStates.map((s) => s.talents))

  const totalItems = rankingRegions ? rankingRegions.length : rankingStates.length
  const hasMore = visibleCount < totalItems
  const canCollapse = visibleCount > PAGE_SIZE

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col gap-1 border-b border-border p-4">
        <div className="flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Concentração de talentos por região</h2>
          <LiveBadge live={isLive} className="ml-auto" />
        </div>
        <p className="text-xs text-muted-foreground">
          {isLive
            ? "Fonte: Vísent CDRView — antenas Anatel. Clique em um estado para filtrar."
            : "Geolocalização de talentos cadastrados. Clique em um estado para filtrar."}
        </p>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col">
          <div className="rounded-lg bg-background/40 p-2">
            <BrazilMap
              selectedState={selectedState}
              onSelectState={onSelectState}
              stateData={stateData}
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Densidade</span>
              <div className="flex overflow-hidden rounded-sm">
                {LEGEND.slice()
                  .reverse()
                  .map((l, i) => (
                    <span key={i} className="size-4" style={{ backgroundColor: l.color }} />
                  ))}
              </div>
            </div>
            {selectedState && (
              <button
                onClick={() => onSelectState(null)}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <X className="size-3" /> Limpar {selectedState}
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {rankingRegions ? "Ranking por região" : "Ranking regional"}
            </span>
            <span className="text-xs text-muted-foreground">
              {Math.min(visibleCount, totalItems)} de {totalItems}
            </span>
          </div>

          {rankingRegions ? (
            <div className="flex flex-col gap-0.5">
              {rankingRegions.slice(0, visibleCount).map((r, i) => {
                const active = selectedState === r.state
                return (
                  <button
                    key={r.regiao}
                    onClick={() => onSelectState(active ? null : r.state)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
                      active ? "bg-green-500" : "hover:bg-grey-100",
                    )}
                  >
                    <span className="w-4 text-xs font-medium tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.regiao}</span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Signal className="size-3 text-primary" />
                        {r.coberturaRede} · {Math.round(r.concentracao * 100)}% densidade
                      </span>
                    </div>
                    <div className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-muted sm:block">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{ width: `${(r.perfis / maxPerfis) * 100}%` }}
                      />
                    </div>
                    <span className="w-14 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {r.perfis.toLocaleString("pt-BR")}
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {rankingStates.slice(0, visibleCount).map((s, i) => {
                const active = selectedState === s.name
                return (
                  <button
                    key={s.uf}
                    onClick={() => onSelectState(active ? null : s.name)}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors",
                      active ? "bg-green-600" : "hover:bg-green-100",
                    )}
                  >
                    <span className="w-4 text-xs font-medium tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium">{s.name}</span>
                    <div className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 sm:block">
                      <span
                        className="block h-full rounded-full bg-green-500"
                        style={{ width: `${(s.talents / maxTalents) * 100}%` }}
                      />
                    </div>
                    <span className="w-12 text-right font-mono text-xs tabular-nums text-muted-foreground">
                      {s.talents.toLocaleString("pt-BR")}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          <div className="mt-2 flex gap-2">
            {hasMore && (
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <ChevronDown className="size-3" />
                Ver mais 15
              </button>
            )}
            {canCollapse && (
              <button
                onClick={() => setVisibleCount(PAGE_SIZE)}
                className="flex flex-1 items-center justify-center gap-1 rounded-md border border-border py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
              >
                <ChevronUp className="size-3" />
                Ver menos
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
