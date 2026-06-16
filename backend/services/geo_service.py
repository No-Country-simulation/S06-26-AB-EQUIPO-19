"""
Serviço de dados geográficos — Vísent CDRView.

Lê o arquivo tensor_concentracao.csv (fornecido pela Vísent / Wongola)
e retorna dados reais de concentração de pessoas por região.

Sem mock. Sem hardcode. Dados reais do dataset.
"""

import os
import csv
from collections import defaultdict

# Caminho para o arquivo CSV dentro do repositório
_CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "..", "..", "dataset-visent", "tensores", "tensor_concentracao.csv"
)


def _carregar_dados() -> dict:
    """
    Lê o tensor_concentracao.csv e agrupa por cluster (zona/bairro).
    Retorna um dicionário com os dados médios de cada zona.
    """
    zonas = defaultdict(lambda: {
        "municipio": "",
        "lat": 0.0,
        "lon": 0.0,
        "total_usuarios": 0,
        "total_sessoes": 0,
        "congestionamento": 0.0,
        "contagem": 0,
    })

    try:
        with open(_CSV_PATH, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cluster = row["cluster"]
                zonas[cluster]["municipio"]       = row["municipio"]
                zonas[cluster]["lat"]             = float(row["lat"])
                zonas[cluster]["lon"]             = float(row["lon"])
                zonas[cluster]["total_usuarios"] += int(row["n_usuarios"])
                zonas[cluster]["total_sessoes"]  += int(row["n_sessoes"])
                zonas[cluster]["congestionamento"] += float(row["congestionamento_medio"])
                zonas[cluster]["contagem"]        += 1

    except FileNotFoundError:
        # Se o CSV não estiver no repositório ainda, retorna vazio
        return {}

    return dict(zonas)


def get_dados_regiao(regiao: str) -> dict:
    """
    Retorna dados de concentração de uma região específica.

    Parâmetro:
        regiao — nome do cluster. Ex: "CBD_BEIRAMAR", "CAMPECHE", "UFSC"

    Retorna:
        {
            "regiao": str,
            "municipio": str,
            "concentracao": float,   # média de usuários por período (0.0 a 1.0)
            "cobertura_rede": str,   # baseado no congestionamento médio
            "perfis_disponiveis": int,
            "lat": float,
            "lon": float
        }
    """
    dados = _carregar_dados()

    if regiao not in dados:
        # Região não encontrada — retorna vazio com aviso
        return {
            "regiao": regiao,
            "municipio": "Desconhecido",
            "concentracao": 0.0,
            "cobertura_rede": "Sem dados",
            "perfis_disponiveis": 0,
            "lat": 0.0,
            "lon": 0.0,
        }

    zona = dados[regiao]
    contagem = zona["contagem"] or 1

    # Concentração: média de usuários por período normalizada (0.0 a 1.0)
    # O valor máximo observado no dataset é ~3000 usuários por período/antena
    media_usuarios = zona["total_usuarios"] / contagem
    concentracao = round(min(media_usuarios / 3000, 1.0), 2)

    # Cobertura de rede baseada no congestionamento médio
    cong_medio = zona["congestionamento"] / contagem
    if cong_medio < 0.2:
        cobertura = "5G"
    elif cong_medio < 0.35:
        cobertura = "4G"
    else:
        cobertura = "3G"

    return {
        "regiao": regiao,
        "municipio": zona["municipio"],
        "concentracao": concentracao,
        "cobertura_rede": cobertura,
        "perfis_disponiveis": zona["total_usuarios"],
        "lat": zona["lat"],
        "lon": zona["lon"],
    }


def get_todas_regioes() -> list:
    """
    Retorna todas as regiões disponíveis no dataset, ordenadas
    da maior para a menor concentração de pessoas.

    Usado pelo endpoint GET /insights para montar o mapa de talentos.
    """
    dados = _carregar_dados()

    if not dados:
        return []

    regioes = []
    for cluster, zona in dados.items():
        contagem = zona["contagem"] or 1
        media_usuarios = zona["total_usuarios"] / contagem
        concentracao = round(min(media_usuarios / 3000, 1.0), 2)
        cong_medio = zona["congestionamento"] / contagem

        if cong_medio < 0.2:
            cobertura = "5G"
        elif cong_medio < 0.35:
            cobertura = "4G"
        else:
            cobertura = "3G"

        regioes.append({
            "regiao": cluster,
            "municipio": zona["municipio"],
            "concentracao": concentracao,
            "cobertura_rede": cobertura,
            "perfis_disponiveis": zona["total_usuarios"],
            "lat": zona["lat"],
            "lon": zona["lon"],
        })

    # Ordena da maior concentração para a menor
    regioes.sort(key=lambda x: x["concentracao"], reverse=True)
    return regioes
