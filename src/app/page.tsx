"use client";

import { useEffect, useMemo, useState } from "react";

type Club = { id: string; name: string; city: string };

type Player = {
  id: number;
  clubId: string;
  name: string;
  level: string;
  points: number;
  wins: number;
  losses: number;
};

type Match = {
  id: number;
  clubId: string;
  date: string;
  teamA: number[];
  teamB: number[];
  score: string;
  winner: "A" | "B";
};

const initialClubs: Club[] = [
  { id: "san-fernando", name: "Club San Fernando", city: "Victoria" },
  { id: "bm-sports", name: "BM Sports", city: "Zona Norte" },
];

const initialPlayers: Player[] = [
  { id: 1, clubId: "san-fernando", name: "Nacho Rusconi", level: "5ta", points: 1240, wins: 8, losses: 3 },
  { id: 2, clubId: "san-fernando", name: "Fede Gandolfo", level: "5ta", points: 1195, wins: 6, losses: 4 },
  { id: 3, clubId: "san-fernando", name: "Mariano", level: "6ta", points: 1130, wins: 5, losses: 5 },
  { id: 4, clubId: "san-fernando", name: "Martin", level: "6ta", points: 1080, wins: 3, losses: 6 },
  { id: 5, clubId: "bm-sports", name: "Juan Cruz", level: "4ta", points: 1310, wins: 10, losses: 2 },
];



