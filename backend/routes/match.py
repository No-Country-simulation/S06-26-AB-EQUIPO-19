import mysql.connector
from fastapi import APIRouter
from models.schemas import MatchRequest, MatchResponse, CandidatoResult
from services.ia_service import calcular_score

router = APIRouter(prefix="/match", tags=["Match"])

@router.post("/", response_model=MatchResponse)
def match_candidatos(payload: MatchRequest):
    print("\n=======================================================")
    print("🤖 INICIANDO TRIAGEM COM INTELIGÊNCIA ARTIFICIAL (GEMINI)")
    print("=======================================================\n")

    # Definindo a Vaga Padrão para a demonstração do Hackathon
    skills_da_vaga = "Python, FastAPI, PostgreSQL, Docker"
    metas_esg_empresa = "Prioridade para talentos das regiões Norte e Nordeste do Brasil"

    print(f"📌 VAGA EXIGIDA: {skills_da_vaga}")
    print(f"🎯 META ESG: {metas_esg_empresa}\n")
    print(f"📡 FILTROS DO FRONTEND: Limite de busca aplicado (Máximo 4 candidatos para proteger a cota gratuita).")

    resultados_finais = []
    total_encontrados = 0

    try:
        # Conexão com o MySQL para puxar a tabela Candidato
        conexao = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",  
            database="appbit_hackathon"
        )
        
        cursor = conexao.cursor(dictionary=True)
        
        # 🛡️ PROTEÇÃO DO HACKATHON: Limitamos no backend a 4 pessoas para garantir 100% que o Google não dê Erro 429
        cursor.execute("SELECT id, nome_completo, skills_candidato, latitude, longitude FROM Candidato LIMIT 4")
        candidatos_banco = cursor.fetchall()
        
        total_encontrados = len(candidatos_banco)
        
        cursor.close()
        conexao.close()

        # Mandando CADA UM dos candidatos do banco para a IA avaliar
        for c in candidatos_banco:
            perfil_anonimizado = f"Candidato #{c['id']} (Anonimizado)"
            skills_cand = c['skills_candidato']
            
            if c['latitude'] and float(c['latitude']) > -15.0:
                regiao_cand = "Norte ou Nordeste"
            else:
                regiao_cand = "Sul, Sudeste ou Centro-Oeste"

            print(f"⏳ A IA está analisando: {perfil_anonimizado}...")
            print(f"   - Skills do banco: {skills_cand}")
            print(f"   - Região mapeada: {regiao_cand}")

            # Chama a API do Gemini
            resultado_ia = calcular_score(
                skills_exigidas=skills_da_vaga,
                skills_candidato=skills_cand,
                regiao_candidato=regiao_cand,
                metas_esg=metas_esg_empresa
            )

            # Extraímos a nota e a justificativa
            score = float(resultado_ia.get("score_compatibilidade", 0.0))
            justificativa = resultado_ia.get("justificativa_analise", "Sem justificativa gerada.")

            print(f"✅ SCORE DEFINIDO: {score} pontos")
            print(f"🧠 PENSAMENTO DA IA: {justificativa}\n")

            resultados_finais.append(
                CandidatoResult(
                    id=c['id'],
                    perfil=perfil_anonimizado,
                    detalhes=f"Skills: {skills_cand} | Parecer IA: {justificativa}",
                    localizacao=f"Região detectada: {regiao_cand}",
                    indice_inclusao=score / 100.0  
                )
            )

        # Ordenamos do candidato com maior nota para o de menor nota
        resultados_finais.sort(key=lambda x: x.indice_inclusao, reverse=True)

    except Exception as e:
        print(f"🛑 ERRO NO BANCO OU NA IA: {e}")
        return MatchResponse(total_encontrados=0, candidatos=[])

    print("🏁 TRIAGEM CONCLUÍDA! Enviando a lista ordenada para o Front-end...")
    print("=======================================================\n")

    return MatchResponse(
        total_encontrados=total_encontrados,
        candidatos=resultados_finais
    )
