"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Club = { id: string; name: string; city: string };

type Activity = {
  id: number;
  clubId: string;
  date: string;
  message: string;
};

type Player = {
  avatarUrl?: string;
  bio?: string;
  racketBrand?: string;
  racketModel?: string;
  preferredSide?: string;
  dominantHand?: string;
  playStyle?: string;
  favoriteShot?: string;
  id: string;
  clubId: string;
  name: string;
  level: string;
  elo: number;
  wins: number;
  losses: number;
};

type Match = {
  id: number;
  clubId: string;
  date: string;
  teamA: string[];
  teamB: string[];
  score: string;
  winner: "A" | "B";
};

const initialClubs: Club[] = [
  { id: "san-fernando", name: "Club San Fernando", city: "Victoria" },
  { id: "bm-sports", name: "BM Sports", city: "Zona Norte" },
];

const initialPlayers: Player[] = [
  { id: "1", clubId: "san-fernando", name: "Nacho Rusconi", level: "5ta", elo: 1240, wins: 8, losses: 3 },
  { id: "2", clubId: "san-fernando", name: "Fede Gandolfo", level: "5ta", elo: 1195, wins: 6, losses: 4 },
  { id: "3", clubId: "san-fernando", name: "Mariano", level: "6ta", elo: 1130, wins: 5, losses: 5 },
  { id: "4", clubId: "san-fernando", name: "Martin", level: "6ta", elo: 1080, wins: 3, losses: 6 },
];

const K_FACTOR = 32;
const MAX_INDIVIDUAL_SHIFT = 0.35;
const SKILL_GAP_DIVISOR = 1000;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function expectedScore(teamElo: number, opponentTeamElo: number) {
  return 1 / (1 + Math.pow(10, (opponentTeamElo - teamElo) / 400));
}

function individualWinWeight(playerElo: number, partnerElo: number) {
  const skillGap = playerElo - partnerElo;
  const shift = clamp(
    skillGap / SKILL_GAP_DIVISOR,
    -MAX_INDIVIDUAL_SHIFT,
    MAX_INDIVIDUAL_SHIFT
  );

  return 0.5 - shift;
}

function individualLossWeight(playerElo: number, partnerElo: number) {
  const skillGap = playerElo - partnerElo;
  const shift = clamp(
    skillGap / SKILL_GAP_DIVISOR,
    -MAX_INDIVIDUAL_SHIFT,
    MAX_INDIVIDUAL_SHIFT
  );

  return 0.5 + shift;
}

