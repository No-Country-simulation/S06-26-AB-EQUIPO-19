# -*- coding: utf-8 -*-
import pandas as pd
from config.database import engine
from models.models_db import Antena, Assinante, Concentracao, FluxoVias
from sqlalchemy.orm import sessionmaker

# Conecta no banco
Session = sessionmaker(bind=engine)
session = Session()

# Caminho relativo — pasta dataset-visent está dentro de backend
CAMINHO_BASE = "dataset-visent/"

# ==============================================
# CARREGAR ANTENAS
# ==============================================
print("Carregando Antenas...")
df_antenas = pd.read_csv(
    CAMINHO_BASE + "antenas_flp.csv",
    dtype={"ecgi": str}
)
df_antenas.to_sql('antenas', con=engine, if_exists='replace', index=False)
print("Antenas carregadas!")

# ==============================================
# CARREGAR ASSINANTES
# ==============================================
print("Carregando Assinantes...")
df_assinantes = pd.read_csv(
    CAMINHO_BASE + "assinantes.csv",
    dtype={"assinante_hash": int}
)
df_assinantes.to_sql('assinantes', con=engine, if_exists='replace', index=False, chunksize=10000)
print("Assinantes carregados!")

# ==============================================
# CARREGAR CONCENTRAÇÃO
# ==============================================
print("Carregando Concentração...")
df_conc = pd.read_csv(
    CAMINHO_BASE + "tensor_concentracao.csv",
    dtype={"ecgi": str}
)
df_conc.to_sql('concentracao', con=engine, if_exists='replace', index=False)
print("Concentração carregada!")

# ==============================================
# CARREGAR FLUXO DE VIAS
# ==============================================
print("Carregando Fluxo de Vias...")
df_fluxo = pd.read_csv(
    CAMINHO_BASE + "tensor_fluxo_vias.csv",
    dtype={"ecgi_origem": str, "ecgi_destino": str}
)
df_fluxo.to_sql('fluxo_vias', con=engine, if_exists='replace', index=False)
print("Fluxo de Vias carregado!")

print("\nTODOS OS DADOS DO HACKATHON FORAM CARREGADOS COM SUCESSO!")