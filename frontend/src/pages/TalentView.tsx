"use client"

import { useState } from "react"
import { Briefcase, Building2, Leaf, ShieldCheck, MapPin, ArrowUpRight, Wallet } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScoreRing } from "@/components/score-ring"
import { LiveBadge } from "@/components/live-badge"
import { CreateVagaDialog } from "@/components/create-vaga-dialog"
import { VagaDetailDialog } from "@/components/vaga-detail-dialog"
import { useVagas } from "@/lib/api/hooks"
import type { JobItem } from "@/lib/api/adapters"
import { companies } from "@/lib/data"

export function TalentView() {
  const { jobs, isLive, isLoading } = useVagas()
  const [selectedJob, setSelectedJob] = useState<null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  function openJob(job: JobItem) {
    setSelectedJob(job)
    setDetailOpen(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Suas oportunidades
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Empresas com metas ESG reais, ranqueadas pela sua compatibilidade técnica
        </p>
      </div>

      {/* Perfil */}
      <Card className="flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
        <Avatar className="size-14 border border-border">
          <AvatarFallback className="bg-green-500 text-base font-medium">AF</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold">Aline Ferreira</h2>
            <span className="size-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Disponível</span>
          </div>
          <p className="text-sm text-muted-foreground">Engenheira de Dados Sênior</p>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" /> São Paulo, SP · Remoto
            </span>
            <Badge variant="secondary" className="ml-1 bg-green-500 text-[10px] text-primary">
              Mulheres
            </Badge>
            <Badge variant="secondary" className="bg-green-500 text-[10px] text-primary">
              Pessoas negras
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Perfil técnico</p>
            <p className="font-mono text-sm font-semibold">Top 5% da base</p>
          </div>
          <ScoreRing value={96} size={64} label="perfil" />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        {/* Vagas publicadas */}
        <Card className="gap-0 p-0">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
            <Briefcase className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Vagas publicadas</h2>
            <LiveBadge live={isLive} className="ml-auto" />
            <CreateVagaDialog />
          </div>
          {isLoading ? (
            <p className="p-8 text-center text-sm text-muted-foreground">Carregando vagas…</p>
          ) : jobs.length === 0 ? (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nenhuma vaga publicada no momento.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {jobs.map((job) => (
                <li key={job.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <Avatar className="size-10 rounded-md border border-border">
                    <AvatarFallback className="rounded-md bg-green-500 text-xs font-medium">
                      <Briefcase className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium">{job.title}</p>
                      {job.esgCriteria.length > 0 && (
                        <Badge className="bg-accent text-[10px] text-accent-foreground">
                          Afirmativa
                        </Badge>
                      )}
                    </div>
                    {job.description && (
                      <p className="truncate text-xs text-muted-foreground">{job.description}</p>
                    )}
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" /> {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-primary">
                          <Wallet className="size-3" /> {job.salary}
                        </span>
                      )}
                    </div>
                    {job.esgCriteria.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.esgCriteria.map((c) => (
                          <Badge
                            key={c}
                            variant="secondary"
                            className="bg-green-500 text-[10px] text-primary"
                          >
                            <Leaf className="mr-1 size-2.5" /> {c}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1 self-start sm:self-center"
                    onClick={() => openJob(job)}
                  >
                    Ver <ArrowUpRight className="size-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div className="flex flex-col gap-6">
          {/* Empresas com metas ESG */}
          <Card className="gap-0 p-0">
            <div className="flex items-center gap-2 border-b border-border p-4">
              <Building2 className="size-4 text-primary" />
              <h2 className="text-sm font-semibold">Empresas com metas ESG</h2>
            </div>
            <ul className="divide-y divide-border">
              {companies.map((c) => (
                <li key={c.id} className="flex items-center gap-3 p-4">
                  <Avatar className="size-10 rounded-md border border-border">
                    <AvatarFallback className="rounded-md bg-green-500 text-xs font-medium">
                      {c.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.sector}</p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-1 font-mono text-sm font-semibold text-primary">
                      <Leaf className="size-3.5" /> {c.esgScore}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{c.openRoles} vagas</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="flex items-start gap-3 p-4">
            <ShieldCheck className="size-5 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Sua identidade <span className="font-medium text-foreground">não afeta</span> seu score
              técnico. Empresas só veem dados demográficos após o match, e apenas para metas ESG.
            </p>
          </Card>
        </div>
      </div>

      <VagaDetailDialog job={selectedJob} open={detailOpen} onOpenChange={setDetailOpen} />
    </div>
  )
}
