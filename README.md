# App BiT — Motor de Matching Inclusivo

Repositório oficial da **Equipe 19** — Hackathon No Country S06-26.

Plataforma B2B que conecta empresas com metas ESG a talentos de grupos sub-representados. Um motor de IA calcula o score de compatibilidade técnica com filtro anti-viés, e dados reais de geolocalização mostram onde esses talentos estão concentrados por região.

> ⚠️ **Observação:** Este repositório contém o Backend (API). O Frontend está em desenvolvimento.

---

## Índice

- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Banco de Dados](#banco-de-dados)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Endpoints da API](#endpoints-da-api)
- [Resumo de Validação](#resumo-de-validação)
- [Equipe](#equipe)

---

## Funcionalidades

- **Health Check** — Verificação de status e disponibilidade da API
- **Vagas** — Cadastro, listagem e gerenciamento de oportunidades com critérios ESG
- **Matching** — Busca inteligente de candidatos ranqueada por Índice de Inclusão
- **Insights** — Dados de geolocalização, concentração e fluxo de talentos
- **Dashboard B2C** — Métricas de diversidade, perfil demográfico e qualificação da base

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

## Banco de Dados

- Banco utilizado: **MySQL**
- Tabelas principais: `assinantes`, `antenas`, `concentracao`, `vagas`, `empresas`
- Campos chave para matching: `home_municipio`, `income_cluster`, `age_group`, `mobility_pattern`, `flag_flagship`
- Scripts SQL:
  - `backend/database/schema.sql` — cria as tabelas e índices
  - `backend/database/insert.sql` — insere dados de exemplo

---

## Como Rodar Localmente

### Pré-requisitos

- Python 3.12+
- MySQL rodando localmente
- Chave de API do [Google AI Studio](https://aistudio.google.com) (gratuito)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/No-Country-simulation/S06-26-AB-EQUIPO-19.git
cd S06-26-AB-EQUIPO-19

# 2. Crie e ative o ambiente virtual
python3 -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 3. Instale as dependências
pip install -r backend/requirements.txt

# 4. Configure as variáveis de ambiente
cp backend/.env.example backend/.env
# Edite o backend/.env com suas credenciais do banco e a IA_API_KEY

# 5. Crie o banco de dados
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/insert.sql

# 6. Carregue os dados da Vísent no banco
cd backend
python carregar_dados.py

# 7. Inicie o servidor
python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8080
```

Acesse `http://localhost:8080/docs` para explorar todos os endpoints via Swagger.

---

## Endpoints da API

Base URL local: `http://localhost:8080`

Documentação interativa (Swagger): `http://localhost:8080/docs`

---

### GET /

Health check — verifica se a API está no ar.

**Response `200 OK`:**
```json
{
  "status": "online",
  "versao": "0.1.0",
  "nome": "App BiT — Motor de Matching Inclusivo"
}
```

---

### GET /vagas

Lista todas as vagas publicadas.

**Response `200 OK`:**
```json
[
  {
    "id": 1,
    "cargo": "Analista de RH",
    "descricao": "Atuar com processos seletivos inclusivos",
    "escolaridade_requerida": "",
    "faixa_salarial": "R$ 3.000,00 a R$ 4.500,00",
    "localizacao": "Palhoça - SC",
    "criterios_esg": [],
    "status": "Publicada"
  },
  {
    "id": 4,
    "cargo": "Desenvolvedor Python",
    "descricao": "Criar soluções com FastAPI e acessibilidade",
    "escolaridade_requerida": "Superior Completo",
    "faixa_salarial": "R$ 5.000,00 a R$ 7.000,00",
    "localizacao": "Ipu - CE",
    "criterios_esg": ["55+", "PcD", "Grupo Sub-representado"],
    "status": "Publicada"
  }
]
```

---

### POST /vagas

Publica uma nova vaga no sistema.

**Request Body:**
```json
{
  "cargo": "Engenheiro de Dados",
  "descricao": "Trabalhar com dados de mobilidade e inclusão",
  "requisito_perfil": "Superior Completo",
  "faixa_salarial": "R$ 6.000,00 a R$ 9.000,00",
  "localizacao": "Florianópolis - SC",
  "criterios_esg": ["PcD", "Grupo Sub-representado"]
}
```

**Response `201 Created`:**
```json
{
  "id": 5,
  "cargo": "Engenheiro de Dados",
  "descricao": "Trabalhar com dados de mobilidade e inclusão",
  "escolaridade_requerida": "Superior Completo",
  "faixa_salarial": "R$ 6.000,00 a R$ 9.000,00",
  "localizacao": "Florianópolis - SC",
  "criterios_esg": ["PcD", "Grupo Sub-representado"],
  "status": "Publicada"
}
```

---

### POST /match

Busca candidatos com filtros anti-viés e critérios ESG, ranqueados por Índice de Inclusão.

> ⚠️ **Segurança:** o endpoint não retorna `nome`, `email`, `genero`, `raca` ou qualquer atributo pessoal identificável.

**Campos disponíveis:** `municipio`, `regiao`, `renda` (A, B ou C), `faixa_etaria`, `mobilidade`, `grupo_sub_representado`, `limite`

**Request Body:**
```json
{
  "faixa_etaria": "55+",
  "grupo_sub_representado": true,
  "limite": 5
}
```

**Response `200 OK`:**
```json
{
  "total_encontrados": 7590,
  "candidatos": [
    {
      "id": 81,
      "perfil": "Perfil Renda C",
      "detalhes": "Renda: C | Idade: 55+ | Mobilidade: INTENSA",
      "localizacao": "São José - Região: SAO_JOSE_BARREIROS",
      "indice_inclusao": 1.0
    },
    {
      "id": 331,
      "perfil": "Perfil Renda B",
      "detalhes": "Renda: B | Idade: 55+ | Mobilidade: INTENSA",
      "localizacao": "Palhoça - Região: PALHOCA_CENTRO",
      "indice_inclusao": 1.0
    }
  ]
}
```

---

### GET /insights

Retorna dados reais de concentração de pessoas por região.
Fonte: Vísent CDRView — dados de antenas Anatel de Florianópolis.

**Response `200 OK`:**
```json
{
  "mapa_talentos": [
    {
      "regiao": "Florianópolis",
      "concentracao": 0.94,
      "cobertura_rede": "5G",
      "perfis_disponiveis": 89200
    },
    {
      "regiao": "Palhoça",
      "concentracao": 0.79,
      "cobertura_rede": "4G/5G",
      "perfis_disponiveis": 38500
    }
  ]
}
```

---

### GET /dashboard/saude-time

Retorna métricas de distribuição de perfis por renda, idade e região.

**Response `200 OK`:**
```json
{
  "total_geral_assinantes": 215400,
  "dados_por_perfil": [
    {
      "perfil": "Analista de Sistemas",
      "quantidade": 32400,
      "percentual_total": 15.04,
      "media_escolaridade": "Superior Completo",
      "indice_qualificacao": 0.92
    }
  ],
  "dados_por_regiao": [
    {
      "regiao": "Florianópolis",
      "total_pessoas": 89200,
      "distribuicao_perfis": {
        "Analista": 14500,
        "Desenvolvedor": 12800
      },
      "indice_densidade": 0.94
    }
  ],
  "data_atualizacao": "2026-06-16"
}
```

---

## Resumo de Validação

Todos os endpoints foram testados com sucesso via Swagger.

| Funcionalidade | Método | Rota | Status |
|---------------|---------|-------|--------|
| Saúde da API | GET | `/` | ✅ 200 |
| Listar Vagas | GET | `/vagas/` | ✅ 200 |
| Publicar Vaga | POST | `/vagas/` | ✅ 201 |
| Matching Inclusivo | POST | `/match/` | ✅ 200 |
| Insights Geográficos | GET | `/insights/` | ✅ 200 |
| Dashboard ESG | GET | `/dashboard/saude-time` | ✅ 200 |

---

## Estrutura de Pastas

```
S06-26-AB-EQUIPO-19/
├── backend/
│   ├── config/
│   │   └── database.py
│   ├── database/
│   │   ├── schema.sql
│   │   └── insert.sql
│   ├── models/
│   │   ├── models_db.py
│   │   └── schemas.py
│   ├── routes/
│   │   ├── match.py
│   │   ├── vagas.py
│   │   ├── insights.py
│   │   └── dashboard.py
│   ├── services/
│   │   ├── ia_service.py
│   │   └── geo_service.py
│   ├── carregar_dados.py
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── dataset-visent/
│   └── tensores/
│       └── tensor_concentracao.csv
├── SYSTEM_PROMPT_APP_BIT.md
├── CONTRIBUTING.md
├── docker-compose.yml
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
| Fernando Henrique Pereira Fernandez | Data Analyst | [@fernandez2312](https://github.com/fernandez2312)— |
| Wesley Muniz França | Graphic Designer | — |
| Erick Levi Souza Machado | Game Developer | — |

---

*Hackathon No Country · S06-26 · Equipe 19*
