import { C, LEVELS } from "../data.js";
import { Btn, Card } from "./ui.jsx";
import WaveVisualizer from "./WaveVisualizer.jsx";
import WordDiffDisplay from "./WordDiffDisplay.jsx";
import { ScoreRing } from "./ui.jsx";

export default function TestSection({
  activeTab, testMode, testQueue, testIdx, testResults,
  isRecording, transcript, diffs, score, aiFeedback, loading, error,
  showBlind, setShowBlind,
  startTest, nextTest, startRecording, stopRecording, analyserRef,
  getAI, speak, setTestMode,
}) {
  const level = LEVELS[activeTab];

  // ── Test mode chooser ────────────────────────────────────────────────────
  if (!testMode) {
    return (
      <Card>
        <h2 style={{ fontSize:16, fontWeight:700, marginBottom:5, marginTop:0 }}>🧪 Test Modes</h2>
        <p style={{ fontSize:12, color:C.gray, marginBottom:16, lineHeight:1.6 }}>
          Push yourself with structured challenge formats. All phrases come from the currently selected level.
        </p>

        {[
          {
            mode:"speed",
            icon:"⚡",
            title:"Speed Round",
            desc:"Race through all phrases — score each one quickly without drills.",
            color:C.amber,
          },
          {
            mode:"shadow",
            icon:"🎭",
            title:"Shadowing Mode",
            desc:"Hear each phrase aloud first, then repeat it immediately. Build muscle memory.",
            color:C.cyan,
          },
          {
            mode:"blind",
            icon:"🙈",
            title:"Blind Challenge",
            desc:"Phrase is hidden. Listen to TTS, then speak from memory. Ultimate test!",
            color:C.purple,
          },
        ].map(({ mode, icon, title, desc, color }) => (
          <div
            key={mode}
            style={{
              padding:"14px 16px", borderRadius:12, marginBottom:9, cursor:"pointer",
              border:`1px solid ${color}30`, background:`${color}08`,
              transition:"all 0.2s",
            }}
            onClick={() => startTest(mode)}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
              <span style={{ fontSize:22 }}>{icon}</span>
              <span style={{ fontWeight:700, fontSize:14, color }}>{title}</span>
              <span style={{ marginLeft:"auto", fontSize:11, color:C.gray }}>
                {level.phrases.length} phrases
              </span>
            </div>
            <div style={{ fontSize:12, color:C.gray, lineHeight:1.5 }}>{desc}</div>
          </div>
        ))}
      </Card>
    );
  }

  // ── Active test session ──────────────────────────────────────────────────
  const currentPhrase = testQueue[testIdx];
  if (!currentPhrase) return null;

  const modeLabel = testMode === "speed" ? "⚡ Speed Round" : testMode === "shadow" ? "🎭 Shadowing" : "🙈 Blind Challenge";
  const progress  = `${testIdx + 1} / ${testQueue.length}`;

  return (
    <div style={{ animation:"slideIn 0.3s ease" }}>
      {/* Header bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:15 }}>{modeLabel}</div>
          <div style={{ fontSize:11, color:C.gray, marginTop:2 }}>Phrase {progress}</div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {/* progress pips */}
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            {testQueue.map((_, i) => (
              <div key={i} style={{
                width:8, height:8, borderRadius:"50%",
                background: i < testIdx ? C.green : i === testIdx ? C.gold : "rgba(255,255,255,0.15)",
                transition:"background 0.3s",
              }}/>
            ))}
          </div>
          <Btn color={C.red} outline style={{ padding:"5px 10px", fontSize:11 }}
            onClick={() => setTestMode(null)}>
            ✕ Exit
          </Btn>
        </div>
      </div>

      <Card>
        {/* Phrase display */}
        <div style={{ background:"rgba(10,15,30,0.6)", borderRadius:10, padding:"13px 15px", marginBottom:13, border:"1px solid rgba(45,108,223,0.22)" }}>
          <div style={{ fontSize:11, color:C.gray, marginBottom:5 }}>
            {testMode === "blind" ? "Listen, then speak from memory:" : "Say this phrase:"}
          </div>

          {testMode === "blind" && !showBlind ? (
            <div style={{ textAlign:"center", padding:"18px 0" }}>
              <div style={{ fontSize:13, color:C.gray, marginBottom:10 }}>Phrase is hidden. Listen first:</div>
              <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
                <Btn color={C.cyan} onClick={() => speak(currentPhrase.text, 0.8)}>🔊 Play Phrase</Btn>
                <Btn color={C.purple} outline onClick={() => setShowBlind(true)}>👁 Reveal</Btn>
              </div>
            </div>
          ) : (
            <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>"{currentPhrase.text}"</div>
          )}

          {testMode !== "blind" && (
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              <Btn color={C.blue} style={{ fontSize:12, padding:"6px 12px" }} onClick={() => speak(currentPhrase.text)}>
                🔊 Hear It
              </Btn>
              <Btn color={C.blue} outline style={{ fontSize:12, padding:"6px 12px" }} onClick={() => speak(currentPhrase.text, 0.6)}>
                🐢 Slow
              </Btn>
            </div>
          )}
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
              transition:"all 0.3s", fontFamily:"inherit",
            }}
          >
            {isRecording ? "⏹" : "🎙"}
          </button>
          <div>
            <div style={{ fontWeight:700, fontSize:13 }}>
              {isRecording ? "🔴 Recording..." : "Tap to record"}
            </div>
            <div style={{ fontSize:11, color:C.gray }}>
              {isRecording ? "Tap again to stop" : "Speak the phrase above"}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ color:C.red, fontSize:12, marginTop:8, padding:"7px 10px", background:"rgba(239,68,68,0.08)", borderRadius:7 }}>
            ⚠️ {error}
          </div>
        )}

        {transcript && (
          <div style={{ marginTop:13 }}>
            <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>What we heard:</div>
            <div style={{ background:"rgba(45,108,223,0.1)", borderRadius:8, padding:"8px 12px", fontSize:13, border:"1px solid rgba(45,108,223,0.28)", marginBottom:11 }}>
              "{transcript}"
            </div>
            <WordDiffDisplay diffs={diffs} />

            {/* Action buttons */}
            <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn color={C.gold} onClick={() => getAI(currentPhrase, transcript, diffs)} disabled={loading}>
                {loading ? "⏳ Analyzing..." : "🤖 AI Coaching"}
              </Btn>
              <Btn color={C.green} onClick={nextTest}>
                {testIdx + 1 < testQueue.length ? "Next Phrase →" : "✅ Finish Test"}
              </Btn>
            </div>
          </div>
        )}

        {score !== null && (
          <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:13, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
            <ScoreRing score={score} />
            <div>
              <div style={{ fontWeight:700, fontSize:14 }}>Score: {score}/100</div>
              <div style={{ fontSize:12, color:C.gray }}>
                {score>=80 ? "Excellent!" : score>=60 ? "Good, keep going!" : "Practice makes perfect!"}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
