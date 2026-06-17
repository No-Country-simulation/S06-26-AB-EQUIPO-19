# -*- coding: utf-8 -*-
from pydantic import BaseModel
from typing import List, Optional

# ==============================================
# SCHEMA PARA INSIGHTS / MAPA DE TALENTOS
# ==============================================
class RegiaoInsight(BaseModel):
    regiao: str                # Ex: "Florianópolis - Centro"
    concentracao: float        # 0.25, 0.5, 0.75, 0.9
    cobertura_rede: str        # 4G, 5G
    perfis_disponiveis: int    # Quantidade de pessoas

class InsightsResponse(BaseModel):
    mapa_talentos: List[RegiaoInsight]

# ==============================================
# SCHEMA PARA MATCHING DE CANDIDATOS
# ==============================================
# Esse é o que estava faltando: MatchRequest é igual a FiltrosMatch
class MatchRequest(BaseModel):
    escolaridade_minima: Optional[str] = None
    faixa_salarial: Optional[str] = None
    municipio: Optional[str] = None
    genero: Optional[str] = None  # Será ignorado por ANTI-VIÉS
    deficiente: Optional[bool] = None # Critério ESG

# Mantemos esse também para organização
class FiltrosMatch(MatchRequest):
    pass

class CandidatoResult(BaseModel):
    id: int
    perfil: str
    escolaridade: str
    localizacao: str
    indice_inclusao: float # Nosso diferencial do Hackathon

class MatchResponse(BaseModel):
    total_encontrados: int
    candidatos: List[CandidatoResult]

# ==============================================
# SCHEMA PARA VAGAS
# ==============================================
class VagaInput(BaseModel):
    cargo: str
    descricao: str
    escolaridade_requerida: str
    faixa_salarial: str
    localizacao: str
    criterios_esg: Optional[List[str]] = None

class VagaResponse(VagaInput):
    id: int
    status: str = "Publicada"

    class Config:
        from_attributes = True # 🔹 Corrige o aviso do Pydantic v2 (era orm_mode)