from fastapi import APIRouter
from models.schemas import InsightsResponse, RegiaoInsight
from services.geo_service import get_todas_regioes

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("/", response_model=InsightsResponse)
def get_insights():
    """
    Retorna dados reais de concentração de pessoas por região.
    Fonte: Vísent CDRView — tensor_concentracao.csv
    """
    regioes_raw = get_todas_regioes()

    regioes = [
        RegiaoInsight(
            regiao=r["regiao"],
            concentracao=r["concentracao"],
            cobertura_rede=r["cobertura_rede"],
            perfis_disponiveis=r["perfis_disponiveis"],
        )
        for r in regioes_raw
    ]

    return InsightsResponse(mapa_talentos=regioes)
