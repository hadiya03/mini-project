import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import "./styles/teamAnalytics.css";

const TeamAnalytics = () => {
  const [players, setPlayers] = useState([]);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [bestTeam, setBestTeam] = useState({
    startingXI: [],
    substitutes: []
  });

  useEffect(() => {
    fetchPlayers();
    fetchLastTeam();
  }, []);

  const fetchLastTeam = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/trainer/last-team", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data) {
        setTeamA(data.team_a || []);
        setTeamB(data.team_b || []);
        setBestTeam(data.best_team || { startingXI: [], substitutes: [] });
      }
    } catch (err) {
      console.error("Error fetching last team:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/trainer/trainer-players", {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      const data = await res.json();
      if (!Array.isArray(data)) return;
      const mapped = data.map((p) => ({
        ...p,
        score: Number(p.readiness_score) || 0,
      }));
      setPlayers(mapped);
    } catch (err) {
      console.error("failed to fetch players", err);
    }
  };

  /* ---- position helpers ---- */
  const POS_MAP = {
    Goalkeeper: "GK",
    Defender: "DEF",
    Midfielder: "MID",
    Forward: "FWD",
  };

  const getCategory = (pos) => {
    if (!pos) return "FWD";
    const lower = pos.toLowerCase();
    if (lower.includes("goal") || lower.includes("keeper") || lower === "gk") return "GK";
    if (lower.includes("defen") || lower.includes("back") || lower === "def" || lower === "cb" || lower === "lb" || lower === "rb") return "DEF";
    if (lower.includes("mid") || lower === "cm" || lower === "cdm" || lower === "cam") return "MID";
    return "FWD";
  };

  /* ---- shuffle teams ---- */
  const shuffleTeams = async () => {
    const goalkeepers = players.filter(p => p.position === "Goalkeeper");
    const others = players.filter(p => p.position !== "Goalkeeper");
    const shuffled = [...others].sort(() => Math.random() - 0.5);

    let newA = [];
    let newB = [];

    if (goalkeepers.length >= 2) {
      newA.push(goalkeepers[0]);
      newB.push(goalkeepers[1]);
    } else if (goalkeepers.length === 1) {
      newA.push(goalkeepers[0]);
    }

    shuffled.forEach((player, index) => {
      if (index % 2 === 0) newA.push(player);
      else newB.push(player);
    });

    setTeamA(newA);
    setTeamB(newB);
    await saveTeam(newA, newB, bestTeam);
  };

  /* ---- evaluation ---- */
  const evaluate = (team) => {
    if (!team || !team.startingXI) return 0;
    return team.startingXI.reduce((sum, p) => sum + (p.score || 0), 0);
  };

  /* ---- formation-based best XI ---- */
  const FORMATION = { GK: 1, DEF: 4, MID: 3, FWD: 3 };

  const generateBestTeam = async () => {
    if (players.length < 11) {
      toast.error("Not enough players to form a team (need at least 11)");
      return;
    }

    // Group players by position category
    const groups = { GK: [], DEF: [], MID: [], FWD: [] };
    players.forEach(p => {
      const cat = getCategory(p.position);
      groups[cat].push(p);
    });

    // Sort each group by readiness score descending
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => (b.score || 0) - (a.score || 0));
    });

    const startingXI = [];
    const usedIds = new Set();

    // Pick best players per position according to formation
    for (const [cat, count] of Object.entries(FORMATION)) {
      const available = groups[cat].filter(p => !usedIds.has(p.id));
      const picked = available.slice(0, count);
      picked.forEach(p => {
        startingXI.push(p);
        usedIds.add(p.id);
      });
    }

    // If we still need more (not enough in some positions), fill from remaining
    if (startingXI.length < 11) {
      const remaining = players
        .filter(p => !usedIds.has(p.id))
        .sort((a, b) => (b.score || 0) - (a.score || 0));
      while (startingXI.length < 11 && remaining.length) {
        const p = remaining.shift();
        startingXI.push(p);
        usedIds.add(p.id);
      }
    }

    // Substitutes: remaining players sorted by score
    const substitutes = players
      .filter(p => !usedIds.has(p.id))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 7);

    const best = { startingXI, substitutes };
    setBestTeam(best);
    await saveTeam(teamA, teamB, best);
  };

  /* ---- save/load ---- */
  const saveTeam = async (tA, tB, best) => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/trainer/save-team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ teamA: tA, teamB: tB, bestTeam: best })
      });
    } catch (err) {
      console.error("Error saving team", err);
    }
  };

  /* ---- group XI by position for display ---- */
  const groupByPosition = (xi) => {
    const grouped = { GK: [], DEF: [], MID: [], FWD: [] };
    xi.forEach(p => {
      const cat = getCategory(p.position);
      grouped[cat].push(p);
    });
    return grouped;
  };

  const posLabel = { GK: "Goalkeeper", DEF: "Defenders", MID: "Midfielders", FWD: "Forwards" };

  return (
    <div className="ta-container">
      <h2 className="ta-title">⚽ Team Analytics</h2>

      <div className="ta-actions">
        <button className="ta-btn ta-btn-shuffle" onClick={shuffleTeams} disabled={players.length === 0}>
          🔀 Shuffle Teams
        </button>
        <button className="ta-btn ta-btn-generate" onClick={generateBestTeam} disabled={players.length < 11}>
          🏆 Generate Match XI
        </button>
      </div>

      {/* Shuffled teams */}
      {teamA.length > 0 && (
        <div className="ta-teams-row">
          <div className="ta-team-card">
            <h3 className="ta-team-heading">Team A</h3>
            <ul className="ta-team-list">
              {teamA.map((p) => (
                <li key={p.id} className="ta-team-item">
                  <span className="ta-pname">{p.name}</span>
                  <span className={"ta-pos-badge ta-pos-" + getCategory(p.position)}>
                    {p.position}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ta-team-card">
            <h3 className="ta-team-heading">Team B</h3>
            <ul className="ta-team-list">
              {teamB.map((p) => (
                <li key={p.id} className="ta-team-item">
                  <span className="ta-pname">{p.name}</span>
                  <span className={"ta-pos-badge ta-pos-" + getCategory(p.position)}>
                    {p.position}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Best XI */}
      {bestTeam.startingXI.length > 0 && (() => {
        const grouped = groupByPosition(bestTeam.startingXI);
        return (
          <div className="ta-best-xi-section">
            <h3 className="ta-xi-heading">🏅 Predicted Starting XI</h3>
            <p className="ta-xi-sub">Formation: 4-3-3 &nbsp;|&nbsp; Total Fitness: <strong>{evaluate(bestTeam).toFixed(1)}</strong></p>

            <div className="ta-formation">
              {["GK", "DEF", "MID", "FWD"].map(cat => (
                grouped[cat].length > 0 && (
                  <div key={cat} className="ta-formation-row">
                    <div className="ta-row-label">{posLabel[cat]}</div>
                    <div className="ta-row-cards">
                      {grouped[cat].map(p => (
                        <div key={p.id} className={"ta-xi-card ta-xi-" + cat}>
                          <div className="ta-xi-name">{p.name}</div>
                          <div className={"ta-xi-pos-badge ta-pos-" + cat}>{p.position}</div>
                          <div className="ta-xi-score">{Number(p.score).toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Substitutes */}
            {bestTeam.substitutes.length > 0 && (
              <div className="ta-subs-section">
                <h4 className="ta-subs-heading">📋 Substitutes</h4>
                <div className="ta-subs-grid">
                  {bestTeam.substitutes.map(p => (
                    <div key={p.id} className="ta-sub-card">
                      <span className="ta-sub-name">{p.name}</span>
                      <span className={"ta-pos-badge ta-pos-" + getCategory(p.position)}>{p.position}</span>
                      <span className="ta-sub-score">Fitness {Number(p.score).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default TeamAnalytics;
