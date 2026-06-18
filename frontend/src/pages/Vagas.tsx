import React, { useState } from "react";
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
  setVagaAtiva: (vaga: any) => void;
};

export default function EmpVagas({ empresa, setTela, setVagaAtiva }: Props) {
  const vagasEmpresa = VAGAS_MOCK.filter(v => v.empresaId === empresa.id);
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px", background: T.cinza50 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: T.cinza900, margin: 0 }}>Minhas Vagas</h1>
          <p style={{ color: T.cinza400, marginTop: 4, fontSize: 14 }}>{vagasEmpresa.length} vagas cadastradas</p>
        </div>
        <Btn label="+ Nova Vaga" onClick={() => setTela("emp-nova-vaga")} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {vagasEmpresa.map(v => (
          <Card key={v.id} style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Avatar sigla={empresa.logo} size={48} cor={T.verde} bg={T.verdeBg} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 15, color: T.cinza900 }}>{v.titulo}</div>
              <div style={{ fontSize: 12, color: T.cinza400, marginTop: 3 }}>{v.cidade} · {v.tipo} · {v.modalidade}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                {v.tags.map((t: string) => (
                  <Badge key={t} label={t} cor={T.cinza600} bg={T.cinza100} />
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <Badge label={v.status} cor={v.status === "Ativa" ? T.verde : T.amarelo} bg={v.status === "Ativa" ? T.verdeBg : T.amareloBg} />
              <span style={{ fontSize: 12, color: T.cinza400 }}>👤 {v.candidatos} candidatos</span>
              <Btn label="Ver candidatos" size="sm" variant="outline" onClick={() => { setVagaAtiva(v); setTela("emp-candidatos"); }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
