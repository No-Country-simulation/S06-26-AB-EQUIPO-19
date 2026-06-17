"""
Serviço de integração com o Motor de IA — Google Gemini.

Lê o system prompt do arquivo SYSTEM_PROMPT_APP_BIT.md e envia
os dados da vaga + candidato para o Gemini calcular:
  - score_compatibilidade (0.0 a 100.0)
  - badge_diversidade (true / false)
  - justificativa_analise (máx. 2 frases)

ATENÇÃO: nunca passe nome, email, genero ou raca para esta função.
"""

import json
import logging
import os
import re

import httpx
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# ── configuração ──────────────────────────────────────────────────────────────

IA_API_KEY = os.getenv("IA_API_KEY")

GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-1.5-flash:generateContent"
)

_PROMPT_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "SYSTEM_PROMPT_APP_BIT.md")


def _ler_system_prompt() -> str:
    """Extrai o bloco de prompt do arquivo SYSTEM_PROMPT_APP_BIT.md."""
    try:
        with open(_PROMPT_PATH, encoding="utf-8") as f:
            conteudo = f.read()

        match = re.search(r"## Prompt Completo.*?```(.*?)```", conteudo, re.DOTALL)
        if match:
            return match.group(1).strip()

        logger.warning("Delimitador do prompt não encontrado — usando fallback.")
        return "Você é o Motor de Análise de Compatibilidade da plataforma App BiT. Retorne exclusivamente um objeto JSON com score_compatibilidade, badge_diversidade e justificativa_analise."

    except FileNotFoundError:
        logger.error("SYSTEM_PROMPT_APP_BIT.md não encontrado em: %s", _PROMPT_PATH)
        return "Você é o Motor de Análise de Compatibilidade da plataforma App BiT. Retorne exclusivamente um objeto JSON com score_compatibilidade, badge_diversidade e justificativa_analise."


def _fallback_erro(motivo: str) -> dict:
    logger.error("Fallback ativado: %s", motivo)
    return {
        "score_compatibilidade": 0.0,
        "badge_diversidade": False,
        "justificativa_analise": "Erro interno na análise. Tente novamente.",
    }


def calcular_score(
    skills_exigidas: str,
    skills_candidato: str,
    regiao_candidato: str,
    metas_esg: str,
) -> dict:
    """
    Chama o Gemini e retorna score + badge + justificativa para um candidato.

    Parâmetros:
        skills_exigidas  — skills da vaga (string separada por vírgula)
        skills_candidato — skills do candidato (string separada por vírgula)
        regiao_candidato — região geográfica do candidato (ex: "Nordeste - Bahia")
        metas_esg        — metas de diversidade da empresa

    Retorna:
        {
            "score_compatibilidade": float,
            "badge_diversidade": bool,
            "justificativa_analise": str
        }

    ATENÇÃO: nunca inclua nome, email, genero ou raca nos parâmetros.
    """
    if not IA_API_KEY:
        return _fallback_erro("IA_API_KEY não configurada no .env")

    system_prompt = _ler_system_prompt()

    user_payload = json.dumps(
        {
            "skills_exigidas": skills_exigidas,
            "skills_candidato": skills_candidato,
            "regiao_candidato": regiao_candidato,
            "metas_esg": metas_esg,
        },
        ensure_ascii=False,
    )

    body = {
        "system_instruction": {
            "parts": [{"text": system_prompt}]
        },
        "contents": [
            {
                "role": "user",
                "parts": [{"text": user_payload}],
            }
        ],
        "generationConfig": {
            "temperature": 0.0,
            "maxOutputTokens": 256,
        },
    }

    try:
        response = httpx.post(
            GEMINI_URL,
            params={"key": IA_API_KEY},
            json=body,
            timeout=15.0,
        )
        response.raise_for_status()

    except httpx.TimeoutException:
        return _fallback_erro("Timeout na chamada ao Gemini (>15s)")
    except httpx.HTTPStatusError as e:
        return _fallback_erro(f"Erro HTTP {e.response.status_code} do Gemini")
    except httpx.RequestError as e:
        return _fallback_erro(f"Erro de conexão com Gemini: {e}")

    try:
        data = response.json()
        texto = data["candidates"][0]["content"]["parts"][0]["text"].strip()
        texto = re.sub(r"```json|```", "", texto).strip()
        resultado = json.loads(texto)

        score = float(resultado.get("score_compatibilidade", 0.0))
        badge = bool(resultado.get("badge_diversidade", False))
        justificativa = str(resultado.get("justificativa_analise", ""))
        score = max(0.0, min(100.0, score))

        return {
            "score_compatibilidade": score,
            "badge_diversidade": badge,
            "justificativa_analise": justificativa,
        }

    except (KeyError, IndexError, json.JSONDecodeError, ValueError) as e:
        return _fallback_erro(f"Resposta do Gemini inválida: {e}")
