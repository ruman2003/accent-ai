import { C, BADGES, findPhrase } from "../data.js";
import { Card } from "./ui.jsx";
import SparkLine from "./SparkLine.jsx";

export default function ProgressSection({ progress, stats }) {
  // ── Weakness report ────────────────────────────────────────────────────
  const entries = Object.entries(progress).filter(([, v]) => v.length > 0);
  const byPhrase = entries.map(([id, arr]) => ({
    id,
    avg:      Math.round(arr.reduce((a, h) => a + h.score, 0) / arr.length),
    attempts: arr.length,
    phrase:   findPhrase(id),
    history:  arr,
  }));

  const weakPhrases   = [...byPhrase].sort((a, b) => a.avg - b.avg).slice(0, 3).filter(x => x.phrase);
  const strongPhrases = [...byPhrase].sort((a, b) => b.avg - a.avg).slice(0, 2).filter(x => x.phrase);

  const totalPhrases     = byPhrase.length;
  const overallAvg       = byPhrase.length
    ? Math.round(byPhrase.reduce((a, x) => a + x.avg, 0) / byPhrase.length)
    : 0;
  const totalAttempts    = stats.totalAttempts || 0;
  const earnedBadges     = stats.earnedBadges  || [];

  return (
    <>
      {/* ── Overview stats ── */}
      <Card>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:13, marginTop:0 }}>📊 My Progress</h2>
        <div style={{ display:"flex", gap:9, marginBottom:16, flexWrap:"wrap" }}>
          {[
            { l:"Total Attempts",    v:totalAttempts,              c:C.blue   },
            { l:"Best Score",        v:stats.bestScore || 0,       c:C.green  },
            { l:"Overall Avg",       v:overallAvg,                 c:C.cyan   },
            { l:"Phrases Practiced", v:totalPhrases,               c:C.purple },
          ].map((s, i) => (
            <div key={i} style={{ flex:1, minWidth:90, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 11px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10, color:C.gray, marginTop:2, lineHeight:1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Streak & improvement */}
        <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
          <div style={{ flex:1, background:`${C.gold}10`, border:`1px solid ${C.gold}30`, borderRadius:10, padding:"10px 13px" }}>
            <div style={{ fontSize:11, color:C.gray, marginBottom:3 }}>🔥 Current Streak</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.gold }}>{stats.streak || 0} days</div>
          </div>
          <div style={{ flex:1, background:`${C.purple}10`, border:`1px solid ${C.purple}30`, borderRadius:10, padding:"10px 13px" }}>
            <div style={{ fontSize:11, color:C.gray, marginBottom:3 }}>📈 Biggest Improvement</div>
            <div style={{ fontSize:20, fontWeight:800, color:C.purple }}>+{stats.biggestImprovement || 0} pts</div>
          </div>
        </div>
      </Card>

      {/* ── Badges ── */}
      <Card>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:13, marginTop:0 }}>🏅 Badges</h2>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {BADGES.map(b => {
            const earned = earnedBadges.includes(b.id);
            return (
              <div key={b.id} style={{
                padding:"8px 12px", borderRadius:10,
                background: earned ? `${C.gold}15` : "rgba(255,255,255,0.03)",
                border: earned ? `1px solid ${C.gold}40` : "1px solid rgba(255,255,255,0.07)",
                opacity: earned ? 1 : 0.45,
                transition:"all 0.2s", textAlign:"center", minWidth:80,
              }}>
                <div style={{ fontSize:22 }}>{b.icon}</div>
                <div style={{ fontSize:11, fontWeight:700, color:earned?C.gold:C.gray, marginTop:3 }}>{b.label}</div>
                <div style={{ fontSize:10, color:C.gray, marginTop:2, lineHeight:1.3 }}>{b.desc}</div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Weakness report ── */}
      {(weakPhrases.length > 0 || strongPhrases.length > 0) && (
        <Card>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:13, marginTop:0 }}>🔍 Phrase Analysis</h2>

          {weakPhrases.length > 0 && (
            <>
              <div style={{ fontSize:12, color:C.red, fontWeight:700, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.5px" }}>
                ⚠️ Needs Work
              </div>
              {weakPhrases.map(p => (
                <div key={p.id} style={{ padding:"10px 12px", borderRadius:10, background:"rgba(239,68,68,0.06)", border:"1px solid rgba(239,68,68,0.15)", marginBottom:7 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:13, fontWeight:600, flex:1 }}>"{p.phrase.text}"</div>
                    <div style={{ display:"flex", gap:8, flexShrink:0, marginLeft:10 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:C.red, background:`${C.red}15`, borderRadius:5, padding:"2px 7px" }}>avg {p.avg}</span>
                      <span style={{ fontSize:11, color:C.gray }}>{p.attempts} tries</span>
                    </div>
                  </div>
                  <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden", marginTop:7 }}>
                    <div style={{ width:`${p.avg}%`, height:"100%", background:C.red, borderRadius:3, transition:"width 0.6s ease" }}/>
                  </div>
                </div>
              ))}
            </>
          )}

          {strongPhrases.length > 0 && (
            <>
              <div style={{ fontSize:12, color:C.green, fontWeight:700, margin:"12px 0 8px", textTransform:"uppercase", letterSpacing:"0.5px" }}>
                ✅ Strengths
              </div>
              {strongPhrases.map(p => (
                <div key={p.id} style={{ padding:"10px 12px", borderRadius:10, background:"rgba(34,197,94,0.06)", border:"1px solid rgba(34,197,94,0.15)", marginBottom:7 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ fontSize:13, fontWeight:600, flex:1 }}>"{p.phrase.text}"</div>
                    <div style={{ display:"flex", gap:8, flexShrink:0, marginLeft:10 }}>
                      <span style={{ fontSize:12, fontWeight:700, color:C.green, background:`${C.green}15`, borderRadius:5, padding:"2px 7px" }}>avg {p.avg}</span>
                      <span style={{ fontSize:11, color:C.gray }}>{p.attempts} tries</span>
                    </div>
                  </div>
                  <div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden", marginTop:7 }}>
                    <div style={{ width:`${p.avg}%`, height:"100%", background:C.green, borderRadius:3, transition:"width 0.6s ease" }}/>
                  </div>
                </div>
              ))}
            </>
          )}
        </Card>
      )}

      {/* ── Per-phrase history sparklines ── */}
      {byPhrase.filter(p => p.history.length >= 2).length > 0 && (
        <Card>
          <h2 style={{ fontSize:16, fontWeight:700, marginBottom:13, marginTop:0 }}>📈 Score History</h2>
          {byPhrase.filter(p => p.history.length >= 2).map(p => (
            <div key={p.id} style={{ marginBottom:18 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.white, marginBottom:4 }}>
                "{p.phrase?.text}"
              </div>
              <SparkLine history={p.history} />
            </div>
          ))}
        </Card>
      )}

      {totalAttempts === 0 && (
        <Card>
          <div style={{ textAlign:"center", padding:"24px 0", color:C.gray }}>
            <div style={{ fontSize:32, marginBottom:10 }}>🎙️</div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:6, color:C.white }}>No attempts yet</div>
            <div style={{ fontSize:12, lineHeight:1.6 }}>
              Head to <strong style={{color:C.gold}}>Practice</strong> and record your first phrase to start tracking progress!
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
