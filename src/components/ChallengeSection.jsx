import { useMemo } from "react";
import { C, DAILY_CHALLENGES } from "../data.js";
import { Card, Btn } from "./ui.jsx";

// Tongue-twister bank for the bonus section
const TWISTERS = [
  "She sells seashells by the seashore.",
  "Peter Piper picked a peck of pickled peppers.",
  "How much wood would a woodchuck chuck?",
  "Red lorry, yellow lorry.",
  "Unique New York, unique New York.",
  "Toy boat, toy boat, toy boat.",
  "The sixth sick sheikh's sixth sheep's sick.",
  "Rubber baby buggy bumpers.",
];

export default function ChallengeSection({ speak }) {
  // Deterministic daily challenge based on calendar day
  const todayChallenge = useMemo(() => {
    const day = new Date().getDate();
    return DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
  }, []);

  const todayTwisters = useMemo(() => {
    const day = new Date().getDate();
    return [
      TWISTERS[day % TWISTERS.length],
      TWISTERS[(day + 3) % TWISTERS.length],
      TWISTERS[(day + 6) % TWISTERS.length],
    ];
  }, []);

  return (
    <>
      {/* ── Today's Challenge ── */}
      <Card style={{ background:"linear-gradient(135deg,rgba(245,197,24,0.08),rgba(245,197,24,0.03))", border:"1px solid rgba(245,197,24,0.25)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{
            width:48, height:48, borderRadius:12, flexShrink:0,
            background:`${C.gold}20`, border:`1px solid ${C.gold}40`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:22,
          }}>
            🏆
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:C.gold, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:4 }}>
              Today's Challenge
            </div>
            <div style={{ fontSize:14, fontWeight:700, lineHeight:1.5, marginBottom:10 }}>
              {todayChallenge}
            </div>
            <div style={{ fontSize:11, color:C.gray }}>
              New challenge refreshes daily at midnight 🌙
            </div>
          </div>
        </div>
      </Card>

      {/* ── Tongue Twisters ── */}
      <Card>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:5, marginTop:0 }}>👅 Today's Tongue Twisters</h2>
        <p style={{ fontSize:12, color:C.gray, marginBottom:14, lineHeight:1.6 }}>
          Say each one slowly 3× then faster. These isolate specific phoneme patterns.
        </p>

        {todayTwisters.map((t, i) => (
          <div key={i} style={{
            padding:"12px 14px", borderRadius:10, marginBottom:9,
            background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
              <div>
                <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>Twister {i+1}</div>
                <div style={{ fontSize:13, fontWeight:600, lineHeight:1.5 }}>"{t}"</div>
              </div>
              <div style={{ display:"flex", gap:6, flexShrink:0, marginTop:18 }}>
                <Btn color={C.blue} style={{ fontSize:11, padding:"5px 10px" }} onClick={() => speak(t)}>
                  🔊 Normal
                </Btn>
                <Btn color={C.blue} outline style={{ fontSize:11, padding:"5px 10px" }} onClick={() => speak(t, 0.5)}>
                  🐢 Slow
                </Btn>
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* ── All Challenges ── */}
      <Card>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:5, marginTop:0 }}>📅 Full Challenge Bank</h2>
        <p style={{ fontSize:12, color:C.gray, marginBottom:14, lineHeight:1.6 }}>
          Pick any challenge to practise independently — great for warm-ups.
        </p>

        {DAILY_CHALLENGES.map((c, i) => {
          const isToday = c === todayChallenge;
          return (
            <div key={i} style={{
              padding:"10px 13px", borderRadius:9, marginBottom:7, cursor:"default",
              background: isToday ? `${C.gold}10` : "rgba(255,255,255,0.03)",
              border: isToday ? `1px solid ${C.gold}30` : "1px solid rgba(255,255,255,0.07)",
              display:"flex", alignItems:"center", gap:10,
            }}>
              <div style={{
                width:24, height:24, borderRadius:6, flexShrink:0,
                background: isToday ? `${C.gold}25` : "rgba(255,255,255,0.06)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:11, fontWeight:700, color: isToday ? C.gold : C.gray,
              }}>
                {i+1}
              </div>
              <div style={{ fontSize:12, lineHeight:1.5, flex:1 }}>{c}</div>
              {isToday && (
                <span style={{ fontSize:10, color:C.gold, fontWeight:700, background:`${C.gold}20`, borderRadius:5, padding:"1px 6px", flexShrink:0 }}>
                  TODAY
                </span>
              )}
            </div>
          );
        })}
      </Card>

      {/* ── Tips for self-study ── */}
      <Card style={{ background:"rgba(6,182,212,0.04)", border:"1px solid rgba(6,182,212,0.18)" }}>
        <h2 style={{ fontSize:14, fontWeight:700, marginBottom:10, marginTop:0, color:C.cyan }}>
          💡 Self-Study Tips
        </h2>
        {[
          "🎧 Shadow native speakers — mirror speed, rhythm, pitch, not just words.",
          "📹 Record video — you'll notice facial tension and mouth shape.",
          "🔁 Repeat a single sentence 20× — your mouth learns the muscle pattern.",
          "📚 Read aloud 10 min/day — builds fluency faster than listening alone.",
          "🗣️ Talk to yourself in English — narrate your day as you live it.",
        ].map((tip, i) => (
          <div key={i} style={{ fontSize:12, lineHeight:1.7, marginBottom:4, color:C.gray }}>
            {tip}
          </div>
        ))}
      </Card>
    </>
  );
}
