"use client"

import { ShieldCheck, Sparkles, Check } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LiveBadge } from "@/components/live-badge"
import { useDashboard } from "@/lib/api/hooks"

const SAFEGUARDS = [
  "Nomes, gênero e foto ocultos na triagem técnica",
  "Pesos calibrados para reduzir viés socioeconômico",
  "Auditoria contínua de paridade entre grupos",
]

export function BiasEnginePanel() {
  const { distribution, isLive } = useDashboard()
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="gap-0 p-5">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">Motor de compatibilidade</h3>
            <p className="text-xs text-muted-foreground">IA de score técnico com filtro anti-viés</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <ShieldCheck className="size-5 shrink-0 text-primary" />
          <p className="text-xs leading-relaxed text-foreground">
            O score avalia <span className="font-medium">apenas competências técnicas</span>. Dados
            demográficos nunca influenciam o ranking — são usados só para metas ESG.
          </p>
        </div>

        <ul className="mt-4 flex flex-col gap-2">
          {SAFEGUARDS.map((s) => (
            <li key={s} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="gap-0 p-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Distribuição da base</h3>
          <LiveBadge live={isLive} className="ml-auto" />
        </div>
        <p className="text-xs text-muted-foreground">
          {isLive ? "Perfis por participação na base ativa" : "Talentos por identidade declarada"}
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {distribution.slice(0, 6).map((g) => (
            <div key={g.label} className="flex flex-col gap-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium">{g.label}</span>
                <span className="font-mono tabular-nums text-muted-foreground">{g.value}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, g.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
