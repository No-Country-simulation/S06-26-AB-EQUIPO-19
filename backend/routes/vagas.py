# -*- coding: utf-8 -*-
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from models.models_db import Vaga
from models.schemas import VagaInput, VagaResponse
from typing import List

router = APIRouter(prefix="/vagas", tags=["Vagas"])

@router.post("/", response_model=VagaResponse, status_code=201)
def publicar_vaga(vaga: VagaInput, db: Session = Depends(get_db)):
    """
    Publicar nova vaga no sistema
    Dados usados posteriormente para o Matching
    """
    try:
        # Converte o objeto Pydantic para dicionário
        dados = vaga.dict()
        
        # Transforma lista de ESG em texto para salvar no banco
        if dados.get("criterios_esg"):
            dados["criterios_esg"] = ", ".join(dados["criterios_esg"])

        # Cria nova vaga
        nova_vaga = Vaga(**dados)
        db.add(nova_vaga)
        db.commit()
        db.refresh(nova_vaga)
        return nova_vaga

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Erro ao cadastrar: {str(e)}")

@router.get("/", response_model=List[VagaResponse])
def listar_vagas(db: Session = Depends(get_db)):
    """Listar todas as vagas cadastradas"""
    return db.query(Vaga).all()