/**
 * hooks.ts — Camada de acesso à API do App BiT
 *
 * Tenta conectar ao backend em localhost:8080.
 * Se a API estiver offline, cai automaticamente para dados mock.
 */

import { useState, useEffect, useCallback } from "react"

const BASE_URL = "http://localhost:8080"

// ── tipos ────────────────────────────────────────────────────────────────────

export interface Candidate {
  id: number
  perfil: string
  detalhes: string
  municipio: string
  regiao: string
  inclusionScore: number
}

export interface Region {
  regiao: string
  state: string
  concentracao: number
  coberturaRede: string
  perfis: number
}

export interface JobItem {
  id: number
  title: string
  description: string
  location: string
  salary: string
  esgCriteria: string[]
  status: string
}

export interface Distribution {
  label: string
  value: number
}

// ── dados mock (fallback quando API está offline) ─────────────────────────────

const MOCK_CANDIDATES: Candidate[] = [
  { id: 1, perfil: "Perfil Renda B", detalhes: "Renda: B | Idade: 25-34 | Mobilidade: INTENSA", municipio: "São Paulo", regiao: "SP", inclusionScore: 90 },
  { id: 2, perfil: "Perfil Renda C", detalhes: "Renda: C | Idade: 55+ | Mobilidade: INTENSA", municipio: "Salvador", regiao: "BA", inclusionScore: 85 },
  { id: 3, perfil: "Perfil Renda A", detalhes: "Renda: A | Idade: 35-44 | Mobilidade: MODERADA", municipio: "Recife", regiao: "PE", inclusionScore: 78 },
  { id: 4, perfil: "Perfil Renda B", detalhes: "Renda: B | Idade: 25-34 | Mobilidade: BAIXA", municipio: "Fortaleza", regiao: "CE", inclusionScore: 72 },
  { id: 5, perfil: "Perfil Renda C", detalhes: "Renda: C | Idade: 18-24 | Mobilidade: INTENSA", municipio: "Manaus", regiao: "AM", inclusionScore: 68 },
  { id: 6, perfil: "Perfil Renda B", detalhes: "Renda: B | Idade: 25-34 | Mobilidade: INTENSA", municipio: "Porto Alegre", regiao: "RS", inclusionScore: 65 },
  { id: 7, perfil: "Perfil Renda A", detalhes: "Renda: A | Idade: 18-24 | Mobilidade: MODERADA", municipio: "Curitiba", regiao: "PR", inclusionScore: 61 },
  { id: 8, perfil: "Perfil Renda C", detalhes: "Renda: C | Idade: 35-44 | Mobilidade: BAIXA", municipio: "Belém", regiao: "PA", inclusionScore: 58 },
  { id: 9, perfil: "Perfil Renda B", detalhes: "Renda: B | Idade: 55+ | Mobilidade: INTENSA", municipio: "Goiânia", regiao: "GO", inclusionScore: 55 },
  { id: 10, perfil: "Perfil Renda A", detalhes: "Renda: A | Idade: 25-34 | Mobilidade: MODERADA", municipio: "Belo Horizonte", regiao: "MG", inclusionScore: 52 },
]

const MOCK_REGIONS: Region[] = [
  { regiao: "São Paulo - Centro", state: "São Paulo", concentracao: 0.98, coberturaRede: "5G", perfis: 198400 },
  { regiao: "Rio de Janeiro - Centro", state: "Rio de Janeiro", concentracao: 0.94, coberturaRede: "5G", perfis: 89200 },
  { regiao: "Minas Gerais - BH", state: "Minas Gerais", concentracao: 0.85, coberturaRede: "4G/5G", perfis: 68400 },
  { regiao: "Bahia - Salvador", state: "Bahia", concentracao: 0.79, coberturaRede: "4G/5G", perfis: 42100 },
  { regiao: "Pernambuco - Recife", state: "Pernambuco", concentracao: 0.72, coberturaRede: "4G", perfis: 31400 },
  { regiao: "Ceará - Fortaleza", state: "Ceará", concentracao: 0.68, coberturaRede: "4G", perfis: 28900 },
  { regiao: "Paraná - Curitiba", state: "Paraná", concentracao: 0.65, coberturaRede: "4G/5G", perfis: 38700 },
  { regiao: "Rio Grande do Sul - Porto Alegre", state: "Rio Grande do Sul", concentracao: 0.61, coberturaRede: "4G", perfis: 44300 },
  { regiao: "Amazonas - Manaus", state: "Amazonas", concentracao: 0.55, coberturaRede: "4G", perfis: 12300 },
  { regiao: "Pará - Belém", state: "Pará", concentracao: 0.51, coberturaRede: "3G/4G", perfis: 22100 },
]