export default function Home() {
  const [clubs, setClubs] = useState(initialClubs);
  const [players, setPlayers] = useState(initialPlayers);
  const [matches, setMatches] = useState<Match[]>([]);
  useEffect(() => {
  const savedPlayers = localStorage.getItem("players");
  const savedMatches = localStorage.getItem("matches");
  const savedClubs = localStorage.getItem("clubs");

  if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
  if (savedMatches) setMatches(JSON.parse(savedMatches));
  if (savedClubs) setClubs(JSON.parse(savedClubs));
}, []);

useEffect(() => {
  localStorage.setItem("players", JSON.stringify(players));
}, [players]);

useEffect(() => {
  localStorage.setItem("matches", JSON.stringify(matches));
}, [matches]);

useEffect(() => {
  localStorage.setItem("clubs", JSON.stringify(clubs));
}, [clubs]);
  const [activeClubId, setActiveClubId] = useState("san-fernando");

  const [newClub, setNewClub] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [b1, setB1] = useState("");
  const [b2, setB2] = useState("");
  const [set1A, setSet1A] = useState("");
  const [set1B, setSet1B] = useState("");
  const [set2A, setSet2A] = useState("");
  const [set2B, setSet2B] = useState("");
  const [set3A, setSet3A] = useState("");
  const [set3B, setSet3B] = useState("");
  const [winner, setWinner] = useState<"A" | "B">("A");
  const [successMessage, setSuccessMessage] = useState("");
  const activeClub = clubs.find((c) => c.id === activeClubId);

  const ranking = useMemo(() => {
    return players
      .filter((p) => p.clubId === activeClubId)
      .sort((a, b) => b.points - a.points);
  }, [players, activeClubId]);

  const clubMatches = matches.filter((m) => m.clubId === activeClubId);
  const totalPlayers = ranking.length;

const totalMatches = clubMatches.length;

const leader = ranking[0]?.name ?? "Sin líder";

const averagePoints =
  ranking.length > 0
    ? Math.round(
        ranking.reduce((sum, player) => sum + player.points, 0) /
          ranking.length
      )
    : 0;

  function isPlayerSelected(playerId: number, currentValue: string) {
  const selected = [a1, a2, b1, b2].filter(Boolean);

  function calculateWinner() {
  let setsA = 0;
  let setsB = 0;

  [
    [set1A, set1B],
    [set2A, set2B],
    [set3A, set3B],
  ].forEach(([a, b]) => {
    if (a === "" || b === "") return;

    if (Number(a) > Number(b)) setsA++;
    if (Number(b) > Number(a)) setsB++;
  });

  if (setsA >= 2) return "A";
  if (setsB >= 2) return "B";

  return null;
}

  return (
    selected.includes(String(playerId)) &&
    currentValue !== String(playerId)
  );
}

  function playerName(id: number) {
    return players.find((p) => p.id === id)?.name ?? "Jugador";
  }

  function addClub() {
    if (!newClub.trim()) return;
    const id = newClub.toLowerCase().replaceAll(" ", "-");
    setClubs([...clubs, { id, name: newClub, city: "Argentina" }]);
    setActiveClubId(id);
    setNewClub("");
  }

  function addPlayer() {
    if (!newPlayer.trim()) return;

    setPlayers([
      ...players,
      {
        id: Date.now(),
        clubId: activeClubId,
        name: newPlayer,
        level: "6ta",
        points: 1000,
        wins: 0,
        losses: 0,
      },
    ]);

    setNewPlayer("");
  }
function buildScore() {
  const sets = [
    [set1A, set1B],
    [set2A, set2B],
    [set3A, set3B],
  ].filter(([a, b]) => a !== "" && b !== "");

  return sets.map(([a, b]) => `${a}-${b}`).join(" / ");
}

function calculateWinner() {
  let setsA = 0;
  let setsB = 0;

  [
    [set1A, set1B],
    [set2A, set2B],
    [set3A, set3B],
  ].forEach(([a, b]) => {
    if (a === "" || b === "") return;

    if (Number(a) > Number(b)) setsA++;
    if (Number(b) > Number(a)) setsB++;
  });

  if (setsA >= 2) return "A";
  if (setsB >= 2) return "B";

  return null;
}


  function registerMatch() {
    
    const finalScore = buildScore();
    const calculatedWinner = calculateWinner();

if (!calculatedWinner) {
  alert("El resultado todavía no define un ganador.");
  return;
}


if (!a1 || !b1 || !set1A || !set1B || !set2A || !set2B) {
  alert("Completá jugadores y al menos los dos primeros sets.");
  return;
}
const selectedPlayers = [a1, a2, b1, b2].filter(Boolean);

const uniquePlayers = new Set(selectedPlayers);

if (selectedPlayers.length !== uniquePlayers.size) {
  alert("No podés seleccionar el mismo jugador más de una vez.");
  return;
}

if (selectedPlayers.length < 2) {
  alert("Tenés que seleccionar jugadores.");
  return;
}
    const teamA = [Number(a1), Number(a2)].filter(Boolean);
    const teamB = [Number(b1), Number(b2)].filter(Boolean);

    const newMatch: Match = {
      id: Date.now(),
      clubId: activeClubId,
      date: new Date().toLocaleDateString("es-AR"),
      teamA,
      teamB,
      score: finalScore,
      winner: calculatedWinner,
    };

    const winners = calculatedWinner === "A" ? teamA : teamB;
    const losers = calculatedWinner === "A" ? teamB : teamA;

    setMatches([newMatch, ...matches]);
    setSuccessMessage("Partido guardado correctamente");

setTimeout(() => {
  setSuccessMessage("");
}, 3000);

    setPlayers((current) =>
      current.map((player) => {
        if (winners.includes(player.id)) {
          return { ...player, points: player.points + 20, wins: player.wins + 1 };
        }

        if (losers.includes(player.id)) {
          return { ...player, points: player.points - 10, losses: player.losses + 1 };
        }

        return player;
      })
    );

    setA1("");
    setA2("");
    setB1("");
    setB2("");
    setSet1A("");
    setSet1B("");
    setSet2A("");
    setSet2B("");
    setSet3A("");
    setSet3B("");
    setWinner("A");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {successMessage && (
  <div className="fixed right-6 top-6 z-50 rounded-2xl border border-emerald-300/30 bg-emerald-500 px-6 py-4 text-lg font-bold text-slate-950 shadow-2xl">
    ✅ {successMessage}
  </div>
)}
      <section
        className="relative h-[520px] bg-cover bg-center px-6 py-10"
        style={{ backgroundImage: "url('/hero-padel.png')" }}
      >
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center">
          <div className="max-w-2xl rounded-3xl bg-slate-950/70 p-8 shadow-2xl backdrop-blur">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-emerald-300">
              Padel Ranking
            </p>
            <h1 className="text-4xl font-black md:text-6xl">
              Ranking, partidos y evolución del club.
            </h1>
            <p className="mt-4 text-lg text-slate-200">
              Cargá resultados, actualizá puntos y seguí el rendimiento de cada jugador.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 grid gap-4 md:grid-cols-4">
  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
    <p className="text-sm text-slate-400">Jugadores</p>
    <h3 className="mt-2 text-3xl font-black">{totalPlayers}</h3>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
    <p className="text-sm text-slate-400">Partidos</p>
    <h3 className="mt-2 text-3xl font-black">{totalMatches}</h3>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
    <p className="text-sm text-slate-400">Líder</p>
    <h3 className="mt-2 text-2xl font-black">{leader}</h3>
  </div>

  <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
    <p className="text-sm text-slate-400">Promedio</p>
    <h3 className="mt-2 text-3xl font-black">{averagePoints}</h3>
  </div>
</div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-white/10 p-6">
            <h2 className="mb-4 text-xl font-semibold">Clubes</h2>

            <div className="space-y-3">
              {clubs.map((club) => (
                <button
                  key={club.id}
                  onClick={() => setActiveClubId(club.id)}
                  className={`w-full rounded-2xl p-4 text-left ${
                    activeClubId === club.id ? "bg-emerald-400 text-slate-950" : "bg-white/10"
                  }`}
                >
                  <strong>{club.name}</strong>
                  <p className="text-sm opacity-70">{club.city}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={newClub}
                onChange={(e) => setNewClub(e.target.value)}
                placeholder="Nuevo club"
                className="w-full rounded-xl bg-white p-3 text-slate-950 placeholder:text-slate-500"
              />
              <button onClick={addClub} className="rounded-xl bg-emerald-400 px-4 font-bold text-slate-950">
                +
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold">{activeClub?.name}</h2>
            <p className="mb-5 text-slate-400">Ranking actual del club</p>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Jugador</th>
                    <th className="p-3">Cat.</th>
                    <th className="p-3 text-right">Puntos</th>
                    <th className="p-3 text-right">Récord</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player, index) => (
                    <tr key={player.id} className="border-t border-white/10">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-semibold">{player.name}</td>
                      <td className="p-3">{player.level}</td>
                      <td className="p-3 text-right">{player.points}</td>
                      <td className="p-3 text-right">{player.wins}G / {player.losses}P</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                placeholder="Nuevo jugador"
                className="w-full rounded-xl bg-white p-3 text-slate-950 placeholder:text-slate-500"
              />
              <button onClick={addPlayer} className="rounded-xl bg-emerald-400 px-5 font-bold text-slate-950">
                Agregar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-6">
            <h2 className="mb-4 text-xl font-semibold">Cargar partido</h2>

            <div className="grid gap-3 md:grid-cols-2">
              <select value={a1} onChange={(e) => setA1(e.target.value)} className="rounded-xl bg-white p-3 text-slate-950">
                <option value="">Equipo A - Jugador 1</option>
               {ranking.map((p) => (
  <option key={p.id} value={p.id} disabled={isPlayerSelected(p.id, a1)}>
    {p.name}
  </option>
))}
              </select>

              <select value={a2} onChange={(e) => setA2(e.target.value)} className="rounded-xl bg-white p-3 text-slate-950">
                <option value="">Equipo A - Jugador 2</option>
                {ranking.map((p) => (
  <option key={p.id} value={p.id} disabled={isPlayerSelected(p.id, a2)}>
    {p.name}
  </option>
))}
              </select>

              <select value={b1} onChange={(e) => setB1(e.target.value)} className="rounded-xl bg-white p-3 text-slate-950">
                <option value="">Equipo B - Jugador 1</option>
                {ranking.map((p) => (
  <option key={p.id} value={p.id} disabled={isPlayerSelected(p.id, b1)}>
    {p.name}
  </option>
))}
              </select>

              <select value={b2} onChange={(e) => setB2(e.target.value)} className="rounded-xl bg-white p-3 text-slate-950">
                <option value="">Equipo B - Jugador 2</option>
                {ranking.map((p) => (
  <option key={p.id} value={p.id} disabled={isPlayerSelected(p.id, b2)}>
    {p.name}
  </option>
))}
              </select>

<div className="grid gap-3 rounded-2xl bg-white/10 p-4 md:col-span-2">
  <p className="font-semibold text-white">Resultado por sets</p>

  <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-3">
    <span className="text-slate-300">Set 1</span>
    <input value={set1A} onChange={(e) => setSet1A(e.target.value)} placeholder="A" className="rounded-xl bg-white p-3 text-slate-950" />
    <input value={set1B} onChange={(e) => setSet1B(e.target.value)} placeholder="B" className="rounded-xl bg-white p-3 text-slate-950" />
  </div>

  <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-3">
    <span className="text-slate-300">Set 2</span>
    <input value={set2A} onChange={(e) => setSet2A(e.target.value)} placeholder="A" className="rounded-xl bg-white p-3 text-slate-950" />
    <input value={set2B} onChange={(e) => setSet2B(e.target.value)} placeholder="B" className="rounded-xl bg-white p-3 text-slate-950" />
  </div>

  <div className="grid grid-cols-[80px_1fr_1fr] items-center gap-3">
    <span className="text-slate-300">Set 3</span>
    <input value={set3A} onChange={(e) => setSet3A(e.target.value)} placeholder="A" className="rounded-xl bg-white p-3 text-slate-950" />
    <input value={set3B} onChange={(e) => setSet3B(e.target.value)} placeholder="B" className="rounded-xl bg-white p-3 text-slate-950" />
  </div>
</div>


              <button onClick={registerMatch} className="rounded-xl bg-emerald-400 p-3 font-bold text-slate-950 md:col-span-2">
                Guardar partido
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <h2 className="mb-4 text-xl font-semibold">Historial</h2>

            {clubMatches.length === 0 ? (
              <p className="text-slate-400">Todavía no hay partidos cargados.</p>
            ) : (
              <div className="space-y-3">
                {clubMatches.map((match) => (
                  <div key={match.id} className="rounded-2xl bg-white/10 p-4">
                    <p className="text-sm text-slate-400">{match.date}</p>
                    <p>{match.teamA.map(playerName).join(" / ")}</p>
                    <p className="text-slate-400">vs</p>
                    <p>{match.teamB.map(playerName).join(" / ")}</p>
                    <p className="mt-2 font-bold text-emerald-300">
                      {match.score} · Ganó Equipo {match.winner}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}