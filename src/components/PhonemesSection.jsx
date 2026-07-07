import { useState } from "react";
import { C, PHONEME_TIPS } from "../data.js";
import { Card, Btn } from "./ui.jsx";

export default function PhonemesSection({ speak }) {
  const [active, setActive] = useState(null);

  return (
    <Card>
      <h2 style={{ fontSize:16, fontWeight:700, marginBottom:5, marginTop:0 }}>🔤 Phoneme Guide</h2>
      <p style={{ fontSize:12, color:C.gray, marginBottom:16, lineHeight:1.6 }}>
        Master the sounds that trip up non-native speakers most. Tap a card to expand the full drill.
      </p>

      {PHONEME_TIPS.map((p, i) => {
        const isOpen = active === i;
        return (
          <div
            key={i}
            onClick={() => setActive(isOpen ? null : i)}
            style={{
              borderRadius:12, marginBottom:9, cursor:"pointer", overflow:"hidden",
              border: isOpen ? `1px solid ${C.blue}50` : "1px solid rgba(255,255,255,0.08)",
              background: isOpen ? "rgba(45,108,223,0.07)" : "rgba(255,255,255,0.03)",
              transition:"all 0.25s",
            }}
          >
            {/* Header row */}
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px" }}>
              <div style={{
                width:44, height:44, borderRadius:10, flexShrink:0,
                background:`${C.blue}20`, border:`1px solid ${C.blue}40`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:15, fontWeight:900, color:C.blue,
              }}>
                {p.sound}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13, marginBottom:2 }}>/{p.sound}/</div>
                <div style={{ fontSize:11, color:C.gray }}>{p.example}</div>
              </div>
              <div style={{
                fontSize:16, color:C.gray, transition:"transform 0.25s",
                transform: isOpen ? "rotate(90deg)" : "none",
              }}>▶</div>
            </div>

            {/* Expanded content */}
            {isOpen && (
              <div style={{ padding:"0 14px 14px", animation:"fadeIn 0.25s ease" }}>
                <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:12 }}/>

                <div style={{ fontSize:13, lineHeight:1.7, marginBottom:10, color:C.white }}>
                  {p.tip}
                </div>

                <div style={{
                  padding:"8px 12px", borderRadius:8,
                  background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.18)",
                  fontSize:12, color:C.gray, marginBottom:12,
                }}>
                  <span style={{ color:C.red, fontWeight:700 }}>Hardest for: </span>
                  {p.hard}
                </div>

                <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
                  <Btn color={C.blue} style={{ fontSize:12, padding:"6px 12px" }}
                    onClick={e => { e.stopPropagation(); speak(p.example.split(",")[0].trim()); }}>
                    🔊 Hear Example
                  </Btn>
                  <Btn color={C.cyan} outline style={{ fontSize:12, padding:"6px 12px" }}
                    onClick={e => { e.stopPropagation(); speak(p.example, 0.6); }}>
                    🐢 Slow
                  </Btn>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* IPA cheat sheet */}
      <div style={{ marginTop:8, padding:"12px 14px", borderRadius:12, background:"rgba(6,182,212,0.06)", border:"1px solid rgba(6,182,212,0.2)" }}>
        <div style={{ fontSize:12, color:C.cyan, fontWeight:700, marginBottom:6 }}>💡 Pro Tip: The Schwa</div>
        <div style={{ fontSize:12, color:C.gray, lineHeight:1.7 }}>
          The unstressed <strong style={{color:C.white}}>schwa /ə/</strong> is the most common sound in English and the single biggest difference between native and non-native speech.
          Every unstressed syllable tends toward "uh". Practice reducing: <em style={{color:C.white}}>about</em> → <em style={{color:C.cyan}}>uh-BOUT</em>, <em style={{color:C.white}}>banana</em> → <em style={{color:C.cyan}}>buh-NA-nuh</em>.
        </div>
      </div>
    </Card>
  );
}
