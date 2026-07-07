import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// PART 1 — CLOUD STORAGE
// ═══════════════════════════════════════════════════════════════════════════════
const store = {
  async set(key, val) {
    const s = JSON.stringify(val);
    try { if (window.storage) await window.storage.set(key, s); } catch {}
    try { localStorage.setItem(key, s); } catch {}
  },
  async get(key, fallback = null) {
    try {
      if (window.storage) {
        const r = await window.storage.get(key);
        if (r && r.value != null) return JSON.parse(r.value);
      }
    } catch {}
    try { const r = localStorage.getItem(key); if (r != null) return JSON.parse(r); } catch {}
    return fallback;
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2 — COLORS
// ═══════════════════════════════════════════════════════════════════════════════
const C = {
  navy:"#0A0F1E", blue:"#2D6CDF", gold:"#F5C518", white:"#EFF3FC",
  gray:"#8B95A8", green:"#22C55E", red:"#EF4444", purple:"#8B5CF6",
  amber:"#F59E0B", cyan:"#06B6D4",
};

// ═══════════════════════════════════════════════════════════════════════════════
// PART 3 — ALL 44 PHONEMES
// ═══════════════════════════════════════════════════════════════════════════════
const PHONEMES = {
  consonants: [
    { id:"p",  ipa:"/p/",  label:"P",   cat:"consonant", ex:"pin, cup, top",      pairs:["pin/bin","cap/cab","pat/bat"],      mouth:"Lips together, pop them apart with a puff of air. No voice.", indianErr:"Often unaspirated — add a clear air burst", drill:"Say 'Peter Piper' × 5 focusing on the puff of air each P" },
    { id:"b",  ipa:"/b/",  label:"B",   cat:"consonant", ex:"bat, rib, big",      pairs:["bat/pat","bad/pad","ban/pan"],      mouth:"Lips together, vibrate your voice as you release.", indianErr:"Sometimes devoiced to /p/ at word end", drill:"Feel your throat buzz: 'ba-ba-ba-ba-ba' × 5" },
    { id:"t",  ipa:"/t/",  label:"T",   cat:"consonant", ex:"top, cat, water",    pairs:["top/cop","tin/din","bat/bad"],      mouth:"Tongue tip touches back of upper teeth, release with puff.", indianErr:"Retroflex T (tongue curls back) instead of alveolar", drill:"'Ten tiny turtles' × 3 — tongue tip, not back" },
    { id:"d",  ipa:"/d/",  label:"D",   cat:"consonant", ex:"dog, bad, ladder",   pairs:["dog/log","dim/gym","bed/bet"],      mouth:"Tongue tip at back of upper teeth, voice on.", indianErr:"Retroflex D common — keep tongue tip forward", drill:"'Daddy did it' × 5 with voiced D" },
    { id:"k",  ipa:"/k/",  label:"K",   cat:"consonant", ex:"cat, back, king",    pairs:["cat/bat","back/bag","cap/gap"],     mouth:"Back of tongue presses roof of mouth (velum), release.", indianErr:"Sometimes too soft or unaspirated", drill:"'Kit kat kicker' × 5 — feel the back-throat plosion" },
    { id:"g",  ipa:"/g/",  label:"G",   cat:"consonant", ex:"go, big, again",     pairs:["go/cow","bag/back","got/cot"],      mouth:"Back of tongue at velum, voice on while releasing.", indianErr:"Devoiced to /k/ at word end sometimes", drill:"'Giggling goats' × 5 — feel vocal cord vibration" },
    { id:"f",  ipa:"/f/",  label:"F",   cat:"consonant", ex:"fish, off, phone",   pairs:["fish/dish","fat/vat","fine/vine"],  mouth:"Upper teeth lightly on lower lip, breathe out steadily.", indianErr:"Sometimes replaced with /ph/ (aspirated P)", drill:"Upper teeth on lip: 'fifty-five, fifty-five' × 5" },
    { id:"v",  ipa:"/v/",  label:"V",   cat:"consonant", ex:"van, love, very",    pairs:["van/ban","vine/wine","vat/fat"],    mouth:"Upper teeth on lower lip, voice ON — feel the buzz.", indianErr:"Often replaced with /w/ or /b/ — 'wery' for 'very'", drill:"'Victor's vivid van' × 5 — buzz that lower lip" },
    { id:"θ",  ipa:"/θ/",  label:"TH-f",cat:"consonant", ex:"think, bath, three", pairs:["think/sink","thick/sick","thin/tin"], mouth:"Tongue tip gently between teeth, breathe out — no voice.", indianErr:"Replaced with /t/ or /s/: 'tink' for 'think'", drill:"Tongue between teeth: 'three, thirty, thousand' × 5" },
    { id:"ð",  ipa:"/ð/",  label:"TH-v",cat:"consonant", ex:"that, breathe, this",pairs:["that/dat","them/dem","then/ten"],  mouth:"Tongue tip between teeth, VOICE ON — feel the buzz.", indianErr:"Replaced with /d/: 'dat' for 'that'", drill:"'The other day' × 5 slowly — voiced TH only" },
    { id:"s",  ipa:"/s/",  label:"S",   cat:"consonant", ex:"sit, miss, see",     pairs:["sit/zit","sip/zip","seal/zeal"],   mouth:"Tongue near roof, teeth slightly apart, hiss out air.", indianErr:"Generally good; sometimes over-sibilated", drill:"'Silly Sally sits' × 5 — crisp sharp S" },
    { id:"z",  ipa:"/z/",  label:"Z",   cat:"consonant", ex:"zoo, buzz, zone",    pairs:["zoo/sue","zap/sap","zone/sone"],   mouth:"Same as S but add voice — feel the buzz at the front.", indianErr:"Often replaced with /s/ at end of words", drill:"'Buzzing bees' × 5 — keep voice on throughout Z" },
    { id:"ʃ",  ipa:"/ʃ/",  label:"SH",  cat:"consonant", ex:"shoe, wash, fish",   pairs:["shoe/sue","ship/sip","shop/cop"],  mouth:"Lips slightly rounded, tongue raised, air rushes broadly.", indianErr:"Sometimes over-sharp — needs to be softer/broader", drill:"'She sells shoes' × 5 with lip rounding" },
    { id:"ʒ",  ipa:"/ʒ/",  label:"ZH",  cat:"consonant", ex:"measure, vision, beige",pairs:["measure/messer","vision/fission","genre/gentry"], mouth:"Like SH but with voice — the 'S' in 'treasure'.", indianErr:"Rare in Indian languages — often replaced with /dʒ/", drill:"'Treasure, measure, pleasure' × 5 slowly" },
    { id:"tʃ", ipa:"/tʃ/", label:"CH",  cat:"consonant", ex:"chip, watch, chair", pairs:["chip/ship","chin/thin","chop/shop"], mouth:"Tongue behind teeth, then release in a SH burst.", indianErr:"Usually good; watch over-aspiration", drill:"'Chuck chews cheese' × 5 — brief, explosive CH" },
    { id:"dʒ", ipa:"/dʒ/", label:"DJ",  cat:"consonant", ex:"jump, age, gem",     pairs:["jump/pump","gem/hem","age/ace"],   mouth:"Like CH but voiced — tongue behind teeth + voice.", indianErr:"Generally well-produced", drill:"'George judges justly' × 5 — voice throughout" },
    { id:"m",  ipa:"/m/",  label:"M",   cat:"consonant", ex:"man, swim, home",    pairs:["man/van","mat/bat","sum/sun"],     mouth:"Lips sealed, voice hums through the nose.", indianErr:"Good — well-produced", drill:"Humming: 'mmm-mama-mmm' × 5" },
    { id:"n",  ipa:"/n/",  label:"N",   cat:"consonant", ex:"no, ten, dinner",    pairs:["no/low","not/lot","night/light"],  mouth:"Tongue tip at roof of mouth, voice hums through nose.", indianErr:"Generally good", drill:"'Nine nice nights' × 5 — tongue tip up" },
    { id:"ŋ",  ipa:"/ŋ/",  label:"NG",  cat:"consonant", ex:"sing, ring, think",  pairs:["sing/sin","ring/rin","king/kin"],  mouth:"Back of tongue at velum, voice hums through nose. NO G sound at end.", indianErr:"Adding /g/ at end: 'sing-g' for 'sing'", drill:"'Singing, ringing, swinging' × 5 — NO final G" },
    { id:"l",  ipa:"/l/",  label:"L",   cat:"consonant", ex:"light, ball, feel",  pairs:["light/right","lack/rack","led/red"], mouth:"Tongue tip at roof of mouth, air around the sides.", indianErr:"Sometimes swapped with /r/ or too dental", drill:"'Lovely little lemon' × 5 — tongue tip up every L" },
    { id:"r",  ipa:"/r/",  label:"R",   cat:"consonant", ex:"red, very, far",     pairs:["red/led","rain/lane","right/light"], mouth:"Tongue tip curled BACK slightly, NEVER touching roof. Lips slightly rounded.", indianErr:"Rolled/trilled R — tongue must NOT trill", drill:"'Red lorry' × 5 — tongue curled back, no trill" },
    { id:"j",  ipa:"/j/",  label:"Y",   cat:"consonant", ex:"yes, you, yellow",   pairs:["yes/mess","year/ear","yell/bell"], mouth:"Tongue raised toward roof of mouth, glide into next vowel.", indianErr:"Sometimes omitted before /uː/: 'oo' for 'you'", drill:"'Yellow yo-yo' × 5 — strong Y glide" },
    { id:"w",  ipa:"/w/",  label:"W",   cat:"consonant", ex:"wet, swim, away",    pairs:["wet/vet","wine/vine","wow/vow"],   mouth:"Lips tightly rounded, then quickly open into next vowel.", indianErr:"Confused with /v/ — lips must be rounded, no teeth", drill:"'With wet willows' × 5 — lips round, no teeth" },
    { id:"h",  ipa:"/h/",  label:"H",   cat:"consonant", ex:"hat, who, ahead",    pairs:["hat/at","hill/ill","he/she"],      mouth:"Mouth open, breathe out without any friction — just air.", indianErr:"Sometimes omitted: 'e ate' for 'he ate'", drill:"'He has had' × 5 — exhale on every H" },
  ],
  monophthongs: [
    { id:"iː", ipa:"/iː/", label:"EE",  cat:"monophthong", ex:"see, feet, tea",   pairs:["feet/fit","beat/bit","sheep/ship"],   mouth:"Lips spread wide, tongue high and forward. Long sound.", indianErr:"Shortened — sounds like /ɪ/ too fast", drill:"'See the bees please' × 5 — hold the EE longer" },
    { id:"ɪ",  ipa:"/ɪ/",  label:"ih",  cat:"monophthong", ex:"bit, fish, sit",   pairs:["bit/beat","ship/sheep","fill/feel"],  mouth:"Mouth more relaxed than EE, tongue slightly lower.", indianErr:"Often over-lengthened to /iː/ — 'beet' for 'bit'", drill:"'This big ship' × 5 — shorter, lax vowel" },
    { id:"uː", ipa:"/uː/", label:"OO",  cat:"monophthong", ex:"boot, food, blue",  pairs:["boot/book","food/foot","pool/pull"],  mouth:"Lips tightly rounded, tongue high and back. Long sound.", indianErr:"Often unrounded — needs lip rounding", drill:"'Zoo, food, moon, too' × 5 — round lips fully" },
    { id:"ʊ",  ipa:"/ʊ/",  label:"uh-short",cat:"monophthong",ex:"book, put, full",pairs:["book/boot","full/fool","pull/pool"], mouth:"Lips slightly rounded, tongue high-back but relaxed.", indianErr:"Replaced with /uː/ — 'fool' for 'full'", drill:"'Put the book' × 5 — quick relaxed OO" },
    { id:"e",  ipa:"/e/",  label:"EH",  cat:"monophthong", ex:"bed, ten, egg",    pairs:["bed/bad","ten/tan","pen/pan"],        mouth:"Mouth half-open, tongue mid-front.", indianErr:"Sometimes raised to /ɪ/ — 'bin' for 'Ben'", drill:"'Ten red hens' × 5 — mouth half-open" },
    { id:"ə",  ipa:"/ə/",  label:"schwa",cat:"monophthong",ex:"about, the, banana",pairs:["about/a-bout","sofa/so-fa","butter/bot-ter"], mouth:"Most relaxed mouth position — mid central. The 'uh' sound.", indianErr:"Often stressed when it should be reduced", drill:"'about, today, banana' × 5 — every unstressed vowel → 'uh'" },
    { id:"ɜː", ipa:"/ɜː/", label:"ER",  cat:"monophthong", ex:"nurse, bird, work", pairs:["nurse/niece","bird/bad","word/ward"],  mouth:"Lips neutral, tongue mid-central, no lip rounding (in RP).", indianErr:"Often replaced with /aː/ — 'narse' for 'nurse'", drill:"'Her first birthday' × 5 — no rounding, mid tongue" },
    { id:"ɔː", ipa:"/ɔː/", label:"AW",  cat:"monophthong", ex:"thought, law, more", pairs:["thought/that","law/low","more/mow"],   mouth:"Lips rounded, tongue low-back. A long rounded AW.", indianErr:"Sometimes shortened or unrounded", drill:"'Forty-four doors' × 5 — round lips, low back tongue" },
    { id:"æ",  ipa:"/æ/",  label:"AE",  cat:"monophthong", ex:"cat, bad, man",    pairs:["cat/cut","bad/bed","man/men"],        mouth:"Jaw drops wide, tongue forward and low. Wide open.", indianErr:"Raised to /e/ — 'bed' for 'bad'", drill:"'Fat cat sat' × 5 — jaw drops, feel the stretch" },
    { id:"ʌ",  ipa:"/ʌ/",  label:"UH",  cat:"monophthong", ex:"cup, love, much",  pairs:["cup/cap","fun/fan","luck/lack"],      mouth:"Mouth half-open, tongue low-central. The 'uh-huh' sound.", indianErr:"Often replaced with /a/ or /ʊ/", drill:"'Luck, cup, sun, fun' × 5 — central low tongue" },
    { id:"ɑː", ipa:"/ɑː/", label:"AH",  cat:"monophthong", ex:"car, father, spa", pairs:["car/care","father/farther","spa/spar"],mouth:"Jaw wide open, tongue low and back. A long AH.", indianErr:"Good — similar vowel exists in Indian languages", drill:"'Far, star, bar, car' × 5 — hold the AH" },
    { id:"ɒ",  ipa:"/ɒ/",  label:"OE-short",cat:"monophthong",ex:"lot, stop, off", pairs:["lot/late","stop/step","cod/cud"],    mouth:"Lips slightly rounded, tongue low-back, jaw open.", indianErr:"Sometimes confused with /ɔː/ or /ʌ/", drill:"'Hot coffee stop' × 5 — short, round, low" },
  ],
  diphthongs: [
    { id:"eɪ", ipa:"/eɪ/", label:"AY",  cat:"diphthong", ex:"face, day, rain",   pairs:["face/farce","day/die","rain/run"],    mouth:"Start at /e/, glide up to /ɪ/. Mouth closes as you go.", indianErr:"Sometimes stays flat at /e/ — 'fes' for 'face'", drill:"'Eight, face, day, say' × 5 — feel the glide up" },
    { id:"aɪ", ipa:"/aɪ/", label:"I",   cat:"diphthong", ex:"my, time, night",   pairs:["time/team","my/me","night/neat"],     mouth:"Start with jaw wide open /a/, glide up to /ɪ/.", indianErr:"Sometimes shortened to just /a/ or /aː/", drill:"'My time, I drive' × 5 — wide open then close" },
    { id:"ɔɪ", ipa:"/ɔɪ/", label:"OY",  cat:"diphthong", ex:"boy, coin, oil",    pairs:["boy/bay","coin/cone","oil/ale"],      mouth:"Start at /ɔː/ with rounded lips, glide to /ɪ/.", indianErr:"Generally well-produced", drill:"'Royal coins, boy's toys' × 5" },
    { id:"aʊ", ipa:"/aʊ/", label:"OW",  cat:"diphthong", ex:"now, house, mouth", pairs:["now/no","house/horse","loud/lord"],   mouth:"Start wide /a/, lips round and close to /ʊ/.", indianErr:"Sometimes monophthongized to /a/ or /aː/", drill:"'Loud sound, now, how' × 5 — feel lips rounding" },
    { id:"əʊ", ipa:"/əʊ/", label:"OH",  cat:"diphthong", ex:"go, home, know",    pairs:["go/goo","home/harm","know/now"],      mouth:"Start at /ə/, lips round and glide to /ʊ/.", indianErr:"Often stays flat as /o:/ — needs rounding at end", drill:"'Go home, don't go' × 5 — round at the end" },
    { id:"ɪə", ipa:"/ɪə/", label:"EER", cat:"diphthong", ex:"ear, here, real",   pairs:["ear/air","here/hair","real/rail"],    mouth:"Start at /ɪ/, glide down to schwa /ə/.", indianErr:"Sometimes monophthongized — needs the schwa glide", drill:"'Here, ear, near, dear' × 5 — feel the glide down" },
    { id:"eə", ipa:"/eə/", label:"AIR", cat:"diphthong", ex:"air, where, care",  pairs:["air/ear","where/wear","care/core"],  mouth:"Start at /e/, glide down to schwa /ə/.", indianErr:"Often monophthongized — add the downward glide", drill:"'Where, there, care, air' × 5" },
    { id:"ʊə", ipa:"/ʊə/", label:"OOR", cat:"diphthong", ex:"sure, tour, poor",  pairs:["sure/shore","tour/tore","poor/pour"], mouth:"Start at /ʊ/ with rounded lips, glide to schwa.", indianErr:"Often merged with /ɔː/ — 'shore' for 'sure'", drill:"'Sure, cure, tour, poor' × 5 — keep the glide" },
  ],
};

const ALL_PHONEMES = [
  ...PHONEMES.consonants,
  ...PHONEMES.monophthongs,
  ...PHONEMES.diphthongs,
];

// ═══════════════════════════════════════════════════════════════════════════════
// PART 4 — LEVELS & PHRASES
// ═══════════════════════════════════════════════════════════════════════════════
const LEVELS = {
  everyday: {
    label:"Everyday English", icon:"💬", color:C.green,
    phrases:[
      { id:"e1", text:"Could you please repeat that?",    tip:"Stress 'please' and 'repeat'. Natural rhythm.", focus:["repeat","please"],   phonemes:["θ","ð","r"] },
      { id:"e2", text:"I'd like to make a reservation.",  tip:"Blend 'I'd' smoothly. Stress 'res-er-VA-tion'.",focus:["reservation"],       phonemes:["r","v","ə"] },
      { id:"e3", text:"What time does it close?",         tip:"Rising intonation on 'close?' for yes/no Q.",  focus:["close"],              phonemes:["w","t","z"] },
      { id:"e4", text:"Sorry, I didn't catch that.",      tip:"Reduce 'didn't'. Soft T at end of 'that'.",   focus:["didn't","catch"],     phonemes:["ð","tʃ","t"] },
      { id:"e5", text:"Can you help me with this?",       tip:"Link 'help-me' as one unit. Warm pitch.",      focus:["help","this"],        phonemes:["θ","ɪ","w"] },
      { id:"e6", text:"That sounds great, thank you!",    tip:"Higher pitch on 'great'. Express enthusiasm.", focus:["great"],              phonemes:["θ","ð","eɪ"] },
      { id:"e7", text:"How long will it take?",           tip:"Stress 'long' and 'take'. Falls at end.",      focus:["long","take"],        phonemes:["ŋ","l","eɪ"] },
      { id:"e8", text:"I'm not sure I understand.",       tip:"Soft linking 'I'm-not' and 'I-un-der-STAND'.",focus:["understand"],         phonemes:["ə","n","æ"] },
    ]
  },
  intermediate: {
    label:"Intermediate English", icon:"📈", color:C.blue,
    phrases:[
      { id:"i1", text:"I was wondering if you could elaborate on that point.", tip:"Stress 'e-LAB-or-ate'. Polite hedging.", focus:["wondering","elaborate"], phonemes:["w","v","ð","r"] },
      { id:"i2", text:"That's a fair point, however I'd argue that.",          tip:"Pause after 'however'. Acknowledge then pivot.", focus:["however","argue"], phonemes:["ð","θ","ɑː"] },
      { id:"i3", text:"The project is progressing steadily despite the challenges.", tip:"Stress nouns: PRO-ject, CHAL-len-ges.", focus:["progressing","steadily","challenges"], phonemes:["ð","θ","tʃ","ə"] },
      { id:"i4", text:"Would it be possible to reschedule our meeting?",       tip:"Tentative tone, rising melody on 'possible'.", focus:["possible","reschedule"], phonemes:["w","r","ʒ","ə"] },
      { id:"i5", text:"I appreciate your perspective on this matter.",         tip:"ap-PRE-ci-ate and PER-spec-tive.", focus:["appreciate","perspective"], phonemes:["ə","θ","p","v"] },
      { id:"i6", text:"Let me clarify what I meant by that statement.",        tip:"Authority phrase. Drop pitch on 'statement'.", focus:["clarify","statement"], phonemes:["θ","ð","eɪ","t"] },
    ]
  },
  advanced: {
    label:"Advanced English", icon:"🎯", color:C.purple,
    phrases:[
      { id:"a1", text:"The ramifications of this decision are far-reaching and multifaceted.", tip:"Stress: RAM-i-fi-CA-tions, mul-ti-FA-ce-ted. Deliberate pace.", focus:["ramifications","multifaceted"], phonemes:["r","ð","θ","æ"] },
      { id:"a2", text:"Notwithstanding the aforementioned concerns the proposal has considerable merit.", tip:"Legal style. Not-with-STAND-ing. Authoritative.", focus:["notwithstanding","aforementioned","considerable"], phonemes:["θ","ð","w","ə"] },
      { id:"a3", text:"It would be remiss of me not to acknowledge the inherent complexities.", tip:"re-MISS and in-HER-ent. Formal self-awareness.", focus:["remiss","inherent","complexities"], phonemes:["r","ɪ","ŋ","θ"] },
      { id:"a4", text:"The empirical evidence unequivocally substantiates this hypothesis.", tip:"un-e-QUIV-o-cal-ly — 6 syllables. Academic precision.", focus:["empirical","unequivocally","substantiates"], phonemes:["v","θ","ɪ","ə"] },
      { id:"a5", text:"We must reconcile the dichotomy between pragmatism and idealism.", tip:"di-CHO-to-my and PRAG-ma-tism. Thoughtful pace.", focus:["reconcile","dichotomy","pragmatism"], phonemes:["θ","ð","r","l"] },
    ]
  },
  british: {
    label:"British Accent", icon:"🇬🇧", color:C.red,
    phrases:[
      { id:"b1", text:"I'm absolutely knackered after that.",            tip:"Broad 'a' in 'after' (AHH-fter). RP style.", focus:["absolutely","knackered"], phonemes:["ɑː","θ","ə"] },
      { id:"b2", text:"Shall we pop round for a spot of tea?",          tip:"Non-rhotic R. 'Shall' preferred over 'Should'.", focus:["shall","spot"], phonemes:["ʃ","r","ɒ"] },
      { id:"b3", text:"That's quite brilliant, I must say.",            tip:"'Quite' = very in RP. British understatement.", focus:["quite","brilliant"], phonemes:["θ","ð","aɪ","r"] },
      { id:"b4", text:"I reckon it'll sort itself out in due course.",  tip:"Non-rhotic. 'cou-se' not 'cour-se' with hard R.", focus:["reckon","course"], phonemes:["r","ɔː","ə"] },
      { id:"b5", text:"Mind the gap, please stand clear of the doors.", tip:"Crisp T's. 'Please' with genuine authority.", focus:["mind","gap","clear"], phonemes:["θ","ð","ɪə"] },
    ]
  },
  american: {
    label:"American Accent", icon:"🇺🇸", color:C.amber,
    phrases:[
      { id:"am1", text:"I'm gonna grab a coffee, wanna come?",           tip:"Rhotic R's. 'Gonna' and 'wanna' are natural reductions.", focus:["gonna","coffee","wanna"], phonemes:["r","ə","æ"] },
      { id:"am2", text:"That was totally awesome, no doubt about it.",   tip:"Strong stress TOH-tally and AWE-some. Upbeat.", focus:["totally","awesome"], phonemes:["θ","ð","aʊ"] },
      { id:"am3", text:"Can I get a large latte to go, please?",         tip:"Rhotic 'large'. Flap-T in 'latte' (LA-dee).", focus:["large","latte"], phonemes:["r","æ","t"] },
      { id:"am4", text:"I feel like we should circle back on this.",     tip:"'Feel like' natural. Rhotic R in 'circle'.", focus:["circle","feel"], phonemes:["r","l","θ","ɪ"] },
      { id:"am5", text:"You guys are doing a great job, honestly.",      tip:"'You guys' = plural. Enthusiastic, warm.", focus:["guys","honestly"], phonemes:["θ","ɑː","eɪ"] },
    ]
  },
  neutral: {
    label:"Neutral / Global", icon:"🌍", color:C.cyan,
    phrases:[
      { id:"n1", text:"Clear communication is key to understanding.",    tip:"Clear vowels, every syllable distinct.", focus:["communication","understanding"], phonemes:["k","l","ŋ","ə"] },
      { id:"n2", text:"Thank you for your time and consideration.",      tip:"Professional global English. No dropped syllables.", focus:["consideration"], phonemes:["θ","ŋ","ə"] },
      { id:"n3", text:"Let's work together to find the best solution.",  tip:"Smooth linking. Positive rising intonation.", focus:["together","solution"], phonemes:["ð","θ","l","ʒ"] },
      { id:"n4", text:"I want to make sure we're on the same page.",    tip:"Idiom: 'same page'. Neutral delivery.", focus:["sure","same"], phonemes:["ʃ","eɪ","r"] },
    ]
  }
};

const ALL_PHRASES = () => Object.values(LEVELS).flatMap(l => l.phrases);
const findPhrase  = id => ALL_PHRASES().find(p => p.id === id);

// ═══════════════════════════════════════════════════════════════════════════════
// PART 5 — BADGES
// ═══════════════════════════════════════════════════════════════════════════════
const BADGES = [
  { id:"first",     label:"First Try",    icon:"🎯", desc:"Completed first recording",           cond: s => s.totalAttempts >= 1 },
  { id:"five",      label:"5 Sessions",   icon:"🔥", desc:"5 practice sessions done",            cond: s => s.totalAttempts >= 5 },
  { id:"ten",       label:"10 Sessions",  icon:"⚡", desc:"10 sessions — real momentum!",        cond: s => s.totalAttempts >= 10 },
  { id:"twenty",    label:"20 Sessions",  icon:"💪", desc:"20 sessions — you're serious!",       cond: s => s.totalAttempts >= 20 },
  { id:"improver",  label:"Improver",     icon:"📈", desc:"Scored 10+ pts higher on any phrase", cond: s => s.biggestImprovement >= 10 },
  { id:"ace",       label:"Ace",          icon:"🏆", desc:"Scored 90+ on any phrase",            cond: s => s.bestScore >= 90 },
  { id:"perfect",   label:"Perfect",      icon:"💎", desc:"Scored 100 on any phrase",            cond: s => s.bestScore >= 100 },
  { id:"consistent",label:"Consistent",   icon:"🎖️", desc:"Practiced 3 different phrases",       cond: s => s.phrasesAttempted >= 3 },
  { id:"wordsmith", label:"Wordsmith",    icon:"✨", desc:"100% word match in one attempt",      cond: s => s.perfectWordMatch >= 1 },
  { id:"streak3",   label:"3-Day Streak", icon:"💫", desc:"Quality sessions 3 days in a row!",   cond: s => s.streak >= 3 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PART 6 — DAILY CHALLENGES
// ═══════════════════════════════════════════════════════════════════════════════
const DAILY_CHALLENGES = [
  "Record yourself ordering food at a restaurant — be natural!",
  "Read a news headline aloud 3× — faster each time.",
  "Say 5 tongue twisters slowly, then at full speed.",
  "Describe your morning in 30 seconds with simple words.",
  "Call out 10 objects around you, focus on vowel clarity.",
  "Record a 1-minute 'daily update' as if presenting to a team.",
  "Shadow a 30-second clip — repeat exactly what you hear.",
];

const TWISTERS = [
  "She sells seashells by the seashore.",
  "Peter Piper picked a peck of pickled peppers.",
  "How much wood would a woodchuck chuck?",
  "Red lorry, yellow lorry.",
  "Unique New York, unique New York.",
  "Toy boat, toy boat, toy boat.",
  "Rubber baby buggy bumpers.",
];

const DIAG_WORDS = [
  { word:"think",  phoneme:"θ",  ipa:"/θ/" },
  { word:"very",   phoneme:"v",  ipa:"/v/" },
  { word:"that",   phoneme:"ð",  ipa:"/ð/" },
  { word:"sit",    phoneme:"ɪ",  ipa:"/ɪ/" },
  { word:"cat",    phoneme:"æ",  ipa:"/æ/" },
  { word:"cup",    phoneme:"ʌ",  ipa:"/ʌ/" },
  { word:"sing",   phoneme:"ŋ",  ipa:"/ŋ/" },
  { word:"chip",   phoneme:"tʃ", ipa:"/tʃ/" },
  { word:"nurse",  phoneme:"ɜː", ipa:"/ɜː/" },
  { word:"face",   phoneme:"eɪ", ipa:"/eɪ/" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PART 7 — HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const normW = w => w.toLowerCase().replace(/[^a-z']/g, "");


function diffWords(target, spoken) {
  if (!target || !spoken) return [];
  const tw = target.split(/\s+/).map(w => ({ raw:w, norm:normW(w) }));
  const sw = spoken.trim().split(/\s+/).map(w => normW(w));
  const res = []; let si = 0;
  for (let ti = 0; ti < tw.length; ti++) {
    const t = tw[ti];
    if (si < sw.length && sw[si] === t.norm) {
      res.push({ word:t.raw, status:"correct", spoken:sw[si] }); si++;
    } else {
      const ai = sw.slice(si, si+4).findIndex(w => w === t.norm);
      if (ai > 0) { res.push({ word:t.raw, status:"correct", spoken:sw[si+ai] }); si += ai+1; }
      else if (si < sw.length) { res.push({ word:t.raw, status:"wrong", spoken:sw[si] }); si++; }
      else res.push({ word:t.raw, status:"missing", spoken:"" });
    }
  }
  return res;
}

const getFlow = diffs => {
  const n = diffs.length; const out = { start:0, middle:0, end:0 };
  diffs.forEach((w,i) => {
    if (w.status !== "correct") {
      if (i < n/3) out.start++;
      else if (i < (n*2)/3) out.middle++;
      else out.end++;
    }
  });
  return out;
};

const wordAcc = diffs => {
  if (!diffs?.length) return 0;
  return Math.round(diffs.filter(w => w.status === "correct").length / diffs.length * 100);
};

const todayStr = () => new Date().toISOString().slice(0,10);

const srDays = score => score >= 95 ? 14 : score >= 80 ? 7 : score >= 60 ? 3 : 1;

const srDue = (srMap, id) => {
  const item = srMap?.[id]; if (!item) return false;
  // SM-2 object format: { nextReview, reps, interval, ease }
  // Legacy string format: "2024-01-01"
  const next = typeof item === 'object' ? item.nextReview : item;
  return next <= todayStr();
};

const masteryScore = progress => {
  const entries = Object.entries(progress).filter(([,v]) => v.length > 0);
  if (!entries.length) return 0;
  let wSum = 0, wTot = 0;
  entries.forEach(([,arr]) => {
    const best = Math.max(...arr.map(a => a.score));
    const w    = arr.length;
    wSum += best * w; wTot += w;
  });
  return wTot ? Math.round(wSum / wTot) : 0;
};

// Phoneme-level mastery map (uses errorBank + progress together)
const phonemeMastery = (progress, errorBank) => {
  const map = {};
  ALL_PHRASES().forEach(p => {
    const h = progress[p.id] || [];
    if (!h.length) return;
    const best = Math.max(...h.map(a => a.score));
    (p.phonemes || []).forEach(pid => {
      if (!map[pid]) map[pid] = { scores:[], errors:0 };
      map[pid].scores.push(best);
      map[pid].errors += (errorBank[pid]?.count || 0);
    });
  });
  const result = {};
  Object.entries(map).forEach(([pid, d]) => {
    result[pid] = Math.round(d.scores.reduce((a,b) => a+b,0) / d.scores.length);
  });
  return result;
};

// ── SM-2 Spaced Repetition Algorithm ──────────────────────────────────────────
// quality: 0=total fail, 3=hard pass, 4=good, 5=perfect
const sm2Update = (item = { reps:0, interval:1, ease:2.5 }, quality) => {
  let { reps, interval, ease } = item;
  if (quality < 3) {
    reps = 0; interval = 1;
  } else {
    reps += 1;
    if (reps === 1)      interval = 1;
    else if (reps === 2) interval = 3;
    else if (reps === 3) interval = 7;
    else                 interval = Math.round(interval * ease);
    ease = Math.max(1.3, ease + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  }
  const nextReview = new Date(Date.now() + interval * 86400000).toISOString().slice(0, 10);
  return { reps, interval, ease, nextReview };
};

// Convert 0-100 score to SM-2 quality 0-5
const scoreToQuality = score => score >= 95 ? 5 : score >= 80 ? 4 : score >= 60 ? 3 : score >= 40 ? 2 : score >= 20 ? 1 : 0;

// ── Minimal Pairs (Indian-English critical pairs) ─────────────────────────────
const MINIMAL_PAIRS = [
  { id:'mp1', a:{ word:'think', ipa:'/θ/' }, b:{ word:'tink',  ipa:'/t/'  }, phonemes:['θ'],    priority:'critical' },
  { id:'mp2', a:{ word:'that',  ipa:'/ð/' }, b:{ word:'dat',   ipa:'/d/'  }, phonemes:['ð'],    priority:'critical' },
  { id:'mp3', a:{ word:'ship',  ipa:'/ʃ/' }, b:{ word:'chip',  ipa:'/tʃ/' }, phonemes:['ʃ','tʃ'], priority:'critical' },
  { id:'mp4', a:{ word:'sheep', ipa:'/iː/'},  b:{ word:'ship',  ipa:'/ɪ/'  }, phonemes:['iː','ɪ'], priority:'high' },
  { id:'mp5', a:{ word:'cat',   ipa:'/æ/' }, b:{ word:'cut',   ipa:'/ʌ/'  }, phonemes:['æ','ʌ'], priority:'high' },
  { id:'mp6', a:{ word:'bed',   ipa:'/e/'  }, b:{ word:'bad',   ipa:'/æ/'  }, phonemes:['e','æ'], priority:'high' },
  { id:'mp7', a:{ word:'sing',  ipa:'/ŋ/'  }, b:{ word:'sin',   ipa:'/n/'  }, phonemes:['ŋ'],    priority:'medium' },
  { id:'mp8', a:{ word:'very',  ipa:'/v/'  }, b:{ word:'berry', ipa:'/b/'  }, phonemes:['v'],    priority:'high' },
  { id:'mp9', a:{ word:'van',   ipa:'/v/'  }, b:{ word:'ban',   ipa:'/b/'  }, phonemes:['v'],    priority:'high' },
  { id:'mp10',a:{ word:'rice',  ipa:'/r/'  }, b:{ word:'lice',  ipa:'/l/'  }, phonemes:['r','l'], priority:'medium' },
];

// ── Simple confetti burst (pure CSS, no lib) ──────────────────────────────────
const CONFETTI_COLORS = ['#F5C518','#22C55E','#8B5CF6','#06B6D4','#EF4444','#F59E0B'];
function makeConfetti() {
  return Array.from({length:30}, (_,i) => ({
    id:i, color:CONFETTI_COLORS[i%CONFETTI_COLORS.length],
    x: 10 + Math.random()*80, delay: Math.random()*0.6,
    size: 6 + Math.random()*8, rot: Math.random()*360,
  }));
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 8 — SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── WaveVisualizer ──────────────────────────────────────────────────────────
function WaveVisualizer({ isRecording, analyserRef }) {
  const cvs = useRef(null); const anim = useRef(null);
  useEffect(() => {
    const canvas = cvs.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const draw = () => {
      anim.current = requestAnimationFrame(draw);
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0,0,W,H);
      if (isRecording && analyserRef.current) {
        const buf = analyserRef.current.frequencyBinCount;
        const data = new Uint8Array(buf); analyserRef.current.getByteTimeDomainData(data);
        ctx.beginPath();
        const sw = W/buf; let x = 0;
        for (let i=0; i<buf; i++) {
          const y = (data[i]/128.0*H)/2;
          i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y); x+=sw;
        }
        ctx.strokeStyle="#F5C518"; ctx.lineWidth=2.5;
        ctx.shadowBlur=12; ctx.shadowColor="#F5C518"; ctx.stroke();
      } else {
        const t = Date.now()/1000;
        ctx.beginPath();
        for (let x=0; x<=W; x++) {
          const y = H/2 + Math.sin((x/W)*Math.PI*4+t*1.5)*6;
          x===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
        }
        ctx.strokeStyle="rgba(45,108,223,0.4)"; ctx.lineWidth=1.5; ctx.shadowBlur=0; ctx.stroke();
      }
    };
    draw();
    return () => cancelAnimationFrame(anim.current);
  }, [isRecording, analyserRef]);
  return <canvas ref={cvs} width={480} height={56} style={{ width:"100%",height:56,borderRadius:8,background:"rgba(10,15,30,0.6)",display:"block" }}/>;
}

// ── WordDiffDisplay ─────────────────────────────────────────────────────────
function WordDiffDisplay({ diffs }) {
  if (!diffs?.length) return null;
  const acc   = wordAcc(diffs);
  const flow  = getFlow(diffs);
  const total = flow.start + flow.middle + flow.end;
  const mx    = Math.max(flow.start, flow.middle, flow.end, 1);
  const sCol  = { correct:C.green, wrong:C.red, missing:C.amber };
  const sBg   = { correct:"rgba(34,197,94,0.12)", wrong:"rgba(239,68,68,0.15)", missing:"rgba(245,158,11,0.12)" };
  const sMk   = { correct:"✓", wrong:"✗", missing:"?" };
  const Bar   = ({ val, label, color }) => (
    <div style={{ flex:1, textAlign:"center" }}>
      <div style={{ height:44, background:"rgba(255,255,255,0.05)", borderRadius:6, display:"flex", alignItems:"flex-end", overflow:"hidden", marginBottom:4 }}>
        <div style={{ width:"100%", height:`${Math.max((val/mx)*100, val>0?12:4)}%`, background:val>0?color:"rgba(255,255,255,0.06)", borderRadius:"4px 4px 0 0", transition:"height 0.5s ease" }}/>
      </div>
      <div style={{ fontSize:10, color:C.gray }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:700, color:val>0?color:C.gray }}>{val} err</div>
    </div>
  );
  return (
    <div style={{ marginTop:12 }}>
      <div style={{ fontSize:11, color:C.gray, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>Word-by-Word Analysis</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
        {diffs.map((w,i) => (
          <div key={i} style={{ padding:"4px 9px", borderRadius:6, fontSize:12, fontWeight:600, background:sBg[w.status], color:sCol[w.status], border:`1px solid ${sCol[w.status]}40`, display:"flex", flexDirection:"column", alignItems:"center", gap:1 }}>
            <span>{w.word}</span>
            <span style={{ fontSize:9 }}>{sMk[w.status]}{w.status==="wrong"&&w.spoken?` "${w.spoken}`:""}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
        <div style={{ flex:1, height:7, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
          <div style={{ width:`${acc}%`, height:"100%", background:acc>=80?C.green:acc>=60?C.amber:C.red, borderRadius:4, transition:"width 0.6s ease" }}/>
        </div>
        <div style={{ fontSize:13, fontWeight:700, color:acc>=80?C.green:acc>=60?C.amber:C.red, minWidth:44 }}>{acc}% words</div>
      </div>
      <div style={{ fontSize:11, color:C.gray, marginBottom:10 }}>{diffs.filter(w=>w.status==="correct").length} of {diffs.length} words matched</div>
      <div style={{ fontSize:11, color:C.gray, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>Where Errors Happened</div>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <Bar val={flow.start}  label="Start"  color={C.red}    />
        <Bar val={flow.middle} label="Middle" color={C.amber}  />
        <Bar val={flow.end}    label="End"    color={C.purple} />
      </div>
      {total > 0
        ? <div style={{ padding:"9px 12px", background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:8, fontSize:12, lineHeight:1.7 }}>
            <span style={{ color:C.red, fontWeight:700 }}>Flow: </span>
            {flow.start  >0 && <span>Errors at <strong style={{color:C.red}}>Start</strong> — hesitation. </span>}
            {flow.middle >0 && <span>Errors in <strong style={{color:C.amber}}>Middle</strong> — pace drop. </span>}
            {flow.end    >0 && <span>Errors at <strong style={{color:C.purple}}>End</strong> — trailing off.</span>}
          </div>
        : <div style={{ padding:"9px 12px", background:"rgba(34,197,94,0.08)", border:"1px solid rgba(34,197,94,0.2)", borderRadius:8, fontSize:12, color:C.green, fontWeight:600 }}>✨ Perfect flow — no positional errors!</div>
      }
    </div>
  );
}

// ── SparkLine ───────────────────────────────────────────────────────────────
function SparkLine({ history }) {
  if (!history || history.length < 2) return null;
  const pts = history.slice(-10);
  const W=320, H=72, px=16, py=8, iW=W-px*2, iH=H-py*2;
  const points = pts.map((h,i) => ({ x:px+(i/(pts.length-1))*iW, y:py+iH-(h.score/100)*iH }));
  const pathD  = points.map((p,i) => `${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const trend  = pts[pts.length-1].score - pts[0].score;
  return (
    <div style={{ marginTop:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
        <span style={{ fontSize:11, color:C.gray }}>Score trend ({pts.length} attempts)</span>
        <span style={{ fontSize:12, fontWeight:700, color:trend>=0?C.green:C.red }}>{trend>=0?"▲":"▼"} {Math.abs(trend)} pts</span>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ background:"rgba(10,15,30,0.5)", borderRadius:8, display:"block" }}>
        {[25,50,75].map(v=><line key={v} x1={px} x2={W-px} y1={py+iH-(v/100)*iH} y2={py+iH-(v/100)*iH} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>)}
        <path d={`${pathD} L${points[points.length-1].x},${H-py} L${points[0].x},${H-py} Z`} fill="rgba(45,108,223,0.1)"/>
        <path d={pathD} fill="none" stroke={C.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {points.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="3.5" fill={pts[i].score>=80?C.green:pts[i].score>=60?C.amber:C.red} stroke={C.navy} strokeWidth="1.5"/>)}
      </svg>
    </div>
  );
}

// ── ConfidenceBar ───────────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  const cfg = value>=80?{label:"High Confidence",color:C.green}:value>=50?{label:"Building Up",color:C.amber}:{label:"Keep Practicing",color:C.blue};
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
        <span style={{ fontSize:11, color:C.gray }}>Confidence</span>
        <span style={{ fontSize:11, fontWeight:700, color:cfg.color }}>{cfg.label} · {value}%</span>
      </div>
      <div style={{ height:8, background:"rgba(255,255,255,0.08)", borderRadius:4, overflow:"hidden" }}>
        <div style={{ width:`${value}%`, height:"100%", background:`linear-gradient(90deg,${cfg.color}99,${cfg.color})`, borderRadius:4, transition:"width 0.8s ease" }}/>
      </div>
    </div>
  );
}

// ── Card & Tag helpers ──────────────────────────────────────────────────────
const Card = ({ children, style={} }) => (
  <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:15, marginBottom:13, ...style }}>{children}</div>
);
const Tag = ({ color, children }) => (
  <span style={{ display:"inline-block", background:color+"20", color, borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, marginBottom:5 }}>{children}</span>
);
const Btn = ({ color, outline, onClick, disabled, children, style={} }) => (
  <button onClick={onClick} disabled={disabled} style={{ padding:"9px 16px", borderRadius:10, border:outline?`2px solid ${color}`:"none", background:outline?"transparent":color, color:outline?color:"#0A0F1E", fontWeight:700, fontSize:13, cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.6:1, transition:"all 0.2s", display:"inline-flex", alignItems:"center", gap:6, fontFamily:"inherit", ...style }}>{children}</button>
);
const Pill = ({ color, children, style={} }) => (
  <span style={{ background:color+"20", border:`1px solid ${color}50`, color, borderRadius:20, padding:"3px 9px", fontSize:11, fontWeight:600, ...style }}>{children}</span>
);
const FbPanel = ({ color, children, style={} }) => (
  <div style={{ background:"rgba(10,15,30,0.7)", borderRadius:10, padding:"11px 13px", border:`1px solid ${color}30`, marginBottom:9, ...style }}>{children}</div>
);
const ScoreRing = ({ score }) => {
  const col = score>=80?C.green:score>=60?C.amber:C.red;
  return (
    <div style={{ width:64, height:64, borderRadius:"50%", background:`conic-gradient(${col} ${score}%, rgba(255,255,255,0.08) 0)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
      <div style={{ background:C.navy, width:48, height:48, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:800, color:col }}>{score}</div>
    </div>
  );
};

// ── Confetti Overlay ────────────────────────────────────────────────────────
function ConfettiOverlay({ message, onDone }) {
  const pieces = useMemo(() => makeConfetti(), []);
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:1000, overflow:"hidden" }}>
      <style>{`
        @keyframes confFall{0%{transform:translateY(-10px) rotate(var(--r));opacity:1}100%{transform:translateY(110vh) rotate(calc(var(--r) + 720deg));opacity:0}}
        @keyframes masteryPop{0%{transform:scale(0.5) translateY(40px);opacity:0}50%{transform:scale(1.1) translateY(-8px)}100%{transform:scale(1) translateY(0);opacity:1}}
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{ position:"absolute", left:`${p.x}%`, top:"-20px", width:p.size, height:p.size, background:p.color, borderRadius:p.id%3===0?"50%":2, "--r":`${p.rot}deg`, animation:`confFall 2.5s ${p.delay}s ease-in forwards` }}/>
      ))}
      {message && (
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", textAlign:"center", animation:"masteryPop 0.5s ease forwards" }}>
          <div style={{ background:"rgba(13,24,41,0.96)", border:`2px solid ${C.gold}`, borderRadius:18, padding:"18px 32px", boxShadow:`0 0 40px ${C.gold}50` }}>
            <div style={{ fontSize:36, marginBottom:8 }}>🎉</div>
            <div style={{ fontSize:16, fontWeight:800, color:C.gold }}>{message}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Phoneme Mastery Map ─────────────────────────────────────────────────────
function PhonemeMasteryMap({ progress, errorBank, onDrillPhoneme }) {
  const pMap = useMemo(() => phonemeMastery(progress, errorBank), [progress, errorBank]);
  const colForScore = s => s === undefined ? C.gray : s >= 75 ? C.green : s >= 50 ? C.amber : C.red;
  const bgForScore  = s => s === undefined ? "rgba(255,255,255,0.04)" : s >= 75 ? `${C.green}18` : s >= 50 ? `${C.amber}18` : `${C.red}18`;

  const Section = ({ title, items }) => (
    <div style={{ marginBottom:16 }}>
      <div style={{ fontSize:11, color:C.gray, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:7 }}>{title}</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
        {items.map(p => {
          const s = pMap[p.id];
          const errs = errorBank?.[p.id];
          return (
            <div key={p.id} onClick={() => onDrillPhoneme?.(p.id)} style={{ padding:"7px 10px", borderRadius:9, cursor:"pointer", minWidth:58, textAlign:"center", background:bgForScore(s), border:`1px solid ${colForScore(s)}40`, transition:"all 0.2s", position:"relative" }}>
              {errs && errs.count >= 3 && <div style={{ position:"absolute", top:-4, right:-4, width:12, height:12, borderRadius:"50%", background:C.red, fontSize:8, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800 }}>!</div>}
              <div style={{ fontSize:12, fontWeight:800, color:colForScore(s) }}>{p.ipa}</div>
              <div style={{ fontSize:9, color:C.gray, marginTop:2 }}>{s !== undefined ? `${s}%` : "—"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ padding:"14px", borderRadius:14, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", marginBottom:13 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <h2 style={{ fontSize:14, fontWeight:700, margin:0 }}>🗺️ Phoneme Mastery Map</h2>
        <div style={{ display:"flex", gap:8, fontSize:10, color:C.gray }}>
          <span style={{ color:C.green }}>● ≥75%</span>
          <span style={{ color:C.amber }}>● 50–74%</span>
          <span style={{ color:C.red }}>● &lt;50%</span>
          <span>● untested</span>
        </div>
      </div>
      <Section title="Consonants" items={PHONEMES.consonants} />
      <Section title="Monophthongs" items={PHONEMES.monophthongs} />
      <Section title="Diphthongs" items={PHONEMES.diphthongs} />
      <div style={{ fontSize:11, color:C.gray, marginTop:8 }}>Tap any card to drill that phoneme · <span style={{ color:C.red }}>!</span> = recurring error (3+ failures)</div>
    </div>
  );
}

// ── Minimal Pairs Section ───────────────────────────────────────────────────
function MinimalPairsSection({ speak, progress }) {
  const [active,   setActive]   = useState(null);
  const [heard,    setHeard]    = useState(null); // 'a' or 'b'
  const [round,    setRound]    = useState(0);
  const [results,  setResults]  = useState([]);
  const [gameOver, setGameOver] = useState(false);

  const pair = MINIMAL_PAIRS[round % MINIMAL_PAIRS.length];

  const playRandom = useCallback(() => {
    const which = Math.random() < 0.5 ? 'a' : 'b';
    setHeard(which);
    speak(pair[which].word, 0.75);
  }, [pair, speak]);

  const guess = (g) => {
    const correct = g === heard;
    const newRes  = [...results, { pair, guess:g, correct, heard }];
    setResults(newRes);
    if (round + 1 >= MINIMAL_PAIRS.length) { setGameOver(true); return; }
    setRound(r => r + 1);
    setHeard(null);
    setActive(null);
  };

  const accuracy = results.length ? Math.round(results.filter(r => r.correct).length / results.length * 100) : 0;

  if (gameOver) return (
    <div style={{ textAlign:"center", padding:"24px 20px" }}>
      <div style={{ fontSize:44, marginBottom:12 }}>{accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👍" : "💪"}</div>
      <div style={{ fontSize:18, fontWeight:800, color:accuracy>=80?C.green:accuracy>=60?C.amber:C.red, marginBottom:8 }}>{accuracy}% Listening Accuracy</div>
      <div style={{ fontSize:13, color:C.gray, marginBottom:20 }}>You distinguished {results.filter(r=>r.correct).length} of {results.length} minimal pairs</div>
      <div style={{ marginBottom:16 }}>
        {results.map((r,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 10px", borderRadius:7, background:r.correct?`${C.green}10`:`${C.red}10`, border:`1px solid ${r.correct?C.green:C.red}30`, marginBottom:5, fontSize:12 }}>
            <span>{r.pair.a.word} vs {r.pair.b.word}</span>
            <span style={{ color:r.correct?C.green:C.red }}>{r.correct?"✓ Correct":"✗ "+`Heard ${r.pair[r.heard].word}, guessed ${r.pair[r.guess].word}`}</span>
          </div>
        ))}
      </div>
      <Btn color={C.blue} onClick={() => { setRound(0); setResults([]); setGameOver(false); setHeard(null); }}>Try Again</Btn>
    </div>
  );

  return (
    <div>
      <div style={{ fontSize:11, color:C.gray, marginBottom:16, lineHeight:1.7 }}>
        🎧 <strong style={{color:C.white}}>Ear Training first.</strong> Listen to the TTS, then tap which word you heard. Research shows ear must be trained before mouth.
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12, alignItems:"center" }}>
        <span style={{ fontSize:11, color:C.gray }}>Pair {round+1} of {MINIMAL_PAIRS.length}</span>
        <span style={{ fontSize:11, fontWeight:700, color:pair.priority==='critical'?C.red:pair.priority==='high'?C.amber:C.cyan }}>{pair.priority.toUpperCase()} priority</span>
      </div>

      <div style={{ textAlign:"center", padding:"20px 0 16px" }}>
        <div style={{ fontSize:13, color:C.gray, marginBottom:14 }}>Which word did you hear?</div>
        <Btn color={C.blue} style={{ marginBottom:16, padding:"11px 28px" }} onClick={playRandom}>🔊 Play Word</Btn>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          {['a','b'].map(k => (
            <button key={k} onClick={() => { if (heard !== null) guess(k); }} style={{ flex:1, maxWidth:160, padding:"16px 12px", borderRadius:12, border:`2px solid ${active===k?C.blue:"rgba(255,255,255,0.15)"}`, background:active===k?`${C.blue}20`:"rgba(255,255,255,0.04)", color:C.white, cursor:heard===null?"not-allowed":"pointer", opacity:heard===null?0.5:1, fontFamily:"inherit", transition:"all 0.2s" }} onMouseEnter={()=>setActive(k)} onMouseLeave={()=>setActive(null)}>
              <div style={{ fontSize:18, fontWeight:900 }}>{pair[k].word}</div>
              <div style={{ fontSize:11, color:C.gray, marginTop:4 }}>{pair[k].ipa}</div>
            </button>
          ))}
        </div>
        {heard === null && <div style={{ fontSize:11, color:C.amber, marginTop:12 }}>← Press Play first, then choose</div>}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop:8, padding:"8px 12px", borderRadius:8, background:"rgba(255,255,255,0.03)", fontSize:12, color:C.gray }}>
          Session: {results.filter(r=>r.correct).length}/{results.length} correct ({accuracy}%)
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 9 — SECTION COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

// ── Diagnostic Overlay ──────────────────────────────────────────────────────
function DiagnosticOverlay({ speak, onComplete, onSkip }) {
  const [idx, setIdx]         = useState(0);
  const [ratings, setRatings] = useState({});
  const [done, setDone]       = useState(false);

  const current = DIAG_WORDS[idx];

  const rate = (val) => {
    const r = { ...ratings, [current.phoneme]: val };
    setRatings(r);
    if (idx + 1 >= DIAG_WORDS.length) {
      // Build profile
      const weak   = Object.entries(r).filter(([,v]) => v === "needs").map(([k]) => k).slice(0,3);
      const strong = Object.entries(r).filter(([,v]) => v === "good").map(([k]) => k).slice(0,2);
      setDone(true);
      setTimeout(() => onComplete({ weak, strong, ratings: r }), 1200);
    } else {
      setIdx(idx + 1);
    }
  };

  if (done) return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,15,30,0.97)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:999 }}>
      <div style={{ fontSize:52 }}>🎉</div>
      <div style={{ fontSize:18, fontWeight:800, marginTop:12, color:C.gold }}>Accent Profile Ready!</div>
      <div style={{ fontSize:13, color:C.gray, marginTop:6 }}>Building your personalised plan…</div>
    </div>
  );

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,15,30,0.97)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:999, padding:20 }}>
      <div style={{ maxWidth:420, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:12, color:C.gold, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>Accent Diagnostic — Word {idx+1} of {DIAG_WORDS.length}</div>
        <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:28, overflow:"hidden" }}>
          <div style={{ width:`${((idx)/DIAG_WORDS.length)*100}%`, height:"100%", background:C.gold, borderRadius:2, transition:"width 0.4s ease" }}/>
        </div>
        <div style={{ fontSize:11, color:C.gray, marginBottom:10 }}>Phoneme: <span style={{ color:C.cyan, fontWeight:700 }}>{current.ipa}</span></div>
        <div style={{ fontSize:72, fontWeight:900, letterSpacing:"-2px", color:C.white, marginBottom:20 }}>{current.word}</div>
        <Btn color={C.blue} style={{ marginBottom:20, padding:"10px 22px" }} onClick={() => speak(current.word)}>
          🔊 Hear it
        </Btn>
        <div style={{ fontSize:13, color:C.gray, marginBottom:20 }}>Now say the word yourself. How did it feel?</div>
        <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
          <button onClick={() => rate("good")} style={{ flex:1, padding:"14px", borderRadius:12, border:`2px solid ${C.green}`, background:`${C.green}15`, color:C.green, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✓ Sounded right</button>
          <button onClick={() => rate("needs")} style={{ flex:1, padding:"14px", borderRadius:12, border:`2px solid ${C.red}`, background:`${C.red}15`, color:C.red, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>✗ Needs work</button>
        </div>
        <button onClick={onSkip} style={{ marginTop:20, background:"transparent", border:"none", color:C.gray, fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>Skip diagnostic</button>
      </div>
    </div>
  );
}

// ── Session Summary Modal ───────────────────────────────────────────────────
function SessionModal({ attempts, avgScore, topPhoneme, onKeepGoing, onViewProgress }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,15,30,0.88)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:990, padding:20 }}>
      <div style={{ background:"rgba(13,24,41,0.98)", border:"1px solid rgba(245,197,24,0.3)", borderRadius:18, padding:28, maxWidth:380, width:"100%", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:10 }}>🎖️</div>
        <div style={{ fontSize:18, fontWeight:800, color:C.gold, marginBottom:6 }}>Session Milestone!</div>
        <div style={{ fontSize:13, color:C.gray, marginBottom:20 }}>{attempts} phrases practiced this session</div>
        <div style={{ display:"flex", gap:9, marginBottom:20 }}>
          {[{l:"Avg Score",v:avgScore,c:avgScore>=80?C.green:avgScore>=60?C.amber:C.red},{l:"Attempts",v:attempts,c:C.blue}].map((s,i)=>(
            <div key={i} style={{ flex:1, background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px" }}>
              <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
              <div style={{ fontSize:10, color:C.gray }}>{s.l}</div>
            </div>
          ))}
        </div>
        {topPhoneme && <div style={{ fontSize:13, color:C.amber, marginBottom:20 }}>⚠️ Focus on <strong>/{topPhoneme}/</strong> this session</div>}
        <div style={{ display:"flex", gap:9 }}>
          <Btn color={C.blue} style={{ flex:1 }} onClick={onKeepGoing}>Keep Going 💪</Btn>
          <Btn color={C.green} outline style={{ flex:1 }} onClick={onViewProgress}>View Progress</Btn>
        </div>
      </div>
    </div>
  );
}

// ── Practice Section ────────────────────────────────────────────────────────
function PracticeSection({ activeTab, selectedPhrase, setSelected, isRecording, transcript, diffs, score, aiFeedback, loading, error, startRecording, stopRecording, analyserRef, progress, srMap, getAI, speak, phraseHistory, confidence, speed, setSpeed }) {
  const level = LEVELS[activeTab];
  const speeds = [{ label:"0.5×", val:0.5 }, { label:"0.75×", val:0.75 }, { label:"1×", val:1 }];

  return (
    <>
      <Card>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:11, marginTop:0 }}>Choose a Phrase</h2>
        {level.phrases.map(p => {
          const h = progress[p.id] || [];
          const avg = h.length ? Math.round(h.reduce((a,x)=>a+x.score,0)/h.length) : null;
          const due = srDue(srMap, p.id);
          const sel = selectedPhrase?.id === p.id;
          return (
            <div key={p.id} onClick={() => setSelected(p)} style={{ padding:"11px 13px", borderRadius:10, cursor:"pointer", border:sel?`2px solid ${level.color}`:"1px solid rgba(255,255,255,0.08)", background:sel?level.color+"15":"rgba(255,255,255,0.03)", marginBottom:6, transition:"all 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div style={{ fontSize:13, fontWeight:600, flex:1, lineHeight:1.4 }}>{p.text}</div>
                <div style={{ display:"flex", gap:5, flexShrink:0, marginLeft:8, flexWrap:"wrap", justifyContent:"flex-end" }}>
                  {due && <span style={{ fontSize:10, fontWeight:700, color:"#fff", background:C.red, borderRadius:5, padding:"1px 6px" }}>📅 DUE</span>}
                  {avg!==null && <span style={{ fontSize:11, fontWeight:700, color:avg>=80?C.green:avg>=60?C.amber:C.red, background:avg>=80?`${C.green}15`:avg>=60?`${C.amber}15`:`${C.red}15`, borderRadius:5, padding:"1px 6px" }}>avg {avg}</span>}
                </div>
              </div>
              {sel && <div style={{ fontSize:12, color:C.gray, marginTop:5, lineHeight:1.5 }}>💡 {p.tip}</div>}
              {h.length>0 && <div style={{ fontSize:10, color:C.gray, marginTop:3 }}>{h.length} attempt{h.length>1?"s":""} · last: {h[h.length-1].score}pts</div>}
            </div>
          );
        })}
      </Card>

      {selectedPhrase && (
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
            <h2 style={{ fontSize:15, fontWeight:700, marginBottom:0, marginTop:0 }}>🎙️ Record</h2>
            <span style={{ fontSize:11, color:C.gray }}>{phraseHistory.length} attempt{phraseHistory.length!==1?"s":""}</span>
          </div>
          {phraseHistory.length > 0 && <ConfidenceBar value={confidence} />}

          <div style={{ background:"rgba(10,15,30,0.6)", borderRadius:10, padding:"11px 13px", marginBottom:11, border:"1px solid rgba(45,108,223,0.22)" }}>
            <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>Target phrase:</div>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:11 }}>"{selectedPhrase.text}"</div>
            {/* Speed buttons */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:11, color:C.gray }}>Speed:</span>
              {speeds.map(s => (
                <button key={s.val} onClick={() => setSpeed(s.val)} style={{ padding:"5px 11px", borderRadius:7, border:speed===s.val?`2px solid ${C.blue}`:"1px solid rgba(255,255,255,0.15)", background:speed===s.val?`${C.blue}20`:"transparent", color:speed===s.val?C.white:C.gray, fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>{s.label}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}>
              <Btn color={C.blue} style={{ fontSize:12, padding:"7px 13px" }} onClick={() => speak(selectedPhrase.text, speed)}>🔊 Hear It</Btn>
              <Btn color={C.blue} outline style={{ fontSize:12, padding:"7px 13px" }} onClick={() => speak(selectedPhrase.text, 0.5)}>🐢 Very Slow</Btn>
            </div>
          </div>

          <WaveVisualizer isRecording={isRecording} analyserRef={analyserRef} />

          <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:12 }}>
            <button onClick={isRecording ? stopRecording : startRecording} style={{ width:58, height:58, borderRadius:"50%", border:"none", cursor:"pointer", background:isRecording?"linear-gradient(135deg,#EF4444,#DC2626)":"linear-gradient(135deg,#2D6CDF,#1D4ED8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:isRecording?"0 0 22px rgba(239,68,68,0.6)":"0 0 14px rgba(45,108,223,0.4)", animation:isRecording?"pulse 1s infinite":"none", transition:"all 0.3s", fontFamily:"inherit" }}>
              {isRecording ? "⏹" : "🎙"}
            </button>
            <div>
              <div style={{ fontWeight:700, fontSize:13 }}>{isRecording ? "🔴 Recording — speak clearly" : "Tap to start recording"}</div>
              <div style={{ fontSize:11, color:C.gray }}>{isRecording ? "Tap again to stop" : "Say the phrase shown above"}</div>
            </div>
          </div>

          {error && <div style={{ color:C.red, fontSize:12, marginTop:8, padding:"7px 10px", background:"rgba(239,68,68,0.08)", borderRadius:7 }}>⚠️ {error}</div>}

          {transcript && (
            <div style={{ marginTop:13 }}>
              <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>What we heard:</div>
              <div style={{ background:"rgba(45,108,223,0.1)", borderRadius:8, padding:"8px 12px", fontSize:13, border:"1px solid rgba(45,108,223,0.28)", marginBottom:11 }}>"{transcript}"</div>
              <WordDiffDisplay diffs={diffs} />
              <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap", alignItems:"center" }}>
                <Btn color={C.gold} onClick={() => getAI(selectedPhrase, transcript, diffs)} disabled={loading}>
                  {loading ? "⏳ AI Analyzing…" : "🤖 Get AI Coaching"}
                </Btn>
              </div>
            </div>
          )}

          {score !== null && (
            <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:13, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}>
              <ScoreRing score={score} />
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>Score: {score}/100</div>
                <div style={{ fontSize:12, color:C.gray }}>{score>=80?"Excellent — near native!":score>=60?"Good — keep refining!":"Every rep improves it!"}</div>
              </div>
            </div>
          )}

          {aiFeedback && !aiFeedback.offline && (
            <div style={{ marginTop:13 }}>
              <FbPanel color={C.green}>
                <Tag color={C.green}>OVERALL</Tag>
                <div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.overall}</div>
                <div style={{ fontSize:12, color:C.green, marginTop:5 }}>✓ {aiFeedback.wellDone}</div>
              </FbPanel>
              {aiFeedback.phonemeErrors?.length > 0 && (
                <FbPanel color={C.red}>
                  <Tag color={C.red}>PHONEME ERRORS</Tag>
                  {aiFeedback.phonemeErrors.map((e,i) => (
                    <div key={i} style={{ marginBottom:9, paddingBottom:9, borderBottom:i<aiFeedback.phonemeErrors.length-1?"1px solid rgba(239,68,68,0.15)":"none" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3, flexWrap:"wrap" }}>
                        <span style={{ fontWeight:800, color:C.red, fontSize:14 }}>"{e.word}"</span>
                        <span style={{ fontSize:10, color:"#fff", background:C.red+"99", borderRadius:4, padding:"1px 5px" }}>{e.type}</span>
                        <span style={{ fontSize:11, color:C.gray }}>{e.phoneme} → heard as {e.heardAs}</span>
                      </div>
                      <div style={{ fontSize:13, color:C.white, paddingLeft:4 }}>→ {e.fix}</div>
                    </div>
                  ))}
                </FbPanel>
              )}
              {aiFeedback.flowNote && <FbPanel color={C.amber}><Tag color={C.amber}>FLOW</Tag><div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.flowNote}</div></FbPanel>}
              {aiFeedback.drills?.length > 0 && (
                <FbPanel color={C.purple}>
                  <Tag color={C.purple}>MICRO-DRILLS (10s each)</Tag>
                  {aiFeedback.drills.map((d,i) => <div key={i} style={{ fontSize:13, padding:"3px 0", display:"flex", gap:8 }}><span style={{ color:C.purple, fontWeight:800, flexShrink:0 }}>{i+1}.</span><span style={{ lineHeight:1.6 }}>{d}</span></div>)}
                </FbPanel>
              )}
              <div style={{ display:"flex", gap:9, flexWrap:"wrap" }}>
                {aiFeedback.nativeTip && <FbPanel color={C.cyan} style={{ flex:1, display:"flex", gap:9, marginBottom:0 }}><span style={{ fontSize:20 }}>💡</span><div><Tag color={C.cyan}>NATIVE TIP</Tag><div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.nativeTip}</div></div></FbPanel>}
                {aiFeedback.nextFocus && <FbPanel color={C.gold} style={{ flex:1, display:"flex", gap:9, marginBottom:0 }}><span style={{ fontSize:20 }}>🎯</span><div><Tag color={C.gold}>NEXT FOCUS</Tag><div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.nextFocus}</div></div></FbPanel>}
              </div>
            </div>
          )}
          {aiFeedback?.offline && <FbPanel color={C.gold} style={{ marginTop:12 }}><Tag color={C.gold}>OFFLINE TIP</Tag><div style={{ fontSize:13, lineHeight:1.6 }}>{aiFeedback.nativeTip}</div></FbPanel>}
          {phraseHistory.length >= 2 && <SparkLine history={phraseHistory} />}
        </Card>
      )}
    </>
  );
}

// ── Test Section ────────────────────────────────────────────────────────────
function TestSection({ activeTab, testMode, testQueue, testIdx, isRecording, transcript, diffs, score, loading, error, showBlind, setShowBlind, startTest, nextTest, startRecording, stopRecording, analyserRef, getAI, speak, setTestMode }) {
  const level = LEVELS[activeTab];
  if (!testMode) return (
    <Card>
      <h2 style={{ fontSize:15, fontWeight:700, marginBottom:5, marginTop:0 }}>🧪 Test Modes</h2>
      <p style={{ fontSize:12, color:C.gray, marginBottom:16, lineHeight:1.6 }}>Challenge yourself with structured formats. All phrases from current level.</p>
      {[
        { mode:"speed",  icon:"⚡", title:"Rapid Fire",    desc:"Race through all phrases. Quick scoring, no drills. Builds speed.",   color:C.amber },
        { mode:"shadow", icon:"🎭", title:"Shadow Mode",   desc:"Hear each phrase first, then repeat. Build muscle memory fast.",       color:C.cyan  },
        { mode:"blind",  icon:"🙈", title:"Blind Challenge",desc:"Phrase hidden. Listen to TTS then speak from memory. Ultimate test!", color:C.purple },
      ].map(({ mode, icon, title, desc, color }) => (
        <div key={mode} onClick={() => startTest(mode)} style={{ padding:"14px 16px", borderRadius:12, marginBottom:9, cursor:"pointer", border:`1px solid ${color}30`, background:`${color}08`, transition:"all 0.2s" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
            <span style={{ fontSize:22 }}>{icon}</span>
            <span style={{ fontWeight:700, fontSize:14, color }}>{title}</span>
            <span style={{ marginLeft:"auto", fontSize:11, color:C.gray }}>{level.phrases.length} phrases</span>
          </div>
          <div style={{ fontSize:12, color:C.gray, lineHeight:1.5 }}>{desc}</div>
        </div>
      ))}
    </Card>
  );
  const cur = testQueue[testIdx]; if (!cur) return null;
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:13 }}>
        <div><div style={{ fontWeight:800, fontSize:15 }}>{testMode==="speed"?"⚡ Rapid Fire":testMode==="shadow"?"🎭 Shadow Mode":"🙈 Blind Challenge"}</div><div style={{ fontSize:11, color:C.gray, marginTop:2 }}>Phrase {testIdx+1}/{testQueue.length}</div></div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <div style={{ display:"flex", gap:4 }}>{testQueue.map((_,i)=><div key={i} style={{ width:8, height:8, borderRadius:"50%", background:i<testIdx?C.green:i===testIdx?C.gold:"rgba(255,255,255,0.15)" }}/>)}</div>
          <Btn color={C.red} outline style={{ padding:"5px 10px", fontSize:11 }} onClick={() => setTestMode(null)}>✕ Exit</Btn>
        </div>
      </div>
      <Card>
        <div style={{ background:"rgba(10,15,30,0.6)", borderRadius:10, padding:"13px 15px", marginBottom:13, border:"1px solid rgba(45,108,223,0.22)" }}>
          {testMode==="blind"&&!showBlind
            ? <div style={{ textAlign:"center", padding:"18px 0" }}>
                <div style={{ fontSize:13, color:C.gray, marginBottom:10 }}>Phrase hidden. Listen first:</div>
                <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                  <Btn color={C.cyan} onClick={() => speak(cur.text, 0.8)}>🔊 Play</Btn>
                  <Btn color={C.purple} outline onClick={() => setShowBlind(true)}>👁 Reveal</Btn>
                </div>
              </div>
            : <div style={{ fontSize:15, fontWeight:700, marginBottom:10 }}>"{cur.text}"</div>
          }
          {testMode!=="blind" && <div style={{ display:"flex", gap:7, flexWrap:"wrap" }}><Btn color={C.blue} style={{ fontSize:12, padding:"6px 12px" }} onClick={() => speak(cur.text)}>🔊 Hear</Btn><Btn color={C.blue} outline style={{ fontSize:12, padding:"6px 12px" }} onClick={() => speak(cur.text,0.6)}>🐢 Slow</Btn></div>}
        </div>
        <WaveVisualizer isRecording={isRecording} analyserRef={analyserRef} />
        <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:12 }}>
          <button onClick={isRecording?stopRecording:startRecording} style={{ width:58, height:58, borderRadius:"50%", border:"none", cursor:"pointer", background:isRecording?"linear-gradient(135deg,#EF4444,#DC2626)":"linear-gradient(135deg,#2D6CDF,#1D4ED8)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, boxShadow:isRecording?"0 0 22px rgba(239,68,68,0.6)":"0 0 14px rgba(45,108,223,0.4)", animation:isRecording?"pulse 1s infinite":"none", transition:"all 0.3s", fontFamily:"inherit" }}>{isRecording?"⏹":"🎙"}</button>
          <div><div style={{ fontWeight:700, fontSize:13 }}>{isRecording?"🔴 Recording…":"Tap to record"}</div><div style={{ fontSize:11, color:C.gray }}>{isRecording?"Tap again to stop":"Speak the phrase"}</div></div>
        </div>
        {error && <div style={{ color:C.red, fontSize:12, marginTop:8, padding:"7px 10px", background:"rgba(239,68,68,0.08)", borderRadius:7 }}>⚠️ {error}</div>}
        {transcript && (
          <div style={{ marginTop:13 }}>
            <div style={{ background:"rgba(45,108,223,0.1)", borderRadius:8, padding:"8px 12px", fontSize:13, border:"1px solid rgba(45,108,223,0.28)", marginBottom:11 }}>"{transcript}"</div>
            <WordDiffDisplay diffs={diffs} />
            <div style={{ marginTop:12, display:"flex", gap:8, flexWrap:"wrap" }}>
              <Btn color={C.gold} onClick={() => getAI(cur, transcript, diffs)} disabled={loading}>{loading?"⏳…":"🤖 AI Coaching"}</Btn>
              <Btn color={C.green} onClick={nextTest}>{testIdx+1<testQueue.length?"Next →":"✅ Finish"}</Btn>
            </div>
          </div>
        )}
        {score !== null && <div style={{ display:"flex", alignItems:"center", gap:13, marginTop:13, padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:10 }}><ScoreRing score={score} /><div><div style={{ fontWeight:700, fontSize:14 }}>Score: {score}/100</div><div style={{ fontSize:12, color:C.gray }}>{score>=80?"Excellent!":score>=60?"Good, keep going!":"Practice makes perfect!"}</div></div></div>}
      </Card>
    </div>
  );
}

// ── Phoneme Drills Section ──────────────────────────────────────────────────
function PhonemeDrillsSection({ speak, errorBank }) {
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [active, setActive]   = useState(null);

  const cats = [{ id:"all",label:"All 44" },{ id:"consonant",label:"Consonants (24)" },{ id:"monophthong",label:"Vowels (12)" },{ id:"diphthong",label:"Diphthongs (8)" }];
  const shown = ALL_PHONEMES.filter(p =>
    (filter==="all"||p.cat===filter) &&
    (search===""||p.ipa.toLowerCase().includes(search)||p.label.toLowerCase().includes(search)||p.ex.toLowerCase().includes(search))
  );

  return (
    <div>
      <Card>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:11, marginTop:0 }}>🔬 Phoneme Drills</h2>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search phonemes…" style={{ width:"100%", padding:"8px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.05)", color:C.white, fontSize:12, outline:"none", marginBottom:10, fontFamily:"inherit" }}/>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {cats.map(c => <button key={c.id} onClick={()=>setFilter(c.id)} style={{ padding:"5px 11px", borderRadius:7, border:filter===c.id?`2px solid ${C.blue}`:"1px solid rgba(255,255,255,0.12)", background:filter===c.id?`${C.blue}20`:"transparent", color:filter===c.id?C.white:C.gray, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>{c.label}</button>)}
        </div>
      </Card>
      {shown.map(p => {
        const isOpen = active === p.id;
        const errs   = errorBank?.[p.id];
        return (
          <div key={p.id} onClick={()=>setActive(isOpen?null:p.id)} style={{ borderRadius:12, marginBottom:8, cursor:"pointer", overflow:"hidden", border:isOpen?`1px solid ${C.blue}50`:"1px solid rgba(255,255,255,0.08)", background:isOpen?`${C.blue}07`:"rgba(255,255,255,0.03)", transition:"all 0.25s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px" }}>
              <div style={{ width:44, height:44, borderRadius:10, flexShrink:0, background:`${C.blue}20`, border:`1px solid ${C.blue}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:C.blue }}>{p.ipa}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{p.label} <span style={{ color:C.gray, fontWeight:400, fontSize:11 }}>· {p.cat}</span></div>
                <div style={{ fontSize:11, color:C.gray }}>{p.ex}</div>
              </div>
              {errs && <span style={{ fontSize:10, color:C.red, background:`${C.red}20`, borderRadius:5, padding:"2px 6px", fontWeight:700 }}>{errs.count} errors</span>}
              <div style={{ fontSize:14, color:C.gray, transition:"transform 0.25s", transform:isOpen?"rotate(90deg)":"none" }}>▶</div>
            </div>
            {isOpen && (
              <div style={{ padding:"0 14px 14px" }}>
                <div style={{ height:1, background:"rgba(255,255,255,0.07)", marginBottom:12 }}/>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:10 }}>
                  {p.pairs.map((pair,i) => <span key={i} style={{ fontSize:12, background:"rgba(255,255,255,0.06)", borderRadius:6, padding:"3px 9px", color:C.white }}>{pair}</span>)}
                </div>
                <div style={{ fontSize:12, color:C.gray, marginBottom:8, lineHeight:1.7 }}><strong style={{color:C.white}}>Mouth position: </strong>{p.mouth}</div>
                <div style={{ padding:"8px 12px", borderRadius:8, background:`${C.red}08`, border:`1px solid ${C.red}20`, fontSize:12, color:C.gray, marginBottom:10 }}><span style={{color:C.red,fontWeight:700}}>Indian-English error: </span>{p.indianErr}</div>
                <div style={{ padding:"8px 12px", borderRadius:8, background:`${C.purple}08`, border:`1px solid ${C.purple}20`, fontSize:12, marginBottom:12 }}><span style={{color:C.purple,fontWeight:700}}>10s Drill: </span>{p.drill}</div>
                {errs && <div style={{ fontSize:12, color:C.amber, marginBottom:10 }}>⚠️ You've made <strong>{errs.count}</strong> errors on: {errs.words?.join(", ")}</div>}
                <div style={{ display:"flex", gap:7 }}>
                  <Btn color={C.blue} style={{ fontSize:12, padding:"6px 12px" }} onClick={e=>{e.stopPropagation();speak(p.ex.split(",")[0].trim());}}>🔊 Hear</Btn>
                  <Btn color={C.cyan} outline style={{ fontSize:12, padding:"6px 12px" }} onClick={e=>{e.stopPropagation();speak(p.ex,0.6);}}>🐢 Slow</Btn>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Error Bank Section ──────────────────────────────────────────────────────
function ErrorBankSection({ errorBank, speak, setSection }) {
  const sorted = Object.entries(errorBank||{}).sort((a,b)=>b[1].count-a[1].count).slice(0,5);
  if (!sorted.length) return <Card><div style={{ textAlign:"center", padding:"24px 0", color:C.gray }}><div style={{ fontSize:32, marginBottom:10 }}>✨</div><div style={{ fontSize:14, fontWeight:600, color:C.white, marginBottom:6 }}>No errors tracked yet</div><div style={{ fontSize:12 }}>Complete practice sessions to track your phoneme errors here.</div></div></Card>;
  return (
    <div>
      <Card style={{ background:`${C.red}08`, border:`1px solid ${C.red}20` }}>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:5, marginTop:0 }}>⚠️ Error Bank</h2>
        <p style={{ fontSize:12, color:C.gray, marginBottom:0 }}>Top recurring phoneme errors across all your practice sessions.</p>
      </Card>
      {sorted.map(([pid, data], i) => {
        const ph = ALL_PHONEMES.find(p => p.id === pid);
        if (!ph) return null;
        return (
          <Card key={pid} style={i===0?{ border:`2px solid ${C.red}40` }:{}}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ width:44, height:44, borderRadius:10, background:`${C.red}20`, border:`1px solid ${C.red}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:900, color:C.red }}>{ph.ipa}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:13 }}>{ph.label} {i===0&&<span style={{ fontSize:10, color:"#fff", background:C.red, borderRadius:4, padding:"1px 6px", marginLeft:5 }}>#1 Most Frequent</span>}</div>
                <div style={{ fontSize:11, color:C.gray }}>{data.count} errors · last: {data.last}</div>
              </div>
              <div style={{ fontSize:22, fontWeight:800, color:C.red }}>{data.count}</div>
            </div>
            <div style={{ fontSize:12, color:C.gray, marginBottom:8 }}>Happened in words: <span style={{ color:C.white }}>{data.words?.join(", ")}</span></div>
            <div style={{ padding:"8px 11px", borderRadius:8, background:`${C.purple}08`, border:`1px solid ${C.purple}20`, fontSize:12, marginBottom:10 }}><span style={{color:C.purple,fontWeight:700}}>Fix drill: </span>{ph.drill}</div>
            <div style={{ display:"flex", gap:7 }}>
              <Btn color={C.blue} style={{ fontSize:11, padding:"5px 10px" }} onClick={() => speak(ph.ex.split(",")[0].trim())}>🔊 Hear</Btn>
              <Btn color={C.purple} outline style={{ fontSize:11, padding:"5px 10px" }} onClick={() => setSection("phonemes")}>→ Full Drill</Btn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// ── Progress Section ────────────────────────────────────────────────────────
function ProgressSection({ progress, stats, accentProfile, errorBank, setSection }) {
  const entries   = Object.entries(progress).filter(([,v]) => v.length > 0);
  const byPhrase  = entries.map(([id,arr]) => ({ id, avg:Math.round(arr.reduce((a,h)=>a+h.score,0)/arr.length), attempts:arr.length, phrase:findPhrase(id), history:arr }));
  const weak      = [...byPhrase].sort((a,b)=>a.avg-b.avg).slice(0,3).filter(x=>x.phrase);
  const strong    = [...byPhrase].sort((a,b)=>b.avg-a.avg).slice(0,2).filter(x=>x.phrase);
  const mastery   = masteryScore(progress);
  const earned    = stats.earnedBadges || [];
  const goToPhonemes = () => setSection?.('phonemes');

  return (
    <>
      {/* Phoneme Mastery Map — always visible */}
      <PhonemeMasteryMap progress={progress} errorBank={errorBank} onDrillPhoneme={goToPhonemes} />

      {accentProfile && (
        <Card style={{ background:`${C.gold}08`, border:`1px solid ${C.gold}30` }}>
          <div style={{ fontSize:11, color:C.gold, fontWeight:700, marginBottom:8 }}>🧬 YOUR ACCENT PROFILE</div>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <div style={{ flex:1 }}><div style={{ fontSize:11, color:C.gray, marginBottom:5 }}>⚠️ Weak phonemes</div>{(accentProfile.weak||[]).map(pid => { const ph=ALL_PHONEMES.find(p=>p.id===pid); return ph?<Pill key={pid} color={C.red} style={{marginRight:4,marginBottom:4}}>{ph.ipa}</Pill>:null; })}</div>
            <div style={{ flex:1 }}><div style={{ fontSize:11, color:C.gray, marginBottom:5 }}>✅ Strong phonemes</div>{(accentProfile.strong||[]).map(pid => { const ph=ALL_PHONEMES.find(p=>p.id===pid); return ph?<Pill key={pid} color={C.green} style={{marginRight:4,marginBottom:4}}>{ph.ipa}</Pill>:null; })}</div>
          </div>
        </Card>
      )}

      {/* 1B fix: show first-run CTA instead of dead zeros */}
      {stats.totalAttempts === 0
        ? (
          <Card style={{ background:`${C.blue}08`, border:`2px dashed ${C.blue}40`, textAlign:"center", padding:"28px 20px" }}>
            <div style={{ fontSize:44, marginBottom:12 }}>🎙️</div>
            <h2 style={{ fontSize:18, fontWeight:800, marginTop:0, marginBottom:8, color:C.white }}>Ready to start your journey?</h2>
            <p style={{ fontSize:13, color:C.gray, lineHeight:1.7, marginBottom:18, maxWidth:360, margin:"0 auto 18px" }}>
              Your stats will appear here after your first practice session.<br/>
              Head to <strong style={{color:C.gold}}>Practice</strong> → pick a phrase → hit record!
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
              <div style={{ padding:"10px 16px", borderRadius:10, background:`${C.blue}20`, border:`1px solid ${C.blue}40`, fontSize:12, color:C.white }}>
                <div style={{ fontSize:20, marginBottom:4 }}>1️⃣</div>Pick any phrase
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:`${C.green}20`, border:`1px solid ${C.green}40`, fontSize:12, color:C.white }}>
                <div style={{ fontSize:20, marginBottom:4 }}>2️⃣</div>Tap 🎙 and speak
              </div>
              <div style={{ padding:"10px 16px", borderRadius:10, background:`${C.gold}20`, border:`1px solid ${C.gold}40`, fontSize:12, color:C.white }}>
                <div style={{ fontSize:20, marginBottom:4 }}>3️⃣</div>Get AI coaching
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <h2 style={{ fontSize:15, fontWeight:700, marginBottom:13, marginTop:0 }}>📊 Global Stats</h2>
            <div style={{ display:"flex", gap:9, flexWrap:"wrap", marginBottom:13 }}>
              {[{l:"Attempts",v:stats.totalAttempts,c:C.blue},{l:"Best Score",v:stats.bestScore,c:C.green},{l:"🏆 Mastery",v:mastery,c:C.gold},{l:"Phrases",v:stats.phrasesAttempted,c:C.purple}].map((s,i)=>(
                <div key={i} style={{ flex:1, minWidth:80, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 11px", textAlign:"center" }}>
                  <div style={{ fontSize:20, fontWeight:800, color:s.c }}>{s.v}</div>
                  <div style={{ fontSize:10, color:C.gray, marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:9 }}>
              <div style={{ flex:1, background:`${C.gold}10`, border:`1px solid ${C.gold}30`, borderRadius:10, padding:"10px 13px" }}>
                <div style={{ fontSize:11, color:C.gray, marginBottom:3 }}>🔥 Streak</div>
                <div style={{ fontSize:20, fontWeight:800, color:C.gold }}>{stats.streak||0} days</div>
                {stats.qualifiedToday && <div style={{ fontSize:10, color:C.green, marginTop:3 }}>✓ Qualified today</div>}
                {!stats.qualifiedToday && <div style={{ fontSize:10, color:C.amber, marginTop:3 }}>Need 3 phrases or score 70+</div>}
              </div>
              <div style={{ flex:1, background:`${C.purple}10`, border:`1px solid ${C.purple}30`, borderRadius:10, padding:"10px 13px" }}>
                <div style={{ fontSize:11, color:C.gray, marginBottom:3 }}>📈 Best Improvement</div>
                <div style={{ fontSize:20, fontWeight:800, color:C.purple }}>+{stats.biggestImprovement||0}pts</div>
              </div>
            </div>
          </Card>
        )
      }

      <Card>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:13, marginTop:0 }}>🏅 Badges</h2>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {BADGES.map(b => {
            const e = earned.includes(b.id);
            return <div key={b.id} style={{ padding:"8px 12px", borderRadius:10, background:e?`${C.gold}15`:"rgba(255,255,255,0.03)", border:e?`1px solid ${C.gold}40`:"1px solid rgba(255,255,255,0.07)", opacity:e?1:0.45, textAlign:"center", minWidth:80 }}><div style={{ fontSize:22 }}>{b.icon}</div><div style={{ fontSize:11, fontWeight:700, color:e?C.gold:C.gray, marginTop:3 }}>{b.label}</div><div style={{ fontSize:10, color:C.gray, marginTop:2, lineHeight:1.3 }}>{b.desc}</div></div>;
          })}
        </div>
      </Card>

      {(weak.length > 0 || strong.length > 0) && (
        <Card>
          <h2 style={{ fontSize:15, fontWeight:700, marginBottom:13, marginTop:0 }}>🔍 Phrase Analysis</h2>
          {weak.length>0 && <><div style={{ fontSize:12, color:C.red, fontWeight:700, marginBottom:8, textTransform:"uppercase" }}>⚠️ Needs Work</div>{weak.map(p=><div key={p.id} style={{ padding:"10px 12px", borderRadius:10, background:`${C.red}06`, border:`1px solid ${C.red}15`, marginBottom:7 }}><div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}><div style={{ fontSize:13, fontWeight:600, flex:1 }}>"{p.phrase.text}"</div><span style={{ fontSize:12, fontWeight:700, color:C.red, background:`${C.red}15`, borderRadius:5, padding:"2px 7px" }}>avg {p.avg}</span></div><div style={{ height:5, background:"rgba(255,255,255,0.06)", borderRadius:3, overflow:"hidden", marginTop:7 }}><div style={{ width:`${p.avg}%`, height:"100%", background:C.red, borderRadius:3 }}/></div></div>)}</>}
          {strong.length>0 && <><div style={{ fontSize:12, color:C.green, fontWeight:700, margin:"12px 0 8px", textTransform:"uppercase" }}>✅ Strengths</div>{strong.map(p=><div key={p.id} style={{ padding:"10px 12px", borderRadius:10, background:`${C.green}06`, border:`1px solid ${C.green}15`, marginBottom:7 }}><div style={{ display:"flex", justifyContent:"space-between" }}><div style={{ fontSize:13, fontWeight:600 }}>"{p.phrase.text}"</div><span style={{ fontSize:12, fontWeight:700, color:C.green, background:`${C.green}15`, borderRadius:5, padding:"2px 7px" }}>avg {p.avg}</span></div></div>)}</>}
        </Card>
      )}

      {byPhrase.filter(p=>p.history.length>=2).map(p=>(
        <Card key={p.id}><div style={{ fontSize:12, fontWeight:600, marginBottom:4 }}>"{p.phrase?.text}"</div><SparkLine history={p.history}/></Card>
      ))}

      {!entries.length && <Card><div style={{ textAlign:"center", padding:"24px 0", color:C.gray }}><div style={{ fontSize:32, marginBottom:10 }}>🎙️</div><div style={{ fontSize:14, fontWeight:600, color:C.white, marginBottom:6 }}>No attempts yet</div><div style={{ fontSize:12 }}>Head to Practice and record your first phrase!</div></div></Card>}
    </>
  );
}

// ── Challenge Section ───────────────────────────────────────────────────────
function ChallengeSection({ speak }) {
  const day      = new Date().getDate();
  const todayC   = DAILY_CHALLENGES[day % DAILY_CHALLENGES.length];
  const twisters = [TWISTERS[day%TWISTERS.length],TWISTERS[(day+2)%TWISTERS.length],TWISTERS[(day+5)%TWISTERS.length]];
  return (
    <>
      <Card style={{ background:`${C.gold}08`, border:`1px solid ${C.gold}25` }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:`${C.gold}20`, border:`1px solid ${C.gold}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🏆</div>
          <div>
            <div style={{ fontSize:11, color:C.gold, fontWeight:700, textTransform:"uppercase", marginBottom:4 }}>Today's Challenge</div>
            <div style={{ fontSize:14, fontWeight:700, lineHeight:1.5, marginBottom:6 }}>{todayC}</div>
            <div style={{ fontSize:11, color:C.gray }}>Refreshes daily at midnight 🌙</div>
          </div>
        </div>
      </Card>
      <Card>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:5, marginTop:0 }}>👅 Today's Tongue Twisters</h2>
        <p style={{ fontSize:12, color:C.gray, marginBottom:14, lineHeight:1.6 }}>Say each 3× slowly then at full speed.</p>
        {twisters.map((t,i)=>(
          <div key={i} style={{ padding:"12px 14px", borderRadius:10, marginBottom:9, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize:11, color:C.gray, marginBottom:4 }}>Twister {i+1}</div>
            <div style={{ fontSize:13, fontWeight:600, lineHeight:1.5, marginBottom:9 }}>"{t}"</div>
            <div style={{ display:"flex", gap:6 }}><Btn color={C.blue} style={{ fontSize:11, padding:"5px 10px" }} onClick={()=>speak(t)}>🔊 Normal</Btn><Btn color={C.blue} outline style={{ fontSize:11, padding:"5px 10px" }} onClick={()=>speak(t,0.5)}>🐢 Slow</Btn></div>
          </div>
        ))}
      </Card>
      <Card>
        <h2 style={{ fontSize:15, fontWeight:700, marginBottom:14, marginTop:0 }}>📅 Full Challenge Bank</h2>
        {DAILY_CHALLENGES.map((c,i)=><div key={i} style={{ padding:"10px 13px", borderRadius:9, marginBottom:7, background:c===todayC?`${C.gold}10`:"rgba(255,255,255,0.03)", border:c===todayC?`1px solid ${C.gold}30`:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", gap:10 }}><div style={{ width:24, height:24, borderRadius:6, background:c===todayC?`${C.gold}25`:"rgba(255,255,255,0.06)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:c===todayC?C.gold:C.gray, flexShrink:0 }}>{i+1}</div><div style={{ fontSize:12, lineHeight:1.5, flex:1 }}>{c}</div>{c===todayC&&<span style={{ fontSize:10, color:C.gold, fontWeight:700, background:`${C.gold}20`, borderRadius:5, padding:"1px 6px" }}>TODAY</span>}</div>)}
      </Card>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART 10 — MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
const NAV = [
  { id:"practice",  icon:"🎙️", label:"Practice"     },
  { id:"test",      icon:"🧪", label:"Test Modes"   },
  { id:"phonemes",  icon:"🔬", label:"Drills"       },
  { id:"errors",    icon:"⚠️", label:"Errors"       },
  { id:"progress",  icon:"📊", label:"Progress"     },
  { id:"challenge", icon:"🏆", label:"Challenge"    },
];

// Add Minimal Pairs to NAV
const NAV_FULL = [
  { id:"practice",     icon:"🎙️", label:"Practice"     },
  { id:"test",         icon:"🧪", label:"Test Modes"   },
  { id:"minimal-pairs",icon:"👂", label:"Ear Training" },
  { id:"phonemes",     icon:"🔬", label:"Drills"       },
  { id:"errors",       icon:"⚠️", label:"Errors"       },
  { id:"progress",     icon:"📊", label:"Progress"     },
  { id:"challenge",    icon:"🏆", label:"Challenge"    },
];

export default function EnglishTrainer() {
  // ── Loading ──
  const [loaded,     setLoaded]     = useState(false);

  // ── UI ──
  const [activeTab,  setActiveTab]  = useState("everyday");
  const [section,    setSection]    = useState("practice");
  const [isMobile,   setIsMobile]   = useState(window.innerWidth <= 600);

  // ── Practice ──
  const [selectedPhrase, setSelectedRaw] = useState(null);
  const [isRecording,    setIsRecording] = useState(false);
  const [transcript,     setTranscript]  = useState("");
  const [diffs,          setDiffs]       = useState([]);
  const [score,          setScore]       = useState(null);
  const [aiFeedback,     setAiFeedback]  = useState(null);
  const [loading,        setLoading]     = useState(false);
  const [error,          setError]       = useState("");
  const [newBadges,      setNewBadges]   = useState([]);
  const [speed,          setSpeed]       = useState(0.82);
  const [voiceWarning,   setVoiceWarning] = useState(false);
  const [darkMode,       setDarkMode]     = useState(() => localStorage.getItem('accentai:darkMode') === 'true');
  const [confetti,       setConfetti]     = useState(null); // { message } or null

  // ── Test ──
  const [testMode,   setTestMode]   = useState(null);
  const [testQueue,  setTestQueue]  = useState([]);
  const [testIdx,    setTestIdx]    = useState(0);
  const [showBlind,  setShowBlind]  = useState(false);

  // ── Session ──
  const [sessionAttempts,  setSessionAttempts]  = useState(0);
  const [sessionScores,    setSessionScores]    = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // ── Persisted state ──
  const [progress,      setProgress]      = useState({});
  const [stats,         setStats]         = useState({ totalAttempts:0, bestScore:0, biggestImprovement:0, phrasesAttempted:0, perfectWordMatch:0, streak:0, earnedBadges:[], qualifiedToday:false, lastQualityDate:"" });
  const [errorBank,     setErrorBank]     = useState({});
  const [srMap,         setSrMap]         = useState({});
  const [diagDone,      setDiagDone]      = useState(true); // overwritten by store on load
  const [accentProfile, setAccentProfile] = useState(null);

  // ── Refs ──
  const recRef      = useRef(null);
  const analyserRef = useRef(null);
  const streamRef   = useRef(null);
  const audioCtxRef = useRef(null);
  const voiceRef    = useRef(null);

  // ── Responsive ──
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Dark mode persistence ──
  useEffect(() => {
    localStorage.setItem('accentai:darkMode', darkMode);
  }, [darkMode]);

  // keyboard shortcuts — defined below after speak/startRecording are declared

  // ── Voice picker — robust async load (Chrome returns [] before onvoiceschanged) ──
  // RULE: Always pass the full SpeechSynthesisVoice object to utterance.voice
  // RULE: Register onvoiceschanged AND call tryLoadVoices() immediately
  const tryLoadVoices = useCallback(() => {
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return; // not ready yet — wait for onvoiceschanged

    const FEMALE_PRIORITY = [
      'Google UK English Female',
      'Microsoft Zira',
      'Samantha',
      'Microsoft Hazel',
      'Karen',
      'Victoria',
      'Moira',
      'Serena',
    ];
    const enVoices = voices.filter(v => v.lang.startsWith('en'));

    let chosen = null;
    for (const name of FEMALE_PRIORITY) {
      chosen = voices.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (chosen) break;
    }
    if (!chosen) {
      // Fallback: try any voice that self-identifies as female via gender (non-standard)
      chosen = enVoices.find(v => v.name.toLowerCase().includes('female'))
             || enVoices[0]
             || voices[0];
      if (!chosen || !FEMALE_PRIORITY.some(n => chosen.name.toLowerCase().includes(n.toLowerCase()))) {
        setVoiceWarning(true); // show warning banner
      }
    } else {
      setVoiceWarning(false);
    }
    voiceRef.current = chosen; // store full SpeechSynthesisVoice object — NOT a string
  }, []);

  useEffect(() => {
    // Register FIRST so we catch the event if voices load after mount
    speechSynthesis.onvoiceschanged = tryLoadVoices;
    // Also try immediately — Firefox & Safari may have voices ready already
    tryLoadVoices();
    return () => { speechSynthesis.onvoiceschanged = null; };
  }, [tryLoadVoices]);

  // ── Load all data on mount ──
  // 1B fix: default diagDone = false (cloud/localStorage truth overrides on load)
  useEffect(() => {
    (async () => {
      const [p, s, eb, sr, dd, prof] = await Promise.all([
        store.get("accentai:progress", {}),
        store.get("accentai:stats",    { totalAttempts:0, bestScore:0, biggestImprovement:0, phrasesAttempted:0, perfectWordMatch:0, streak:0, earnedBadges:[], qualifiedToday:false, lastQualityDate:"" }),
        store.get("accentai:eb",       {}),
        store.get("accentai:sr",       {}),
        store.get("accentai:dd",       false), // false = not onboarded → show diagnostic
        store.get("accentai:profile",  null),
      ]);
      setProgress(p); setStats(s); setErrorBank(eb); setSrMap(sr);
      setDiagDone(dd ?? false); // explicit false check — null/undefined → run diagnostic
      setAccentProfile(prof);
      setLoaded(true);
    })();
  }, []);

  // ── Speak ──
  const speak = useCallback((text, rate = 0.82) => {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate  = rate; u.pitch = 1; u.lang = "en-US";
    if (voiceRef.current) u.voice = voiceRef.current;
    speechSynthesis.speak(u);
  }, []);

  // ── Set selected phrase ──
  const setSelected = useCallback((p) => {
    setSelectedRaw(p); setTranscript(""); setDiffs([]); setAiFeedback(null); setScore(null); setError("");
  }, []);

  // ── Stop stream ──
  const stopStream = () => {
    if (streamRef.current)   streamRef.current.getTracks().forEach(t => t.stop());
    if (audioCtxRef.current) audioCtxRef.current.close().catch(()=>{});
    analyserRef.current = null;
  };

  // ── Start recording ──
  const startRecording = useCallback(async () => {
    setError(""); setTranscript(""); setDiffs([]); setScore(null); setAiFeedback(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      const AC = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AC();
      const src = audioCtxRef.current.createMediaStreamSource(stream);
      const an  = audioCtxRef.current.createAnalyser(); an.fftSize = 512;
      src.connect(an); analyserRef.current = an;
    } catch { setError("Mic access denied. Allow microphone and retry."); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Speech recognition needs Chrome or Edge."); return; }
    const rec = new SR(); rec.lang = "en-US"; rec.continuous = false; rec.interimResults = true;
    recRef.current = rec;
    rec.onresult = e => { const t = Array.from(e.results).map(r=>r[0].transcript).join(" "); setTranscript(t); };
    rec.onend    = () => { setIsRecording(false); stopStream(); };
    rec.onerror  = e => { setError("Error: "+e.error); setIsRecording(false); stopStream(); };
    rec.start(); setIsRecording(true);
  }, []);

  const stopRecording = useCallback(() => {
    if (recRef.current) recRef.current.stop();
    setIsRecording(false); stopStream();
  }, []);

  // ── Keyboard shortcuts (placed here so speak/startRecording/stopRecording exist) ──
  useEffect(() => {
    const handler = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); isRecording ? stopRecording() : selectedPhrase && startRecording(); }
      if (e.code === 'KeyR')  { e.preventDefault(); selectedPhrase && speak(selectedPhrase.text, speed); }
      if (e.code === 'KeyN')  { e.preventDefault(); setSelected(null); }
      if (e.code === 'KeyD')  { e.preventDefault(); setDarkMode(m => !m); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isRecording, selectedPhrase, speed, speak, startRecording, stopRecording]); // eslint-disable-line

  // ── Live diff ──
  useEffect(() => {
    const phrase = testMode ? testQueue[testIdx] : selectedPhrase;
    if (phrase && transcript) setDiffs(diffWords(phrase.text, transcript));
  }, [transcript, selectedPhrase, testMode, testQueue, testIdx]);

  // ── Update error bank from diffs ──
  const updateErrorBank = useCallback((phraseObj, diffsArr) => {
    const wrong     = diffsArr.filter(w => w.status !== "correct");
    if (!wrong.length || !phraseObj.phonemes?.length) return;
    const newBank   = { ...errorBank };
    phraseObj.phonemes.forEach(pid => {
      const entry = newBank[pid] || { count:0, words:[], last:"" };
      entry.count += wrong.length;
      wrong.forEach(w => { if (!entry.words.includes(w.word)) entry.words = [...entry.words, w.word].slice(-10); });
      entry.last  = todayStr();
      newBank[pid] = entry;
    });
    setErrorBank(newBank);
    store.set("accentai:eb", newBank);
  }, [errorBank]);

  // ── Record attempt ──
  const recordAttempt = useCallback((phraseObj, sc, diffsArr, spoken) => {
    const pid     = phraseObj.id;
    const attempt = { score:sc, ts:Date.now(), transcript:spoken, wordAcc:wordAcc(diffsArr) };
    const np      = { ...progress, [pid]: [...(progress[pid]||[]), attempt].slice(-20) };

    const allScores         = Object.values(np).flat().map(a => a.score);
    const bestScore         = Math.max(...allScores, 0);
    const phrasesAttempted  = Object.keys(np).filter(k=>np[k].length>0).length;
    let biggestImprovement  = 0;
    Object.values(np).forEach(arr => { if (arr.length>=2) { const d=arr[arr.length-1].score-arr[0].score; if(d>biggestImprovement)biggestImprovement=d; } });
    const perfectWordMatch  = (stats.perfectWordMatch||0) + (wordAcc(diffsArr)===100?1:0);

    // ── Quality streak ──
    const today         = todayStr();
    const newSessAtt    = sessionAttempts + 1;
    const newSessScores = [...sessionScores, sc];
    const qualifiedNow  = newSessAtt >= 3 || sc >= 70;
    let streak          = stats.streak || 0;
    let qualifiedToday  = stats.qualifiedToday || false;
    const lastQual      = stats.lastQualityDate || "";

    if (qualifiedNow && !qualifiedToday) {
      qualifiedToday = true;
      const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
      streak = lastQual === yesterday || lastQual === today ? streak + 1 : 1;
    }
    setSessionAttempts(newSessAtt);
    setSessionScores(newSessScores);
    if (newSessAtt % 5 === 0) setShowSessionModal(true);

    const ns = { ...stats, totalAttempts:(stats.totalAttempts||0)+1, bestScore, phrasesAttempted, biggestImprovement, perfectWordMatch, streak, qualifiedToday, lastQualityDate: qualifiedNow ? today : lastQual };
    const earned = BADGES.filter(b => !(ns.earnedBadges||[]).includes(b.id) && b.cond(ns)).map(b => b.id);
    ns.earnedBadges = [...(ns.earnedBadges||[]), ...earned];

    // ── SM-2 Spaced Repetition (replaces flat srDays) ──
    const quality  = scoreToQuality(sc);
    const srItem   = srMap[pid] || { reps:0, interval:1, ease:2.5 };
    const newSrItem = sm2Update(srItem, quality);
    const newSr    = { ...srMap, [pid]: newSrItem };

    // ── Phoneme mastery confetti check ──
    const prevBest = (progress[pid]||[]).reduce((mx,a)=>Math.max(mx,a.score),0);
    const nowBest  = Math.max(prevBest, sc);
    if (prevBest < 75 && nowBest >= 75) {
      setTimeout(() => setConfetti({ message:`Phoneme mastered! Keep it up! 🌟` }), 400);
    }

    setProgress(np); setStats(ns); setSrMap(newSr);
    store.set("accentai:progress", np);
    store.set("accentai:stats",    ns);
    store.set("accentai:sr",       newSr);

    if (earned.length) { setNewBadges(earned); setTimeout(()=>setNewBadges([]),4500); }
    updateErrorBank(phraseObj, diffsArr);
    return earned;
  }, [progress, stats, srMap, sessionAttempts, sessionScores, updateErrorBank]);

  // ── AI coaching ──
  const getAI = useCallback(async (phraseObj, spoken, diffsArr) => {
    if (!phraseObj || !spoken) return;
    setLoading(true); setAiFeedback(null);
    const levelLabel   = Object.values(LEVELS).find(l=>l.phrases.some(p=>p.id===phraseObj.id))?.label||"General";
    const flow         = getFlow(diffsArr||[]);
    const wrongWords   = (diffsArr||[]).filter(w=>w.status!=="correct").map(w=>w.word);
    const wAcc_        = wordAcc(diffsArr||[]);
    const topErrors    = Object.entries(errorBank).sort((a,b)=>b[1].count-a[1].count).slice(0,3).map(([pid,d])=>({phoneme:ALL_PHONEMES.find(p=>p.id===pid)?.ipa||pid,count:d.count}));

    const prompt = `You are an expert English accent and pronunciation coach. Respond ONLY in valid JSON, no markdown.

Target phrase: "${phraseObj.text}"
Level: ${levelLabel}
Student said: "${spoken}"
Word accuracy: ${wAcc_}%
Wrong/missing words: ${JSON.stringify(wrongWords)}
Flow errors — Start:${flow.start} Middle:${flow.middle} End:${flow.end}
Key focus phonemes: ${JSON.stringify(phraseObj.phonemes||[])}
Student's recurring top errors: ${JSON.stringify(topErrors)}
Mastery score: ${masteryScore(progress)}

Return this exact JSON:
{
  "score": <integer 0-100>,
  "overall": "<one warm encouraging sentence>",
  "wellDone": "<specific praise>",
  "phonemeErrors": [{"phoneme":"<IPA>","word":"<word>","type":"substitution|deletion|distortion|insertion","heardAs":"<IPA>","fix":"<plain English fix>"}],
  "flowNote": "<one sentence on flow>",
  "drills": ["<10-sec drill 1>","<10-sec drill 2>","<10-sec drill 3>"],
  "nativeTip": "<one insider tip>",
  "nextFocus": "<single most important thing next session>"
}`;
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model:"claude-sonnet-4-6", max_tokens:900, messages:[{role:"user",content:prompt}] }) });
      const data = await res.json();
      const raw  = data.content?.map(c=>c.text||"").join("")||"";
      const parsed = JSON.parse(raw.replace(/```json|```/g,"").trim());
      setAiFeedback(parsed);
      const sc = Math.max(0,Math.min(100,parseInt(parsed.score)||wAcc_));
      setScore(sc);
      recordAttempt(phraseObj, sc, diffsArr||[], spoken);
    } catch {
      setAiFeedback({ offline:true, score:wAcc_, overall:"Offline — AI unavailable. Here's your local tip.", wellDone:"You completed the attempt — great work!", drills:[], nativeTip:phraseObj.tip, nextFocus:"Practice again and hit 'AI Coaching' when connected." });
      setScore(wAcc_);
      recordAttempt(phraseObj, wAcc_, diffsArr||[], spoken);
    }
    setLoading(false);
  }, [progress, errorBank, recordAttempt]);

  // ── Test helpers ──
  const startTest = useCallback((mode) => {
    const phrases = [...LEVELS[activeTab].phrases].sort(()=>Math.random()-0.5);
    setTestMode(mode); setTestQueue(phrases); setTestIdx(0);
    setTranscript(""); setDiffs([]); setScore(null); setAiFeedback(null); setShowBlind(false);
    setSection("test");
    if (mode==="shadow") speak(phrases[0].text, 0.8);
  }, [activeTab, speak]);

  const nextTest = useCallback(() => {
    const ni = testIdx + 1;
    if (ni >= testQueue.length) { setTestMode(null); return; }
    setTestIdx(ni); setTranscript(""); setDiffs([]); setScore(null); setAiFeedback(null); setShowBlind(false);
    if (testMode==="shadow") speak(testQueue[ni].text, 0.8);
  }, [testIdx, testQueue, testMode, speak]);

  // ── Diagnostic complete ──
  const handleDiagComplete = useCallback(async (profile) => {
    setAccentProfile(profile);
    setDiagDone(true);
    await store.set("accentai:profile", profile);
    await store.set("accentai:dd",      true);
  }, []);

  // ── Derived values ──
  const phraseHistory = selectedPhrase ? (progress[selectedPhrase.id]||[]) : [];
  const confidence    = useMemo(() => {
    if (!selectedPhrase) return 0;
    const h = progress[selectedPhrase.id]||[];
    if (!h.length) return 0;
    return Math.min(Math.round(h.slice(-5).reduce((a,x)=>a+x.score,0)/Math.min(h.length,5)), 100);
  }, [selectedPhrase, progress]);

  const dueCount = useMemo(() => ALL_PHRASES().filter(p => srDue(srMap, p.id)).length, [srMap]);
  const topPhoErr = useMemo(() => Object.entries(errorBank).sort((a,b)=>b[1].count-a[1].count)[0]?.[0], [errorBank]);

  // ── Session modal avg ──
  const sessionAvg = sessionScores.length ? Math.round(sessionScores.reduce((a,b)=>a+b,0)/sessionScores.length) : 0;

  // ── Shared props ──
  const shared = { isRecording, transcript, diffs, score, aiFeedback, loading, error, startRecording, stopRecording, analyserRef, progress, getAI, speak };

  // ── Loading screen ──
  if (!loaded) return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0A0F1E,#0D1829)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Inter',system-ui,sans-serif" }}>
      <div style={{ fontSize:32, fontWeight:800, letterSpacing:"-1px", color:C.white, marginBottom:20 }}>Accent<span style={{color:C.gold}}>AI</span></div>
      <div style={{ width:36, height:36, border:`3px solid ${C.blue}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
      <div style={{ fontSize:12, color:C.gray, marginTop:16 }}>Loading your data…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // ── Diagnostic overlay ──
  if (!diagDone) return <DiagnosticOverlay speak={speak} onComplete={handleDiagComplete} onSkip={()=>{setDiagDone(true);store.set("accentai:dd",true);}}/>;

  // ── Dark mode colours (light mode is a future option, for now just track state) ──
  const bg = darkMode
    ? "linear-gradient(135deg,#0A0F1E 0%,#0D1829 50%,#0A0F1E 100%)"
    : "linear-gradient(135deg,#f0f4ff 0%,#e8eef8 50%,#f0f4ff 100%)";
  const textColor = darkMode ? C.white : "#1a2235";

  // ── Sidebar / nav styles ──
  const navBtnSt = (a) => ({ padding:"7px 11px", borderRadius:8, border:"none", cursor:"pointer", fontSize:11, fontWeight:600, whiteSpace:"nowrap", transition:"all 0.2s", background:a?"rgba(45,108,223,0.25)":"transparent", color:a?C.white:C.gray, borderBottom:a?`2px solid ${C.blue}`:"2px solid transparent", fontFamily:"inherit" });
  const sideStl  = (a) => ({ padding:"9px 11px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, textAlign:"left", transition:"all 0.2s", background:a?"rgba(245,197,24,0.12)":"transparent", color:a?C.gold:C.gray, borderLeft:a?`3px solid ${C.gold}`:"3px solid transparent", fontFamily:"inherit", width:"100%" });

  return (
    <div style={{ background:bg, minHeight:"100vh", fontFamily:"'Inter','Segoe UI',system-ui,sans-serif", color:textColor, display:"flex", flexDirection:"column" }}>
      <style>{`
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes badgePop{0%{transform:scale(0.4);opacity:0}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
        @keyframes spin{to{transform:rotate(360deg)}}
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.14);border-radius:2px}
      `}</style>

      {/* ── Confetti Overlay ── */}
      {confetti && <ConfettiOverlay message={confetti.message} onDone={() => setConfetti(null)} />}

      {/* ── Badge Toast ── */}
      {newBadges.length > 0 && (
        <div style={{ position:"fixed", top:16, right:16, zIndex:999, display:"flex", flexDirection:"column", gap:8 }}>
          {newBadges.map(id => { const b=BADGES.find(x=>x.id===id); return b?(<div key={id} style={{ background:"linear-gradient(135deg,rgba(245,197,24,0.97),rgba(234,179,8,0.97))", borderRadius:12, padding:"10px 16px", display:"flex", gap:10, alignItems:"center", animation:"badgePop 0.4s ease", boxShadow:"0 4px 24px rgba(245,197,24,0.45)" }}><span style={{fontSize:26}}>{b.icon}</span><div><div style={{fontWeight:800,fontSize:13,color:"#0A0F1E"}}>Badge Unlocked!</div><div style={{fontSize:12,color:"#0A0F1E99"}}>{b.label} — {b.desc}</div></div></div>):null; })}
        </div>
      )}

      {/* ── Session Modal ── */}
      {showSessionModal && <SessionModal attempts={sessionAttempts} avgScore={sessionAvg} topPhoneme={topPhoErr ? ALL_PHONEMES.find(p=>p.id===topPhoErr)?.ipa : null} onKeepGoing={()=>setShowSessionModal(false)} onViewProgress={()=>{setShowSessionModal(false);setSection("progress");}}/>}

      {/* ── Voice Warning Banner ── */}
      {voiceWarning && (
        <div style={{ background:"rgba(245,158,11,0.12)", borderBottom:"1px solid rgba(245,158,11,0.3)", padding:"8px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:12, gap:12 }}>
          <span style={{ color:C.amber }}>🔊 <strong>Female voice not available on this browser.</strong> Using default voice — try Chrome on desktop for best results.</span>
          <button onClick={()=>setVoiceWarning(false)} style={{ background:"transparent", border:"none", color:C.amber, cursor:"pointer", fontSize:16, lineHeight:1, fontFamily:"inherit" }}>×</button>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ background:"rgba(13,24,41,0.96)", borderBottom:"1px solid rgba(45,108,223,0.2)", padding:`13px ${isMobile?"12px":"18px"}`, display:"flex", alignItems:"center", justifyContent:"space-between", backdropFilter:"blur(10px)", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ fontSize:18, fontWeight:800, letterSpacing:"-0.5px", color:C.white }}>Accent<span style={{color:C.gold}}>AI</span><span style={{ fontSize: 12, color: "#a0aec0", fontWeight: 500, marginLeft: 10, letterSpacing: "1.5px", fontStyle: "italic" }}> by Rudra </span></div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          {dueCount > 0 && <Pill color={C.red}>📅 {dueCount} due</Pill>}
          <Pill color={C.gold}>🔥 {stats.streak} streak</Pill>
          {!isMobile && <Pill color={C.green}>{stats.totalAttempts} attempts</Pill>}
          {!isMobile && stats.bestScore>0 && <Pill color={C.purple}>🏆 Best {stats.bestScore}</Pill>}
          <Pill color={C.cyan}>⭐ {masteryScore(progress)}%</Pill>
          <button onClick={() => setDarkMode(m=>!m)} title="Toggle dark/light mode (D)" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:8, padding:"4px 9px", cursor:"pointer", fontSize:14, color:C.gray, fontFamily:"inherit", lineHeight:1 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* ── Level Tabs ── */}
      <div style={{ display:"flex", gap:4, padding:"9px 12px", overflowX:"auto", background:"rgba(10,15,30,0.85)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        {Object.entries(LEVELS).map(([k,v])=>(
          <button key={k} style={navBtnSt(activeTab===k)} onClick={()=>{setActiveTab(k);setSelected(null);setTestMode(null);}}>
            {v.icon} {v.label}
          </button>
        ))}
      </div>

      {/* ── Main Layout ── */}
      <div style={{ display:"flex", flex:1, paddingBottom:isMobile?"60px":"0" }}>

        {/* Sidebar (desktop) */}
        {!isMobile && (
          <div style={{ width:188, flexShrink:0, background:"rgba(13,24,41,0.6)", borderRight:"1px solid rgba(255,255,255,0.06)", padding:"14px 10px", display:"flex", flexDirection:"column", gap:3 }}>
            {NAV_FULL.map(s=>(
              <button key={s.id} style={sideStl(section===s.id)} onClick={()=>{setSection(s.id);if(s.id!=="test")setTestMode(null);}}>
                {s.icon} {s.label}
              </button>
            ))}
            <div style={{ marginTop:"auto", padding:"11px 0", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ fontSize:10, color:C.gray, marginBottom:4, fontWeight:700 }}>KEYBOARD SHORTCUTS</div>
              <div style={{ fontSize:10, color:C.gray, lineHeight:1.8 }}>
                <span style={{color:C.white}}>Space</span> record/stop&nbsp;&nbsp;
                <span style={{color:C.white}}>R</span> replay&nbsp;&nbsp;
                <span style={{color:C.white}}>N</span> next&nbsp;&nbsp;
                <span style={{color:C.white}}>D</span> dark mode
              </div>
              <div style={{ marginTop:8, borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:8 }}>
                <div style={{ fontSize:10, color:C.gray, marginBottom:2 }}>Offline status</div>
                <div style={{ fontSize:11, color:C.green }}>✓ Recording &amp; diff</div>
                <div style={{ fontSize:11, color:C.green }}>✓ TTS playback</div>
                <div style={{ fontSize:11, color:C.gold }}>◉ AI coaching (needs net)</div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ flex:1, padding:"16px", overflowY:"auto" }}>
          {(section==="practice") && !testMode && <PracticeSection {...shared} activeTab={activeTab} selectedPhrase={selectedPhrase} setSelected={setSelected} srMap={srMap} phraseHistory={phraseHistory} confidence={confidence} speed={speed} setSpeed={setSpeed}/>}
          {(section==="test"||section==="practice") && testMode && <TestSection {...shared} activeTab={activeTab} testMode={testMode} testQueue={testQueue} testIdx={testIdx} showBlind={showBlind} setShowBlind={setShowBlind} startTest={startTest} nextTest={nextTest} setTestMode={setTestMode}/>}
          {section==="test" && !testMode && <TestSection {...shared} activeTab={activeTab} testMode={null} testQueue={[]} testIdx={0} showBlind={false} setShowBlind={setShowBlind} startTest={startTest} nextTest={nextTest} setTestMode={setTestMode}/>}
          {section==="minimal-pairs" && <div style={{animation:"fadeIn 0.3s ease"}}><Card><h2 style={{fontSize:15,fontWeight:700,marginTop:0,marginBottom:14}}>👂 Ear Training — Minimal Pairs</h2><MinimalPairsSection speak={speak} progress={progress}/></Card></div>}
          {section==="phonemes"  && <PhonemeDrillsSection speak={speak} errorBank={errorBank}/>}
          {section==="errors"    && <ErrorBankSection errorBank={errorBank} speak={speak} setSection={setSection}/>}
          {section==="progress"  && <ProgressSection progress={progress} stats={stats} accentProfile={accentProfile} errorBank={errorBank} setSection={setSection}/>}
          {section==="challenge" && <ChallengeSection speak={speak}/>}
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      {isMobile && (
        <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"rgba(13,24,41,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", zIndex:200, overflowX:"auto" }}>
          {NAV_FULL.map(s => (
            <button key={s.id} onClick={()=>{setSection(s.id);if(s.id!=="test")setTestMode(null);}} style={{ flex:1, minWidth:44, padding:"10px 4px 8px", border:"none", background:"transparent", color:section===s.id?C.gold:C.gray, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2, fontFamily:"inherit", minHeight:44 }}>
              <span style={{ fontSize:18 }}>{s.icon}</span>
              <span style={{ fontSize:9, fontWeight:600 }}>{s.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
