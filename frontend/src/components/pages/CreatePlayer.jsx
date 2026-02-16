import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePlayer = () => {
  const navigate = useNavigate();

  const [player, setPlayer] = useState({
    playerId: "",
    email: "",
    profileImage: "",
    name: "",
    position: "",
    age: "",
    weight: "",
    height: "",
    preferredFoot: "",
    currentTeam: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setPlayer((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPlayer((prev) => ({
        ...prev,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      player_id: player.playerId,
      email: player.email,
      name: player.name,
      position: player.position,
      age: player.age || null,
      weight: player.weight || null,
      height: player.height || null,
      preferred_foot: player.preferredFoot || null,
      current_team: player.currentTeam || null,
      profile_image: player.profileImage || null,
    };

    try {
      const res = await fetch("http://localhost:5000/api/player/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create player");

      alert("Player created successfully");
      navigate("/players", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      alert("Failed to create player");
    }
  };

  return (
    <form className="create-player-container" onSubmit={handleSubmit}>
      <div className="section-title">Player Information</div>

      <div className="form-row">
        <div>
          <label>Player ID</label>
          <input
            name="playerId"
            value={player.playerId}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={player.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <label>Name</label>
          <input name="name" value={player.name} onChange={handleChange} />
        </div>

        <div>
          <label>Position</label>
          <input
            name="position"
            value={player.position}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Age</label>
          <input
            name="age"
            type="number"
            value={player.age}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="section-title">Physical Details</div>

      <div className="form-row">
        <div>
          <label>Weight (kg)</label>
          <input
            name="weight"
            type="number"
            value={player.weight}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Height (cm)</label>
          <input
            name="height"
            type="number"
            value={player.height}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Preferred Foot</label>
          <input
            name="preferredFoot"
            value={player.preferredFoot}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Current Team</label>
          <input
            name="currentTeam"
            value={player.currentTeam}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="button-row">
        <button type="button" onClick={() => navigate("/players")}>
          Back
        </button>
        <button type="submit">Create Player</button>
      </div>
    </form>
  );
};

export default CreatePlayer;
