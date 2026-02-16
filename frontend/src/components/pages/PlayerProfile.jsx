/*import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./playerProfile.css";

const PlayerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/player/players");
        if (!res.ok) throw new Error("Failed to fetch players");

        const data = await res.json();

        const players = Array.isArray(data)
          ? data
          : Array.isArray(data.players)
          ? data.players
          : [];

        const foundPlayer = players.find(
          (p) => String(p.id) === String(id)
        );

        setPlayer(foundPlayer || null);
      } catch (err) {
        console.error(err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <p>Loading player profile...</p>;
  if (!player) return <p>Player not found</p>;

  return (
    <div className="player-profile-container">
      <button className="back-btn" onClick={() => navigate("/players")}>
        ← Back
      </button>

      <div className="profile-header">
        <img
          src={player.profile_image || "https://via.placeholder.com/120"}
          alt={player.name}
          className="profile-image"
        />
        <div>
          <h2>{player.name}</h2>
          <p>
            {player.position} • {player.age} years old
          </p>
        </div>
      </div>

      <div className="profile-sections">
        <div className="profile-card">
          <h3>Personal & Football Details</h3>
          <p><strong>Email:</strong> {player.email || "N/A"}</p>
          <p><strong>Height:</strong> {player.height || "N/A"} cm</p>
          <p><strong>Weight:</strong> {player.weight || "N/A"} kg</p>
          <p><strong>Preferred Foot:</strong> {player.preferred_foot || "N/A"}</p>
          <p><strong>Current Team:</strong> {player.current_team || "N/A"}</p>
        </div>
      </div>

      
      <div style={{ marginTop: "24px" }}>
        <button
          className="readiness-btn"
          onClick={() => navigate(`/players/${id}/readiness`)}
        >
          Player Readiness & Fatigue
        </button>
      </div>
    </div>
  );
};

export default PlayerProfile;*/











/*import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./playerProfile.css";

const PlayerProfile = () => {
  const navigate = useNavigate();

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/player/players"
        );

        if (!res.ok) throw new Error("Failed to fetch players");

        const data = await res.json();

        const playersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.players)
          ? data.players
          : [];

        setPlayers(playersArray);
      } catch (err) {
        console.error(err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  if (loading) return <p>Loading players...</p>;
  if (players.length === 0) return <p>No players found</p>;

  return (
    <div className="player-profile-container">
      <h2>All Player Profiles</h2>

      {players.map((player) => (
        <div key={player.id} className="profile-sections">
          <div className="profile-header">
            <img
              src={
                player.profile_image ||
                "https://via.placeholder.com/120"
              }
              alt={player.name}
              className="profile-image"
            />
            <div>
              <h2>{player.name}</h2>
              <p>
                {player.position} • {player.age} years old
              </p>
            </div>
          </div>

          <div className="profile-card">
            <h3>Personal & Football Details</h3>
            <p><strong>Email:</strong> {player.email || "N/A"}</p>
            <p><strong>Height:</strong> {player.height || "N/A"} cm</p>
            <p><strong>Weight:</strong> {player.weight || "N/A"} kg</p>
            <p><strong>Preferred Foot:</strong> {player.preferred_foot || "N/A"}</p>
            <p><strong>Current Team:</strong> {player.current_team || "N/A"}</p>
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              className="readiness-btn"
              onClick={() =>
                navigate(`/players/${player.id}/readiness`)
              }
            >
              Player Readiness & Fatigue
            </button>
          </div>

          <hr style={{ margin: "30px 0" }} />
        </div>
      ))}
    </div>
  );
};

export default PlayerProfile;*/








/*import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./playerProfile.css";

const PlayerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/player/players/${id}`
        );

        if (!res.ok) throw new Error("Failed to fetch player");

        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        console.error(err);
        setPlayer(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [id]);

  if (loading) return <p>Loading player...</p>;
  if (!player) return <p>Player not found</p>;

  return (
    <div className="player-profile-container">
      
      
      <button
        className="back-btn"
        onClick={() => navigate("/players")}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Players
      </button>

      <div className="profile-sections">
        <div className="profile-header">
          <img
            src={
              player.profile_image ||
              "https://via.placeholder.com/120"
            }
            alt={player.name}
            className="profile-image"
          />
          <div>
            <h2>{player.name}</h2>
            <p>
              {player.position} • {player.age} years old
            </p>
          </div>
        </div>

        <div className="profile-card">
          <h3>Personal & Football Details</h3>
          <p><strong>Email:</strong> {player.email || "N/A"}</p>
          <p><strong>Height:</strong> {player.height || "N/A"} cm</p>
          <p><strong>Weight:</strong> {player.weight || "N/A"} kg</p>
          <p><strong>Preferred Foot:</strong> {player.preferred_foot || "N/A"}</p>
          <p><strong>Current Team:</strong> {player.current_team || "N/A"}</p>
        </div>

        <div style={{ marginTop: "24px" }}>
          <button
            className="readiness-btn"
            onClick={() =>
              navigate(`/players/${player.id}/readiness`)
            }
          >
            Player Readiness & Fatigue
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;*/


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
        setFormData(data); // preload form
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
        style={{ marginBottom: "20px" }}
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
          <div>
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
              <p>
                <strong>Email:</strong>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                />
              </p>
              <p>
                <strong>Height:</strong>
                <input
                  type="number"
                  name="height"
                  value={formData.height || ""}
                  onChange={handleChange}
                />{" "}
                cm
              </p>
              <p>
                <strong>Weight:</strong>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight || ""}
                  onChange={handleChange}
                />{" "}
                kg
              </p>
              <p>
                <strong>Preferred Foot:</strong>
                <input
                  type="text"
                  name="preferred_foot"
                  value={formData.preferred_foot || ""}
                  onChange={handleChange}
                />
              </p>
              <p>
                <strong>Current Team:</strong>
                <input
                  type="text"
                  name="current_team"
                  value={formData.current_team || ""}
                  onChange={handleChange}
                />
              </p>
              <p>
                <strong>Profile Image URL:</strong>
                <input
                  type="text"
                  name="profile_image"
                  value={formData.profile_image || ""}
                  onChange={handleChange}
                />
              </p>
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

        <div style={{ marginTop: "24px" }}>
          {!editMode ? (
            <button
              className="readiness-btn"
              onClick={() =>
                navigate(`/players/${player.id}/readiness`)
              }
            >
              Player Readiness & Fatigue
            </button>
          ) : null}
        </div>

        <div style={{ marginTop: "20px" }}>
          {editMode ? (
            <>
              <button
                className="save-btn"
                onClick={handleSave}
                style={{ marginRight: "10px" }}
              >
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => {
                  setEditMode(false);
                  setFormData(player);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              className="edit-btn"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;

