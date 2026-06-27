from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
from pydantic import BaseModel
from models.schemas import VagaInput, VagaResponse
from config.database import get_db
from models.models_db import Vaga

router = APIRouter(prefix="/vagas", tags=["Vagas"])

# Schema para a Candidatura da Aline
class CandidaturaInput(BaseModel):
    vaga_id: int
    candidato_id: int

@router.get("/", response_model=List[VagaResponse])
def listar_vagas(db: Session = Depends(get_db)):
    try:
        vagas_bd = db.query(Vaga).all()

        lista_vagas = []
        for v in vagas_bd:
            dados = {
                "id": v.id,
                "cargo": v.cargo,
                "descricao": v.descricao,
                "escolaridade_requerida": v.escolaridade_requerida or "",
                "faixa_salarial": v.faixa_salarial,
                "localizacao": v.localizacao,
                "status": v.status or "Publicada",
                "criterios_esg": v.criterios_esg.split(",") if v.criterios_esg else []
            }
            lista_vagas.append(dados)

        return lista_vagas

    except Exception as e:
        print("ERRO AO LISTAR VAGAS:", str(e))
        return []


@router.post("/", response_model=VagaResponse, status_code=201)
def publicar_vaga(vaga: VagaInput, db: Session = Depends(get_db)):
    try:
        dados = vaga.dict(by_alias=True, exclude_unset=True)

        if dados.get("requisito_perfil"):
            dados["escolaridade_requerida"] = dados.pop("requisito_perfil")

        if dados.get("criterios_esg") and isinstance(dados["criterios_esg"], list):
            dados["criterios_esg"] = ",".join(dados["criterios_esg"])
        else:
            dados["criterios_esg"] = None

        dados["status"] = "Publicada"

        nova_vaga = Vaga(**dados)
        db.add(nova_vaga)
        db.commit()
        db.refresh(nova_vaga)

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


# NOVA ROTA: Permite que a Aline Ferreira se candidate (AGORA COM CONEXÃO BLINDADA)
@router.post("/candidatar", status_code=201)
def candidatar_vaga(payload: CandidaturaInput, db: Session = Depends(get_db)):
    try:
        # Cria a tabela de candidaturas automaticamente se ela não existir
        db.execute(text("""
        CREATE TABLE IF NOT EXISTS Candidatura (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vaga_id INT NOT NULL,
            candidato_id INT NOT NULL,
            data_candidatura TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """))
        
        # Insere a candidatura da Aline Ferreira
        db.execute(
            text("INSERT INTO Candidatura (vaga_id, candidato_id) VALUES (:vaga, :candidato)"),
            {"vaga": payload.vaga_id, "candidato": payload.candidato_id}
        )
        db.commit()
        
        return {"sucesso": True, "mensagem": "Candidatura enviada com sucesso! A empresa já pode ver o seu perfil no painel de Triagem."}
    except Exception as e:
        db.rollback()
        print("ERRO AO CANDIDATAR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
