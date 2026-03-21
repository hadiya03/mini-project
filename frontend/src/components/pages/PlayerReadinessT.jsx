/*import React, { useEffect, useState } from "react";  
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
       
        <div className="card">
          <h1>{assessment?.readiness ?? "N/A"} / 100</h1>
          <p>Overall Readiness</p>
        </div>

      
        <div className="card">
          <h1>{assessment?.fatigue ?? "N/A"} / 1</h1>
          <p>Fatigue Score</p>
        </div>

       
        <div className="card">
          <h1>{assessment?.skill_gap ?? "N/A"} / 10</h1>
          <p>Skill Gap</p>
        </div>


       
        <div className="card">
          <h1>{assessment?.overall_performance ?? "N/A"} / 10</h1>
          <p>Overall Performance</p>
        </div>

        
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

export default PlayerReadinessT;*/















import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const PlayerReadinessT = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const playerRes = await fetch(`http://localhost:5000/api/players/${id}`);
        const players = await playerRes.json();
        const foundPlayer = players[0] || null;

        const assessRes = await fetch(`http://localhost:5000/api/assessments/${id}`);
        const assessData = assessRes.ok ? await assessRes.json() : null;

        // ✅ Set state naturally without unstable_batchedUpdates
        if (isMounted) {
          setPlayer(foundPlayer);
          setAssessment(assessData);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const sendMessage = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/trainer/message/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (res.ok) {
        toast.success("Message sent!");
        setMessage("");
      } else {
        toast.error("Failed to send message");
      }
    } catch (err) {
      toast.error("Failed to send message");
    }
  };

  if (loading) return <p>Loading player readiness...</p>;
  if (!player) return <p>Player not found</p>;

  const format = (val, max) => (val !== null && val !== undefined ? `${val} / ${max}` : "N/A");

  const status = assessment
    ? assessment.readiness >= 80
      ? "Good"
      : assessment.readiness >= 50
      ? "Average"
      : "Poor"
    : "N/A";

  return (
    <div>
      <h2>{player.name}</h2>
      <p>{player.position}</p>
      <p>Readiness: {format(assessment?.readiness, 100)}</p>
      <p>Fatigue: {format(assessment?.fatigue, 1)}</p>
      <p>Skill Gap: {format(assessment?.skill_gap, 10)}</p>
      <p>Overall: {format(assessment?.overall_performance, 10)}</p>
      <p>Status: {status}</p>

      <textarea
        placeholder="Write recovery advice"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <button onClick={() => navigate(`/trainer-playerprofile/${id}`)}>Back to Profile</button>
    </div>
  );
};

export default PlayerReadinessT;