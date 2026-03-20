import React, { useEffect, useState } from "react";  
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./playerReadiness.css";


const PlayerReadinessT = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        /* ===== FETCH PLAYER ===== */
        const playerRes = await fetch("http://localhost:5000/api/player/players");
        const players = await playerRes.json();

        const foundPlayer = players.find((p) => String(p.id) === String(id));
        //const foundPlayer = players.find((p) => String(p.player_id) === String(id));
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
          <h1>{assessment?.fatigue ?? "N/A"} / 1</h1>
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




      <div style={{ marginTop: "30px" }}>
  <h3>Send Message to Player</h3>

  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Write recovery advice..."
    style={{
      width: "100%",
      height: "100px",
      padding: "10px",
      borderRadius: "8px"
    }}
  />

  <button
    style={{ marginTop: "10px" }}
    onClick={async () => {
      try {
        await fetch(
          `http://localhost:5000/api/trainer/message/${player.player_id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
          }
        );

        toast.success("Message sent successfully!");
        setMessage("");
      } catch {
        toast.error("Failed to send message");
      }
    }}
  >
    Send Message
  </button>
</div>

      <div className="actions">
        <button onClick={() => navigate(`/trainer-playerprofile/${id}`)}>Back to Profile</button>
        
      </div>
    </div>
  );
};

export default PlayerReadinessT;

