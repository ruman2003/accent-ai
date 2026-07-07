// ─── LEVELS DATA ──────────────────────────────────────────────────────────────
export const LEVELS = {
  everyday: {
    label: "Everyday English", icon: "💬", color: "#22C55E",
    phrases: [
      { id:"e1", text:"Could you please repeat that?", tip:"Stress 'please' and 'repeat'. Natural rhythm: could-you-PLEASE-re-PEAT-that.", focus:["repeat","please"] },
      { id:"e2", text:"I'd like to make a reservation.", tip:"Blend 'I'd' smoothly. Stress 'res-er-VA-tion' on third syllable.", focus:["reservation"] },
      { id:"e3", text:"What time does it close?", tip:"Rising intonation on 'close?' — it's a yes/no question.", focus:["close"] },
      { id:"e4", text:"Sorry, I didn't catch that.", tip:"Reduce 'didn't'. Soft 't' at end of 'that'.", focus:["didn't","catch"] },
      { id:"e5", text:"Can you help me with this?", tip:"Friendly upward pitch on 'this'. Link 'help-me' as one unit.", focus:["help","this"] },
      { id:"e6", text:"That sounds great, thank you!", tip:"Express enthusiasm: higher pitch on 'great'. Warm closing.", focus:["great"] },
      { id:"e7", text:"How long will it take?", tip:"Stress 'long' and 'take'. Question drops at end.", focus:["long","take"] },
      { id:"e8", text:"I'm not sure I understand.", tip:"Soft linking: 'I'm-not' and 'I-un-der-STAND'.", focus:["understand"] },
    ]
  },
  intermediate: {
    label: "Intermediate English", icon: "📈", color: "#3B82F6",
    phrases: [
      { id:"i1", text:"I was wondering if you could elaborate on that point.", tip:"Polite hedging. Stress 'e-LAB-or-ate'.", focus:["wondering","elaborate"] },
      { id:"i2", text:"That's a fair point, however I'd argue that.", tip:"Acknowledge then pivot. Pause after 'however'.", focus:["however","argue"] },
      { id:"i3", text:"The project is progressing steadily despite the challenges.", tip:"Stress nouns: 'PRO-ject', 'CHAL-len-ges'.", focus:["progressing","steadily","challenges"] },
      { id:"i4", text:"Would it be possible to reschedule our meeting?", tip:"Tentative tone: rising melody on 'possible'.", focus:["possible","reschedule"] },
      { id:"i5", text:"I appreciate your perspective on this matter.", tip:"Formal vocab: 'ap-PRE-ci-ate' and 'PER-spec-tive'.", focus:["appreciate","perspective"] },
      { id:"i6", text:"Let me clarify what I meant by that statement.", tip:"Authority phrase. Drop pitch on 'statement'.", focus:["clarify","statement"] },
    ]
  },
  advanced: {
    label: "Advanced English", icon: "🎯", color: "#8B5CF6",
    phrases: [
      { id:"a1", text:"The ramifications of this decision are far-reaching and multifaceted.", tip:"Stress: 'RAM-i-fi-CA-tions', 'mul-ti-FA-ce-ted'. Deliberate pace.", focus:["ramifications","multifaceted"] },
      { id:"a2", text:"Notwithstanding the aforementioned concerns the proposal has considerable merit.", tip:"Legal style. 'Not-with-STAND-ing'. Authoritative.", focus:["notwithstanding","aforementioned","considerable"] },
      { id:"a3", text:"It would be remiss of me not to acknowledge the inherent complexities.", tip:"'re-MISS' and 'in-HER-ent'. Formal self-awareness.", focus:["remiss","inherent","complexities"] },
      { id:"a4", text:"The empirical evidence unequivocally substantiates this hypothesis.", tip:"'un-e-QUIV-o-cal-ly' — 6 syllables. Academic precision.", focus:["empirical","unequivocally","substantiates"] },
      { id:"a5", text:"We must reconcile the dichotomy between pragmatism and idealism.", tip:"'di-CHO-to-my' and 'PRAG-ma-tism'. Thoughtful pace.", focus:["reconcile","dichotomy","pragmatism"] },
    ]
  },
  british: {
    label: "British Accent", icon: "🇬🇧", color: "#EF4444",
    phrases: [
      { id:"b1", text:"I'm absolutely knackered after that.", tip:"Received Pronunciation: broad 'a' in 'after' (AHH-fter).", focus:["absolutely","knackered"] },
      { id:"b2", text:"Shall we pop round for a spot of tea?", tip:"Classic RP: non-rhotic 'r'. 'Shall' preferred over 'Should'.", focus:["shall","spot"] },
      { id:"b3", text:"That's quite brilliant, I must say.", tip:"British understatement. 'Quite' = very (RP).", focus:["quite","brilliant"] },
      { id:"b4", text:"I reckon it'll sort itself out in due course.", tip:"Non-rhotic: 'cou-se' not 'cour-se' with hard R.", focus:["reckon","course"] },
      { id:"b5", text:"Mind the gap, please stand clear of the doors.", tip:"Crisp T's. 'Please' with genuine authority.", focus:["mind","gap","clear"] },
    ]
  },
  american: {
    label: "American Accent", icon: "🇺🇸", color: "#F59E0B",
    phrases: [
      { id:"am1", text:"I'm gonna grab a coffee, wanna come?", tip:"Rhotic R's strong. 'Gonna' and 'wanna' are natural reductions.", focus:["gonna","coffee","wanna"] },
      { id:"am2", text:"That was totally awesome, no doubt about it.", tip:"Strong stress on 'TOH-tally' and 'AWE-some'. Upbeat.", focus:["totally","awesome"] },
      { id:"am3", text:"Can I get a large latte to go, please?", tip:"Rhotic 'large'. Flap-T in 'latte' (LA-dee).", focus:["large","latte"] },
      { id:"am4", text:"I feel like we should circle back on this.", tip:"'Feel like' is very natural. Rhotic R in 'circle'.", focus:["circle","feel"] },
      { id:"am5", text:"You guys are doing a great job, honestly.", tip:"'You guys' = plural address. Enthusiastic, warm.", focus:["guys","honestly"] },
    ]
  },
  neutral: {
    label: "Neutral / Global", icon: "🌍", color: "#06B6D4",
    phrases: [
      { id:"n1", text:"Clear communication is key to understanding.", tip:"Clear vowels, no strong regional features. Every syllable distinct.", focus:["communication","understanding"] },
      { id:"n2", text:"Thank you for your time and consideration.", tip:"Professional global English. Even pace. No dropped syllables.", focus:["consideration"] },
      { id:"n3", text:"Let's work together to find the best solution.", tip:"Smooth linking. Positive rising intonation.", focus:["together","solution"] },
      { id:"n4", text:"I want to make sure we're on the same page.", tip:"Idiom: 'same page'. Neutral delivery.", focus:["sure","same"] },
    ]
  }
};

