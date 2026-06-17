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
- OAS 3.1 (Documentação automática em /docs)

## 📊 Base de Dados
- Estrutura alinhada com dados Vísent
- Tabelas: , , , , 
- Campos chave: , , , , 

## 🚀 Como executar
```bash
# Instalar dependências
pip install -r requirements.txt

# Configurar variáveis de ambiente (copiar .env.example para .env)

# Rodar servidor
python3 -m uvicorn backend.main:app --reload --port 8080
```

Acesse: http://localhost:8080/docs

---
**Versão:** 0.1.0
**Branch:** feat/backend-base-match-route

