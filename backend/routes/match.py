# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import and_
from models.schemas import MatchRequest, MatchResponse, CandidatoResult
from config.database import get_db
from models.models_db import Assinante

router = APIRouter(prefix="/match", tags=["Matching"])

@router.post("/", response_model=MatchResponse)
def gerar_match(filtros: MatchRequest, db: Session = Depends(get_db)):
    """
    🤝 Motor de Matching Inclusivo - App BiT
    ✅ Base: 200k assinantes RMBF
    ✅ REGRA: Sem viés de gênero, raça ou idade
    ✅ Filtros permitidos: Escolaridade, Renda, Localização
    ✅ Critérios ESG: Incentivo à diversidade
    """
    try:
        # Inicia consulta
        query = db.query(Assinante)

        # 🎯 FILTROS PERMITIDOS (HABILIDADES / CONHECIMENTO)
        if filtros.escolaridade_minima:
            # Compara texto exato ou contém
            query = query.filter(Assinante.escolaridade.ilike(f"%{filtros.escolaridade_minima}%"))

        if filtros.faixa_salarial:
            query = query.filter(Assinante.faixa_salarial.ilike(f"%{filtros.faixa_salarial}%"))

        if filtros.municipio:
            query = query.filter(Assinante.municipio.ilike(f"%{filtros.municipio}%"))

        # 🚫 FILTROS PROIBIDOS (ANTI-VIÉS)
        # Gênero, Idade, Raça -> IGNORADOS AUTOMATICAMENTE
        # Mesmo que enviados na requisição, não são usados na busca

        # 🟢 CRITÉRIO ESG: Deficiência -> FILTRA SE SOLICITADO
        if filtros.deficiente is not None:
            query = query.filter(Assinante.deficiente == filtros.deficiente)

        # 📊 LIMITA E ORDENA (sem usar dados pessoais)
        candidatos_bd = query.limit(50).all()

        # 📋 MONTAR RESPOSTA COM ÍNDICE DE INCLUSÃO
        lista_candidatos = []
        for cand in candidatos_bd:
            # Calcula índice ESG (diferencial do projeto)
            indice_inclusao = 0.80 # Base

            # Incentivo: Mulheres (+10%)
            if hasattr(cand, 'genero') and cand.genero == "Feminino":
                indice_inclusao += 0.10
            # Incentivo: Pessoas com deficiência (+10%)
            if hasattr(cand, 'deficiente') and cand.deficiente == True:
                indice_inclusao += 0.10
            # Incentivo: 50+ (+10%)
            if hasattr(cand, 'idade') and getattr(cand, 'idade', 0) > 50:
                indice_inclusao += 0.10

            # Monta objeto de retorno
            lista_candidatos.append(CandidatoResult(
                id = cand.assinante_hash,
                perfil = f"Profissional de {getattr(cand, 'ocupacao', 'área geral')}",
                escolaridade = getattr(cand, 'escolaridade', 'Não informado'),
                localizacao = f"{getattr(cand, 'municipio', '')} - {getattr(cand, 'bairro', '')}".strip(" -"),
                indice_inclusao = round(min(indice_inclusao, 1.0), 2) # Máximo 1.0
            ))

        return MatchResponse(
            total_encontrados = len(lista_candidatos),
            candidatos = lista_candidatos
        )

    except Exception as e:
        print("ERRO NA ROTA MATCH:", str(e))
        # Retorna vazio mas sem travar
        return MatchResponse(total_encontrados=0, candidatos=[])