export default function Home() {
  const [clubs, setClubs] = useState(initialClubs);
  const [players, setPlayers] = useState(initialPlayers);
  const [matches, setMatches] = useState<Match[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
useEffect(() => {
  async function loadData() {




    const { data: clubsData, error: clubsError } = await supabase
      .from("clubs")
      .select("*")
      .order("created_at", { ascending: true });

    if (clubsError) {
      console.log("ERROR LOADING CLUBS:", clubsError);
    }

    if (clubsData && clubsData.length > 0) {
      setClubs(
        clubsData.map((club) => ({
          id: club.id,
          name: club.name,
          city: club.city ?? "Argentina",
        }))
      );


      

      setActiveClubId(clubsData[0].id);
    }





    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .order("created_at", { ascending: true });

    if (playersError) {
      console.log("ERROR LOADING PLAYERS:", playersError);
    }

if (playersData) {
  setPlayers(
    playersData.map((player: any) => ({
      id: player.id,
      clubId: player.club_id,
      name: `${player.first_name} ${player.last_name}`,
      level: "9na",
      elo: player.elo,
      wins: player.wins,
      losses: player.losses,

      avatarUrl: player.avatar_url ?? "",
      bio: player.bio ?? "",
      racketBrand: player.racket_brand ?? "",
      racketModel: player.racket_model ?? "",
      preferredSide: player.preferred_side ?? "",
      dominantHand: player.dominant_hand ?? "",
      playStyle: player.play_style ?? "",
      favoriteShot: player.favorite_shot ?? "",
    }))
  );
}
const { data: matchesData, error: matchesError } = await supabase
  .from("matches")
  .select("*")
  .order("created_at", { ascending: false });

if (matchesError) {
  console.log("ERROR LOADING MATCHES:", matchesError);
}

if (matchesData) {
  setMatches(
    matchesData.map((match) => ({
      id: Date.now() + Math.random(),
      clubId: match.club_id,
      date: new Date(match.created_at).toLocaleDateString("es-AR"),
      teamA: [match.team_a_player_1, match.team_a_player_2].filter(Boolean),
      teamB: [match.team_b_player_1, match.team_b_player_2].filter(Boolean),
      score: match.score,
      winner: match.winner,
    }))
  );
}



  }

  

  loadData();
}, []);

useEffect(() => {
  localStorage.setItem("players", JSON.stringify(players));
}, [players]);

useEffect(() => {
  localStorage.setItem("activities", JSON.stringify(activities));
}, [activities]);

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
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);

const [profileForm, setProfileForm] = useState({
  avatarUrl: "",
  bio: "",
  racketBrand: "",
  racketModel: "",
  preferredSide: "",
  dominantHand: "",
  playStyle: "",
  favoriteShot: "",
});

  const ranking = useMemo(() => {
    return players
      .filter((p) => p.clubId === activeClubId)
      .sort((a, b) => b.elo - a.elo);
  }, [players, activeClubId]);

  const clubMatches = matches.filter((m) => m.clubId === activeClubId);
  const totalPlayers = ranking.length;

const totalMatches = clubMatches.length;

const leader = ranking[0]?.name ?? "Sin líder";
const clubActivities = activities.filter(
  (a) => a.clubId === activeClubId
);
const averageElo =
  ranking.length > 0
    ? Math.round(
        ranking.reduce((sum, player) => sum + player.elo, 0) /
          ranking.length
      )
    : 0;

  function isPlayerSelected(playerId: string, currentValue: string) {
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

  function playerName(id: string) {
    return players.find((p) => p.id === id)?.name ?? "Jugador";
  }

async function addClub() {
  if (!newClub.trim()) return;

  const { data, error } = await supabase
    .from("clubs")
    .insert([
      {
        name: newClub,
        city: "Argentina",
      },
    ])
    .select();

  console.log("SUPABASE CLUB INSERT:", data, error);

  if (data && data[0]) {
    setClubs([...clubs, data[0]]);
    setActiveClubId(data[0].id);
    setNewClub("");
  }
}

  async function addPlayer() {
  if (!newPlayer.trim()) return;

  const nameParts = newPlayer.trim().split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ") || "-";

  const { data, error } = await supabase
    .from("players")
    .insert([
      {
        club_id: activeClubId,
        first_name: firstName,
        last_name: lastName,
        elo: 800,
        wins: 0,
        losses: 0,
      },
    ])
    .select();

  console.log("SUPABASE PLAYER INSERT:", data, error);

  if (data && data[0]) {
    const newPlayerFromDb = {
      id: data[0].id,
      clubId: data[0].club_id,
      name: `${data[0].first_name} ${data[0].last_name}`,
      level: "9na",
      elo: data[0].elo,
      wins: data[0].wins,
      losses: data[0].losses,
    };

    setPlayers([...players, newPlayerFromDb]);
    setNewPlayer("");
  }
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

function getCategoryFromElo(elo: number) {
  if (elo >= 1600) return "1ra";
  if (elo >= 1500) return "2da";
  if (elo >= 1400) return "3ra";
  if (elo >= 1300) return "4ta";
  if (elo >= 1200) return "5ta";
  if (elo >= 1100) return "6ta";
  if (elo >= 1000) return "7ma";
  if (elo >= 900) return "8va";

  return "9na";
}

  async function registerMatch() {
    
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
    const teamA = [a1, a2].filter(Boolean);
    const teamB = [b1, b2].filter(Boolean);

    const newMatch: Match = {
      id: Date.now(),
      clubId: activeClubId,
      date: new Date().toLocaleDateString("es-AR"),
      teamA,
      teamB,
      score: finalScore,
      winner: calculatedWinner,
    };


    const { data: insertedMatch, error: matchInsertError } = await supabase
  .from("matches")
  .insert([
    {
      club_id: activeClubId,
      team_a:teamA,
      team_b:teamB,
      team_a_player_1: teamA[0] ?? null,
      team_a_player_2: teamA[1] ?? null,
      team_b_player_1: teamB[0] ?? null,
      team_b_player_2: teamB[1] ?? null,
      score: finalScore,
      winner: calculatedWinner,
    },
  ])
  .select();

console.log("MATCH INSERT:", insertedMatch, matchInsertError);

if (matchInsertError) {
  alert("Error guardando el partido en Supabase.");
  return;
}
    const winners = calculatedWinner === "A" ? teamA : teamB;
    const losers = calculatedWinner === "A" ? teamB : teamA;

    setMatches([
  {
    ...newMatch,
    id: Date.now(),
  },
  ...matches,
]);
    setSuccessMessage("Partido guardado correctamente");

    const winnerTeam = calculatedWinner === "A" ? teamA : teamB;
const loserTeam = calculatedWinner === "A" ? teamB : teamA;

const activity: Activity = {
  id: Date.now(),
  clubId: activeClubId,
  date: new Date().toLocaleString("es-AR"),
  message: `🎾 ${winnerTeam.map(playerName).join(" / ")} venció a ${loserTeam
    .map(playerName)
    .join(" / ")} por ${finalScore}`,
};
const clubActivities = activities.filter((a) => a.clubId === activeClubId);
setActivities([activity, ...activities]);

setTimeout(() => {
  setSuccessMessage("");
}, 3000);

const playerById = Object.fromEntries(
  players.map((player) => [player.id, player])
);

const avgTeamA =
  teamA.reduce((sum, id) => sum + playerById[id].elo, 0) / teamA.length;

const avgTeamB =
  teamB.reduce((sum, id) => sum + playerById[id].elo, 0) / teamB.length;

const expectedA = expectedScore(avgTeamA, avgTeamB);
const expectedB = expectedScore(avgTeamB, avgTeamA);

const scoreA = calculatedWinner === "A" ? 1 : 0;
const scoreB = calculatedWinner === "B" ? 1 : 0;

const teamADelta = Math.round(K_FACTOR * (scoreA - expectedA));
const teamBDelta = Math.round(K_FACTOR * (scoreB - expectedB));

function getPartnerId(playerId: string, team: string[]) {
  return team.find((id) => id !== playerId);
}

function calculateIndividualDelta(
  playerId: string,
  team: string[],
  teamDelta: number,
  teamWon: boolean
) {
  const partnerId = getPartnerId(playerId, team);

  if (!partnerId) {
    return teamDelta;
  }

  const playerElo = playerById[playerId].elo;
  const partnerElo = playerById[partnerId].elo;

  if (teamWon) {
    return Math.round(
      Math.abs(teamDelta) * individualWinWeight(playerElo, partnerElo)
    );
  }

  return -Math.round(
    Math.abs(teamDelta) * individualLossWeight(playerElo, partnerElo)
  );
}

const eloDeltas: Record<string, number> = {};

teamA.forEach((playerId) => {
  eloDeltas[playerId] = calculateIndividualDelta(
    playerId,
    teamA,
    teamADelta,
    calculatedWinner === "A"
  );
});

teamB.forEach((playerId) => {
  eloDeltas[playerId] = calculateIndividualDelta(
    playerId,
    teamB,
    teamBDelta,
    calculatedWinner === "B"
  );
});

setPlayers((current) =>
  current.map((player) => {
    const delta = eloDeltas[player.id];

    if (delta === undefined) return player;

    const playerWon = winners.includes(player.id);

    return {
      ...player,
      elo: player.elo + delta,
      wins: playerWon ? player.wins + 1 : player.wins,
      losses: playerWon ? player.losses : player.losses + 1,
    };
  })
);

  const updatedPlayers = players.map((player) => {
  const delta = eloDeltas[player.id];

  if (delta === undefined) return player;

  const playerWon = winners.includes(player.id);

  return {
    ...player,
    elo: player.elo + delta,
    wins: playerWon ? player.wins + 1 : player.wins,
    losses: playerWon ? player.losses : player.losses + 1,
  };
});

console.log("PLAYERS TO UPDATE:", updatedPlayers);

const updateResults = await Promise.all(
  updatedPlayers
    .filter((player) => eloDeltas[player.id] !== undefined)
    .map((player) =>
      supabase
        .from("players")
        .update({
          elo: player.elo,
          wins: player.wins,
          losses: player.losses,
        })
        .eq("id", player.id)
        .select()
    )
);

console.log("SUPABASE UPDATE RESULTS:", updateResults);

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

  function startEditingProfile(player: Player) {
  console.log("EDITING PLAYER:", player);

  setProfileForm({
    avatarUrl: player.avatarUrl ?? "",
    bio: player.bio ?? "",
    racketBrand: player.racketBrand ?? "",
    racketModel: player.racketModel ?? "",
    preferredSide: player.preferredSide ?? "",
    dominantHand: player.dominantHand ?? "",
    playStyle: player.playStyle ?? "",
    favoriteShot: player.favoriteShot ?? "",
  });

  setIsEditingProfile(true);
}
async function savePlayerProfile() {
  if (!selectedPlayer) return;

  const { error } = await supabase
    .from("players")
    .update({
  avatar_url: profileForm.avatarUrl,
  bio: profileForm.bio,
  racket_brand: profileForm.racketBrand,
  racket_model: profileForm.racketModel,

  preferred_side: profileForm.preferredSide,
  dominant_hand: profileForm.dominantHand,
  play_style: profileForm.playStyle,
  favorite_shot: profileForm.favoriteShot,
})
    .eq("id", selectedPlayer.id);

  if (error) {
    console.log("ERROR UPDATING PROFILE:", error);
    alert("No se pudo guardar el perfil.");
    return;
  }

  const updatedPlayer: Player = {
    ...selectedPlayer,
    avatarUrl: profileForm.avatarUrl,
    bio: profileForm.bio,
    racketBrand: profileForm.racketBrand,
    racketModel: profileForm.racketModel,
    preferredSide: profileForm.preferredSide,
    dominantHand: profileForm.dominantHand,
    playStyle: profileForm.playStyle,
    favoriteShot: profileForm.favoriteShot,
  };

  setPlayers((current) =>
    current.map((player) =>
      player.id === selectedPlayer.id ? updatedPlayer : player
    )
  );

  setSelectedPlayer(updatedPlayer);
  setIsEditingProfile(false);
}


async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
  if (!selectedPlayer) return;

  const file = event.target.files?.[0];
  if (!file) return;

  const fileExt = file.name.split(".").pop();
  const filePath = selectedPlayer.id + "-" + Date.now() + "." + fileExt;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file);

  if (uploadError) {
    console.log("ERROR UPLOADING AVATAR:", uploadError);
    alert("No se pudo subir la foto.");
    return;
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

const publicUrl = data.publicUrl;

console.log("PUBLIC AVATAR URL:", publicUrl);

setProfileForm((current) => {
  const next = {
    ...current,
    avatarUrl: publicUrl,
  };

  console.log("NEXT PROFILE FORM:", next);

  return next;
});

}
function getVisibleAvatarUrl() {
  if (isEditingProfile && profileForm.avatarUrl) {
    return profileForm.avatarUrl;
  }

  return selectedPlayer?.avatarUrl ?? "";
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
    <p className="text-4xl font-bold">
  {ranking.length > 0
    ? Math.round(
        ranking.reduce((sum, player) => sum + player.elo, 0) /
          ranking.length
      )
    : 0}
</p>
  </div>
</div>
<div className="mt-6 rounded-3xl bg-white/10 p-6">
  <h2 className="mb-2 text-xl font-semibold">Última actividad</h2>

  {clubActivities.length === 0 ? (
    <p className="text-slate-400">Todavía no hay actividad registrada.</p>
  ) : (
    <div className="space-y-3">
      {clubActivities.slice(0, 5).map((activity) => (
        <div key={activity.id} className="rounded-2xl bg-white/10 p-4">
          <p className="text-sm text-slate-400">{activity.date}</p>
          <p className="mt-1 font-medium">{activity.message}</p>
        </div>
      ))}
    </div>
  )}
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
            <div className="mb-6 overflow-hidden rounded-2xl bg-white p-4">
  <img
    src="/BMSports.jpeg"
    alt="BM Sports"
    className="h-20 w-full object-contain"
  />
</div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm md:text-base">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-3">#</th>
                    <th className="p-3">Jugador</th>
                    <th className="p-3">Cat.</th>
                    <th className="p-3 text-right">ELO</th>
                    <th className="p-3 text-right">Récord</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player, index) => (
                    <tr
  key={player.id}
  onClick={() => {
  setSelectedPlayer(player);
  setIsEditingProfile(false);
}}
  className={`cursor-pointer border-t border-white/10 transition-all duration-300 hover:bg-white/10 ${
    index === 0 ? "bg-emerald-400/10" : ""
  }`}
>
                      <td className="p-3">
  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
</td>
                      <td className={`p-3 font-semibold ${index === 0 ? "text-emerald-300" : ""}`}>
  <div className="flex items-center gap-3">
  {player.avatarUrl ? (
    <img
      src={player.avatarUrl}
      alt={player.name}
      className="h-10 w-10 rounded-full object-cover border border-white/20"
    />
  ) : (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 font-bold text-black">
      {player.name.charAt(0)}
    </div>
  )}

  <div>
    <p className="font-semibold">{player.name}</p>

    {player.racketBrand && (
      <p className="text-xs text-slate-400">
        {player.racketBrand} {player.racketModel}
      </p>
    )}
  </div>
</div>




</td>
                      <td className="p-3">{getCategoryFromElo(player.elo)}</td>
                      <td className="p-3 text-right">{player.elo}</td>
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
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  }}
  placeholder="Nombre y apellido"
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

  <div className="grid grid-cols-[80px_70px_70px] items-center gap-3">
    <span className="text-slate-300">Set 1</span>
    <input value={set1A} onChange={(e) => setSet1A(e.target.value)} placeholder="A" className="h-12 w-[70px] rounded-xl bg-white text-center text-xl font-bold text-slate-950" />
    <input value={set1B} onChange={(e) => setSet1B(e.target.value)} placeholder="B" className="h-12 w-[70px] rounded-xl bg-white text-center text-xl font-bold text-slate-950" />
  </div>

  <div className="grid grid-cols-[80px_70px_70px] items-center gap-3">
    <span className="text-slate-300">Set 2</span>
    <input value={set2A} onChange={(e) => setSet2A(e.target.value)} placeholder="A" className="h-12 w-[70px] rounded-xl bg-white text-center text-xl font-bold text-slate-950" />
    <input value={set2B} onChange={(e) => setSet2B(e.target.value)} placeholder="B" className="h-12 w-[70px] rounded-xl bg-white text-center text-xl font-bold text-slate-950" />
  </div>

  <div className="grid grid-cols-[80px_70px_70px] items-center gap-3">
    <span className="text-slate-300">Set 3</span>
    <input value={set3A} onChange={(e) => setSet3A(e.target.value)} placeholder="A" className="h-12 w-[70px] rounded-xl bg-white text-center text-xl font-bold text-slate-950" />
    <input value={set3B} onChange={(e) => setSet3B(e.target.value)} placeholder="B" className="h-12 w-[70px] rounded-xl bg-white text-center text-xl font-bold text-slate-950" />
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

      {selectedPlayer && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-slate-900 p-6 text-white shadow-2xl">
      <div className="mb-5 flex flex-wrap gap-2">
  <button
    type="button"
    onClick={() => {
      setSelectedPlayer(null);
      setIsEditingProfile(false);
    }}
    className="rounded-full bg-white/10 px-3 py-1 text-sm"
  >
    Cerrar
  </button>

  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      if (!selectedPlayer) return;
      startEditingProfile(selectedPlayer);
    }}
    className="rounded-full bg-emerald-400 px-3 py-1 text-sm font-bold text-slate-950"
  >
    Editar perfil
  </button>

  {isEditingProfile && (
    <button
      type="button"
      onClick={savePlayerProfile}
      className="rounded-full bg-cyan-400 px-3 py-1 text-sm font-bold text-slate-950"
    >
      Guardar perfil
    </button>
  )}
</div>

{isEditingProfile && (
  <div className="mb-5 space-y-3 rounded-2xl bg-white/10 p-4">
    <p className="font-bold text-emerald-300">Editando perfil</p>

    <input
  type="file"
  accept="image/*"
  onChange={uploadAvatar}
  className="w-full rounded-xl bg-white p-3 text-slate-950"
/>

    <input
      value={profileForm.racketBrand}
      onChange={(e) =>
        setProfileForm({ ...profileForm, racketBrand: e.target.value })
      }
      placeholder="Marca de paleta"
      className="w-full rounded-xl bg-white p-3 text-slate-950"
    />

    <input
      value={profileForm.racketModel}
      onChange={(e) =>
        setProfileForm({ ...profileForm, racketModel: e.target.value })
      }
      placeholder="Modelo de paleta"
      className="w-full rounded-xl bg-white p-3 text-slate-950"
    />

    {profileForm.avatarUrl && (
  <img
    src={profileForm.avatarUrl}
    alt="Preview avatar"
    className="h-20 w-20 rounded-full object-cover"
  />
)}

    <select
  value={profileForm.preferredSide}
  onChange={(e) =>
    setProfileForm({ ...profileForm, preferredSide: e.target.value })
  }
  className="w-full rounded-xl bg-white p-3 text-slate-950"
>
  <option value="">Lado preferido</option>
  <option value="Derecha">Derecha</option>
  <option value="Revés">Revés</option>
  <option value="Ambos">Ambos</option>
</select>

<select
  value={profileForm.dominantHand}
  onChange={(e) =>
    setProfileForm({ ...profileForm, dominantHand: e.target.value })
  }
  className="w-full rounded-xl bg-white p-3 text-slate-950"
>
  <option value="">Mano hábil</option>
  <option value="Derecho">Derecho</option>
  <option value="Zurdo">Zurdo</option>
</select>

<select
  value={profileForm.playStyle}
  onChange={(e) =>
    setProfileForm({ ...profileForm, playStyle: e.target.value })
  }
  className="w-full rounded-xl bg-white p-3 text-slate-950"
>
  <option value="">Estilo de juego</option>
  <option value="Ofensivo">Ofensivo</option>
  <option value="Defensivo">Defensivo</option>
  <option value="Táctico">Táctico</option>
  <option value="Potente">Potente</option>
  <option value="Consistente">Consistente</option>
</select>

<input
  value={profileForm.favoriteShot}
  onChange={(e) =>
    setProfileForm({ ...profileForm, favoriteShot: e.target.value })
  }
  placeholder="Golpe favorito"
  className="w-full rounded-xl bg-white p-3 text-slate-950"
/>

    <textarea
      value={profileForm.bio}
      onChange={(e) =>
        setProfileForm({ ...profileForm, bio: e.target.value })
      }
      placeholder="Bio corta"
      className="w-full rounded-xl bg-white p-3 text-slate-950"
    />
  </div>
)}

      <div className="flex items-center gap-4">
  {getVisibleAvatarUrl() ? (
    <img
      key={getVisibleAvatarUrl()}
      src={getVisibleAvatarUrl()}
      alt={selectedPlayer.name}
      className="h-20 w-20 rounded-full object-cover"
    />
  ) : (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400 text-3xl font-black text-slate-950">
      {selectedPlayer.name.charAt(0)}
    </div>
  )}

  <div>
    <h2 className="text-2xl font-black">{selectedPlayer.name}</h2>
    <p className="text-slate-400">{getCategoryFromElo(selectedPlayer.elo)}</p>
  </div>
</div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/10 p-4 text-center">
          <p className="text-sm text-slate-400">ELO</p>
          <p className="text-2xl font-black text-emerald-300">{selectedPlayer.elo}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4 text-center">
          <p className="text-sm text-slate-400">Ganados</p>
          <p className="text-2xl font-black">{selectedPlayer.wins}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4 text-center">
          <p className="text-sm text-slate-400">Perdidos</p>
          <p className="text-2xl font-black">{selectedPlayer.losses}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl bg-white/10 p-4">
        <p><strong>Paleta:</strong> {selectedPlayer.racketBrand || "-"} {selectedPlayer.racketModel || ""}</p>
        <p><strong>Lado:</strong> {selectedPlayer.preferredSide || "-"}</p>
        <p><strong>Mano:</strong> {selectedPlayer.dominantHand || "-"}</p>
        <p><strong>Estilo:</strong> {selectedPlayer.playStyle || "-"}</p>
        <p><strong>Golpe favorito:</strong> {selectedPlayer.favoriteShot || "-"}</p>
      </div>

      {selectedPlayer.bio && (
        <p className="mt-5 rounded-2xl bg-white/10 p-4 text-slate-200">
          “{selectedPlayer.bio}”
        </p>
      )}
    </div>
  </div>
)}
    </main>
  );
}