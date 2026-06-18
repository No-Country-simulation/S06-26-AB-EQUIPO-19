import React from "react";
import { Avatar, Badge, Btn, Card } from "@/components/ui";
import { T, VAGAS_MOCK, CANDIDATOS_MOCK, PIPELINE, PIPELINE_COR } from "@/data/mock";

type Props = {
  vagaAtiva: any;
  setVagaAtiva: (vaga: any) => void;
};

export default function EmpCandidatos({ vagaAtiva, setVagaAtiva }: Props) {
  const vagasEmpresa = VAGAS_MOCK.slice(0, 2);
  const vaga = vagaAtiva || vagasEmpresa[0];
  const cands = CANDIDATOS_MOCK.filter(c => c.vagaId === vaga?.id);

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px", background: T.cinza50 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.cinza900, margin: 0 }}>Candidatos</h1>
        <p style={{ color: T.cinza400, marginTop: 4, fontSize: 14 }}>Gerencie o pipeline de cada vaga</p>
      </div>

      {/* Seletor de vaga */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {VAGAS_MOCK.slice(0, 2).map(v => (
          <button
            key={v.id}
            onClick={() => setVagaAtiva(v)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: `1.5px solid ${vaga?.id === v.id ? T.verde : T.cinza200}`,
              background: vaga?.id === v.id ? T.verdeBg : T.branco,
              color: vaga?.id === v.id ? T.verde : T.cinza600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {v.titulo}
          </button>
        ))}
      </div>

      {/* Pipeline Kanban */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, overflowX: "auto" }}>
        {PIPELINE.map(etapa => {
          const candsEtapa = cands.filter(c => c.status === etapa);
          const { cor, bg } = PIPELINE_COR[etapa];
          return (
            <div key={etapa} style={{ minWidth: 170 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 12px",
                  background: bg,
                  borderRadius: "10px 10px 0 0",
                  borderBottom: `2px solid ${cor}`,
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: cor }}>{etapa}</span>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: cor,
                    color: T.branco,
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {candsEtapa.length}
                </span>
              </div>
              <div
                style={{
                  background: T.cinza100,
                  borderRadius: "0 0 10px 10px",
                  padding: 8,
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {candsEtapa.map(c => (
                  <div key={c.id} style={{ background: T.branco, borderRadius: 10, padding: "10px 12px", border: `1px solid ${T.cinza200}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Avatar sigla={c.avatar} size={28} cor={cor} bg={bg} />
                      <div style={{ fontWeight: 700, fontSize: 12, color: T.cinza900 }}>{c.nome}</div>
                    </div>
                    <div style={{ fontSize: 11, color: T.cinza400 }}>{c.cargo}</div>
                    <div style={{ fontSize: 10, color: T.cinza400, marginTop: 4 }}>{c.email}</div>
                  </div>
                ))}
                {candsEtapa.length === 0 && (
                  <div style={{ textAlign: "center", color: T.cinza400, fontSize: 11, padding: "20px 0" }}>Vazio</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
