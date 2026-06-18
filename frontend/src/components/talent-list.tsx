"use client"

import { MapPin, ShieldCheck, Users, UserCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreRing } from "@/components/score-ring"
import { LiveBadge } from "@/components/live-badge"
import { useMatch } from "@/lib/api/hooks"
import { stateData } from "@/lib/data"

type Props = {
  selectedState: string | null
}

export function TalentList({ selectedState }: Props) {
  const { candidates, total, isLive, isLoading } = useMatch({ limite: 12 })

  // No modo demonstração filtramos por UF do estado selecionado no mapa.
  // Com dados reais (uma única região), exibimos todos os candidatos do match.
  const selectedUf = selectedState
    ? stateData.find((s) => s.name === selectedState)?.uf
    : undefined

  const ranked = [...candidates]
    .filter((c) => {
      if (isLive || !selectedUf) return true
      return c.regiao === selectedUf
    })
    .sort((a, b) => b.inclusionScore - a.inclusionScore)

  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">
            Candidatos compatíveis
            {selectedState && !isLive && (
              <span className="text-muted-foreground"> · {selectedState}</span>
            )}
          </h2>
          <LiveBadge live={isLive} />
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {isLive
            ? `${total.toLocaleString("pt-BR")} encontrados`
            : `${ranked.length} resultados`}
        </span>
      </div>

      {isLoading ? (
        <p className="p-8 text-center text-sm text-muted-foreground">Carregando candidatos…</p>
      ) : ranked.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          Nenhum candidato em destaque neste filtro. Selecione outra região no mapa.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {ranked.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-3 p-4 transition-colors hover:bg-secondary/50 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground">
                  <UserCircle2 className="size-6" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.perfil}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.detalhes}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {c.municipio}
                    {c.regiao && <span className="text-primary">· {c.regiao}</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  variant="secondary"
                  className="hidden bg-primary/10 text-[10px] text-primary sm:inline-flex"
                >
                  ID #{c.id}
                </Badge>
                <div className="hidden items-center gap-1 rounded-md bg-primary/5 px-2 py-1 text-[10px] font-medium text-primary md:flex">
                  <ShieldCheck className="size-3" />
                  Sem viés
                </div>
                <ScoreRing value={c.inclusionScore} label="inclusão" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