// ─── PHONEMES ─────────────────────────────────────────────────────────────────
export const PHONEME_TIPS = [
  { sound:"TH", example:"think, that, the", tip:"Tongue lightly touches upper teeth. Breathe out for 'th' in 'think', voice for 'th' in 'that'.", hard:"Most non-native speakers" },
  { sound:"R", example:"red, right, very", tip:"American R: tongue tip curled back, doesn't touch roof. British R: lighter, often silent at word end.", hard:"Spanish, French, Indian speakers" },
  { sound:"V / W", example:"vine vs wine", tip:"V: upper teeth touch lower lip, vibrate air. W: lips rounded, no teeth contact.", hard:"German, Spanish, Hindi speakers" },
  { sound:"Short I", example:"bit vs beat", tip:"Lax short 'i' — mouth more open than 'ee'. Bit ≠ beat. Ship ≠ sheep.", hard:"Spanish, Portuguese speakers" },
  { sound:"Schwa ə", example:"about, the, banana", tip:"Most common English sound! Unstressed syllables become 'uh'. 'about' = 'uh-BOUT'.", hard:"Everyone — mastering this makes speech fluent" },
  { sound:"L / N", example:"light vs night", tip:"L: tongue touches roof of mouth, air flows around sides. N: air through nose.", hard:"East Asian language speakers" },
];

// ─── DAILY CHALLENGES ─────────────────────────────────────────────────────────
export const DAILY_CHALLENGES = [
  "Record yourself ordering food at a restaurant — be natural!",
  "Read a news headline aloud 3 times, getting faster each time.",
  "Say 5 tongue twisters slowly, then at full speed.",
  "Describe your morning in 30 seconds using only simple words.",
  "Call out 10 objects around you, focusing on vowel clarity.",
  "Record a 1-minute 'daily update' as if presenting to a team.",
  "Shadow a 30-second clip — repeat exactly what you hear.",
];

