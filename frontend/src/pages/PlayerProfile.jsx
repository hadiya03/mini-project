import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./PlayerProfile.css";

const PlayerProfile = () => {
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayer();
  }, [id]);

  const fetchPlayer = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/players/${id}`
      );
      setPlayer(res.data);
    } catch (err) {
      console.error("Failed to load player:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="dashboard">Loading player...</div>;
  if (!player) return <div className="dashboard">Player not found</div>;

  return (
    <div className="dashboard">
      <h1>Player Profile</h1>

      <div className="card profile-card">
        <h2>{player.name}</h2>

        <div className="profile-grid">
          <p><strong>Email:</strong> {player.email}</p>
          <p><strong>Team:</strong> {player.current_team}</p>
          <p><strong>Position:</strong> {player.position}</p>
          <p>
            <strong>Readiness Score:</strong>{" "}
            {parseFloat(player.readiness_score || 0).toFixed(2)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
