# App BiT — Motor de Matching Inclusivo 🤝

API B2B para recrutamento e seleção com **filtro anti-viés** e **critérios ESG**, desenvolvida com base em dados reais da Vísent.

> ⚠️ **Observação importante**: Este repositório contém apenas o Backend (API). O Frontend da aplicação ainda não foi implementado ou integrado.

---

## ✨ Funcionalidades
- **Health Check**: Verificação de status e disponibilidade da API
- **Vagas**: Cadastro, listagem e gerenciamento de oportunidades com critérios ESG
- **Matching**: Busca inteligente de candidatos, ranqueada por **Índice de Inclusão**
- **Insights**: Dados de geolocalização, concentração e fluxo de talentos
- **Dashboard B2C**: Métricas de diversidade, perfil demográfico e qualificação da base

---

## 🛠️ Tecnologias Utilizadas
- **Python 3.12** — Linguagem principal de desenvolvimento
- **FastAPI** — Framework para criação de APIs rápidas e modernas
- **SQLAlchemy** — ORM para manipulação e consultas no banco de dados
- **Uvicorn** — Servidor ASGI para execução da aplicação
- **MySQL** — Banco de dados relacional utilizado para testes e desenvolvimento
- **OAS 3.1** — Documentação automática e interface de testes via **Swagger UI**

---

## 📊 Estrutura do Banco de Dados
- Banco utilizado: **MySQL**
- Modelo alinhado com a estrutura de dados da Vísent
- **Tabelas principais**: `assinantes`, `antenas`, `concentracao`, `vagas`, `empresas`
- **Campos chave para matching**: `home_municipio`, `income_cluster`, `age_group`, `mobility_pattern`, `flag_flagship`
- 📂 **Scripts SQL disponíveis**:
  - Criação das tabelas e índices: `backend/database/schema.sql`
  - Inserção de dados de exemplo/teste: `backend/database/insert.sql`

---

## 🚀 Como executar o projeto na íntegra

Siga todos os passos abaixo para configurar, rodar e testar a API:

### 1. Pré-requisitos
- Ter o **Python 3.12** instalado
- Ter o **MySQL** instalado e rodando
- Ter o **Git** instalado

### 2. Clonar o repositório
```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd S06-26-AB-EQUIPO-19
```

### 3. Criar e ativar ambiente virtual (recomendado)
# Criar ambiente
```bash
python3 -m venv venv
```
# Ativar no Linux / macOS
```bash
source venv/bin/activate
```
# Ativar no Windows
```bash
venv\Scripts\activate
```
4. Instalar dependências
pip install -r requirements.txt

5. Configurar variáveis de ambiente
# Copiar o arquivo de exemplo
```bash
cp backend/.env.example backend/.env
```
dite o arquivo backend/.env e insira suas credenciais do MySQL:
```bash
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=appbit_hackathon
```

### 6. Preparar o Banco de Dados
Acesse o seu MySQL via linha de comando ou Workbench
Execute o script de criação: `backend/database/schema.sql`
Execute o script de população de dados: `backend/database/insert.sql`

# Exemplo via linha de comando:
```bash
mysql -u root -p < backend/database/schema.sql
mysql -u root -p < backend/database/insert.sql
```
### 7. Rodar o servidor da API
# Executar na pasta raiz do projeto
```bash
python3 -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8080
```

📌 O servidor estará disponível em: http://localhost:8080

### 8. Como testar a API no Swagger
A interface interativa do Swagger permite testar todas as rotas diretamente no navegador, sem necessidade de ferramentas externas.

Acesse: http://localhost:8080/docs
Você verá a lista completa de endpoints:
GET / — Verifica status da API
POST /match/ — Realiza a busca de candidatos (funcionalidade principal)
GET /vagas/ — Lista todas as vagas
POST /vagas/ — Cadastra nova vaga
GET /insights/ — Dados de geolocalização
GET /dashboard/saude-time — Métricas gerais
Exemplo de teste - Rota de Matching:
Clique em POST /match/
Clique em Try it out
No campo Request body, insira os critérios desejados, por exemplo:
json
{
  "faixa_etaria": "55+",
  "grupo_sub_representado": true,
  "limite": 5
}
Clique em Execute
Veja o resultado abaixo: retorno dos candidatos, índice de inclusão e total encontrado

✅ Todos os testes são feitos em tempo real, consultando diretamente o banco de dados configurado.
Versão: 0.1.0
Branch: feat/backend-base-match-route
plaintext

📋 TESTE COMPLETO E DOCUMENTAÇÃO FINAL
Projeto: App BiT — Motor de Matching Inclusivo
Versão: 0.1.0
Base de Dados: Vísent (Tabela assinantes + vagas)
URL: http://localhost:8080/docs

🩺 1. HEALTH CHECK → GET /
✅ Objetivo: Validar que a API está online e funcional.
Ação:
Clique em GET / → Try it out → Execute
Resultado:
json
{
  "status": "online",
  "versao": "0.1.0",
  "nome": "App BiT — Motor de Matching Inclusivo"
}

Status: ✅ 200 OK
Observação: Sistema operacional, versão correta.

