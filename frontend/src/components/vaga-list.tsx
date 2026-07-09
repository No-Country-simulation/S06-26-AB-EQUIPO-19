"use client"

import { useState } from "react"
import { Briefcase, MapPin, Wallet, Users, ChevronRight, ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { VAGAS_MOCK, CANDIDATOS_MOCK, TIPO_COR, TIPO_BG } from "@/data/mock"
import { VagaCandidatosList } from "./vaga-candidatos-list"

export function VagaList() {
  const [expandedVagaId, setExpandedVagaId] = useState<string | null>(null)

  const vagas = VAGAS_MOCK

  return (
    <Card className="gap-0 p-0">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div className="flex items-center gap-2">
          <Briefcase className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Vagas cadastradas</h2>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {vagas.length} {vagas.length === 1 ? "vaga" : "vagas"}
        </span>
      </div>

      {vagas.length === 0 ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          Nenhuma vaga cadastrada. Clique em "Cadastrar vaga" para criar uma nova oportunidade.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {vagas.map((vaga) => {
            const isExpanded = expandedVagaId === vaga.id
            const candidatosCount = CANDIDATOS_MOCK.filter((c) => c.vagaId === vaga.id).length

            return (
              <li key={vaga.id} className="flex flex-col">
                <div
                  className="flex flex-col gap-3 p-4 transition-colors hover:bg-green-500/10 sm:flex-row sm:items-center cursor-pointer"
                  onClick={() => setExpandedVagaId(isExpanded ? null : vaga.id)}
                >
                  <div className="flex flex-1 items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-green-500 text-white font-semibold text-sm">
                      {vaga.logo}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium">{vaga.titulo}</p>
                        <Badge
                          variant="secondary"
                          className="text-[10px]"
                          style={{
                            backgroundColor: TIPO_BG[vaga.tipo as keyof typeof TIPO_BG],
                            color: TIPO_COR[vaga.tipo as keyof typeof TIPO_COR],
                          }}
                        >
                          {vaga.tipo}
                        </Badge>
                        {vaga.status === "Pausada" && (
                          <Badge variant="destructive" className="text-[10px]">
                            {vaga.status}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {vaga.cidade}
                        </span>
                        <span className="flex items-center gap-1">
                          <Wallet className="size-3" />
                          {vaga.salario}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {candidatosCount} {candidatosCount === 1 ? "candidato" : "candidatos"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Publicada em {new Date(vaga.publicadaEm).toLocaleDateString("pt-BR")}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="size-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-border bg-muted/30">
                    <VagaCandidatosList vagaId={vaga.id} vagaTitulo={vaga.titulo} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}