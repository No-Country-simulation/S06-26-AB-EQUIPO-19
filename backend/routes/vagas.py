# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.schemas import VagaInput, VagaResponse
from config.database import get_db
from models.models_db import Vaga

router = APIRouter(prefix="/vagas", tags=["Vagas"])

@router.get("/", response_model=List[VagaResponse])
def listar_vagas(db: Session = Depends(get_db)):
    """
    Listar todas as vagas publicadas
    Trata valores NULL do banco
    Converte texto para lista
    """
    try:
        vagas_bd = db.query(Vaga).all()

        lista_vagas = []
        for v in vagas_bd:
            dados = {
                "id": v.id,
                "cargo": v.cargo,
                "descricao": v.descricao,
                # SE FOR None, COLOCA TEXTO VAZIO ""
                "escolaridade_requerida": v.escolaridade_requerida or "", 
                "faixa_salarial": v.faixa_salarial,
                "localizacao": v.localizacao,
                "status": v.status or "Publicada",
                # TRATA criterios_esg VAZIO
                "criterios_esg": v.criterios_esg.split(",") if v.criterios_esg else []
            }
            lista_vagas.append(dados)

        return lista_vagas

    except Exception as e:
        print("ERRO AO LISTAR VAGAS:", str(e))
        return []


@router.post("/", response_model=VagaResponse, status_code=201)
def publicar_vaga(vaga: VagaInput, db: Session = Depends(get_db)):
    """
    Publicar nova vaga
    """
    try:
        dados = vaga.dict(by_alias=True, exclude_unset=True)

        # Mapeia o nome novo para o nome do banco
        if dados.get("requisito_perfil"):
            dados["escolaridade_requerida"] = dados.pop("requisito_perfil")

        # 🧩 Transforma lista em texto para salvar
        if dados.get("criterios_esg") and isinstance(dados["criterios_esg"], list):
            dados["criterios_esg"] = ",".join(dados["criterios_esg"])
        else:
            dados["criterios_esg"] = None

        dados["status"] = "Publicada"

        nova_vaga = Vaga(**dados)
        db.add(nova_vaga)
        db.commit()
        db.refresh(nova_vaga)

        # Monta resposta tratando valores nulos
        resposta = {
            "id": nova_vaga.id,
            "cargo": nova_vaga.cargo,
            "descricao": nova_vaga.descricao,
            "escolaridade_requerida": nova_vaga.escolaridade_requerida or "",
            "faixa_salarial": nova_vaga.faixa_salarial,
            "localizacao": nova_vaga.localizacao,
            "status": nova_vaga.status or "Publicada",
            "criterios_esg": nova_vaga.criterios_esg.split(",") if nova_vaga.criterios_esg else []
        }

        return resposta

    except Exception as e:
        db.rollback()
        print("ERRO AO CADASTRAR VAGA:", str(e))
        raise HTTPException(status_code=400, detail=f"Erro ao cadastrar: {str(e)}")