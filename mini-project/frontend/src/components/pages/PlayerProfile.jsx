import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./playerProfile.css";

const PlayerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/player/players/${id}`
        );

        if (!res.ok) throw new Error("Failed to fetch player");

        const data = await res.json();
        setPlayer(data);
        setFormData(data);
      } catch (err) {
        console.error(err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/player/players/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) throw new Error("Failed to update player");

      const updatedPlayer = await res.json();
      setPlayer(updatedPlayer);
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  if (loading) return <p>Loading player...</p>;
  if (!player) return <p>Player not found</p>;

  return (
    <div className="player-profile-container">
      <button
        className="back-btn"
        onClick={() => navigate("/players")}
      >
        ← Back to Players
      </button>

      <div className="profile-sections">

        <div className="profile-header">
          <img
            src={
              editMode
                ? formData.profile_image || "https://via.placeholder.com/120"
                : player.profile_image || "https://via.placeholder.com/120"
            }
            alt={player.name}
            className="profile-image"
          />

          <div className="header-content">
            {editMode ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="position"
                  value={formData.position || ""}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="age"
                  value={formData.age || ""}
                  onChange={handleChange}
                />
              </>
            ) : (
              <>
                <h2>{player.name}</h2>
                <p>
                  {player.position} • {player.age} years old
                </p>
              </>
            )}
          </div>
        </div>

        <div className="profile-card">
          <h3>Personal & Football Details</h3>

          {editMode ? (
            <>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
              />

              <input
                type="number"
                name="height"
                value={formData.height || ""}
                onChange={handleChange}
              />

              <input
                type="number"
                name="weight"
                value={formData.weight || ""}
                onChange={handleChange}
              />

              <input
                type="text"
                name="preferred_foot"
                value={formData.preferred_foot || ""}
                onChange={handleChange}
              />

              <input
                type="text"
                name="current_team"
                value={formData.current_team || ""}
                onChange={handleChange}
              />

              <input
                type="text"
                name="profile_image"
                value={formData.profile_image || ""}
                onChange={handleChange}
              />
            </>
          ) : (
            <>
              <p><strong>Email:</strong> {player.email || "N/A"}</p>
              <p><strong>Height:</strong> {player.height || "N/A"} cm</p>
              <p><strong>Weight:</strong> {player.weight || "N/A"} kg</p>
              <p><strong>Preferred Foot:</strong> {player.preferred_foot || "N/A"}</p>
              <p><strong>Current Team:</strong> {player.current_team || "N/A"}</p>
            </>
          )}
        </div>

        {!editMode && (
          <button
            className="readiness-btn"
            onClick={() =>
              navigate(`/players/${player.id}/readiness`)
            }
          >
            Player Readiness & Fatigue
          </button>
        )}

        <div>
          {editMode ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData(player);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PlayerProfile;