import { C, LEVELS, findPhrase, wordAccuracy, getFlowPos, BADGES, EMPTY_STATS } from "../data.js";
import { Btn, Tag, ScoreRing, Card, FbPanel } from "./ui.jsx";
import WaveVisualizer from "./WaveVisualizer.jsx";
import WordDiffDisplay from "./WordDiffDisplay.jsx";
import SparkLine from "./SparkLine.jsx";
import ConfidenceBar from "./ConfidenceBar.jsx";
import { useCallback } from "react";

// ── styles ──────────────────────────────────────────────────────────────────
const pCard = (sel, clr) => ({
  padding:"11px 13px", borderRadius:10, cursor:"pointer",
  border: sel ? `2px solid ${clr}` : "1px solid rgba(255,255,255,0.08)",
  background: sel ? clr + "15" : "rgba(255,255,255,0.03)",
  marginBottom:6, transition:"all 0.2s",
  transform: sel ? "scale(1.01)" : "scale(1)",
});

export default function PracticeSection({
  activeTab, selectedPhrase, setSelected,
  isRecording, transcript, diffs, score, aiFeedback, loading, error,
  startRecording, stopRecording, analyserRef,
  progress, stats, getAI, speak,
  phraseHistory, confidence,
}) {
  const level = LEVELS[activeTab];

  return (
    <>
      {/* ── Stats row ── */}
      <div style={{ display:"flex", gap:9, marginBottom:13 }}>
        {[
          { l:"Attempts",        v:stats.totalAttempts,           c:C.blue   },
          { l:"Best Score",      v:stats.bestScore,               c:C.green  },
          { l:"Best Improvement",v:`+${stats.biggestImprovement}`,c:C.purple },
          { l:"Phrases Done",    v:stats.phrasesAttempted,        c:C.amber  },
        ].map((s, i) => (
          <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 11px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:s.c }}>{s.v}</div>
            <div style={{ fontSize:10, color:C.gray, marginTop:2, lineHeight:1.3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── Phrase list ── */}
      <Card>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:11, marginTop:0 }}>
          Choose a Phrase to Practice
        </h2>
        {level.phrases.map(p => {
          const h         = progress[p.id] || [];
          const avg       = h.length ? Math.round(h.reduce((a,x)=>a+x.score,0)/h.length) : null;
          const lastScore = h.length ? h[h.length-1].score : null;
          const trend     = h.length >= 2 ? h[h.length-1].score - h[0].score : null;
          const sel       = selectedPhrase?.id === p.id;

          return (
            <div key={p.id} style={pCard(sel, level.color)}
              onClick={() => setSelected(p)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontSize:13, fontWeight:600, flex:1, lineHeight:1.4 }}>{p.text}</div>
                <div style={{ display:"flex", gap:5, flexShrink:0, marginLeft:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
                  {avg !== null && (
                    <span style={{
                      fontSize:11, fontWeight:700,
                      color:avg>=80?C.green:avg>=60?C.amber:C.red,
                      background:avg>=80?`${C.green}15`:avg>=60?`${C.amber}15`:`${C.red}15`,
                      borderRadius:5, padding:"1px 6px",
                    }}>avg {avg}</span>
                  )}
                  {trend !== null && (
                    <span style={{ fontSize:10, color:trend>=0?C.green:C.red }}>
                      {trend>=0?"▲":"▼"}{Math.abs(trend)}
                    </span>
                  )}
                </div>
              </div>
              {sel && <div style={{ fontSize:12, color:C.gray, marginTop:5, lineHeight:1.5 }}>💡 {p.tip}</div>}
              {h.length > 0 && (
                <div style={{ fontSize:10, color:C.gray, marginTop:3 }}>
                  {h.length} attempt{h.length>1?"s":""} · last: {lastScore}pts
                </div>
              )}
            </div>
          );
        })}
      </Card>

      {/* ── Recording panel ── */}
      {selectedPhrase && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
            <h2 style={{ fontSize:16, fontWeight:700, marginBottom:0, marginTop:0 }}>🎙️ Record Your Pronunciation</h2>
            <span style={{ fontSize:11, color:C.gray }}>
              {phraseHistory.length} attempt{phraseHistory.length!==1?"s":""}
            </span>
          </div>

          {phraseHistory.length > 0 && <ConfidenceBar value={confidence} />}

          {/* Target phrase */}
          <div style={{ background:"rgba(10,15,30,0.6)", borderRadius:10, padding:"11px 13px", marginBottom:11, border:"1px solid rgba(45,108,223,0.22)" }}>
            <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>Target phrase:</div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:9 }}>"{selectedPhrase.text}"</div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              <Btn color={C.blue} style={{ fontSize:12, padding:"7px 13px" }} onClick={() => speak(selectedPhrase.text)}>
                🔊 Hear It (Normal)
              </Btn>
              <Btn color={C.blue} outline style={{ fontSize:12, padding:"7px 13px" }} onClick={() => speak(selectedPhrase.text, 0.6)}>
                🐢 Slow Speed
              </Btn>
            </div>
          </div>

          <WaveVisualizer isRecording={isRecording} analyserRef={analyserRef} />

          {/* Record button */}
          <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:12 }}>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              style={{
                width:58, height:58, borderRadius:"50%", border:"none", cursor:"pointer",
                background: isRecording
                  ? "linear-gradient(135deg,#EF4444,#DC2626)"
                  : "linear-gradient(135deg,#2D6CDF,#1D4ED8)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:24,
                boxShadow: isRecording
                  ? "0 0 22px rgba(239,68,68,0.6)"
                  : "0 0 14px rgba(45,108,223,0.4)",
                animation: isRecording ? "pulse 1s infinite" : "none",
                transition:"all 0.3s",
                fontFamily:"inherit",
              }}
            >
              {isRecording ? "⏹" : "🎙"}
            </button>
            <div>
              <div style={{ fontWeight:700, fontSize:13 }}>
                {isRecording ? "🔴 Recording — speak clearly" : "Tap to start recording"}
              </div>
              <div style={{ fontSize:11, color:C.gray }}>
                {isRecording ? "Tap again to stop" : "Say the phrase shown above"}
              </div>
            </div>
          </div>

          {error && (
            <div style={{ color:C.red, fontSize:12, marginTop:8, padding:"7px 10px", background:"rgba(239,68,68,0.08)", borderRadius:7 }}>
              ⚠️ {error}
            </div>
          )}

          {/* Transcript & diff */}
          {transcript && (
            <div style={{ marginTop:13 }}>
              <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>What we heard:</div>
              <div style={{ background:"rgba(45,108,223,0.1)", borderRadius:8, padding:"8px 12px", fontSize:13, border:"1px solid rgba(45,108,223,0.28)", marginBottom:11 }}>
                "{transcript}"
              </div>
              <WordDiffDisplay diffs={diffs} />
              <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                <Btn color={C.gold} onClick={() => getAI(selectedPhrase, transcript, diffs)} disabled={loading}>
                  {loading ? "⏳ AI Analyzing..." : "🤖 Get Full AI Coaching"}
                </Btn>
                <span style={{ fontSize:11, color:C.gray }}>Detailed word-level drills + next steps</span>
              </div>
            </div>
          )}

          {/* Score ring */}
          {score !== null && (
            <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:13, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
              <ScoreRing score={score} />
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>AI Score: {score}/100</div>
                <div style={{ fontSize:12, color:C.gray }}>
                  {score>=80 ? "Excellent — near native level!" : score>=60 ? "Good — keep refining each session!" : "Every rep improves it — keep going!"}
                </div>
              </div>
            </div>
          )}

          {/* AI Feedback */}
          {aiFeedback && !aiFeedback.offline && (
            <div style={{ marginTop:13, animation:"fadeIn 0.4s ease" }}>
              <FbPanel color={C.green}>
                <Tag color={C.green}>OVERALL</Tag>
                <div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.overall}</div>
                <div style={{ fontSize:12, color:C.green, marginTop:5 }}>✓ {aiFeedback.wellDone}</div>
              </FbPanel>

              {aiFeedback.topErrors?.length > 0 && (
                <FbPanel color={C.red}>
                  <Tag color={C.red}>PROBLEM WORDS — Exactly Where &amp; Why</Tag>
                  {aiFeedback.topErrors.map((e, i) => (
                    <div key={i} style={{ marginBottom:9, paddingBottom:9, borderBottom:i<aiFeedback.topErrors.length-1?"1px solid rgba(239,68,68,0.15)":"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                        <span style={{ fontWeight:800, color:C.red, fontSize:14 }}>"{e.word}"</span>
                        <span style={{ fontSize:11, color:C.gray, background:"rgba(239,68,68,0.1)", borderRadius:5, padding:"1px 6px" }}>{e.problem}</span>
                      </div>
                      <div style={{ fontSize:13, color:C.white, paddingLeft:4 }}>→ Fix: {e.fix}</div>
                    </div>
                  ))}
                </FbPanel>
              )}

              {aiFeedback.flowNote && (
                <FbPanel color={C.amber}>
                  <Tag color={C.amber}>FLOW &amp; RHYTHM ANALYSIS</Tag>
                  <div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.flowNote}</div>
                </FbPanel>
              )}

              {aiFeedback.drills?.length > 0 && (
                <FbPanel color={C.purple}>
                  <Tag color={C.purple}>3 MICRO-DRILLS (10 seconds each — do right now!)</Tag>
                  {aiFeedback.drills.map((d, i) => (
                    <div key={i} style={{ fontSize:13, padding:"3px 0", display:"flex", gap:8, alignItems:"flex-start" }}>
                      <span style={{ color:C.purple, fontWeight:800, flexShrink:0, fontSize:15 }}>{i+1}.</span>
                      <span style={{ lineHeight:1.6 }}>{d}</span>
                    </div>
                  ))}
                </FbPanel>
              )}

              <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                {aiFeedback.nativeTip && (
                  <FbPanel color={C.cyan} style={{ flex:1, display:"flex", gap:9, alignItems:"flex-start", marginBottom:0 }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>💡</span>
                    <div>
                      <Tag color={C.cyan}>NATIVE SPEAKER TIP</Tag>
                      <div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.nativeTip}</div>
                    </div>
                  </FbPanel>
                )}
                {aiFeedback.nextFocus && (
                  <FbPanel color={C.gold} style={{ flex:1, display:"flex", gap:9, alignItems:"flex-start", marginBottom:0 }}>
                    <span style={{ fontSize:20, flexShrink:0 }}>🎯</span>
                    <div>
                      <Tag color={C.gold}>NEXT SESSION FOCUS</Tag>
                      <div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.nextFocus}</div>
                    </div>
                  </FbPanel>
                )}
              </div>
            </div>
          )}

          {aiFeedback?.offline && (
            <FbPanel color={C.gold} style={{ marginTop:12 }}>
              <Tag color={C.gold}>OFFLINE COACHING TIP</Tag>
              <div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.nativeTip}</div>
            </FbPanel>
          )}

          {phraseHistory.length >= 2 && <SparkLine history={phraseHistory} />}
        </Card>
      )}
    </>
  );
}
