from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import match, vagas, insights, dashboard, mensagens

app = FastAPI(
    title="App BiT — Motor de Matching Inclusivo",
    description="API B2B para matching de candidatos com filtro anti-viés e critérios ESG.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(match.router)
app.include_router(vagas.router)
app.include_router(insights.router)
app.include_router(dashboard.router)
app.include_router(mensagens.router)

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "App BiT API está no ar."}
