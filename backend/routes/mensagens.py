from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from typing import Optional
from config.database import get_db

router = APIRouter(prefix="/mensagens", tags=["Mensagens e Contratação"])

class MensagemInput(BaseModel):
    empresa_id: int
    candidato_id: int
    vaga_id: int
    conteudo: str

class MensagemResponse(BaseModel):
    sucesso: bool
    mensagem: str
    id_registro: Optional[int] = None

@router.post("/", response_model=MensagemResponse)
def enviar_mensagem_candidato(payload: MensagemInput, db: Session = Depends(get_db)):
    try:
        # PRIMEIRA QUERY: Salva a mensagem que a empresa enviou
        res_msg = db.execute(
            text("""
                INSERT INTO Mensagem_Recrutamento (empresa_id, candidato_id, vaga_id, conteudo)
                VALUES (:emp_id, :cand_id, :vag_id, :conteudo)
            """),
            {
                "emp_id": payload.empresa_id,
                "cand_id": payload.candidato_id,
                "vag_id": payload.vaga_id,
                "conteudo": payload.conteudo
            }
        )
        
        # SEGUNDA QUERY: Inicia o rastreio da comissão para a plataforma App BiT
        db.execute(
            text("""
                INSERT INTO Contratacao_Comissao (empresa_id, candidato_id, vaga_id, status_contratacao)
                VALUES (:emp_id, :cand_id, :vag_id, 'Em negociação')
            """),
            {
                "emp_id": payload.empresa_id,
                "cand_id": payload.candidato_id,
                "vag_id": payload.vaga_id
            }
        )
        
        db.commit()
        
        return MensagemResponse(
            sucesso=True,
            mensagem="Mensagem enviada! Processo de contratação iniciado e comissão registrada no banco.",
            id_registro=res_msg.lastrowid
        )

    except Exception as erro:
        db.rollback()
        print(f"Erro ao processar mensagem e comissão: {erro}")
        raise HTTPException(status_code=500, detail="Falha ao registrar dados de contratação no banco de dados.")

@router.get("/{id}/candidatos")
def listar_candidatos_vaga(id: int, db: Session = Depends(get_db)):
    try:
        query = text("""
            SELECT c.* FROM Candidatos c
            JOIN Candidaturas cand ON c.id = cand.candidato_id
            WHERE cand.vaga_id = :vaga_id
        """)
        resultado = db.execute(query, {"vaga_id": id}).fetchall()
        candidatos = [dict(row._mapping) for row in resultado]
        return {"vaga_id": id, "candidatos": candidatos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))