import mysql.connector
from fastapi import APIRouter, HTTPException # Adicione o HTTPException aqui!
from models.schemas import SaudeTimeResponse, DadosPerfil
import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# ... dentro da função get_dados_saude_time:
conexao = mysql.connector.connect(
    host="localhost",
    user="root",
    password=os.getenv("DB_PASSWORD", ""), # Tenta ler do .env, se não achar, usa senha vazia
    database="appbit_hackathon"
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard B2C - Saúde do Time"])

#MOCK_DADOS = SaudeTimeResponse(
#    total_geral_assinantes=215400,
#    data_atualizacao="2026-06-23",
#    dados_por_perfil=[
#        DadosPorPerfil(perfil="Analista de Sistemas", quantidade=32400, percentual_total=15.04, media_escolaridade="Superior Completo", indice_qualificacao=0.92),
#        DadosPorPerfil(perfil="Desenvolvedor Frontend", quantidade=28900, percentual_total=13.42, media_escolaridade="Superior Completo", indice_qualificacao=0.95),
#        DadosPorPerfil(perfil="Assistente Administrativo", quantidade=41200, percentual_total=19.13, media_escolaridade="Médio Completo", indice_qualificacao=0.78),
#        DadosPorPerfil(perfil="Engenheiro de Dados", quantidade=15700, percentual_total=7.29, media_escolaridade="Pós-Graduação", indice_qualificacao=0.98)
#    ],
#    dados_por_regiao=[
#        DadosPorRegiao(regiao="Florianópolis", total_pessoas=89200, distribuicao_perfis={"Analista": 14500, "Desenvolvedor": 12800, "Administrativo": 18300}, indice_densidade=0.94),
#        DadosPorRegiao(regiao="São José", total_pessoas=52800, distribuicao_perfis={"Analista": 8700, "Desenvolvedor": 6200, "Administrativo": 11400}, indice_densidade=0.87),
#        DadosPorRegiao(regiao="Palhoça", total_pessoas=38500, distribuicao_perfis={"Analista": 5200, "Desenvolvedor": 3900, "Administrativo": 9800}, indice_densidade=0.79)
#    ]
#)

@router.get("/saude-time", response_model=SaudeTimeResponse)
def get_dados_saude_time():
    try:
        # 1. Conexão
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password=os.getenv("DB_PASSWORD"),
            database="appbit_hackathon"
        )
        cursor = conexao.cursor(dictionary=True)

        # 2. Query
        query_perfil = """
            SELECT income_cluster AS perfil, 
                   COUNT(*) AS total 
            FROM assinantes 
            GROUP BY income_cluster
        """
        cursor.execute(query_perfil)
        resultados = cursor.fetchall()
        
        cursor.close()
        conexao.close()

        # 3. Mapear para o Pydantic (DENTRO DO TRY)
        lista_perfis = [
            DadosPerfil(
                perfil=row['perfil'],
                quantidade=row['total'],
                percentual=0.0
            ) for row in resultados
        ]

        return SaudeTimeResponse(
            total_pessoas=sum(item.quantidade for item in lista_perfis),
            por_renda=lista_perfis,
            por_idade=lista_perfis,
            grupo_sub_representado=DadosPerfil(perfil="Geral", quantidade=0, percentual=0.0)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados: {str(e)}")
   
        # Mapear para o Pydantic
        lista_perfis = [
            DadosPerfil(
                perfil=row['perfil'],
                quantidade=row['total'],
                percentual=(row['total'] / total_pessoas) * 100
            ) for row in resultados
        ]

        cursor.close()
        conexao.close()

        return SaudeTimeResponse(
            total_pessoas=sum(item.quantidade for item in lista_perfis),
            por_renda=lista_perfis,
            por_idade=lista_perfis,
            grupo_sub_representado=DadosPerfil(perfil="Geral", quantidade=0, percentual=0.0)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados: {str(e)}")