const MOCK_JOBS: JobItem[] = [
  { id: 1, title: "Analista de RH", description: "Atuar com processos seletivos inclusivos", location: "Palhoça - SC", salary: "R$ 3.000 - R$ 4.500", esgCriteria: [], status: "Publicada" },
  { id: 2, title: "Desenvolvedor Python", description: "Criar soluções com FastAPI e acessibilidade", location: "Ipu - CE", salary: "R$ 5.000 - R$ 7.000", esgCriteria: ["55+", "PcD", "Grupo Sub-representado"], status: "Publicada" },
]

const MOCK_DISTRIBUTION: Distribution[] = [
  { label: "Mulheres", value: 38 },
  { label: "Pessoas negras", value: 31 },
  { label: "PcD", value: 12 },
  { label: "LGBTQIA+", value: 9 },
  { label: "Pessoas 50+", value: 7 },
  { label: "Povos indígenas", value: 3 },
]

// ── mapeamento de município para estado ───────────────────────────────────────

const MUNICIPIO_PARA_ESTADO: Record<string, string> = {
  "Florianópolis": "Santa Catarina",
  "São José": "Santa Catarina",
  "Sao Jose": "Santa Catarina",
  "Palhoça": "Santa Catarina",
  "Palhoca": "Santa Catarina",
  "Biguaçu": "Santa Catarina",
  "São Paulo": "São Paulo",
  "Rio de Janeiro": "Rio de Janeiro",
  "Belo Horizonte": "Minas Gerais",
  "Salvador": "Bahia",
  "Fortaleza": "Ceará",
  "Recife": "Pernambuco",
  "Manaus": "Amazonas",
  "Curitiba": "Paraná",
  "Porto Alegre": "Rio Grande do Sul",
  "Belém": "Pará",
  "Goiânia": "Goiás",
  "Brasília": "Distrito Federal",
  "Maceió": "Alagoas",
  "Natal": "Rio Grande do Norte",
  "Teresina": "Piauí",
  "Campo Grande": "Mato Grosso do Sul",
  "Cuiabá": "Mato Grosso",
  "Macapá": "Amapá",
  "Porto Velho": "Rondônia",
  "Rio Branco": "Acre",
  "Boa Vista": "Roraima",
  "Palmas": "Tocantins",
  "Aracaju": "Sergipe",
  "João Pessoa": "Paraíba",
  "São Luís": "Maranhão",
  "Vitória": "Espírito Santo",
}

// ── helper de fetch ───────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...opts?.headers },
    signal: AbortSignal.timeout(4000),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

// ── useApiStatus ──────────────────────────────────────────────────────────────

export function useApiStatus() {
  const [online, setOnline] = useState(false)

  useEffect(() => {
    apiFetch("/")
      .then(() => setOnline(true))
      .catch(() => setOnline(false))
  }, [])

  return { online }
}

// ── useMatch ──────────────────────────────────────────────────────────────────

export function useMatch(params: { limite?: number } = {}) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [total, setTotal] = useState(0)
  const [isLive, setIsLive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch<{ total_encontrados: number; candidatos: any[] }>("/match/", {
      method: "POST",
      body: JSON.stringify({ grupo_sub_representado: true, limite: params.limite ?? 12 }),
    })
      .then((data) => {
        setCandidates(
          data.candidatos.map((c) => ({
            id: c.id,
            perfil: c.perfil,
            detalhes: c.detalhes,
            municipio: c.localizacao?.split(" - ")[0] ?? "",
            regiao: c.localizacao?.split(" - ")[1] ?? "",
            inclusionScore: Math.round((c.indice_inclusao ?? 0) * 100),
          }))
        )
        setTotal(data.total_encontrados)
        setIsLive(true)
      })
      .catch(() => {
        setCandidates(MOCK_CANDIDATES)
        setTotal(MOCK_CANDIDATES.length)
        setIsLive(false)
      })
      .finally(() => setIsLoading(false))
  }, [params.limite])

  return { candidates, total, isLive, isLoading }
}

