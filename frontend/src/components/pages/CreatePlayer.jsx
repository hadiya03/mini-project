/**import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatePlayer = () => {
  const navigate = useNavigate();

  const [player, setPlayer] = useState({
    playerId: "12345",
    email: "player@example.com",
    profileImage: "",
    name: "John Doe",
    position: "Forward",
    age: "25",
    weight: "75",
    height: "180",
    preferredFoot: "Right",
    currentTeam: "Team A",
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

      toast.success("Player created successfully");
      navigate("/players", { state: { refresh: true } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create player");
    }
  };

  return (
    <form className="create-player-container" onSubmit={handleSubmit}>
      <div className="form-content">
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

export default CreatePlayer;*/



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./createplayer.css"
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
    jerseyNumber: "",
    careerGoals: "",
    careerAssists: "",
    performanceRating: "",
    internationalCaps: "",
    debutDate: "",
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
    jersey_number: player.jerseyNumber || null,
    career_goals: player.careerGoals || null,
    career_assists: player.careerAssists || null,
    performance_rating: player.performanceRating || null,
    international_caps: player.internationalCaps || null,
    debut_date: player.debutDate || null,
  };

  try {
    const res = await fetch("http://localhost:5000/api/player/players", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json(); // ✅ read backend response

    if (!res.ok) {
      toast.error(data.message); // ✅ show exact backend message
      return;
    }

    toast.success("Player created successfully");
    navigate("/players", { state: { refresh: true } });

  } catch (err) {
    console.error(err);
    toast.error("Failed to create player");
  }
};


  return (
    <form className="create-player-container" onSubmit={handleSubmit}>
      <div className="form-content">
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

      <div className="section-title">Performance Statistics</div>

      <div className="form-row">
        <div>
          <label>Jersey Number</label>
          <input
            name="jerseyNumber"
            type="number"
            value={player.jerseyNumber}
            onChange={handleChange}
            placeholder="Enter jersey number"
          />
        </div>

        <div>
          <label>Career Goals</label>
          <input
            name="careerGoals"
            type="number"
            value={player.careerGoals}
            onChange={handleChange}
            placeholder="Total goals scored"
          />
        </div>

        <div>
          <label>Career Assists</label>
          <input
            name="careerAssists"
            type="number"
            value={player.careerAssists}
            onChange={handleChange}
            placeholder="Total assists"
          />
        </div>

        <div>
          <label>Performance Rating (1-10)</label>
          <input
            name="performanceRating"
            type="number"
            min="1"
            max="10"
            value={player.performanceRating}
            onChange={handleChange}
            placeholder="Rate 1-10"
          />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label>International Caps</label>
          <input
            name="internationalCaps"
            type="number"
            value={player.internationalCaps}
            onChange={handleChange}
            placeholder="International appearances"
          />
        </div>

        <div>
          <label>Debut Date</label>
          <input
            name="debutDate"
            type="date"
            value={player.debutDate}
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
      </div>
    </form>
  );
};

export default CreatePlayer;

