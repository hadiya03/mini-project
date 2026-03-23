import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import "../pages/styles/players.css";
import { API_URL } from "../../config";

const Players = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/api/player/players`);
      if (!res.ok) throw new Error("Server error");

      const data = await res.json();

      const playerArray = Array.isArray(data)
        ? data
        : Array.isArray(data.players)
        ? data.players
        : [];

      const mappedPlayers = playerArray.map((p) => ({
        id: p.id,
        name: p.name ?? "N/A",
        position: p.position ?? "N/A",
        age: p.age ?? "N/A",
        current_team: p.current_team ?? "N/A",
        profileImage: p.profile_image || "https://via.placeholder.com/120",
      }));

      setPlayers(mappedPlayers);
    } catch (err) {
      console.error(err);
      setError("Failed to load players");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      fetchPlayers();
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // ✅ prevent navigation

    const confirm = window.confirm(
      "Are you sure you want to delete this player?"
    );
    if (!confirm) return;

    try {
      const res = await fetch(`${API_URL}/api/player/players/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete player");

      toast.success("Player deleted successfully");
      fetchPlayers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete player");
    }
  };

  return (
    <div className="players-container">
      <h2>Players List</h2>

      {loading && <p>Loading players...</p>}
      {!loading && error && <p className="error-text">{error}</p>}
      {!loading && !error && players.length === 0 && <p>No players found.</p>}

      {!loading && !error && players.length > 0 && (
        <div className="players-grid">
          {players.map((player) => (
            <div
              key={player.id}
              className="player-card"
              onClick={() => navigate(`/players/${player.id}`)} // ✅ profile navigation
            >
              <img
                src={player.profileImage}
                alt={player.name}
                className="player-image"
              />

              <div className="player-info">
                <h3>{player.name}</h3>
                <p>{player.position}</p>
                <p>{player.age} years old</p>
                <p>{player.current_team}</p>
              </div>

              <button
                className="delete-btn"
                onClick={(e) => handleDelete(player.id, e)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="button-row">
        
        <button
          className="create-player-btn"
          onClick={() => navigate("/create-player")}
        >
          Create Player Profile
        </button>
      </div>
    </div>
  );
};

export default Players;







