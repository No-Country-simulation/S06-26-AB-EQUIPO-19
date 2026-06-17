# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from models.schemas import InsightsResponse, RegiaoInsight
from config.database import get_db
from models.models_db import Antena, Concentracao

router = APIRouter(prefix="/insights", tags=["Insights e Geolocalização"])

# Regra de negócio: transforma número de usuários em nível de concentração
def definir_nivel(qtd_usuarios):
    if not qtd_usuarios:
        return 0.1  # Baixo / Sem dados
    try:
        vol = float(qtd_usuarios)
        if vol > 500: return 0.9   # Muito Alta
        elif vol > 200: return 0.75 # Alta
        elif vol > 50: return 0.5   # Média
        else: return 0.25            # Baixa
    except:
        return 0.1

@router.get("/", response_model=InsightsResponse)
def get_insights(db: Session = Depends(get_db)):
    """
    Mapa de Talentos - Região Metropolitana de Florianópolis
    Usa dados REAIS da tabela CONCENTRACAO
    Métrica: n_usuarios (quantidade real de pessoas)
    Período: TARDE (horário de pico)
    Fonte: Vísent / OSX Telecom
    """
    try:
        # Consulta junta localização + volume de usuários
        resultado = db.query(
            Concentracao.municipio,
            Concentracao.cluster,
            Concentracao.lat,
            Concentracao.lon,
            func.coalesce(func.avg(Concentracao.n_usuarios), 0).label("media_usuarios")
        ).filter(
            Concentracao.periodo == "TARDE",
            Concentracao.municipio.isnot(None),
            Concentracao.cluster.isnot(None)
        ).group_by(
            Concentracao.municipio,
            Concentracao.cluster,
            Concentracao.lat,
            Concentracao.lon
        ).all()

        # Monta a resposta no formato do nosso schema
        mapa = []
        for reg in resultado:
            mapa.append(RegiaoInsight(
                regiao = f"{reg.municipio.strip()} - {reg.cluster.strip()}",
                concentracao = definir_nivel(reg.media_usuarios),
                cobertura_rede = "4G/5G",
                perfis_disponiveis = int(reg.media_usuarios or 0)
            ))

        return InsightsResponse(mapa_talentos=mapa)

    except Exception as e:
        print("ERRO DETALHADO:", str(e))
        return InsightsResponse(mapa_talentos=[])
