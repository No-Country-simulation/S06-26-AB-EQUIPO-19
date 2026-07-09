"use client"

import { useState } from "react"
import { UserCircle2, Mail, CheckCircle, XCircle, Clock, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CANDIDATOS_MOCK, PIPELINE_COR } from "@/data/mock"
import { cn } from "@/lib/utils"

type Props = {
  vagaId: string
  vagaTitulo: string
}

const STATUS_ICON: Record<string, React.ElementType> = {
  Triagem: Clock,
  Entrevista: Clock,
  "Teste Técnico": Clock,
  Aprovado: CheckCircle,
  Reprovado: XCircle,
}

export function VagaCandidatosList({ vagaId, vagaTitulo }: Props) {
  const [selectedCandidatoId, setSelectedCandidatoId] = useState<number | null>(null)

  const candidatos = CANDIDATOS_MOCK.filter((c) => c.vagaId === vagaId)

  if (candidatos.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Esta vaga ainda não recebeu candidaturas.
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Candidatos para "{vagaTitulo}"
        </h3>
        <span className="text-xs text-muted-foreground">
          {candidatos.length} {candidatos.length === 1 ? "candidato" : "candidatos"}
        </span>
      </div>

      <ul className="space-y-2">
        {candidatos.map((candidato) => {
          const isSelected = selectedCandidatoId === candidato.id
          const StatusIcon = STATUS_ICON[candidato.status] || Clock
          const pipelineStyle = PIPELINE_COR[candidato.status as keyof typeof PIPELINE_COR]

          return (
            <li key={candidato.id}>
              <div
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border p-3 transition-colors cursor-pointer",
                  isSelected ? "border-green-500 bg-green-500/10" : "border-border bg-background hover:bg-muted/50"
                )}
                onClick={() => setSelectedCandidatoId(isSelected ? null : candidato.id)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                    <UserCircle2 className="size-5" />
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium truncate">{candidato.nome}</p>
                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                        style={{
                          backgroundColor: pipelineStyle?.bg,
                          color: pipelineStyle?.cor,
                        }}
                      >
                        <StatusIcon className="size-2.5 mr-1" />
                        {candidato.status}
                      </Badge>
                      <div className="flex items-center gap-1 rounded-md bg-green-500/10 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                        <ShieldCheck className="size-2.5 shrink-0" />
                        Cego
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{candidato.cargo}</p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(candidato.updatedAt).toLocaleDateString("pt-BR")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      alert(`Iniciar contato com ${candidato.nome}`)
                    }}
                    className="rounded-md bg-green-600 p-1.5 text-white transition-colors hover:bg-green-700"
                    title="Entrar em contato"
                  >
                    <Mail className="size-3.5" />
                  </button>
                </div>
              </div>

              {isSelected && (
                <div className="mt-2 rounded-md border border-border bg-card p-3 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{candidato.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="size-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Cargo atual:</span>
                      <span className="font-medium">{candidato.cargo}</span>
                    </div>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}