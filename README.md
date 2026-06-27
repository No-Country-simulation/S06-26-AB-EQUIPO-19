# App BiT — Motor de Matching Inclusivo

Repositório oficial da **Equipe 19** — Hackathon No Country S06-26.

O **App BiT** é uma plataforma corporativa B2B projetada para conectar empresas com metas de governança ambiental e social (ESG) a talentos de grupos sub-representados. A solução utiliza um motor de Inteligência Artificial para avaliar competências técnicas através de um filtro anti-viés, cruzando os resultados com dados reais de geolocalização e densidade demográfica.

---

## Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Principais Funcionalidades](#principais-funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Endpoints da API](#endpoints-da-api)
- [Resumo de Validação](#resumo-de-validação)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Guia de Contribuição](#guia-de-contribuição)
- [Equipe](#equipe)

---

## Sobre o Projeto

O processo de recrutamento técnico frequentemente esbarra em vieses inconscientes. O App BiT resolve esse problema ocultando informações demográficas (nome, gênero, raça) durante a triagem inicial e delegando a avaliação técnica para um modelo de Inteligência Artificial (Google Gemini). 

As empresas definem suas metas ESG, e a plataforma destaca candidatos que atendem a esses critérios geográficos e sociais de forma paralela à nota técnica, garantindo um processo seletivo justo, rastreável e altamente inclusivo.

---

## Principais Funcionalidades

- **Health Check:** Verificação de status e disponibilidade da API.
- **Triagem Anti-Viés com IA:** Avaliação de currículos executada pelo Google Gemini, baseada estritamente em habilidades técnicas, gerando um Score de Inclusão e um parecer justificado para o recrutador.
- **Insights de Geolocalização:** Integração com o dataset Vísent CDRView, permitindo visualizar a densidade real de talentos mapeados, concentração, fluxo e a cobertura de rede (4G/5G) por região.
- **Gestão de Vagas:** Interface B2B para cadastro, listagem e gerenciamento de oportunidades de emprego com definição clara de critérios ESG e de ação afirmativa.
- **Candidatura e Mensageria Integrada:** Fluxo completo onde o talento se candidata e a empresa inicia a comunicação diretamente pela plataforma, gerando o rastreio automático do status da negociação para fins de comissionamento.
- **Dashboard B2C:** Painel interativo com métricas globais conectadas ao vivo ao banco de talentos, mostrando a distribuição por perfil, renda, idade e qualificação da base.

---

## Stack Tecnológica

| Camada | Tecnologia | Status |
|--------|-----------|--------|
| Back-end | Python / FastAPI | ✅ Implementado |
| Banco de Dados | MySQL + SQLAlchemy | ✅ Implementado |
| Motor de IA | Google Gemini (SDK google-genai) | ✅ Implementado |
| Dados Geográficos | Vísent CDRView (dataset real) | ✅ Implementado |
| Front-end | React.js | ✅ Implementado |
| Deploy | Render | ⏳ Pendente |

---

## Estrutura do Banco de Dados

O sistema opera com um banco de dados relacional (MySQL). O núcleo do modelo de dados é composto por:

- Banco utilizado: **MySQL**
- Tabelas principais: `assinantes`, `antenas`, `concentracao`, `vagas`, `empresas`, `Mensagem_Recrutamento`, `Contratacao_Comissao`
- Campos chave para matching: `home_municipio`, `income_cluster`, `age_group`, `mobility_pattern`, `flag_flagship`
- Scripts SQL:
  - `backend/database/schema.sql` — cria as tabelas e índices
  - `backend/database/insert.sql` e `seed.sql` — inserem dados de exemplo e alimentam as bases de teste.

---

## Como Rodar Localmente

### Pré-requisitos
- Node.js e npm (Para a interface web)
- Python 3.11+ (Para o servidor da API)
- MySQL Server rodando localmente (Ex: XAMPP, WAMP, MySQL Workbench)
- Chave de API do [Google AI Studio](https://aistudio.google.com/)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/No-Country-simulation/S06-26-AB-EQUIPO-19.git
cd S06-26-AB-EQUIPO-19

# 2. Crie e ative o ambiente virtual para o backend
cd backend
python3 -m venv venv
source venv/bin/activate        # Linux/macOS
venv\Scripts\activate           # Windows

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais locais de acesso ao banco MySQL e a chave IA_API_KEY

# 5. Crie o banco de dados e as tabelas
mysql -u root -p < database/schema.sql
mysql -u root -p < database/insert.sql
mysql -u root -p < database/seed.sql

# 6. Carregue os dados estruturais da Vísent no banco
python carregar_dados.py

# 7. Inicie o servidor da API
python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8080

# 8. Inicie a interface do usuário em outro terminal
cd ../frontend
npm install
npm run dev
```

Acesse `http://localhost:8080/docs` para explorar e testar todos os endpoints via Swagger. O painel web estará disponível localmente em `http://localhost:5173`.

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
  "status": "ok",
  "message": "App BiT API está no ar."
}
```

---

### GET /vagas

Lista todas as vagas publicadas na base de dados.

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

Publica uma nova oportunidade de emprego no sistema.

**Request Body:**
```json
{
  "empresa_id": 1,
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

### POST /vagas/candidatar

Permite que um candidato manifeste interesse em uma vaga publicada.

**Request Body:**
```json
{
  "vaga_id": 1,
  "candidato_id": 1
}
```

**Response `201 Created`:**
```json
{
  "sucesso": true,
  "mensagem": "Candidatura enviada com sucesso! A empresa já pode ver o seu perfil no painel de Triagem."
}
```

---

### POST /mensagens

Registra o envio da primeira mensagem entre a empresa e o talento, ativando simultaneamente o registro de comissionamento de contratação atrelado à plataforma.

**Request Body:**
```json
{
  "empresa_id": 1,
  "candidato_id": 1,
  "vaga_id": 1,
  "conteudo": "Olá, Aline! Gostamos do seu perfil técnico aprovado pelo motor de IA."
}
```

**Response `200 OK`:**
```json
{
  "sucesso": true,
  "mensagem": "Mensagem enviada e processo de contratação iniciado com rastreio de comissão.",
  "id_registro": 12
}
```

---

### POST /match

Busca candidatos limitados aos filtros estipulados e os submete à Inteligência Artificial (Google Gemini) para análise de compatibilidade técnica sem viés humano, ranqueando a lista de retorno pelo Score de Inclusão.

> ⚠️ **Segurança:** A identidade, nome e gênero dos candidatos são completamente anonimizados no envio do payload ao motor de Inteligência Artificial para garantir imparcialidade estrutural.

**Campos disponíveis no Request:** `municipio`, `regiao`, `renda`, `faixa_etaria`, `mobilidade`, `grupo_sub_representado`, `limite`

**Request Body:**
```json
{
  "faixa_etaria": "55+",
  "grupo_sub_representado": true,
  "limite": 4
}
```

**Response `200 OK`:**
```json
{
  "total_encontrados": 2,
  "candidatos": [
    {
      "id": 1,
      "perfil": "Candidato #1 (Anonimizado)",
      "detalhes": "Skills: Python, React, PostgreSQL | Parecer IA: A análise técnica indicou adequação integral do candidato à vaga proposta.",
      "localizacao": "Região detectada: Norte ou Nordeste",
      "indice_inclusao": 0.85
    },
    {
      "id": 2,
      "perfil": "Candidato #2 (Anonimizado)",
      "detalhes": "Skills: Python, Flask | Parecer IA: O candidato não demonstrou conhecimentos em PostgreSQL e Docker.",
      "localizacao": "Região detectada: Sul, Sudeste ou Centro-Oeste",
      "indice_inclusao": 0.45
    }
  ]
}
```

---

### GET /insights

Retorna dados brutos reais de concentração populacional cruzados pelo backend, traduzindo as capturas geográficas das antenas para alimentar o mapa interativo.
Fonte primária: Vísent CDRView — dados de antenas Anatel da região metropolitana de Florianópolis.

**Response `200 OK`:**
```json
{
  "mapa_talentos": [
    {
      "regiao": "Florianópolis - Centro_Historico",
      "concentracao": 0.94,
      "cobertura_rede": "5G",
      "perfis_disponiveis": 89200
    },
    {
      "regiao": "Palhoça - Sao_Jose_Barreiros",
      "concentracao": 0.79,
      "cobertura_rede": "4G/5G",
      "perfis_disponiveis": 38500
    }
  ]
}
```

---

### GET /dashboard/saude-time

Consome a tabela de dados dos usuários logados e processa métricas ativas de distribuição de perfis por renda, idade e regiões para exibição no Dashboard.

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
  "data_atualizacao": "2026-06-23"
}
```

---

## Resumo de Validação

Todos os endpoints foram testados e homologados localmente com sucesso.

| Funcionalidade | Método | Rota | Status HTTP |
|---------------|---------|-------|--------|
| Saúde da API | GET | `/` | ✅ 200 |
| Listar Vagas | GET | `/vagas/` | ✅ 200 |
| Publicar Vaga | POST | `/vagas/` | ✅ 201 |
| Registrar Candidatura | POST | `/vagas/candidatar` | ✅ 201 |
| Enviar Mensagem (Comissão) | POST | `/mensagens/` | ✅ 200 |
| Triagem IA Inclusiva | POST | `/match/` | ✅ 200 |
| Insights Geográficos | GET | `/insights/` | ✅ 200 |
| Dashboard ESG e Métricas | GET | `/dashboard/saude-time` | ✅ 200 |

---

## Estrutura de Pastas

A organização de módulos atualizada se apresenta da seguinte forma no backend:

```
S06-26-AB-EQUIPO-19/
├── backend/
│   ├── config/
│   │   └── database.py
│   ├── database/
│   │   ├── schema.sql
│   │   ├── insert.sql
│   │   └── seed.sql
│   ├── models/
│   │   ├── models_db.py
│   │   └── schemas.py
│   ├── routes/
│   │   ├── dashboard.py
│   │   ├── insights.py
│   │   ├── match.py
│   │   ├── mensagens.py
│   │   └── vagas.py
│   ├── services/
│   │   ├── geo_service.py
│   │   └── ia_service.py
│   ├── carregar_dados.py
│   ├── main.py
│   ├── Dockerfile
│   └── requirements.txt
├── dataset-visent/
│   └── tensores/
│       └── tensor_concentracao.csv
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── lib/
├── SYSTEM_PROMPT_APP_BIT.md
├── CONTRIBUTING.md
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Guia de Contribuição

O fluxo de desenvolvimento da Equipe 19 segue estritamente o modelo de branches baseado em features/fixes. **Sob nenhuma circunstância realize commits diretos na branch `main`.**

Para compreender o padrão de mensagens de commits, as diretrizes de código e como submeter Pull Requests de forma segura para revisão da arquitetura, consulte o nosso [Guia de Contribuição (CONTRIBUTING.md)](CONTRIBUTING.md).

---

## Equipe

| Nome | Papel | GitHub |
|------|-------|--------|
| Matheus Bauer | Architect (Software / Solution Architect) | [@obauercosta](https://github.com/obauercosta) |
| Carlos André Alves Bezerra | Backend Developer | [@andrealves8](https://github.com/andrealves8) |
| Geordani Machado | Frontend Developer | [@Geordani-Machado](https://github.com/Geordani-Machado) |
| Fernando Henrique Pereira Fernandez | Data Analyst | [@fernandez2312](https://github.com/fernandez2312) |
| Wesley Muniz França | Graphic Designer | — |
| Erick Levi Souza Machado | Game Developer | — |

---

*Hackathon No Country · S06-26 · Equipe 19*