// ─── BADGES ───────────────────────────────────────────────────────────────────
export const BADGES = [
  { id:"first",    label:"First Try",    icon:"🎯", desc:"Completed first recording",            condition: s => s.totalAttempts >= 1 },
  { id:"five",     label:"5 Sessions",   icon:"🔥", desc:"5 practice sessions done",             condition: s => s.totalAttempts >= 5 },
  { id:"ten",      label:"10 Sessions",  icon:"⚡", desc:"10 sessions — real momentum!",         condition: s => s.totalAttempts >= 10 },
  { id:"twenty",   label:"20 Sessions",  icon:"💪", desc:"20 sessions — you're serious!",        condition: s => s.totalAttempts >= 20 },
  { id:"improver", label:"Improver",     icon:"📈", desc:"Scored 10+ pts higher on any phrase",  condition: s => s.biggestImprovement >= 10 },
  { id:"ace",      label:"Ace",          icon:"🏆", desc:"Scored 90+ on any phrase",             condition: s => s.bestScore >= 90 },
  { id:"perfect",  label:"Perfect",      icon:"💎", desc:"Scored 100 on any phrase",             condition: s => s.bestScore >= 100 },
  { id:"consistent",label:"Consistent",  icon:"🎖️", desc:"Practiced 3 different phrases",        condition: s => s.phrasesAttempted >= 3 },
  { id:"wordsmith",label:"Wordsmith",    icon:"✨", desc:"100% word match in one attempt",       condition: s => s.perfectWordMatch >= 1 },
  { id:"streak3",  label:"3-Day Streak", icon:"💫", desc:"3 days in a row!",                     condition: s => s.streak >= 3 },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export function normalizeWord(w) { return w.toLowerCase().replace(/[^a-z']/g, ""); }

export function diffWords(targetStr, spokenStr) {
  if (!targetStr || !spokenStr) return [];
  const targetWords = targetStr.split(/\s+/).map(w => ({ raw: w, norm: normalizeWord(w) }));
  const spokenNorms = spokenStr.trim().split(/\s+/).map(w => normalizeWord(w));
  const result = [];
  let si = 0;
  for (let ti = 0; ti < targetWords.length; ti++) {
    const tw = targetWords[ti];
    if (si < spokenNorms.length && spokenNorms[si] === tw.norm) {
      result.push({ word: tw.raw, status: "correct", spoken: spokenNorms[si] }); si++;
    } else {
      const aheadIdx = spokenNorms.slice(si, si + 4).findIndex(w => w === tw.norm);
      if (aheadIdx > 0) {
        result.push({ word: tw.raw, status: "correct", spoken: spokenNorms[si + aheadIdx] }); si += aheadIdx + 1;
      } else if (si < spokenNorms.length) {
        result.push({ word: tw.raw, status: "wrong", spoken: spokenNorms[si] }); si++;
      } else {
        result.push({ word: tw.raw, status: "missing", spoken: "" });
      }
    }
  }
  return result;
}

export function getFlowPos(diffs) {
  const n = diffs.length;
  const out = { start: 0, middle: 0, end: 0 };
  diffs.forEach((w, i) => {
    if (w.status !== "correct") {
      if (i < n / 3) out.start++;
      else if (i < (n * 2) / 3) out.middle++;
      else out.end++;
    }
  });
  return out;
}

export function wordAccuracy(diffs) {
  if (!diffs || diffs.length === 0) return 0;
  return Math.round((diffs.filter(w => w.status === "correct").length / diffs.length) * 100);
}

export const ALL_PHRASES = () => Object.values(LEVELS).flatMap(l => l.phrases);
export function findPhrase(id) { return ALL_PHRASES().find(p => p.id === id); }

export const EMPTY_STATS = {
  totalAttempts: 0, bestScore: 0, biggestImprovement: 0,
  phrasesAttempted: 0, perfectWordMatch: 0, streak: 3, earnedBadges: []
};

// ─── COLORS ───────────────────────────────────────────────────────────────────
export const C = {
  navy:"#0A0F1E", blue:"#2D6CDF", gold:"#F5C518", white:"#EFF3FC",
  gray:"#8B95A8", green:"#22C55E", red:"#EF4444", purple:"#8B5CF6",
  amber:"#F59E0B", cyan:"#06B6D4"
};
