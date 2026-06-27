"use client"

import { useState } from "react"
import { Briefcase, MapPin, Wallet, GraduationCap, Leaf, ShieldCheck, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { JobItem } from "@/lib/api/adapters"
import { aplicarVaga } from "@/lib/api/hooks"

type Props = {
  job: JobItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

export function VagaDetailDialog({ job, open, onOpenChange }: Props) {
  const [aplicando, setAplicando] = useState(false)

  if (!job) return null

  // Função disparada quando a Aline (ID 1) clica no botão
  const handleCandidatar = async () => {
    setAplicando(true)
    try {
      // Como é a visão da Aline, forçamos o candidato_id dela como 1 para a demonstração
      const resposta = await aplicarVaga({ vaga_id: job.id, candidato_id: 1 })
      alert(resposta.mensagem)
      onOpenChange(false)
    } catch (error) {
      alert("Erro ao se candidatar. Verifique a conexão com o servidor.")
    } finally {
      setAplicando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-md border border-border bg-green-500">
              <Briefcase className="size-5 text-primary" />
            </span>
            <div>
              <DialogTitle>{job.title}</DialogTitle>
              <DialogDescription className="mt-0.5">
                Vaga {job.status?.toLowerCase() || "publicada"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          {job.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          )}

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <Row icon={MapPin} label="Localização" value={job.location || "Não informada"} />
            <Row icon={Wallet} label="Faixa salarial" value={job.salary || "A combinar"} />
          </div>

          {job.esgCriteria.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <GraduationCap className="size-3.5 text-primary" /> Critérios ESG · ação
                  afirmativa
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {job.esgCriteria.map((c) => (
                    <Badge
                      key={c}
                      variant="secondary"
                      className="bg-green-500 text-[11px] text-primary"
                    >
                      <Leaf className="mr-1 size-2.5" /> {c}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex items-start gap-2 rounded-md bg-green-500/10 p-3">
            <ShieldCheck className="size-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              A triagem técnica desta vaga é cega: nome, gênero e foto ficam ocultos até o match.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={aplicando}>
            Fechar
          </Button>
          
          {/* Botão de Candidatura que chama a função nova */}
          <Button onClick={handleCandidatar} disabled={aplicando} className="gap-2">
            {aplicando && <Loader2 className="size-4 animate-spin" />}
            {aplicando ? "Enviando perfil..." : "Candidatar-se"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