📋 2. VAGAS → GET /vagas/
✅ Objetivo: Listar todas as vagas cadastradas, tratando valores nulos e convertendo critérios ESG para lista.
Ação:
Clique em GET /vagas/ → Try it out → Execute
Resultado (exemplo):
json
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

Status: ✅ 200 OK
Observação: Retorna todos os registros, valores nulos como "", critérios ESG como [] ou lista de valores.

📝 3. VAGAS → POST /vagas/
✅ Objetivo: Cadastrar nova vaga com critérios ESG (diferencial do projeto).
Ação:
Clique em POST /vagas/ → Try it out
Cole o JSON:
json
{
  "cargo": "Engenheiro de Dados",
  "descricao": "Trabalhar com dados de mobilidade e inclusão",
  "requisito_perfil": "Superior Completo",
  "faixa_salarial": "R$ 6.000,00 a R$ 9.000,00",
  "localizacao": "Florianópolis - SC",
  "criterios_esg": ["PcD", "Grupo Sub-representado"]
}

Clique em Execute
Resultado:
json
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

Status: ✅ 201 Created
Observação: Cadastro realizado com sucesso, critérios ESG salvos e retornados corretamente. Repita o teste GET /vagas/ para confirmar que apareceu na lista.

🤝 4. MATCHING → POST /match/
✅ Objetivo: Funcionalidade principal — Buscar candidatos com filtro anti-viés, critérios ESG e ranqueamento por Índice de Inclusão.
Base: Tabela assinantes (dados reais Vísent)
📌 TESTE 4.1: Critério ESG + Faixa Etária
Clique em POST /match/ → Try it out
Cole:
json
{
  "faixa_etaria": "55+",
  "grupo_sub_representado": true,
  "limite": 5
}

Execute
Resultado:
json
{
  "total_encontrados": 7590,
  "candidatos": [
    {
      "id": 81,
      "perfil": "Perfil Renda C",
      "detalhes": "Renda: C | Idade: 55+ | Mobilidade: INTENSA",
      "localizacao": "São José - Região: SAO_JOSE_BARREIROS",
      "indice_inclusao": 1
    },
    {
      "id": 331,
      "perfil": "Perfil Renda B",
      "detalhes": "Renda: B | Idade: 55+ | Mobilidade: INTENSA",
      "localizacao": "Palhoça - Região: PALHOCA_CENTRO",
      "indice_inclusao": 1
    }
  ]
}

Status: ✅ 200 OK
Observação: Encontrou 7.590 pessoas que atendem aos critérios. Índice 1 = pontuação máxima de inclusão. Ordenado do mais inclusivo para o menos.

📌 TESTE 4.2: Filtrar por Município e Renda
Cole:
json
{
  "municipio": "Palhoça",
  "renda": "C",
  "limite": 3
}

Execute
Resultado: Retorna apenas pessoas de Palhoça, renda C, com índice calculado.
Status: ✅ 200 OK
Observação: Filtros funcionam isolados ou combinados. Campos permitidos: municipio, regiao, renda (A/B/C), faixa_etaria, mobilidade.

📊 5. INSIGHTS E GEOLOCALIZAÇÃO → GET /insights/
✅ Objetivo: Apresentar mapa de talentos, concentração de usuários e dados de cobertura por região.
Ação:
Clique em GET /insights/ → Try it out → Execute
Resultado (exemplo):
json
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

Status: ✅ 200 OK
Observação: Dados de densidade populacional de talentos e infraestrutura por região.

📈 6. DASHBOARD B2C - SAÚDE DO TIME → GET /dashboard/saude-time
✅ Objetivo: Métricas de diversidade, perfil demográfico e qualificação — tela principal do sistema.
Ação:
Clique em GET /dashboard/saude-time → Try it out → Execute
Resultado:
json
{
  "total_geral_assinantes": 215400,
  "dados_por_perfil": [
    {
      "perfil": "Analista de Sistemas",
      "quantidade": 32400,
      "percentual_total": 15.04,
      "media_escolaridade": "Superior Completo",
      "indice_qualificacao": 0.92
    },
    {
      "perfil": "Assistente Administrativo",
      "quantidade": 41200,
      "percentual_total": 19.13,
      "media_escolaridade": "Médio Completo",
      "indice_qualificacao": 0.78
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

Status: ✅ 200 OK
Observação: Base com 215.400 usuários cadastrados. Mostra distribuição por perfil, região, índice de qualificação e densidade. Dados alinhados com o Matching.

✅ RESUMO FINAL DE VALIDAÇÃO
Tabela
Funcionalidade
Método
Rota
Status
Observação
Saúde da API
GET
/
✅ 200
Online, versão correta
Listar Vagas
GET
/vagas/
✅ 200
Trata nulos, converte ESG
Publicar Vaga
POST
/vagas/
✅ 201
Cadastro com critérios
Matching
POST
/match/
✅ 200
7.590 resultados, índice 1.0
Insights
GET
/insights/
✅ 200
Dados geográficos
Dashboard
GET
/dashboard/saude-time
✅ 200
215k usuários, métricas ESG

