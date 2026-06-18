"use client"

import { useMemo, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"
import { type StateData } from "@/lib/data"
// Import the GeoJSON data directly. Vite supports JSON imports when `resolveJsonModule`
// is enabled in tsconfig (added in a previous patch).
import brazilStates from "@/data/brazil-states.json"

const SCALE_COLORS = [
  "oklch(0.30 0.03 205)",
  "oklch(0.42 0.06 190)",
  "oklch(0.55 0.09 183)",
  "oklch(0.68 0.115 179)",
  "oklch(0.82 0.14 175)",
]

function colorFor(talents: number, maxTalents: number) {
  const ratio = maxTalents > 0 ? talents / maxTalents : 0
  if (ratio > 0.7) return SCALE_COLORS[4]
  if (ratio > 0.4) return SCALE_COLORS[3]
  if (ratio > 0.2) return SCALE_COLORS[2]
  if (ratio > 0.08) return SCALE_COLORS[1]
  return SCALE_COLORS[0]
}

type Props = {
  selectedState: string | null
  onSelectState: (state: string | null) => void
  stateData: StateData[]
}

export function BrazilMap({ selectedState, onSelectState, stateData }: Props) {
  const [hovered, setHovered] = useState<StateData | null>(null)
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const lookup = useMemo(() => {
    const map = new Map<string, StateData>()
    stateData.forEach((s) => map.set(s.name, s))
    return map
  }, [stateData])

  const maxTalents = useMemo(
    () => Math.max(1, ...stateData.map((s) => s.talents)),
    [stateData],
  )

  return (
    <div
      className="relative w-full"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
    >
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 720, center: [-54, -15] }}
        width={520}
        height={520}
        style={{ width: "100%", height: "auto" }}
      >
        <Geographies geography={brazilStates}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties.name as string
              const data = lookup.get(name)
              const isSelected = selectedState === name
              const isDimmed = selectedState !== null && !isSelected
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => setHovered(data ?? null)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => onSelectState(isSelected ? null : name)}
                  style={{
                    default: {
                      fill: data ? colorFor(data.talents, maxTalents) : "oklch(0.3 0.02 205)",
                      stroke: "oklch(0.17 0.012 220)",
                      strokeWidth: 0.75,
                      outline: "none",
                      opacity: isDimmed ? 0.35 : 1,
                      transition: "all 0.2s ease",
                    },
                    hover: {
                      fill: "oklch(0.86 0.15 174)",
                      stroke: "oklch(0.17 0.012 220)",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "oklch(0.86 0.15 174)",
                      outline: "none",
                    },
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 rounded-md border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg"
          style={{ left: pos.x + 14, top: pos.y + 14 }}
        >
          <p className="text-sm font-medium leading-tight">
            {hovered.name} <span className="text-muted-foreground">({hovered.uf})</span>
          </p>
          <p className="text-xs text-muted-foreground">
            {hovered.talents.toLocaleString("pt-BR")} talentos · {hovered.matchRate}% match médio
          </p>
        </div>
      )}
    </div>
  )
}
