/*import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./playerReadiness.css";

const PlayerReadiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        
        const playerRes = await fetch("http://localhost:5000/api/player/players");
        const players = await playerRes.json();

        const foundPlayer = players.find(
          (p) => String(p.id) === String(id)
        );

        if (!foundPlayer) {
          setPlayer(null);
          setLoading(false);
          return;
        }

        setPlayer(foundPlayer);

        
        const assessRes = await fetch(
          `http://localhost:5000/api/assessments/${id}`
        );

        if (assessRes.ok) {
          const assessData = await assessRes.json();
          setAssessment(assessData);
        } else {
          setAssessment(null);
        }
      } catch (err) {
        console.error(err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) return <p>Loading player readiness...</p>;
  if (!player) return <p>Player not found</p>;

  return (
    <div className="readiness-container">
      <h2>Player Readiness & Fatigue</h2>

      <h3>{player.name}</h3>
      <p>{player.position}</p>

      <div className="readiness-cards">
        <div className="card">
          <h1>{assessment?.readiness ?? "N/A"} / 100 </h1>
          <p>Overall Readiness</p>
        </div>

        <div className="card">
          <p>Fatigue Score</p>
          <strong>{assessment?.fatigue ?? "N/A"} / 10</strong>
        </div>

        <div className="card">
          <p>Skill Gap</p>
          <strong>{assessment?.skill_gap ?? "N/A"} / 100</strong>
        </div>

        <div className="card">
          <p>Recovery Status</p>
          <strong>
            {assessment?.readiness >= 70
              ? "Good"
              : "Needs Attention"}
          </strong>
        </div>
      </div>

    
      {assessment?.coach_notes && (
        <div className="card" style={{ marginTop: "20px" }}>
          <h3>Coach Notes</h3>
          <p>{assessment.coach_notes}</p>
        </div>
      )}

      <div className="actions">
        <button onClick={() => navigate(`/players/${id}`)}>
          Back to Profile
        </button>

        <button
          className="primary"
          onClick={() => navigate(`/players/${id}/update-assessment`)}
        >
          Update Assessment
        </button>
      </div>
    </div>
  );
};

export default PlayerReadiness;*/













import React, { useEffect, useState } from "react";  
import { useParams, useNavigate } from "react-router-dom";
import "./playerReadiness.css";

const PlayerReadiness = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        /* ===== FETCH PLAYER ===== */
        const playerRes = await fetch("http://localhost:5000/api/player/players");
        const players = await playerRes.json();

        const foundPlayer = players.find((p) => String(p.id) === String(id));

        if (!foundPlayer) {
          setPlayer(null);
          setLoading(false);
          return;
        }

        setPlayer(foundPlayer);

        /* ===== FETCH LATEST ASSESSMENT ===== */
        const assessRes = await fetch(`http://localhost:5000/api/assessments/${id}`);
        if (assessRes.ok) {
          const assessData = await assessRes.json();
          setAssessment(assessData);
        } else {
          setAssessment(null);
        }
      } catch (err) {
        console.error(err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (loading) return <p>Loading player readiness...</p>;
  if (!player) return <p>Player not found</p>;

  return (
    <div className="readiness-container">
      <h2>Player Readiness & Fatigue</h2>

      <h3>{player.name}</h3>
      <p>{player.position}</p>

      <div className="readiness-cards">
        {/* Overall Readiness */}
        <div className="card">
          <h1>{assessment?.readiness ?? "N/A"} / 100</h1>
          <p>Overall Readiness</p>
        </div>

        {/* Fatigue Score */}
        <div className="card">
          <h1>{assessment?.fatigue ?? "N/A"} / 10</h1>
          <p>Fatigue Score</p>
        </div>

        {/* Skill Gap */}
        <div className="card">
          <h1>{assessment?.skill_gap ?? "N/A"} / 10</h1>
          <p>Skill Gap</p>
        </div>


        {/* Overall Performance */}
        <div className="card">
          <h1>{assessment?.overall_performance ?? "N/A"} / 10</h1>
          <p>Overall Performance</p>
        </div>

        {/* Recovery Status */}
        <div className="card">
          <h1>{assessment?.readiness >= 70 ? "Good" : "Needs Attention"}</h1>
          <p>Recovery Status</p>
        </div>
      </div>

      <div className="actions">
        <button onClick={() => navigate(`/players/${id}`)}>Back to Profile</button>
        <button
          className="primary"
          onClick={() => navigate(`/players/${id}/update-assessment`)}
        >
          Update Assessment
        </button>
      </div>
    </div>
  );
};

export default PlayerReadiness;

