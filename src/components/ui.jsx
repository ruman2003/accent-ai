import { C } from "../data.js";

/** Reusable filled or outlined button */
export function Btn({ color, outline, onClick, disabled, children, style={} }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding:"9px 16px", borderRadius:10,
        border: outline ? `2px solid ${color}` : "none",
        background: outline ? "transparent" : color,
        color: outline ? color : "#0A0F1E",
        fontWeight:700, fontSize:13, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition:"all 0.2s",
        display:"inline-flex", alignItems:"center", gap:6,
        fontFamily:"inherit",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

/** Coloured label tag */
export function Tag({ color, children }) {
  return (
    <span style={{
      display:"inline-block",
      background: color + "20", color,
      borderRadius:6, padding:"2px 8px",
      fontSize:11, fontWeight:700, marginBottom:5,
    }}>
      {children}
    </span>
  );
}

/** Conic-gradient score ring */
export function ScoreRing({ score }) {
  const col = score >= 80 ? C.green : score >= 60 ? C.amber : C.red;
  return (
    <div style={{
      width:64, height:64, borderRadius:"50%", flexShrink:0,
      background:`conic-gradient(${col} ${score}%, rgba(255,255,255,0.08) 0)`,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}>
      <div style={{
        background:C.navy, width:48, height:48, borderRadius:"50%",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:15, fontWeight:800, color:col,
      }}>
        {score}
      </div>
    </div>
  );
}

/** Generic glass card */
export function Card({ children, style={} }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.04)",
      border:"1px solid rgba(255,255,255,0.08)",
      borderRadius:14, padding:"15px", marginBottom:13,
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Coloured feedback panel */
export function FbPanel({ color, children, style={} }) {
  return (
    <div style={{
      background:"rgba(10,15,30,0.7)", borderRadius:10,
      padding:"11px 13px", border:`1px solid ${color}30`,
      marginBottom:9, ...style,
    }}>
      {children}
    </div>
  );
}
