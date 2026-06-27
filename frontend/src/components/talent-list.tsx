"use client"

import { useState } from "react"
import { MapPin, ShieldCheck, Users, UserCircle2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreRing } from "@/components/score-ring"
import { LiveBadge } from "@/components/live-badge"
import { useMatch, enviarMensagem } from "@/lib/api/hooks"
import { stateData } from "@/lib/data"

type Props = {
  selectedState: string | null
}

const MATCH_CONFIG = { limite: 12 }

export function TalentList({ selectedState }: Props) {
  const { candidates, total, isLive, isLoading } = useMatch(MATCH_CONFIG)
  
  // Estados para controlar o Modal de Mensagem e o envio
  const [candidatoAtivoModal, setCandidatoAtivoModal] = useState<number | null>(null)
  const [textoMensagem, setTextoMensagem] = useState("")
  const [enviando, setEnviando] = useState(false)

  const selectedUf = selectedState
    ? stateData.find((s) => s.name === selectedState)?.uf
    : undefined

  const ranked = [...candidates]
    .filter((c) => {
      if (isLive || !selectedUf) return true
      return c.regiao === selectedUf
    })
    .sort((a, b) => b.inclusionScore - a.inclusionScore)

  // Função que dispara o endpoint de mensagens no backend
  const handleEnviarMensagem = async (candidatoId: number) => {
    if (!textoMensagem.trim()) return
    setEnviando(true)
    try {
      const resposta = await enviarMensagem({
        empresa_id: 1, // Simulando a empresa logada (ID 1)
        candidato_id: candidatoId,
        vaga_id: 1, // Simulando a vaga ativa (ID 1)
        conteudo: textoMensagem
      })
      alert(resposta.mensagem)
      setCandidatoAtivoModal(null)
      setTextoMensagem("")
    } catch (error) {
      alert("Erro ao enviar a mensagem. Verifique a conexão com o servidor.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Card className="gap-0 p-0 relative overflow-hidden">
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
              className="flex flex-col gap-4 p-4 transition-colors hover:bg-green-500/10 sm:flex-row sm:items-start justify-between"
            >
              {/* LADO ESQUERDO: Avatar + Textos */}
              <div className="flex flex-1 min-w-0 items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground bg-background">
                  <UserCircle2 className="size-6" />
                </span>
                
                {/* min-w-0 e flex-1 garantem que o texto respeite o limite da tela */}
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="truncate text-sm font-medium">{c.perfil}</p>
                  
                  {/* BUG CORRIGIDO: whitespace-normal e break-words forçam o texto a pular linha */}
                  <p className="text-xs text-muted-foreground whitespace-normal break-words overflow-hidden leading-relaxed pr-2">
                    {c.detalhes}
                  </p>
                  
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {c.municipio}
                    {c.regiao && <span className="text-primary">· {c.regiao}</span>}
                  </div>
                </div>
              </div>

              {/* LADO DIREITO: Botão de Contato, Badges e Score */}
              {/* shrink-0 impede que o texto grande da esquerda esmague essa coluna */}
              <div className="flex shrink-0 flex-col items-end gap-3 sm:pl-4 sm:border-l sm:border-border/50">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="hidden bg-green-500 text-[10px] text-primary sm:inline-flex"
                  >
                    ID #{c.id}
                  </Badge>
                  <div className="hidden items-center gap-1 rounded-md bg-orange-300 px-2 py-1 text-[10px] font-medium text-primary md:flex">
                    <ShieldCheck className="size-3 shrink-0" />
                    Sem viés
                  </div>
                </div>

                <button
                  onClick={() => setCandidatoAtivoModal(c.id)}
                  className="w-full rounded bg-green-600 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-700"
                >
                  Iniciar Contato
                </button>

                <div className="hidden flex-col items-center gap-1 mt-1 sm:flex">
                  <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Score
                  </span>
                  <ScoreRing value={c.inclusionScore} label="inclusão" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* MODAL SOBREPOSTO PARA ENVIO DE MENSAGEM - CORRIGIDO PARA BRANCO SÓLIDO */}
      {candidatoAtivoModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          {/* bg-white forçado aqui para matar o problema de transparência do tema */}
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-200">
            {/* Cores de texto forçadas para cinza e preto absolutos para contraste perfeito no branco */}
            <h2 className="mb-2 text-lg font-bold text-gray-900">Contatar Candidato #{candidatoAtivoModal}</h2>
            <p className="mb-4 text-sm text-gray-600">
              Para garantir a segurança do processo e o rastreio da comissão de contratação da App BiT, a primeira interação deve ocorrer por aqui.
            </p>
            
            <textarea
              className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none placeholder:text-gray-400"
              placeholder="Descreva a vaga e faça o convite inicial para a entrevista..."
              value={textoMensagem}
              onChange={(e) => setTextoMensagem(e.target.value)}
            />
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setCandidatoAtivoModal(null)
                  setTextoMensagem("")
                }}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={enviando}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleEnviarMensagem(candidatoAtivoModal)}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
                disabled={enviando || !textoMensagem.trim()}
              >
                {enviando ? "Registrando..." : "Enviar e Registrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
