"use client"

import { useState } from "react"
import { Users, Target, Sparkles, MapPin } from "lucide-react"
import { StatCard } from "@/components/stat-card"
import { TalentMapPanel } from "@/components/talent-map-panel"
import { TalentList } from "@/components/talent-list"
import { BiasEnginePanel } from "@/components/bias-engine-panel"
import { useDashboard, useMatch, useInsights } from "@/lib/api/hooks"

export function CompanyView() {
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const { totalSubscribers } = useDashboard()
  const { total: totalMatch } = useMatch({ limite: 12 })
  const { regions, isLive } = useInsights()

  const regioesAtivas = regions ? regions.length : 27

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Painel de recrutamento ESG
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Verdejar Energia · meta de 40% de lideranças diversas até 2027
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pessoas na base"
          value={totalSubscribers.toLocaleString("pt-BR")}
          delta={isLive ? "ao vivo" : "demo"}
          icon={Users}
        />
        <StatCard
          label="Compatíveis ao filtro"
          value={totalMatch.toLocaleString("pt-BR")}
          delta="anti-viés"
          icon={Sparkles}
        />
        <StatCard label="Meta de diversidade" value="34%" delta="meta 40%" icon={Target} />
        <StatCard
          label="Regiões mapeadas"
          value={regioesAtivas.toLocaleString("pt-BR")}
          delta={isLive ? "Anatel" : "Brasil"}
          icon={MapPin}
        />
      </div>

      <TalentMapPanel selectedState={selectedState} onSelectState={setSelectedState} />

      <BiasEnginePanel />

      <TalentList selectedState={selectedState} />
    </div>
  )
}
