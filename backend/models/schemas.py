# -*- coding: utf-8 -*-
from pydantic import BaseModel, Field
from typing import List, Optional

# ==============================================
# SCHEMA PARA INSIGHTS / MAPA DE TALENTOS
# ==============================================
class RegiaoInsight(BaseModel):
    regiao: str                
    concentracao: float        
    cobertura_rede: str        
    perfis_disponiveis: int    

class InsightsResponse(BaseModel):
    mapa_talentos: List[RegiaoInsight]

# ==============================================
# SCHEMA PARA MATCHING
# ==============================================
class MatchRequest(BaseModel):
    municipio: Optional[str] = None          
    regiao: Optional[str] = None            
    renda: Optional[str] = None             # Valores: A, B, C
    faixa_etaria: Optional[str] = None      # Valores: 18-24, 25-34, 55+
    mobilidade: Optional[bool] = None       # True = INTENSA
    grupo_sub_representado: Optional[bool] = None # flag_flagship = 1
    limite: Optional[int] = None                

    class Config:
        extra = "forbid"  # Evita erros 422 por campos desconhecidos

class CandidatoResult(BaseModel):
    id: int
    perfil: str
    detalhes: str
    localizacao: str
    indice_inclusao: float

    class Config:
        from_attributes = True


class MatchResponse(BaseModel):
    total_encontrados: int
    candidatos: List[CandidatoResult]

# ==============================================
# SCHEMA PARA VAGAS
# ==============================================
class VagaInput(BaseModel):
    cargo: str
    descricao: str
    # Aceita os dois nomes
    requisito_perfil: Optional[str] = None
    escolaridade_requerida: Optional[str] = None
    faixa_salarial: str
    localizacao: str
    criterios_esg: Optional[List[str]] = None

    class Config:
        populate_by_name = True  


class VagaResponse(BaseModel):
    id: int
    cargo: str
    descricao: str
    escolaridade_requerida: str = ""  # Valor padrão se vier nulo
    faixa_salarial: str
    localizacao: str
    criterios_esg: List[str] = []
    status: str = "Publicada"

    class Config:
        from_attributes = True


# ==============================================
# SCHEMA PARA DASHBOARD / SAÚDE DO TIME
# ==============================================
class DadosPerfil(BaseModel):
    perfil: str
    quantidade: int
    percentual: float

class SaudeTimeResponse(BaseModel):
    total_pessoas: int
    por_renda: List[DadosPerfil]
    por_idade: List[DadosPerfil]
    grupo_sub_representado: DadosPerfil