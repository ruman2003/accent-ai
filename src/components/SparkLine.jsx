/** SVG sparkline showing score history for a phrase. */
export default function SparkLine({ history }) {
  if (!history || history.length < 2) return null;
  const pts = history.slice(-10);
  const W = 320, H = 72, px = 16, py = 8;
  const iW = W - px * 2, iH = H - py * 2;

  const points = pts.map((h, i) => ({
    x: px + (i / (pts.length - 1)) * iW,
    y: py + iH - (h.score / 100) * iH,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const trend = pts[pts.length - 1].score - pts[0].score;

  return (
    <div style={{ marginTop:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:11, color:"#8B95A8" }}>Score trend ({pts.length} attempts)</span>
        <span style={{ fontSize:12, fontWeight:700, color:trend>=0?"#22C55E":"#EF4444" }}>
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)} pts
        </span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background:"rgba(10,15,30,0.5)", borderRadius:8, display:"block" }}>
        {[25,50,75].map(v => (
          <line
            key={v}
            x1={px} x2={W-px}
            y1={py+iH-(v/100)*iH} y2={py+iH-(v/100)*iH}
            stroke="rgba(255,255,255,0.05)" strokeWidth="1"
          />
        ))}
        <path
          d={`${pathD} L${points[points.length-1].x},${H-py} L${points[0].x},${H-py} Z`}
          fill="rgba(45,108,223,0.1)"
        />
        <path d={pathD} fill="none" stroke="#2D6CDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3.5"
            fill={pts[i].score>=80?"#22C55E":pts[i].score>=60?"#F59E0B":"#EF4444"}
            stroke="#0A0F1E" strokeWidth="1.5"
          />
        ))}
      </svg>
    </div>
  );
}
