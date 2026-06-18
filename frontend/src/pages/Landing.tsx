import React from "react";
import { T } from "@/data/mock";
import { Btn } from "@/components/ui";

export default function Landing({ setFluxo }: { setFluxo: (fluxo: string) => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.verdeBg} 0%, #fff 60%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ width: "100%", maxWidth: 960 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: T.verde,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              📍
            </div>
            <span style={{ fontWeight: 800, fontSize: 22, color: T.cinza900 }}>VagasMap</span>
          </div>
          <h1
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: T.cinza900,
              lineHeight: 1.15,
              margin: "0 0 14px",
            }}
          >
            Conectando talentos<br />às melhores vagas
          </h1>
          <p style={{ color: T.cinza400, fontSize: 17, maxWidth: 480, margin: "0 auto" }}>
            Encontre vagas no mapa ou publique oportunidades e gerencie candidatos — tudo em um só lugar.
          </p>
        </div>

        {/* Cards de escolha */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          {/* Empresa */}
          <div
            style={{
              background: T.branco,
              borderRadius: 20,
              padding: 32,
              border: `2px solid ${T.cinza200}`,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = T.verde;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${T.verde}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = T.cinza200;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: T.verdeBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                margin: "0 auto 16px",
              }}
            >
              🏢
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: T.cinza900, margin: "0 0 8px" }}>
              Sou uma Empresa
            </h2>
            <p style={{ color: T.cinza400, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Publique vagas, gerencie candidatos e encontre os melhores talentos da região.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn label="Criar conta empresa" full onClick={() => setFluxo("cadastro-empresa")} />
              <button
                onClick={() => setFluxo("empresa")}
                style={{
                  background: "none",
                  border: "none",
                  color: T.verde,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Já tenho conta →
              </button>
            </div>
          </div>

          {/* Candidato */}
          <div
            style={{
              background: T.branco,
              borderRadius: 20,
              padding: 32,
              border: `2px solid ${T.cinza200}`,
              cursor: "pointer",
              transition: "all 0.2s",
              textAlign: "center",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = T.azul;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 32px ${T.azul}22`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = T.cinza200;
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                background: T.azulBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                margin: "0 auto 16px",
              }}
            >
              🧑‍💻
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: T.cinza900, margin: "0 0 8px" }}>
              Sou Candidato
            </h2>
            <p style={{ color: T.cinza400, fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
              Encontre vagas próximas a você, candidate-se e acompanhe o progresso em tempo real.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Btn label="Criar meu perfil" full onClick={() => setFluxo("cadastro-candidato")} />
              <button
                onClick={() => setFluxo("candidato")}
                style={{
                  background: "none",
                  border: "none",
                  color: T.azul,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Já tenho conta →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
