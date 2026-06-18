import React from "react";
import { Avatar, Badge, Btn, Card } from "@/components/ui";
import { T, VAGAS_MOCK } from "@/data/mock";

type Props = {
  empresa: {
    id: string;
    nome: string;
    logo: string;
    segmento: string;
    cidade: string;
    cnpj?: string;
    email?: string;
    site?: string;
  };
  setTela: (tela: string) => void;
};

export default function EmpDashboard({ empresa, setTela }: Props) {
  const vagasEmpresa = VAGAS_MOCK.filter(v => v.empresaId === empresa.id);
  const totalCands = vagasEmpresa.reduce((s, v) => s + v.candidatos, 0);
  const vagasAtivas = vagasEmpresa.filter(v => v.status === "Ativa").length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px", background: T.cinza50 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: T.cinza900, margin: 0 }}>
          Olá, {empresa.nome} 👋
        </h1>
        <p style={{ color: T.cinza400, marginTop: 4, fontSize: 14 }}>
          Veja como suas vagas estão performando hoje.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Vagas Ativas", value: vagasAtivas, cor: T.verde },
          { label: "Total de Candidatos", value: totalCands, cor: T.azul },
          { label: "Vagas Publicadas", value: vagasEmpresa.length, cor: T.roxo },
        ].map((s, i) => (
          <Card key={i} style={{ textAlign: "center", padding: "22px 16px" }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.cor }}>{s.value}</div>
            <div style={{ fontSize: 13, color: T.cinza400, marginTop: 4 }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Vagas recentes */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: T.cinza900, margin: 0 }}>Vagas Recentes</h2>
          <Btn label="Ver todas" variant="ghost" size="sm" onClick={() => setTela("emp-vagas")} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {vagasEmpresa.slice(0, 3).map(v => (
            <div
              key={v.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                background: T.cinza50,
                borderRadius: 12,
                border: `1px solid ${T.cinza200}`,
              }}
            >
              <Avatar sigla={empresa.logo} size={38} cor={T.verde} bg={T.verdeBg} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.cinza900 }}>{v.titulo}</div>
                <div style={{ fontSize: 12, color: T.cinza400, marginTop: 2 }}>{v.cidade} · {v.modalidade}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: T.cinza400 }}>👤 {v.candidatos}</span>
                <Badge
                  label={v.status}
                  cor={v.status === "Ativa" ? T.verde : T.amarelo}
                  bg={v.status === "Ativa" ? T.verdeBg : T.amareloBg}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
