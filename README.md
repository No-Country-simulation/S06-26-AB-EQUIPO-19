# App BiT — Motor de Matching Inclusivo 🤝

API B2B para recrutamento e seleção com **filtro anti-viés** e **critérios ESG**, desenvolvida com base em dados reais da Vísent.

## ✨ Funcionalidades
- **Health Check**: Verificação de status da API
- **Vagas**: Cadastro, listagem e gerenciamento de vagas com critérios ESG
- **Matching**: Busca inteligente de candidatos, ranqueada por **Índice de Inclusão**
- **Insights**: Dados de geolocalização e concentração de talentos
- **Dashboard B2C**: Métricas de diversidade, perfil demográfico e qualificação

## 🛠️ Tecnologias
- Python 3.12
- FastAPI
- SQLAlchemy
- Uvicorn
- **MySQL** — Banco de dados utilizado para testes e desenvolvimento
- OAS 3.1 — Documentação e teste de API via **Swagger UI**

## 📊 Base de Dados
- Banco utilizado: **MySQL**
- Estrutura alinhada com modelo Vísent
- Tabelas: assinantes, `antenas`, `concentracao`, `vagas`, `empresas`
- Campos chave: `home_municipio`, `income_cluster`, `age_group`, `mobility_pattern`, `flag_flagship`
- 📂 **Scripts SQL**:
  - Criação das tabelas: `backend/database/schema.sql`
  - Inserção de dados para teste: `backend/database/insert.sql`

## 🧪 Teste da API
A documentação interativa e ambiente de testes estão disponíveis através do **Swagger UI**:
