import React from "react";
import { T } from "@/data/mock";

export function Badge({ label, cor, bg, size = 11 }: { label: string; cor: string; bg: string; size?: number }) {
  return (
    <span
      style={{
        background: bg,
        color: cor,
        fontSize: size,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

export function Avatar({ sigla, size = 36, cor = T.verde, bg = T.verdeBg }: { sigla: string; size?: number; cor?: string; bg?: string }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: bg,
        color: cor,
        fontSize: size * 0.33,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        letterSpacing: "-0.5px",
      }}
    >
      {sigla}
    </div>
  );
}

export function Input({ label, placeholder, type = "text", value, onChange, required }: { label: string; placeholder?: string; type?: string; value: string; onChange: React.ChangeEventHandler<HTMLInputElement>; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.cinza600, letterSpacing: "0.3px" }}>
        {label}
        {required && <span style={{ color: T.erro }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          border: `1.5px solid ${T.cinza200}`,
          borderRadius: 10,
          padding: "10px 13px",
          fontSize: 14,
          color: T.cinza900,
          outline: "none",
          fontFamily: "inherit",
          background: T.branco,
          transition: "border 0.15s",
        }}
        onFocus={e => (e.target.style.borderColor = T.verde)}
        onBlur={e => (e.target.style.borderColor = T.cinza200)}
      />
    </div>
  );
}

export function Select({ label, value, onChange, options, required }: { label: string; value: string; onChange: React.ChangeEventHandler<HTMLSelectElement>; options: string[]; required?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 700, color: T.cinza600, letterSpacing: "0.3px" }}>
        {label}
        {required && <span style={{ color: T.erro }}> *</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        style={{
          border: `1.5px solid ${T.cinza200}`,
          borderRadius: 10,
          padding: "10px 13px",
          fontSize: 14,
          color: T.cinza900,
          outline: "none",
          fontFamily: "inherit",
          background: T.branco,
          cursor: "pointer",
        }}
      >
        {options.map(o => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function Btn({ label, onClick, variant = "primary", full = false, size = "md", disabled = false }: { label: string; onClick?: () => void; variant?: "primary" | "outline" | "ghost" | "danger"; full?: boolean; size?: "sm" | "md" | "lg"; disabled?: boolean }) {
  const pad = size === "sm" ? "7px 14px" : size === "lg" ? "14px 28px" : "10px 20px";
  const fz = size === "sm" ? 12 : size === "lg" ? 15 : 13;
  const styles = {
    primary: { bg: T.verde, color: T.branco, border: "none" },
    outline: { bg: "transparent", color: T.verde, border: `2px solid ${T.verde}` },
    ghost: { bg: T.cinza100, color: T.cinza600, border: "none" },
    danger: { bg: T.erroBg, color: T.erro, border: `1.5px solid ${T.erro}` },
  } as const;
  const s = styles[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: s.bg,
        color: s.color,
        border: s.border,
        borderRadius: 10,
        padding: pad,
        fontSize: fz,
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "inherit",
        width: full ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s, transform 0.1s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={e => {
        if (!disabled) e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {label}
    </button>
  );
}

export function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: T.branco,
        border: `1px solid ${T.cinza200}`,
        borderRadius: 16,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value, cor = T.cinza900 }: { label: string; value: number | string; cor?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: cor }}>{value}</div>
      <div style={{ fontSize: 12, color: T.cinza400, marginTop: 2 }}>{label}</div>
    </div>
  );
}
