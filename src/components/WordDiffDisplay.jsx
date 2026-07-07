import { wordAccuracy, getFlowPos } from "../data.js";

const statusColor = { correct:"#22C55E", wrong:"#EF4444", missing:"#F59E0B" };
const statusBg    = { correct:"rgba(34,197,94,0.12)", wrong:"rgba(239,68,68,0.15)", missing:"rgba(245,158,11,0.12)" };
const statusMark  = { correct:"✓", wrong:"✗", missing:"?" };

function Bar({ val, flowMax, label, color }) {
  return (
    <div style={{ flex:1, textAlign:"center" }}>
      <div style={{ height:44, background:"rgba(255,255,255,0.05)", borderRadius:6, display:"flex", alignItems:"flex-end", overflow:"hidden", marginBottom:4 }}>
        <div style={{
          width:"100%",
          height:`${Math.max((val/flowMax)*100, val>0?12:4)}%`,
          background: val > 0 ? color : "rgba(255,255,255,0.06)",
          borderRadius:"4px 4px 0 0",
          transition:"height 0.5s ease"
        }}/>
      </div>
      <div style={{ fontSize:10, color:"#8B95A8" }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:700, color:val>0?color:"#8B95A8" }}>{val} err</div>
    </div>
  );
}

export default function WordDiffDisplay({ diffs }) {
  if (!diffs || diffs.length === 0) return null;

  const acc     = wordAccuracy(diffs);
  const flow    = getFlowPos(diffs);
  const total   = flow.start + flow.middle + flow.end;
  const flowMax = Math.max(flow.start, flow.middle, flow.end, 1);

  return (
    <div style={{ marginTop:12, animation:"fadeIn 0.3s ease" }}>
      <div style={{ fontSize:11, color:"#8B95A8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>
        Word-by-Word Analysis
      </div>

      {/* Word chips */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
        {diffs.map((w, i) => (
          <div key={i} style={{
            padding:"4px 9px", borderRadius:6, fontSize:12, fontWeight:600,
            background:statusBg[w.status], color:statusColor[w.status],
            border:`1px solid ${statusColor[w.status]}40`,
            display:"flex", flexDirection:"column", alignItems:"center", gap:1
          }}>
            <span>{w.word}</span>
            <span style={{ fontSize:9 }}>
              {statusMark[w.status]}
              {w.status === "wrong" && w.spoken ? ` "${w.spoken}"` : ""}
            </span>
          </div>
        ))}
      </div>

      {/* Accuracy bar */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
          <div style={{
            width:`${acc}%`, height:"100%",
            background: acc>=80?"#22C55E":acc>=60?"#F59E0B":"#EF4444",
            borderRadius:4, transition:"width 0.6s ease"
          }}/>
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:acc>=80?"#22C55E":acc>=60?"#F59E0B":"#EF4444", minWidth:44 }}>
          {acc}% words
        </div>
      </div>
      <div style={{ fontSize:11, color:"#8B95A8", marginBottom:10 }}>
        {diffs.filter(w=>w.status==="correct").length} of {diffs.length} words matched
      </div>

      {/* Flow chart */}
      <div style={{ fontSize:11, color:"#8B95A8", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>
        Where Errors Happened in Your Flow
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <Bar val={flow.start}  flowMax={flowMax} label="Start"  color="#EF4444" />
        <Bar val={flow.middle} flowMax={flowMax} label="Middle" color="#F59E0B" />
        <Bar val={flow.end}    flowMax={flowMax} label="End"    color="#8B5CF6" />
      </div>

      {total > 0 ? (
        <div style={{ padding:"9px 12px", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, fontSize:12, lineHeight:1.7 }}>
          <span style={{ color:"#EF4444", fontWeight:700 }}>Flow Analysis: </span>
          {flow.start  > 0 && <span>Errors at <strong style={{color:"#EF4444"}}>Start</strong> — hesitation before beginning. </span>}
          {flow.middle > 0 && <span>Errors in <strong style={{color:"#F59E0B"}}>Middle</strong> — pace or breath dropping. </span>}
          {flow.end    > 0 && <span>Errors at <strong style={{color:"#8B5CF6"}}>End</strong> — trailing off or rushing to finish.</span>}
        </div>
      ) : (
        <div style={{ padding:"9px 12px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:12, color:"#22C55E", fontWeight:600 }}>
          ✨ Perfect flow — no positional errors detected!
        </div>
      )}
    </div>
  );
}
