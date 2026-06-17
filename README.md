# App BiT — Portal B2B de Matching Inclusivo com Filtro ESG

Repositório oficial da **Equipe 19** — Hackathon No Country S06-26.

Plataforma B2B que conecta empresas com metas ESG a talentos de grupos sub-representados. Um motor de IA calcula o score de compatibilidade técnica com filtro anti-viés, e dados reais de geolocalização mostram onde esses talentos estão concentrados por região.

---

## Índice

- [O Desafio](#o-desafio)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Stack Tecnológica](#stack-tecnológica)
- [Endpoints da API](#endpoints-da-api)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Equipe](#equipe)

---

## O Desafio

Empresas com metas ESG não conseguem encontrar e contratar talentos de grupos sub-representados de forma eficiente e sem viés.

Nossa solução: um portal B2B onde empresas publicam vagas com filtros de diversidade, e um agente de IA retorna uma shortlist de candidatos com **score de compatibilidade técnica** e **badge de diversidade geográfica**, sem expor atributos pessoais ao processo de seleção.

---

## Arquitetura do Sistema

<img width="1174" height="373" alt="Diagrama de Blocos" src="https://github.com/user-attachments/assets/df259499-560a-4b7a-be3c-7ed48a4e6323" />

**Fluxo principal:**
1. Recrutador acessa o portal e define filtros ESG no Front-end
2. Front-end envia `POST /match` com os dados da vaga para o Back-end
3. Back-end consulta candidatos no Banco de Dados MySQL
4. Back-end envia perfis para o Motor de IA (Google Gemini) e recebe scores
5. Back-end consulta dados geográficos reais do dataset Vísent CDRView
6. Shortlist com scores e badges é retornada ao Front-end

---

## Stack Tecnológica

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Back-end | Python / FastAPI | ✅ Implementado |
| Banco de Dados | MySQL + SQLAlchemy | ✅ Implementado |
| Motor de IA | Google Gemini (AI Studio) | ✅ Implementado |
| Dados Geográficos | Vísent CDRView (dataset real) | ✅ Implementado |
| Front-end | React.js | 🔄 Em desenvolvimento |
| Deploy | Render | ⏳ Pendente |

---

## Endpoints da API

Base URL local: `http://localhost:8080`

Documentação interativa (Swagger): `http://localhost:8080/docs`

---

### `POST /match`

Recebe filtros de diversidade e retorna shortlist de candidatos com índice de inclusão.

**Request Body:**
```json
{
  "municipio": "Florianópolis",
  "regiao": "Centro",
  "renda": "B",
  "faixa_etaria": "25-34",
  "mobilidade": true,
  "grupo_sub_representado": true,
  "limite": 10
}
```

**Response `200 OK`:**
```json
{
  "total_encontrados": 48,
  "candidatos": [
    {
      "id": 7,
      "perfil": "Perfil Renda B",
      "detalhes": "Renda: B | Idade: 25-34 | Mobilidade: INTENSA",
      "localizacao": "Florianópolis - Região: Centro",
      "indice_inclusao": 0.9
    }
  ]
}
```

> ⚠️ **Segurança:** o endpoint **não retorna** `nome`, `email`, `genero`, `raca` ou qualquer atributo pessoal identificável.

---

### `GET /vagas`

Lista todas as vagas publicadas.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "cargo": "Analista de Dados",
    "descricao": "Vaga para analista com foco em diversidade",
    "escolaridade_requerida": "Superior Completo",
    "faixa_salarial": "R$ 4.000 - R$ 6.000",
    "localizacao": "Florianópolis",
    "criterios_esg": ["PcD", "Mulheres em Tech"],
    "status": "Publicada"
  }
]
```

---

### `POST /vagas`

Publica uma nova vaga no sistema.

**Request Body:**
```json
{
  "cargo": "Desenvolvedora Back-end Pleno",
  "descricao": "Vaga com foco em inclusão de grupos sub-representados",
  "faixa_salarial": "R$ 6.000 - R$ 9.000",
  "localizacao": "Florianópolis",
  "criterios_esg": ["Negros e Pardos", "Mulheres em Tech"]
}
```

**Response `201 Created`:**
```json
{
  "id": 12,
  "cargo": "Desenvolvedora Back-end Pleno",
  "descricao": "Vaga com foco em inclusão de grupos sub-representados",
  "faixa_salarial": "R$ 6.000 - R$ 9.000",
  "localizacao": "Florianópolis",
  "criterios_esg": ["Negros e Pardos", "Mulheres em Tech"],
  "status": "Publicada"
}
```

---

### `GET /insights`

Retorna dados reais de concentração de pessoas por região.
Fonte: **Vísent CDRView** — dados de antenas Anatel de Florianópolis.

**Response `200 OK`:**
```json
{
  "mapa_talentos": [
    {
      "regiao": "Florianópolis - CBD_BEIRAMAR",
      "concentracao": 0.9,
      "cobertura_rede": "4G/5G",
      "perfis_disponiveis": 1240
    },
    {
      "regiao": "Florianópolis - UFSC",
      "concentracao": 0.75,
      "cobertura_rede": "4G/5G",
      "perfis_disponiveis": 890
    }
  ]
}
```

---

### `GET /dashboard/saude-time`

Retorna métricas de distribuição de perfis por renda, idade e região.

**Response `200 OK`:**
```json
{
  "total_geral_assinantes": 215400,
  "dados_por_perfil": [...],
  "dados_por_regiao": [...],
  "data_atualizacao": "2026-06-16"
}
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/` copiando o `.env.example`:

```bash
cp backend/.env.example backend/.env
```

| Variável | Descrição |
|----------|-----------|
| `DB_HOST` | Host do banco de dados (padrão: `localhost`) |
| `DB_USER` | Usuário do MySQL |
| `DB_PASSWORD` | Senha do MySQL |
| `DB_NAME` | Nome do banco (padrão: `appbit`) |
| `IA_API_KEY` | Chave da API do Google AI Studio (Gemini) |

> 🔒 **Nunca suba o arquivo `.env` para o repositório.**

---

## Como Rodar Localmente

### Pré-requisitos

- Python 3.10+
- MySQL rodando localmente
- Chave de API do [Google AI Studio](https://aistudio.google.com) (gratuito)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/No-Country-simulation/S06-26-AB-EQUIPO-19.git
cd S06-26-AB-EQUIPO-19

# 2. Configure as variáveis de ambiente
cp backend/.env.example backend/.env
# Edite o backend/.env com suas credenciais do banco e a IA_API_KEY

# 3. Crie o banco de dados
# No MySQL Workbench ou terminal MySQL, execute:
# backend/database/schema.sql   (cria as tabelas)
# backend/database/insert.sql   (insere dados de exemplo)

# 4. Carregue os dados da Vísent no banco
cd backend
python carregar_dados.py

# 5. Instale as dependências
pip install -r requirements.txt

# 6. Inicie o servidor
uvicorn main:app --reload --port 8080
```

