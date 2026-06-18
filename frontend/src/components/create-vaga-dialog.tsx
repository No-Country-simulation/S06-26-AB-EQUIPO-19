"use client"

import { useState } from "react"
import { Plus, Loader2, Leaf } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { publishVaga } from "@/lib/api/hooks"
import { cn } from "@/lib/utils"

const ESG_OPTIONS = [
  "Mulheres",
  "Pessoas negras",
  "Pessoas com deficiência",
  "LGBTQIA+",
  "Pessoas 50+",
  "Baixa renda",
  "Povos indígenas",
]

const ESCOLARIDADE = [
  "Ensino fundamental",
  "Ensino médio",
  "Ensino técnico",
  "Ensino superior",
  "Pós-graduação",
]

type FormState = {
  cargo: string
  descricao: string
  requisito_perfil: string
  faixa_salarial: string
  localizacao: string
}

const EMPTY: FormState = {
  cargo: "",
  descricao: "",
  requisito_perfil: ESCOLARIDADE[3],
  faixa_salarial: "",
  localizacao: "",
}

export function CreateVagaDialog() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [criterios, setCriterios] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function toggleCriterio(c: string) {
    setCriterios((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  }

  function reset() {
    setForm(EMPTY)
    setCriterios([])
    setError(null)
  }

  const valid = form.cargo.trim() && form.localizacao.trim() && form.descricao.trim()

  async function handleSubmit() {
    if (!valid || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      await publishVaga({
        cargo: form.cargo.trim(),
        descricao: form.descricao.trim(),
        requisito_perfil: form.requisito_perfil,
        faixa_salarial: form.faixa_salarial.trim() || "A combinar",
        localizacao: form.localizacao.trim(),
        criterios_esg: criterios,
      })
      reset()
      setOpen(false)
    } catch {
      setError(
        "Não foi possível publicar a vaga. Verifique se a API está conectada (modo demonstração não persiste vagas).",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) reset()
      }}
    >
      <DialogTrigger render={<Button size="sm" className="gap-1" />}>
        <Plus className="size-4" /> Cadastrar vaga
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar nova vaga</DialogTitle>
          <DialogDescription>
            Defina os requisitos técnicos e os critérios ESG. A identidade dos candidatos
            permanece oculta na triagem.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cargo">Cargo</Label>
            <Input
              id="cargo"
              placeholder="Ex.: Engenheira(o) de Dados Sênior"
              value={form.cargo}
              onChange={(e) => set("cargo", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              rows={3}
              placeholder="Responsabilidades, stack e contexto da posição"
              value={form.descricao}
              onChange={(e) => set("descricao", e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="localizacao">Localização</Label>
              <Input
                id="localizacao"
                placeholder="Ex.: São Paulo, SP · Remoto"
                value={form.localizacao}
                onChange={(e) => set("localizacao", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="salario">Faixa salarial</Label>
              <Input
                id="salario"
                placeholder="Ex.: R$ 12k – 16k"
                value={form.faixa_salarial}
                onChange={(e) => set("faixa_salarial", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="escolaridade">Escolaridade requerida</Label>
            <select
              id="escolaridade"
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={form.requisito_perfil}
              onChange={(e) => set("requisito_perfil", e.target.value)}
            >
              {ESCOLARIDADE.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Critérios ESG (ação afirmativa)</Label>
            <div className="flex flex-wrap gap-2">
              {ESG_OPTIONS.map((c) => {
                const active = criterios.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleCriterio(c)}
                    aria-pressed={active}
                  >
                    <Badge
                      variant={active ? "default" : "secondary"}
                      className={cn(
                        "cursor-pointer gap-1 transition-colors",
                        active && "bg-primary text-primary-foreground",
                      )}
                    >
                      <Leaf className="size-2.5" /> {c}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!valid || submitting} className="gap-1">
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Publicar vaga
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
