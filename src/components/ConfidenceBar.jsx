/** Animated confidence bar for a specific phrase. */
export default function ConfidenceBar({ value }) {
  const cfg =
    value >= 80 ? { label:"High Confidence",  color:"#22C55E" } :
    value >= 50 ? { label:"Building Up",       color:"#F59E0B" } :
                  { label:"Keep Practicing",   color:"#3B82F6" };
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:11, color:"#8B95A8" }}>Confidence for this phrase</span>
        <span style={{ fontSize:11, fontWeight:700, color:cfg.color }}>
          {cfg.label} · {value}%
        </span>
      </div>
      <div style={{ height:8, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
        <div style={{
          width:`${value}%`, height:"100%",
          background:`linear-gradient(90deg,${cfg.color}99,${cfg.color})`,
          borderRadius:4, transition:"width 0.8s ease"
        }}/>
      </div>
    </div>
  );
}