// ── useInsights ───────────────────────────────────────────────────────────────

// undefined = ainda carregando
// null = API offline, usar mock
// Region[] = dados reais da API

export function useInsights() {
  const [regions, setRegions] = useState<Region[] | null | undefined>(undefined)
  const [isLive, setIsLive] = useState(false)

  // Só usa MOCK_REGIONS quando temos certeza que a API está offline (null)
  // Quando undefined (carregando), retorna array vazio para não misturar
  const activeRegions = regions === undefined
    ? []
    : regions === null
      ? MOCK_REGIONS
      : regions

  const stateData = activeRegions.reduce((acc, r) => {
    const existing = acc.find((s) => s.name === r.state)
    if (existing) {
      existing.talents += r.perfis
    } else {
      acc.push({
        uf: r.state?.slice(0, 2).toUpperCase() ?? "SC",
        name: r.state ?? r.regiao,
        talents: r.perfis,
        matchRate: Math.round(r.concentracao * 100),
      })
    }
    return acc
  }, [] as { uf: string; name: string; talents: number; matchRate: number }[])

  useEffect(() => {
    apiFetch<{ mapa_talentos: any[] }>("/insights/")
      .then((data) => {
        setRegions(
          data.mapa_talentos.map((r) => {
            const municipio = r.regiao?.split(" - ")[0]?.trim() ?? ""
            const estado = MUNICIPIO_PARA_ESTADO[municipio] ?? "Santa Catarina"
            return {
              regiao: r.regiao,
              state: estado,
              concentracao: r.concentracao,
              coberturaRede: r.cobertura_rede,
              perfis: r.perfis_disponiveis,
            }
          })
        )
        setIsLive(true)
      })
      .catch(() => {
        setRegions(null)
        setIsLive(false)
      })
  }, [])

  // Expõe regions como null quando offline ou array quando online
  // O componente usa regions !== null para saber se está no modo real
  return { regions: regions === undefined ? null : regions, stateData, isLive }
}

// ── useDashboard ──────────────────────────────────────────────────────────────

export function useDashboard() {
  const [totalSubscribers, setTotalSubscribers] = useState(0)
  const [distribution, setDistribution] = useState<Distribution[]>(MOCK_DISTRIBUTION)
  const [isLive, setIsLive] = useState(false)

  useEffect(() => {
    apiFetch<{ total_geral_assinantes: number }>("/dashboard/saude-time")
      .then((data) => {
        setTotalSubscribers(data.total_geral_assinantes)
        setIsLive(true)
      })
      .catch(() => {
        setTotalSubscribers(215400)
        setIsLive(false)
      })
  }, [])

  return { totalSubscribers, distribution, isLive }
}

// ── useVagas ──────────────────────────────────────────────────────────────────

export function useVagas() {
  const [jobs, setJobs] = useState<JobItem[]>([])
  const [isLive, setIsLive] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(() => {
    apiFetch<any[]>("/vagas/")
      .then((data) => {
        setJobs(
          data.map((v) => ({
            id: v.id,
            title: v.cargo,
            description: v.descricao,
            location: v.localizacao,
            salary: v.faixa_salarial,
            esgCriteria: v.criterios_esg ?? [],
            status: v.status,
          }))
        )
        setIsLive(true)
      })
      .catch(() => {
        setJobs(MOCK_JOBS)
        setIsLive(false)
      })
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return { jobs, isLive, isLoading, reload: load }
}

// ── publishVaga ───────────────────────────────────────────────────────────────

export async function publishVaga(payload: {
  cargo: string
  descricao: string
  requisito_perfil: string
  faixa_salarial: string
  localizacao: string
  criterios_esg: string[]
}) {
  return apiFetch("/vagas/", { method: "POST", body: JSON.stringify(payload) })
}
