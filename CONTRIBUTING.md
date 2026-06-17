# Como contribuir — App BiT · Equipe 19

Guia rápido para todos os membros da equipe trabalharem no repositório sem conflito.

---

## Regra principal

**Nunca commite direto na `main`.** Sempre crie uma branch nova para o que você for fazer.

---

## Fluxo de trabalho

### 1. Criar uma branch para sua tarefa

O nome da branch segue este padrão:

```
feat/nome-da-sua-tarefa
```

Exemplos:
- `feat/tela-publicar-vaga`
- `feat/dashboard-metricas`
- `fix/erro-no-match`

### 2. Fazer seus commits

Mensagens de commit no formato:

```
tipo: descrição curta do que foi feito
```

Tipos mais comuns:
- `feat:` — funcionalidade nova
- `fix:` — correção de bug
- `docs:` — mudança em documentação
- `chore:` — ajuste de configuração

Exemplos:
- `feat: tela de publicar vaga com formulário`
- `fix: corrige erro 422 no endpoint /match`
- `docs: atualiza README com instruções de deploy`

### 3. Abrir Pull Request para a main

Quando terminar, abre um Pull Request no GitHub:
- Base: `main`
- Compare: sua branch
- Avisa o **arquiteto do projeto** no Discord para revisar

### 4. Merge

O arquiteto faz o merge depois de revisar. Não faça merge sem avisar.

---

## O que nunca deve ir pro repositório

- Arquivo `.env` com credenciais reais
- Senhas, chaves de API ou tokens
- Arquivos CSV maiores que 50MB
- Pasta `__pycache__`, `node_modules`, `.venv`

Esses itens já estão no `.gitignore`. Se aparecer algum desses no seu commit, remova antes de subir.

---

## Estrutura de branches

| Branch | Uso |
|--------|-----|
| `main` | Versão estável — só recebe merge revisado |
| `feat/...` | Funcionalidades novas |
| `fix/...` | Correções |

---

*Dúvidas? Fala com o arquiteto do projeto no Discord.*
