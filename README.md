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
