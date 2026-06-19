import React from "react";
import { Avatar, Btn } from "@/components/ui";
import { T } from "@/data/mock";

type Empresa = {
  id: string;
  nome: string;
  logo: string;
  segmento: string;
  cidade: string;
  cnpj?: string;
  email?: string;
  site?: string;
};

type Props = {
  tela: string;
  setTela: (tela: string) => void;
  empresa: Empresa;
  onSair: () => void;
};

export default function SidebarEmpresa({ tela, setTela, empresa, onSair }: Props) {
  const itens = [
    { id: "emp-dashboard", icon: "⬡", label: "Dashboard" },
    { id: "emp-vagas", icon: "📋", label: "Minhas Vagas" },
    { id: "emp-candidatos", icon: "👥", label: "Candidatos" },
    { id: "emp-nova-vaga", icon: "＋", label: "Nova Vaga" },
    { id: "emp-perfil", icon: "⚙️", label: "Perfil" },
  ];
  return (
    <div style={{
      width: 220,
      background: T.cinza900,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 20px 16px", borderBottom: `1px solid #ffffff12` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: T.verde, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>📍</div>
          <div>
            <div style={{ color: T.branco, fontWeight: 800, fontSize: 14 }}>VagasMap</div>
            <div style={{ color: "#ffffff55", fontSize: 10 }}>Empresa</div>
          </div>
        </div>
      </div>

      {/* Empresa info */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid #ffffff12` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar sigla={empresa.logo} size={38} cor={T.verde} bg="#ffffff18" />
          <div>
            <div style={{ color: T.branco, fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{empresa.nome}</div>
            <div style={{ color: "#ffffff55", fontSize: 11, marginTop: 2 }}>{empresa.segmento}</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 0" }}>
        {itens.map(item => (
          <div key={item.id} onClick={() => setTela(item.id)} style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            padding: "10px 20px",
            cursor: "pointer",
            background: tela === item.id ? "#ffffff14" : "transparent",
            borderLeft: `3px solid ${tela === item.id ? T.verdeL : "transparent"}`,
            color: tela === item.id ? T.branco : "#ffffff66",
            fontSize: 13,
            fontWeight: tela === item.id ? 700 : 500,
            transition: "all 0.12s",
          }}>
            <span style={{ fontSize: 15 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div style={{ padding: "14px 20px", borderTop: `1px solid #ffffff12` }}>
        <div onClick={onSair} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          cursor: "pointer",
          color: "#ffffff55",
          fontSize: 13,
          fontWeight: 500,
        }}>
          <span>↩</span> Sair
        </div>
      </div>
    </div>
  );
}