Acesse `http://localhost:8080/docs` para explorar todos os endpoints via Swagger.

---

## Estrutura de Pastas

```
S06-26-AB-EQUIPO-19/
├── backend/
│   ├── config/
│   │   └── database.py          # Conexão MySQL via SQLAlchemy
│   ├── database/
│   │   ├── schema.sql            # Criação das tabelas
│   │   └── insert.sql            # Dados de exemplo
│   ├── models/
│   │   ├── models_db.py          # Modelos SQLAlchemy (tabelas)
│   │   └── schemas.py            # Schemas Pydantic (request/response)
│   ├── routes/
│   │   ├── match.py              # POST /match — motor de matching
│   │   ├── vagas.py              # GET e POST /vagas
│   │   ├── insights.py           # GET /insights — mapa de talentos
│   │   └── dashboard.py          # GET /dashboard/saude-time
│   ├── services/
│   │   ├── ia_service.py         # Integração Google Gemini
│   │   └── geo_service.py        # Dados geográficos Vísent
│   ├── carregar_dados.py         # Script para popular o banco com CSVs
│   ├── main.py                   # Entrada da aplicação FastAPI
│   └── requirements.txt
├── dataset-visent/
│   └── tensores/
│       └── tensor_concentracao.csv  # Dataset Vísent CDRView
├── frontend/                    # 🔄 Em desenvolvimento (React.js)
├── SYSTEM_PROMPT_APP_BIT.md     # System prompt do motor de IA
├── .env.example
├── .gitignore
└── README.md
```

---

## Equipe

| Nome | Papel | GitHub |
|------|-------|--------|
| Matheus Bauer | Architect (Software / Solution Architect) | [@obauercosta](https://github.com/obauercosta) |
| Carlos André Alves Bezerra | Backend Developer | [@andrealves8](https://github.com/andrealves8) |
| Geordani Machado | Frontend Developer | [@Geordani-Machado](https://github.com/Geordani-Machado) |
| Fernando Henrique Pereira Fernandez | Data Analyst | — |
| Wesley Muniz França | Graphic Designer | — |
| Erick Levi Souza Machado | Game Developer | — |

---

*Hackathon No Country · S06-26 · Equipe 19*
