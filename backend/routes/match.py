# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from models.schemas import MatchRequest, MatchResponse, CandidatoResult
from config.database import get_db
# IMPORTA APENAS O QUE EXISTE: Assinante
from models.models_db import Assinante

router = APIRouter(prefix="/match", tags=["Matching"])

@router.post("/", response_model=MatchResponse, status_code=200)
def gerar_match(filtros: MatchRequest, db: Session = Depends(get_db)):
    """
    Motor de Matching Inclusivo - App BiT
    Base: Tabela ASSINANTES (estrutura real)
    Campos: assinante_hash, home_cluster, home_municipio, income_cluster, age_group, mobility_pattern, flag_flagship
    Critérios ESG: flag_flagship = 1
    """
    try:
        query = db.query(Assinante)

        # 🔍 FILTROS ALINHADOS COM CAMPOS REAIS
        if filtros.municipio:
            # Campo real: home_municipio
            query = query.filter(Assinante.home_municipio.ilike(f"%{filtros.municipio}%"))

        if filtros.regiao:
            # Campo real: home_cluster (bairro/região)
            query = query.filter(Assinante.home_cluster.ilike(f"%{filtros.regiao}%"))

        if filtros.renda:
            # Campo real: income_cluster (valores: A, B, C)
            query = query.filter(Assinante.income_cluster == filtros.renda.upper())

        if filtros.faixa_etaria:
            # Campo real: age_group (18-24, 25-34, 55+)
            query = query.filter(Assinante.age_group == filtros.faixa_etaria)

        if filtros.mobilidade is not None:
            # Campo real: mobility_pattern → INTENSA / MODERADA
            if filtros.mobilidade:
                query = query.filter(Assinante.mobility_pattern == "INTENSA")
            else:
                query = query.filter(Assinante.mobility_pattern.in_(["MODERADA", "BAIXA"]))

        # CRITÉRIO ESG: flag_flagship = 1
        if filtros.grupo_sub_representado is not None:
            valor = 1 if filtros.grupo_sub_representado else 0
            query = query.filter(Assinante.flag_flagship == valor)

        # BUSCA OS DADOS
        assinantes_bd = query.all()

        # CÁLCULO DO ÍNDICE DE INCLUSÃO
        lista_resultado = []
        for a in assinantes_bd:
            score = 0.0

            # REGRAS DE PONTUAÇÃO
            if a.flag_flagship == 1:
                score += 0.4  # Maior peso para grupos sub-representados
            if a.age_group in ["55+", "18-24"]:
                score += 0.3
            if a.mobility_pattern == "INTENSA":
                score += 0.2
            if a.income_cluster in ["B", "C"]:
                score += 0.1  # Incentiva menor renda

            indice_inclusao = round(min(score, 1.0), 2)

            # MONTAGEM DO RETORNO (SEM CAMPO QUE NÃO EXISTE)
            lista_resultado.append(CandidatoResult(
                id=a.assinante_hash,
                perfil=a.ocupacao,  # Usa a propriedade que já existe
                detalhes=f"Renda: {a.income_cluster} | Idade: {a.age_group} | Mobilidade: {a.mobility_pattern}",
                localizacao=f"{a.home_municipio} - Região: {a.home_cluster}",
                indice_inclusao=indice_inclusao
            ))

        # ORDENAÇÃO
        lista_resultado.sort(key=lambda x: x.indice_inclusao, reverse=True)

        # LIMITE
        if filtros.limite and filtros.limite > 0:
            lista_resultado = lista_resultado[:filtros.limite]

        return MatchResponse(
            total_encontrados=len(assinantes_bd),
            candidatos=lista_resultado
        )

    except Exception as e:
        print("ERRO MATCH:", str(e))
        raise HTTPException(status_code=422, detail=f"Erro: {str(e)}")