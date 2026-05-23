"use client";

import { useMemo, useState } from "react";

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
  teamA: string;
  teamB: string;
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
  { id: 4, clubId: "bm-sports", name: "Juan Cruz", level: "4ta", points: 1310, wins: 10, losses: 2 },
];

export default function Home() {
  const [clubs, setClubs] = useState(initialClubs);
  const [players, setPlayers] = useState(initialPlayers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activeClubId, setActiveClubId] = useState("san-fernando");

  const [newClub, setNewClub] = useState("");
  const [newPlayer, setNewPlayer] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [score, setScore] = useState("");
  const [winner, setWinner] = useState<"A" | "B">("A");

  const activeClub = clubs.find((c) => c.id === activeClubId);

  const ranking = useMemo(() => {
    return players
      .filter((p) => p.clubId === activeClubId)
      .sort((a, b) => b.points - a.points);
  }, [players, activeClubId]);

  const clubMatches = matches.filter((m) => m.clubId === activeClubId);

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

  function registerMatch() {
    if (!teamA.trim() || !teamB.trim() || !score.trim()) return;

    const newMatch: Match = {
      id: Date.now(),
      clubId: activeClubId,
      date: new Date().toLocaleDateString("es-AR"),
      teamA,
      teamB,
      score,
      winner,
    };

    setMatches([newMatch, ...matches]);

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) => {
        const isTeamA = teamA.toLowerCase().includes(player.name.toLowerCase());
        const isTeamB = teamB.toLowerCase().includes(player.name.toLowerCase());

        if (!isTeamA && !isTeamB) return player;

        const playerWon = winner === "A" ? isTeamA : isTeamB;

        return {
          ...player,
          points: player.points + (playerWon ? 20 : -10),
          wins: player.wins + (playerWon ? 1 : 0),
          losses: player.losses + (playerWon ? 0 : 1),
        };
      })
    );

    setTeamA("");
    setTeamB("");
    setScore("");
    setWinner("A");
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8 text-white">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-emerald-500 p-8 text-slate-950">
          <h1 className="text-4xl font-bold">Ranking de Pádel</h1>
          <p className="mt-3 text-lg">MVP multi-club con ranking y carga de partidos.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
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
                className="w-full rounded-xl p-3 text-slate-950"
              />
              <button onClick={addClub} className="rounded-xl bg-emerald-400 px-4 font-bold text-slate-950">
                +
              </button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6 md:col-span-2">
            <h2 className="text-2xl font-semibold">{activeClub?.name}</h2>
            <p className="mb-5 text-slate-400">Ranking actual del club</p>

            <table className="w-full overflow-hidden rounded-2xl text-left">
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

            <div className="mt-5 flex gap-2">
              <input
                value={newPlayer}
                onChange={(e) => setNewPlayer(e.target.value)}
                placeholder="Nuevo jugador"
                
              />
              <button onClick={addPlayer} className="rounded-xl bg-emerald-400 px-5 font-bold text-slate-950">
                Agregar
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-6">
            <h2 className="mb-4 text-xl font-semibold">Cargar partido</h2>

            <div className="space-y-3">
              <input value={teamA} onChange={(e) => setTeamA(e.target.value)} placeholder="Equipo A: Nacho Rusconi / Fede Gandolfo" className="w-full rounded-xl bg-white p-3 text-slate-950 placeholder:text-slate-500" />
              <input value={teamB} onChange={(e) => setTeamB(e.target.value)} placeholder="Equipo B: Mariano / Juan Cruz" className="w-full rounded-xl bg-white p-3 text-slate-950 placeholder:text-slate-500" />
              <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="Resultado: 6-4 6-3" className="w-full rounded-xl bg-white p-3 text-slate-950 placeholder:text-slate-500" />

              <select value={winner} onChange={(e) => setWinner(e.target.value as "A" | "B")} className="w-full rounded-xl bg-white p-3 text-slate-950 placeholder:text-slate-500">
                <option value="A">Ganó Equipo A</option>
                <option value="B">Ganó Equipo B</option>
              </select>

              <button onClick={registerMatch} className="w-full rounded-xl bg-emerald-400 p-3 font-bold text-slate-950">
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
                    <p>{match.teamA}</p>
                    <p className="text-slate-400">vs</p>
                    <p>{match.teamB}</p>
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