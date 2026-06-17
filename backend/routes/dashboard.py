from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard B2C - Saúde do Time"],
    # summary="Dados estatísticos por perfil e região"
)

# ───────────────────────────────────────────────────────
# Modelos de dados
# ───────────────────────────────────────────────────────

class DadosPorPerfil(BaseModel):
    perfil: str                     # Ex: Analista, Desenvolvedor, Assistente
    quantidade: int                 # Quantidade de pessoas
    percentual_total: float         # % em relação ao total geral
    media_escolaridade: str         # Nível médio de formação
    indice_qualificacao: float      # Nota de 0 a 1

class DadosPorRegiao(BaseModel):
    regiao: str                     # Cidade / Região
    total_pessoas: int
    distribuicao_perfis: Dict[str, int]  # { "Perfil": quantidade }
    indice_densidade: float        # Concentração de talentos

class SaudeTimeResponse(BaseModel):
    total_geral_assinantes: int
    dados_por_perfil: List[DadosPorPerfil]
    dados_por_regiao: List[DadosPorRegiao]
    data_atualizacao: str

# ───────────────────────────────────────────────────────
# Rota principal
# ───────────────────────────────────────────────────────
@router.get("/saude-time", response_model=SaudeTimeResponse)
def get_dados_saude_time():
    """
    Dashboard de Saúde do Time - Módulo B2C
    Mostra distribuição de usuários por PERFIL e por REGIÃO,
    com métricas de qualificação e concentração.
    """

    # DADOS MOCKADOS (estrutura pronta para conectar ao BD depois)
    return SaudeTimeResponse(
        total_geral_assinantes=215400,
        data_atualizacao="2026-06-16",
        dados_por_perfil=[
            DadosPorPerfil(
                perfil="Analista de Sistemas",
                quantidade=32400,
                percentual_total=15.04,
                media_escolaridade="Superior Completo",
                indice_qualificacao=0.92
            ),
            DadosPorPerfil(
                perfil="Desenvolvedor Frontend",
                quantidade=28900,
                percentual_total=13.42,
                media_escolaridade="Superior Completo",
                indice_qualificacao=0.95
            ),
            DadosPorPerfil(
                perfil="Assistente Administrativo",
                quantidade=41200,
                percentual_total=19.13,
                media_escolaridade="Médio Completo",
                indice_qualificacao=0.78
            ),
            DadosPorPerfil(
                perfil="Engenheiro de Dados",
                quantidade=15700,
                percentual_total=7.29,
                media_escolaridade="Pós-Graduação",
                indice_qualificacao=0.98
            )
        ],
        dados_por_regiao=[
            DadosPorRegiao(
                regiao="Florianópolis",
                total_pessoas=89200,
                distribuicao_perfis={
                    "Analista": 14500,
                    "Desenvolvedor": 12800,
                    "Administrativo": 18300
                },
                indice_densidade=0.94
            ),
            DadosPorRegiao(
                regiao="São José",
                total_pessoas=52800,
                distribuicao_perfis={
                    "Analista": 8700,
                    "Desenvolvedor": 6200,
                    "Administrativo": 11400
                },
                indice_densidade=0.87
            ),
            DadosPorRegiao(
                regiao="Palhoça",
                total_pessoas=38500,
                distribuicao_perfis={
                    "Analista": 5200,
                    "Desenvolvedor": 3900,
                    "Administrativo": 9800
                },
                indice_densidade=0.79
            )
        ]
    )