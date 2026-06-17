"""
Serviço de integração com o Motor de IA (filtro anti-viés).

Responsável por:
- Montar o payload com skills da vaga e do candidato
- Chamar a API do motor de IA escolhido pela equipe
- Retornar score_compatibilidade, badge_diversidade e justificativa

TODO (time de back-end / IA):
- Definir qual API de IA será utilizada
- Configurar a IA_API_KEY no .env
- Implementar a chamada real abaixo
- O system prompt está documentado em /SYSTEM_PROMPT_APP_BIT.md
"""

def calcular_score(
    skills_exigidas: str,
    skills_candidato: str,
    regiao_candidato: str,
    metas_esg: str,
) -> dict:
    """
    Envia os dados para o motor de IA e retorna o resultado da análise.

    Parâmetros:
        skills_exigidas  — skills da vaga (string separada por vírgula)
        skills_candidato — skills do candidato (string separada por vírgula)
        regiao_candidato — região geográfica do candidato
        metas_esg        — metas de diversidade da empresa

    Retorna:
        {
            "score_compatibilidade": float,
            "badge_diversidade": bool,
            "justificativa_analise": str
        }

    ATENÇÃO: retorna valores mockados até implementação real.
    Atributos pessoais (nome, email, genero, raca) NÃO devem ser passados aqui.
    """
    # TODO: substituir pelo retorno real da API de IA
    return {
        "score_compatibilidade": 85.0,
        "badge_diversidade": True,
        "justificativa_analise": "Mock — implementação pendente.",
    }
