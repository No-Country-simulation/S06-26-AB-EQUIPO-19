import mysql.connector
from fastapi import APIRouter
from models.schemas import SaudeTimeResponse, DadosPorPerfil, DadosPorRegiao

router = APIRouter(prefix="/dashboard", tags=["Dashboard B2C - Saúde do Time"])

MOCK_DADOS = SaudeTimeResponse(
    total_geral_assinantes=215400,
    data_atualizacao="2026-06-23",
    dados_por_perfil=[
        DadosPorPerfil(perfil="Analista de Sistemas", quantidade=32400, percentual_total=15.04, media_escolaridade="Superior Completo", indice_qualificacao=0.92),
        DadosPorPerfil(perfil="Desenvolvedor Frontend", quantidade=28900, percentual_total=13.42, media_escolaridade="Superior Completo", indice_qualificacao=0.95),
        DadosPorPerfil(perfil="Assistente Administrativo", quantidade=41200, percentual_total=19.13, media_escolaridade="Médio Completo", indice_qualificacao=0.78),
        DadosPorPerfil(perfil="Engenheiro de Dados", quantidade=15700, percentual_total=7.29, media_escolaridade="Pós-Graduação", indice_qualificacao=0.98)
    ],
    dados_por_regiao=[
        DadosPorRegiao(regiao="Florianópolis", total_pessoas=89200, distribuicao_perfis={"Analista": 14500, "Desenvolvedor": 12800, "Administrativo": 18300}, indice_densidade=0.94),
        DadosPorRegiao(regiao="São José", total_pessoas=52800, distribuicao_perfis={"Analista": 8700, "Desenvolvedor": 6200, "Administrativo": 11400}, indice_densidade=0.87),
        DadosPorRegiao(regiao="Palhoça", total_pessoas=38500, distribuicao_perfis={"Analista": 5200, "Desenvolvedor": 3900, "Administrativo": 9800}, indice_densidade=0.79)
    ]
)

@router.get("/saude-time", response_model=SaudeTimeResponse)
def get_dados_saude_time():
    resposta_final = None
    try:
        conexao = mysql.connector.connect(
            host="localhost",       
            user="root",            
            password="root",   
            database="appbit_hackathon" 
        )
        cursor = conexao.cursor()

        # COMO A TABELA ASSINANTES FOI DELETADA, VAMOS CONTAR OS CANDIDATOS:
        cursor.execute("SELECT COUNT(*) FROM Candidato")
        resultado = cursor.fetchone() 
        
        total_real = int(resultado[0] or 0) 

        cursor.close()
        conexao.close()
        
        resposta_final = SaudeTimeResponse(
            total_geral_assinantes=total_real,
            data_atualizacao="2026-06-23",
            dados_por_perfil=MOCK_DADOS.dados_por_perfil, 
            dados_por_regiao=MOCK_DADOS.dados_por_regiao
        )
    except Exception as erro:
        print(f"⚠️ Erro Banco: {erro}. Usando MOCK.")
        resposta_final = MOCK_DADOS 

    return resposta_final
