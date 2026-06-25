"use client";

import { useMemo, useState } from "react";

type Mode = "Classic" | "Cricket-IQ";
type LineupKey = "Batting depth" | "Extra bowler";
type Role = "Opener" | "Middle" | "Keeper" | "Bowler" | "All-rounder";
type DraftPlayer = {
  name: string;
  role: Role;
  franchise: string;
  season: number;
  bat: number;
  bowl: number;
  clutch: number;
};

type Slot = { role: Role; label: string };

const FRANCHISES = ["MI", "CSK", "RCB", "KKR", "RR", "SRH", "DC", "PBKS", "GT", "LSG"];
const SEASONS = [2008, 2010, 2011, 2013, 2014, 2016, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const PLAYERS: DraftPlayer[] = [
  { name: "Rohit Sharma", role: "Opener", franchise: "MI", season: 2013, bat: 93, bowl: 8, clutch: 91 },
  { name: "Sachin Tendulkar", role: "Opener", franchise: "MI", season: 2010, bat: 94, bowl: 14, clutch: 86 },
  { name: "Quinton de Kock", role: "Keeper", franchise: "MI", season: 2019, bat: 88, bowl: 5, clutch: 78 },
  { name: "Suryakumar Yadav", role: "Middle", franchise: "MI", season: 2020, bat: 91, bowl: 4, clutch: 84 },
  { name: "Kieron Pollard", role: "All-rounder", franchise: "MI", season: 2013, bat: 87, bowl: 70, clutch: 94 },
  { name: "Jasprit Bumrah", role: "Bowler", franchise: "MI", season: 2020, bat: 8, bowl: 96, clutch: 93 },
  { name: "Lasith Malinga", role: "Bowler", franchise: "MI", season: 2011, bat: 7, bowl: 97, clutch: 92 },
  { name: "MS Dhoni", role: "Keeper", franchise: "CSK", season: 2011, bat: 90, bowl: 3, clutch: 98 },
  { name: "Suresh Raina", role: "Middle", franchise: "CSK", season: 2014, bat: 89, bowl: 36, clutch: 88 },
  { name: "Faf du Plessis", role: "Opener", franchise: "CSK", season: 2021, bat: 90, bowl: 4, clutch: 83 },
  { name: "Ravindra Jadeja", role: "All-rounder", franchise: "CSK", season: 2021, bat: 82, bowl: 88, clutch: 91 },
  { name: "Dwayne Bravo", role: "All-rounder", franchise: "CSK", season: 2013, bat: 76, bowl: 92, clutch: 90 },
  { name: "Ravichandran Ashwin", role: "Bowler", franchise: "CSK", season: 2011, bat: 30, bowl: 88, clutch: 80 },
  { name: "Virat Kohli", role: "Opener", franchise: "RCB", season: 2016, bat: 99, bowl: 10, clutch: 92 },
  { name: "AB de Villiers", role: "Middle", franchise: "RCB", season: 2016, bat: 98, bowl: 8, clutch: 97 },
  { name: "Chris Gayle", role: "Opener", franchise: "RCB", season: 2011, bat: 96, bowl: 40, clutch: 89 },
  { name: "Glenn Maxwell", role: "All-rounder", franchise: "RCB", season: 2021, bat: 87, bowl: 68, clutch: 79 },
  { name: "Yuzvendra Chahal", role: "Bowler", franchise: "RCB", season: 2016, bat: 4, bowl: 89, clutch: 82 },
  { name: "Gautam Gambhir", role: "Opener", franchise: "KKR", season: 2012, bat: 89, bowl: 2, clutch: 86 },
  { name: "Andre Russell", role: "All-rounder", franchise: "KKR", season: 2019, bat: 95, bowl: 83, clutch: 96 },
  { name: "Sunil Narine", role: "All-rounder", franchise: "KKR", season: 2012, bat: 63, bowl: 95, clutch: 87 },
  { name: "Dinesh Karthik", role: "Keeper", franchise: "KKR", season: 2018, bat: 82, bowl: 4, clutch: 83 },
  { name: "Varun Chakravarthy", role: "Bowler", franchise: "KKR", season: 2021, bat: 6, bowl: 86, clutch: 75 },
  { name: "Shane Watson", role: "All-rounder", franchise: "RR", season: 2008, bat: 90, bowl: 84, clutch: 92 },
  { name: "Jos Buttler", role: "Keeper", franchise: "RR", season: 2022, bat: 97, bowl: 3, clutch: 91 },
  { name: "Sanju Samson", role: "Keeper", franchise: "RR", season: 2021, bat: 86, bowl: 2, clutch: 76 },
  { name: "Yusuf Pathan", role: "All-rounder", franchise: "RR", season: 2008, bat: 85, bowl: 65, clutch: 89 },
  { name: "Sohail Tanvir", role: "Bowler", franchise: "RR", season: 2008, bat: 24, bowl: 92, clutch: 85 },
  { name: "David Warner", role: "Opener", franchise: "SRH", season: 2016, bat: 96, bowl: 5, clutch: 91 },
  { name: "Kane Williamson", role: "Middle", franchise: "SRH", season: 2018, bat: 91, bowl: 12, clutch: 86 },
  { name: "Rashid Khan", role: "Bowler", franchise: "SRH", season: 2018, bat: 45, bowl: 96, clutch: 90 },
  { name: "Bhuvneshwar Kumar", role: "Bowler", franchise: "SRH", season: 2016, bat: 13, bowl: 91, clutch: 84 },
  { name: "Shikhar Dhawan", role: "Opener", franchise: "DC", season: 2020, bat: 91, bowl: 3, clutch: 81 },
  { name: "Rishabh Pant", role: "Keeper", franchise: "DC", season: 2018, bat: 92, bowl: 2, clutch: 84 },
  { name: "Kagiso Rabada", role: "Bowler", franchise: "DC", season: 2020, bat: 12, bowl: 93, clutch: 86 },
  { name: "Axar Patel", role: "All-rounder", franchise: "DC", season: 2021, bat: 68, bowl: 84, clutch: 78 },
  { name: "KL Rahul", role: "Keeper", franchise: "PBKS", season: 2020, bat: 94, bowl: 2, clutch: 80 },
  { name: "Mayank Agarwal", role: "Opener", franchise: "PBKS", season: 2020, bat: 88, bowl: 4, clutch: 76 },
  { name: "Mohammed Shami", role: "Bowler", franchise: "PBKS", season: 2020, bat: 10, bowl: 88, clutch: 82 },
  { name: "Hardik Pandya", role: "All-rounder", franchise: "GT", season: 2022, bat: 88, bowl: 75, clutch: 90 },
  { name: "Shubman Gill", role: "Opener", franchise: "GT", season: 2023, bat: 97, bowl: 2, clutch: 89 },
  { name: "Mohit Sharma", role: "Bowler", franchise: "GT", season: 2023, bat: 10, bowl: 84, clutch: 80 },
  { name: "Nicholas Pooran", role: "Keeper", franchise: "LSG", season: 2023, bat: 88, bowl: 2, clutch: 82 },
  { name: "Marcus Stoinis", role: "All-rounder", franchise: "LSG", season: 2023, bat: 83, bowl: 73, clutch: 80 },
  { name: "Avesh Khan", role: "Bowler", franchise: "LSG", season: 2022, bat: 8, bowl: 82, clutch: 72 },
];

const LINEUPS: Record<LineupKey, Slot[]> = {
  "Batting depth": [
    { role: "Opener", label: "Opener" }, { role: "Opener", label: "Opener" }, { role: "Middle", label: "Middle" },
    { role: "Middle", label: "Middle" }, { role: "Middle", label: "Middle" }, { role: "Middle", label: "Middle" },
    { role: "All-rounder", label: "All-rounder" }, { role: "Keeper", label: "Keeper" },
    { role: "Bowler", label: "Bowler" }, { role: "Bowler", label: "Bowler" }, { role: "Bowler", label: "Bowler" },
  ],
  "Extra bowler": [
    { role: "Opener", label: "Opener" }, { role: "Opener", label: "Opener" }, { role: "Middle", label: "Middle" },
    { role: "Middle", label: "Middle" }, { role: "Middle", label: "Middle" }, { role: "Keeper", label: "Keeper" },
    { role: "All-rounder", label: "All-rounder" }, { role: "Bowler", label: "Bowler" },
    { role: "Bowler", label: "Bowler" }, { role: "Bowler", label: "Bowler" }, { role: "Bowler", label: "Bowler" },
  ],
};

function ratingFor(player: DraftPlayer, slot: Role) {
  const base = slot === "Bowler" ? player.bowl : slot === "All-rounder" ? Math.round((player.bat + player.bowl) / 2) : player.bat;
  const fit = player.role === slot || (slot === "Middle" && ["Keeper", "All-rounder"].includes(player.role)) ? 8 : player.role === "All-rounder" ? 3 : -8;
  return Math.max(1, Math.min(100, base + fit + Math.round(player.clutch / 20)));
}

function randomItem<T>(items: T[]) { return items[Math.floor(Math.random() * items.length)]; }

export default function Home() {
  const [screen, setScreen] = useState<"setup" | "draft" | "result">("setup");
  const [mode, setMode] = useState<Mode>("Classic");
  const [lineup, setLineup] = useState<LineupKey>("Batting depth");
  const [rerollsStart, setRerollsStart] = useState(1);
  const [rerolls, setRerolls] = useState(1);
  const [current, setCurrent] = useState<{ franchise: string; season: number } | null>(null);
  const [picked, setPicked] = useState<(DraftPlayer | null)[]>(Array(11).fill(null));
  const [history, setHistory] = useState<string[]>([]);

  const slots = LINEUPS[lineup];
  const pickIndex = picked.findIndex((p) => !p);
  const currentSlot = pickIndex >= 0 ? slots[pickIndex] : null;

  const options = useMemo(() => {
    if (!current || !currentSlot) return [] as DraftPlayer[];
    const already = new Set(picked.filter(Boolean).map((p) => p!.name));
    return PLAYERS.filter(p => p.franchise === current.franchise && p.season <= current.season + 1 && p.season >= current.season - 3 && !already.has(p.name))
      .sort((a, b) => ratingFor(b, currentSlot.role) - ratingFor(a, currentSlot.role))
      .slice(0, 4);
  }, [current, currentSlot, picked]);

  function startGame() {
    setPicked(Array(11).fill(null));
    setCurrent(null); setRerolls(rerollsStart); setHistory([]); setScreen("draft");
  }
  function spin(useReroll = false) {
    if (useReroll && rerolls <= 0) return;
    if (useReroll) setRerolls(r => r - 1);
    const franchise = randomItem(FRANCHISES); const season = randomItem(SEASONS);
    setCurrent({ franchise, season });
    setHistory(h => [`${franchise} ${season}${useReroll ? " · reroll" : ""}`, ...h].slice(0, 6));
  }
  function pick(player: DraftPlayer) {
    if (pickIndex < 0) return;
    const next = [...picked]; next[pickIndex] = player; setPicked(next); setCurrent(null);
    if (pickIndex === 10) setScreen("result");
  }
  function reset() { setScreen("setup"); setCurrent(null); setPicked(Array(11).fill(null)); }

  const strength = picked.reduce((sum, p, i) => sum + (p ? ratingFor(p, slots[i].role) : 0), 0);
  const maxStrength = slots.length * 100;
  const bat = picked.reduce((s,p) => s + (p?.bat || 0), 0);
  const bowl = picked.reduce((s,p) => s + (p?.bowl || 0), 0);
  const recordWins = Math.min(16, Math.max(0, Math.round((strength / maxStrength) * 15 + (bowl > 560 ? 1 : 0))));

  return <main>
    <topbar><b>16-0</b><span>PLAY</span><span>LEADERBOARD</span></topbar>
    {screen === "setup" && <div className="shell setup">
      <section className="hero"><p className="eyebrow">THE ALL-TIME IPL DRAFT</p><h1>16<span>–</span>0</h1><p>Spin a franchise & a season. Draft one player into your XI. Repeat eleven times — then chase the <strong>perfect undefeated season.</strong></p><small>{rerollsStart} reroll · 11 picks · 1 shot at 16–0</small></section>
      <section className="panel"><p className="eyebrow">SET UP YOUR RUN</p><label>CHOOSE YOUR MODE</label><div className="grid two">{(["Classic","Cricket-IQ"] as Mode[]).map(m => <button key={m} onClick={() => setMode(m)} className={mode===m ? "card active" : "card"}><i /> <h3>{m} {m==="Cricket-IQ" && <em>HARD</em>}</h3><p>{m === "Classic" ? "Ratings visible. Draft with full information." : "Ratings hidden until you lock the XI. Pure ball knowledge."}</p></button>)}</div>
      <label>CHOOSE YOUR LINEUP</label><div className="grid two">{(["Batting depth","Extra bowler"] as LineupKey[]).map(l => <button key={l} onClick={() => setLineup(l)} className={lineup===l ? "card active" : "card"}><i /><h3>{l}</h3><p>{l === "Batting depth" ? "Stack the order — runs to spare, four frontline bowlers." : "Cover all 20 overs — five bowlers, a tighter batting line."}</p><b>{LINEUPS[l].filter(s=>s.role==="Opener").length} OPEN</b><b>{LINEUPS[l].filter(s=>s.role==="Middle").length} MID</b><b>{LINEUPS[l].filter(s=>s.role==="Bowler").length} BOWL</b></button>)}</div>
      <label>CHOOSE YOUR REROLLS</label><div className="grid three">{[0,1,3].map(n => <button key={n} onClick={() => setRerollsStart(n)} className={rerollsStart===n ? "card active compact" : "card compact"}><i /><h2>{n}</h2><p>{n===0 ? "Take what you spin." : n===1 ? "One mulligan in the tank." : "Spin freely for a better squad."}</p></button>)}</div><button className="primary" onClick={startGame}>START THE DRAFT →</button></section>
    </div>}

    {screen === "draft" && <div className="shell draft"><aside className="sidebar"><div className="score"><h2>16-0</h2><small>{mode} · {lineup} · {rerolls} rerolls</small></div><div className="meter"><p>SQUAD STRENGTH <span>{picked.filter(Boolean).length}/11 picked</span></p><strong>{strength ? Math.round(strength / Math.max(1,picked.filter(Boolean).length)) : "—"}</strong><div><mark style={{width:`${(bat/(bat+bowl||1))*100}%`}} /></div><small>BAT {bat}<span>BOWL {bowl}</span></small></div><div className="need">🧤 {currentSlot?.label || "Complete"} — needed</div><p className="eyebrow">YOUR XI</p>{slots.map((s,i)=><div key={i} className={i===pickIndex ? "slot live" : "slot"}><small>{s.label}</small><span>{picked[i]?.name || "Open"}</span></div>)}</aside>
    <section className="stage"><div className="stageHead"><p className="eyebrow">PICK {Math.min(pickIndex+1,11)} OF 11</p><h1>{current ? `${current.franchise} ${current.season}` : "Spin & draft"}</h1><p>REROLLS <b>{rerolls}</b></p></div>{!current ? <div className="spinbox"><p>Spin to reveal a franchise & season</p><button onClick={() => spin(false)} className="primary">◎ SPIN TO DRAFT</button></div> : <div className="options">{options.length ? options.map(p => <button key={p.name} className="player" onClick={() => pick(p)}><span>{p.role}</span><h2>{p.name}</h2><p>{p.franchise} · {p.season}</p>{mode === "Classic" && <div className="ratings"><b>BAT {p.bat}</b><b>BOWL {p.bowl}</b><b>FIT {currentSlot ? ratingFor(p,currentSlot.role) : 0}</b></div>}</button>) : <div className="spinbox"><p>No eligible players. Use a reroll.</p></div>}{rerolls > 0 && <button className="ghost" onClick={() => spin(true)}>REROLL THIS SPIN</button>}</div>}<div className="history">{history.map(h => <span key={h}>{h}</span>)}</div></section></div>}

    {screen === "result" && <div className="shell result"><section className="panel centered"><p className="eyebrow">FINAL SEASON</p><h1>{recordWins}-{16-recordWins}</h1><p className="summary">Squad strength {strength}/{maxStrength}. {recordWins === 16 ? "Perfect run. Dynasty unlocked." : recordWins >= 13 ? "Title contender. A few edges from 16-0." : "Good squad, but the league found weak links."}</p><div className="xi">{picked.map((p,i)=><div key={i} className="slot"><small>{slots[i].label}</small><span>{p?.name}</span></div>)}</div><button className="primary" onClick={reset}>PLAY AGAIN</button></section></div>}
    <footer>Inspired by 38-0 and 82-0 · Local demo data · Built with Next.js</footer>
  </main>;
}
